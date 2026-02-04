# 🧪 Therma-Triage API Testing Guide

## Quick Start Testing

The API is now running at: **http://127.0.0.1:8000**

## 📖 Interactive Documentation

Visit: **http://127.0.0.1:8000/docs** (Swagger UI)

## 🔑 Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `hospital_staff` | `staff123` | Hospital Staff |

---

## 📝 API Testing Examples

### 1️⃣ Health Check
**Endpoint**: `GET /`

**cURL**:
```bash
curl http://127.0.0.1:8000/
```

**Expected Response**:
```json
{
  "service": "Therma-Triage API",
  "status": "operational",
  "version": "1.0.0",
  ...
}
```

---

### 2️⃣ Calculate WBGT (Heat Stress Index)
**Endpoint**: `POST /weather/wbgt`

**cURL**:
```bash
curl -X POST "http://127.0.0.1:8000/weather/wbgt" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 37.7749,
    "longitude": -122.4194
  }'
```

**Swagger UI Steps**:
1. Expand `POST /weather/wbgt`
2. Click "Try it out"
3. Use this JSON:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194
}
```
4. Click "Execute"

**Expected Response**:
```json
{
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "temperature": 35.0,
  "humidity": 65.0,
  "wbgt": 28.5,
  "heat_stress_level": "Moderate",
  "recommendation": "Take regular breaks and maintain hydration"
}
```

---

### 3️⃣ Submit Triage Request (AI Routing)
**Endpoint**: `POST /triage/submit`

#### Test Case 1: Critical Symptoms
```bash
curl -X POST "http://127.0.0.1:8000/triage/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["confusion", "fever", "hot_dry_skin"],
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "age": 72
  }'
```

**Expected Result**: 
- Severity: `Critical`
- Routing: `Emergency Room`
- Instructions include: "Call 911 immediately"

#### Test Case 2: Moderate Symptoms
```json
{
  "symptoms": ["dizziness", "nausea", "headache"],
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "age": 35
}
```

**Expected Result**:
- Severity: `Moderate`
- Routing: `Cooling Shelter` or `Hospital`
- Recommended facility with distance

#### Test Case 3: Mild Symptoms
```json
{
  "symptoms": ["thirst", "mild_headache"],
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "age": 28
}
```

**Expected Result**:
- Severity: `Mild`
- Routing: `Cooling Shelter`
- Instructions to move to air-conditioned space

---

### 4️⃣ Get Resource Map
**Endpoint**: `GET /map/resources`

**cURL**:
```bash
curl http://127.0.0.1:8000/map/resources
```

**Expected Response**:
```json
{
  "hospitals": [
    {
      "id": "hosp_001",
      "name": "San Francisco General Hospital",
      "latitude": 37.7599,
      "longitude": -122.4148,
      "icu_beds": 12,
      "er_beds": 20,
      "is_diverting": false,
      "last_updated": "2026-02-05T04:30:00"
    },
    ...
  ],
  "shelters": [
    {
      "id": "shelter_001",
      "name": "Downtown Cooling Center",
      "latitude": 37.7849,
      "longitude": -122.4094,
      "capacity": 150,
      "current_occupancy": 78,
      "has_medical_staff": true
    },
    ...
  ]
}
```

---

### 5️⃣ Authentication & Protected Endpoints

#### Step 1: Login
**Endpoint**: `POST /auth/login`

**cURL**:
```bash
curl -X POST "http://127.0.0.1:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Copy the `access_token` value!**

#### Step 2: Get Current User Info
**Endpoint**: `GET /auth/me` (Protected)

**cURL**:
```bash
curl -X GET "http://127.0.0.1:8000/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Swagger UI Steps**:
1. Click the **"Authorize"** button (top right, lock icon)
2. Enter: `Bearer YOUR_TOKEN_HERE` (replace with actual token)
3. Click "Authorize"
4. Now all protected endpoints will work

---

### 6️⃣ Update Hospital Capacity (Protected)
**Endpoint**: `POST /hospital/update`

**⚠️ Must be authenticated first (see step 5)**

**cURL**:
```bash
curl -X POST "http://127.0.0.1:8000/hospital/update" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "hospital_id": "hosp_001",
    "icu_beds": 15,
    "er_beds": 25,
    "is_diverting": false
  }'
