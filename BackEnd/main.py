"""
Therma-Triage FastAPI Application
A robust heatwave emergency response system with WBGT calculation,
AI-powered triage, and hospital resource management.
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import timedelta
from typing import List
import json

# Import project modules
from schemas import (
    LocationRequest, WBGTResponse, TriageRequest, TriageResponse,
    HospitalUpdate, Hospital, Shelter, ResourcesResponse,
    Token, LoginRequest, User
)
from logic import WBGTCalculator, TriageEngine, WeatherService
from database import db
from auth import (
    authenticate_user, create_access_token, get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from hospital_routes import router as hospital_router

# Initialize FastAPI app
app = FastAPI(
    title="Therma-Triage API",
    description="Heatwave Emergency Response System with WBGT calculation, AI triage, and hospital management",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include hospital dashboard routes
app.include_router(hospital_router)

# Initialize services
weather_service = WeatherService(api_key=None)  # Set API key in production
wbgt_calculator = WBGTCalculator()
triage_engine = TriageEngine()


# ============================================================================
# Health Check Endpoint
# ============================================================================

@app.get("/", tags=["System"])
async def root():
    """
    Root endpoint - API health check.
    """
    return {
        "service": "Therma-Triage API",
        "status": "operational",
        "version": "1.0.0",
        "endpoints": {
            "weather": "/weather/wbgt",
            "triage": "/triage/submit",
            "resources": "/map/resources",
            "hospital_update": "/hospital/update (requires auth)",
            "login": "/auth/login",
            "docs": "/docs"
        }
    }


# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post("/auth/login", response_model=Token, tags=["Authentication"])
async def login(login_request: LoginRequest):
    """
    Authenticate hospital staff and generate JWT token.
    
    **Demo Credentials:**
    - Username: `admin` / Password: `admin123`
    - Username: `hospital_staff` / Password: `staff123`
    """
    user = authenticate_user(login_request.username, login_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me", response_model=User, tags=["Authentication"])
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Get current authenticated user information.
    Requires valid JWT token in Authorization header.
    """
    return current_user


# ============================================================================
# Weather & WBGT Endpoints
# ============================================================================

@app.get("/weather/wbgt", response_model=WBGTResponse, tags=["Weather"])
async def get_wbgt_query(
    latitude: float,
    longitude: float
):
    """
    Calculate WBGT using GET with query parameters (for user frontend).
    Alternative to POST version.
    """
    location = LocationRequest(latitude=latitude, longitude=longitude)
    return await calculate_wbgt_internal(location)


@app.post("/weather/wbgt", response_model=WBGTResponse, tags=["Weather"])
async def get_wbgt(location: LocationRequest):
    """
    Calculate Wet Bulb Globe Temperature (WBGT) for a location.
    
    **WBGT Heat Stress Levels:**
    - < 27°C: Low risk
    - 27-29°C: Moderate risk
    - 29-31°C: High risk
    - 31-32°C: Very high risk
    - > 32°C: Extreme risk
    
    **How it works:**
    1. Fetches current weather data (temperature & humidity)
    2. Calculates WBGT using: `WBGT = 0.7*Twb + 0.2*Tg + 0.1*Td`
    3. Determines heat stress level and provides recommendations
    """
    try:
        # Get weather data
        weather_data = weather_service.get_weather_data(
            location.latitude,
            location.longitude
        )
        
        # Calculate WBGT
        wbgt = wbgt_calculator.calculate_wbgt(
            weather_data["temperature"],
            weather_data["humidity"]
        )
        
        # Get heat stress level
        heat_level, recommendation = wbgt_calculator.get_heat_stress_level(wbgt)
        
        return await calculate_wbgt_internal(location)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating WBGT: {str(e)}"
        )


async def calculate_wbgt_internal(location: LocationRequest) -> WBGTResponse:
    """Internal function to calculate WBGT (shared by GET and POST endpoints)."""
    # Get weather data
    weather_data = weather_service.get_weather_data(
        location.latitude,
        location.longitude
    )
    
    # Calculate WBGT
    wbgt = wbgt_calculator.calculate_wbgt(
        weather_data["temperature"],
        weather_data["humidity"]
    )
    
    # Get heat stress level
    heat_level, recommendation = wbgt_calculator.get_heat_stress_level(wbgt)
    
    return WBGTResponse(
        location={"latitude": location.latitude, "longitude": location.longitude},
        temperature=weather_data["temperature"],
        humidity=weather_data["humidity"],
        wbgt=wbgt,
        heat_stress_level=heat_level,
        recommendation=recommendation
    )


# ============================================================================
# Triage Endpoints
# ============================================================================