```

**Swagger UI JSON**:
```json
{
  "hospital_id": "hosp_001",
  "icu_beds": 15,
  "er_beds": 25,
  "is_diverting": false
}
```

**Expected Response**:
```json
{
  "message": "Hospital updated successfully",
  "updated_by": "admin",
  "hospital": {
    "id": "hosp_001",
    "name": "San Francisco General Hospital",
    "icu_beds": 15,
    "er_beds": 25,
    "is_diverting": false,
    ...
  }
}
```

---

### 7️⃣ List All Hospitals (Protected)
**Endpoint**: `GET /hospital/list`

**cURL**:
```bash
curl -X GET "http://127.0.0.1:8000/hospital/list" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Complete Test Flow

### Scenario: Heatwave Emergency Response

1. **Check Current Heat Conditions**
   - `POST /weather/wbgt` with your location
   - Note the WBGT and heat stress level

2. **Patient Reports Symptoms**
   - `POST /triage/submit` with symptoms: `["dizziness", "fever", "confusion"]`
   - System determines: CRITICAL → Emergency Room
   - Recommends nearest hospital with available beds

3. **Hospital Staff Updates Capacity**
   - Staff logs in: `POST /auth/login`
   - Updates bed count: `POST /hospital/update`

4. **View All Resources**
   - `GET /map/resources` shows updated availability
   - Frontend can display on map

5. **Another Patient (Mild Case)**
   - `POST /triage/submit` with symptoms: `["thirst", "headache"]`
   - System determines: MILD → Cooling Shelter
   - Recommends nearest shelter with capacity

---

## 🎯 Key Features to Demonstrate

### WBGT Logic ✅
- Real-time heat stress calculation
- Environmental risk assessment
- Actionable recommendations

### AI Triage Engine ✅
- Symptom severity analysis
- Age risk factors (elderly/children)
- Environmental conditions integration
- Smart routing (ER/Hospital/Shelter)

### Hospital Management ✅
- Real-time bed availability
- Divert status tracking
- JWT-protected updates

### Resource Routing ✅
- Haversine distance calculation
- Facility type matching
- Availability filtering
- Nearest facility selection

---

## 🐛 Common Issues & Solutions

### Issue: "Could not validate credentials"
**Solution**: 
1. Login first: `POST /auth/login`
2. Copy the token
3. Click "Authorize" in Swagger UI
4. Enter: `Bearer YOUR_TOKEN`

### Issue: "Hospital not found"
**Solution**: Check available hospital IDs:
- `hosp_001` - San Francisco General Hospital
- `hosp_002` - Mission Bay Medical Center
- `hosp_003` - Downtown Emergency Hospital

### Issue: Token expired
**Solution**: Login again to get a fresh token (valid for 60 minutes)

---

## 📊 Data Validation

The API validates all inputs using Pydantic:

- **Latitude**: -90 to 90
- **Longitude**: -180 to 180
- **Symptoms**: At least 1 symptom required
- **Age**: 0 to 150 (optional)
- **ICU/ER Beds**: >= 0
- **Hospital ID**: Must exist in database

---

## 🚀 Next Steps

1. **Frontend Integration**: Use these endpoints to build a React/Vue dashboard
2. **Map Visualization**: Display hospitals/shelters on Google Maps
3. **Real-time Updates**: Implement WebSocket for live bed counts
4. **Mobile App**: Build iOS/Android app with location services
5. **Analytics**: Add dashboard for triage trends and heatwave patterns

---

**Server Running At**: http://127.0.0.1:8000  
**Documentation**: http://127.0.0.1:8000/docs  
**Alternative Docs**: http://127.0.0.1:8000/redoc  

Happy Testing! 🎉