@app.post("/triage/submit", response_model=TriageResponse, tags=["Triage"])
async def submit_triage(request: TriageRequest):
    """
    Submit symptoms for AI-powered triage and routing.
    
    **Symptom Categories:**
    - **Critical**: confusion, unconsciousness, seizure, hot_dry_skin
    - **Severe**: high_fever, chest_pain, difficulty_breathing
    - **Moderate**: dizziness, nausea, muscle_cramps, heavy_sweating
    - **Mild**: thirst, mild_headache, slight_fatigue
    
    **Routing Logic:**
    - Critical symptoms → Emergency Room (call 911)
    - Severe symptoms → Hospital
    - Moderate symptoms → Cooling Shelter or Hospital
    - Mild symptoms → Cooling Shelter
    
    **Returns:**
    - Severity assessment (Mild/Moderate/Critical)
    - Recommended routing destination
    - Nearest available facility
    - Specific instructions for patient
    """
    try:
        # Get weather data for location
        weather_data = weather_service.get_weather_data(
            request.location.latitude,
            request.location.longitude
        )
        
        # Calculate WBGT
        wbgt = wbgt_calculator.calculate_wbgt(
            weather_data["temperature"],
            weather_data["humidity"]
        )
        
        # Analyze symptoms
        severity, routing, instructions = triage_engine.analyze_symptoms(
            request.symptoms,
            wbgt,
            request.age
        )
        
        # Find nearest facility
        all_facilities = db.get_all_facilities()
        nearest_facility = triage_engine.find_nearest_facility(
            request.location.latitude,
            request.location.longitude,
            all_facilities,
            routing
        )
        
        # Prepare recommended facility info
        recommended_facility = None
        estimated_wait_time = None
        
        if nearest_facility:
            recommended_facility = {
                "id": nearest_facility["id"],
                "name": nearest_facility["name"],
                "distance_km": nearest_facility["distance_km"]
            }
            
            if nearest_facility["type"] == "hospital":
                recommended_facility["available_beds"] = (
                    nearest_facility["icu_beds"] + nearest_facility["er_beds"]
                )
                # Estimate wait time based on bed availability
                total_beds = recommended_facility["available_beds"]
                estimated_wait_time = max(10, 60 - (total_beds * 3))
            else:
                recommended_facility["capacity_left"] = (
                    nearest_facility["capacity"] - nearest_facility["current_occupancy"]
                )
                estimated_wait_time = 5  # Shelters typically have minimal wait
        
        # Log triage event
        db.log_triage({
            "latitude": request.location.latitude,
            "longitude": request.location.longitude,
            "symptoms": request.symptoms,
            "severity": severity.value,
            "routing": routing.value,
            "wbgt": wbgt,
            "recommended_facility_id": nearest_facility["id"] if nearest_facility else None
        })
        
        return TriageResponse(
            severity=severity,
            routing=routing,
            symptoms_detected=request.symptoms,
            wbgt=wbgt,
            recommended_facility=recommended_facility,
            instructions=instructions,
            estimated_wait_time=estimated_wait_time
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing triage: {str(e)}"
        )


# ============================================================================
# Resource Map Endpoints
# ============================================================================

@app.get("/map/resources", response_model=ResourcesResponse, tags=["Resources"])
@app.get("/map/nearby", response_model=ResourcesResponse, tags=["Resources"])  # Alias for user frontend
async def get_resources():
    """
    Get all available hospitals and cooling shelters with real-time capacity.
    
    **Hospital Information:**
    - Available ICU beds
    - Available ER beds
    - Divert status (whether accepting new patients)
    - Last update timestamp
    
    **Shelter Information:**
    - Total capacity
    - Current occupancy
    - Whether medical staff is present
    
    **Use Case:**
    Frontend can use this to display resource availability on a map,
    helping emergency responders and civilians find the nearest help.
    """
    try:
        hospitals = db.get_all_hospitals()
        shelters = db.get_all_shelters()
        
        # Convert to Pydantic models
        hospital_models = [Hospital(**h) for h in hospitals]
        shelter_models = [Shelter(**s) for s in shelters]
        
        return ResourcesResponse(
            hospitals=hospital_models,
            shelters=shelter_models
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching resources: {str(e)}"
        )


# ============================================================================
# Hospital Management Endpoints (Protected)
# ============================================================================

@app.post("/hospital/update", tags=["Hospital Management"])
async def update_hospital(
    update: HospitalUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """
    Update hospital bed capacity and divert status.
    
    **🔒 Protected Endpoint** - Requires JWT authentication.
    
    **Authorization:**
    Include the JWT token in the Authorization header:
    ```
    Authorization: Bearer <your_token_here>
    ```
    
    **Usage:**
    Hospital staff can update:
    - Number of available ICU beds
    - Number of available ER beds
    - Divert status (true/false)
    
    **Response:**
    Returns success message with updated hospital information.
    """
    try:
        # Verify hospital exists
        hospital = db.get_hospital(update.hospital_id)
        if not hospital:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Hospital with ID '{update.hospital_id}' not found"
            )
        
        # Update hospital
        success = db.update_hospital(
            update.hospital_id,
            update.icu_beds,
            update.er_beds,
            update.is_diverting
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update hospital"
            )
        
        # Get updated hospital data
        updated_hospital = db.get_hospital(update.hospital_id)
        
        return {
            "message": "Hospital updated successfully",
            "updated_by": current_user.username,
            "hospital": updated_hospital
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating hospital: {str(e)}"
        )


@app.get("/hospital/list", tags=["Hospital Management"])
async def list_hospitals(current_user: User = Depends(get_current_active_user)):
    """
    Get list of all hospitals (for authenticated users).
    
    **🔒 Protected Endpoint** - Requires JWT authentication.
    
    Returns detailed hospital information for management purposes.
    """
    try:
        hospitals = db.get_all_hospitals()
        return {
            "total_hospitals": len(hospitals),
            "hospitals": hospitals
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching hospitals: {str(e)}"
        )


# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": "The requested resource was not found",
            "path": str(request.url)
        }
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later."
        }
    )


# ============================================================================
# Application Startup
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """
    Run on application startup.
    """
    print("=" * 60)
    print("🚑 Therma-Triage API Starting...")
    print("=" * 60)
    print(f"📊 Loaded {len(db.get_all_hospitals())} hospitals")
    print(f"🏠 Loaded {len(db.get_all_shelters())} cooling shelters")
    print("🔒 JWT authentication enabled")
    print("🌐 CORS middleware enabled")
    print("=" * 60)
    print("✅ API is ready!")
    print("📖 Documentation: http://127.0.0.1:8000/docs")
    print("=" * 60)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
