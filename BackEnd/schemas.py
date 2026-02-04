"""
Pydantic models for data validation and serialization.
These define the "data contract" for the API.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class Severity(str, Enum):
    MILD = "Mild"
    MODERATE = "Moderate"
    CRITICAL = "Critical"


class RoutingDestination(str, Enum):
    COOLING_SHELTER = "Cooling Shelter"
    HOSPITAL = "Hospital"
    EMERGENCY_ROOM = "Emergency Room"


# Weather Models
class LocationRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitude coordinate")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude coordinate")
    
    class Config:
        json_schema_extra = {
            "example": {
                "latitude": 37.7749,
                "longitude": -122.4194
            }
        }


class WBGTResponse(BaseModel):
    location: dict
    temperature: float
    humidity: float
    wbgt: float
    heat_stress_level: str
    recommendation: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "location": {"latitude": 37.7749, "longitude": -122.4194},
                "temperature": 35.0,
                "humidity": 65.0,
                "wbgt": 28.5,
                "heat_stress_level": "High",
                "recommendation": "Limit outdoor activities"
            }
        }


# Triage Models
class TriageRequest(BaseModel):
    symptoms: List[str] = Field(..., min_length=1, description="List of symptoms")
    location: LocationRequest
    age: Optional[int] = Field(None, ge=0, le=150, description="Patient age")
    
    class Config:
        json_schema_extra = {
            "example": {
                "symptoms": ["dizziness", "fever", "confusion"],
                "location": {"latitude": 37.7749, "longitude": -122.4194},
                "age": 45
            }
        }


class TriageResponse(BaseModel):
    severity: Severity
    routing: RoutingDestination
    symptoms_detected: List[str]
    wbgt: float
    recommended_facility: Optional[dict] = None
    instructions: str
    estimated_wait_time: Optional[int] = None  # in minutes
    
    class Config:
        json_schema_extra = {
            "example": {
                "severity": "Critical",
                "routing": "Emergency Room",
                "symptoms_detected": ["dizziness", "fever", "confusion"],
                "wbgt": 28.5,
                "recommended_facility": {
                    "name": "City General Hospital",
                    "distance_km": 2.3,
                    "available_beds": 5
                },
                "instructions": "Seek immediate medical attention. Call 911 if symptoms worsen.",
                "estimated_wait_time": 15
            }
        }


# Hospital Models
class HospitalUpdate(BaseModel):
    hospital_id: str
    icu_beds: int = Field(..., ge=0, description="Available ICU beds")
    er_beds: int = Field(..., ge=0, description="Available ER beds")
    is_diverting: bool = Field(..., description="Whether hospital is on divert status")
    
    class Config:
        json_schema_extra = {
            "example": {
                "hospital_id": "hosp_001",
                "icu_beds": 10,
                "er_beds": 15,
                "is_diverting": False
            }
        }


class Hospital(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    icu_beds: int
    er_beds: int
    is_diverting: bool
    last_updated: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "hosp_001",
                "name": "City General Hospital",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "icu_beds": 10,
                "er_beds": 15,
                "is_diverting": False,
                "last_updated": "2026-02-05T04:30:00"
            }
        }


class Shelter(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    capacity: int
    current_occupancy: int
    has_medical_staff: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "shelter_001",
                "name": "Community Cooling Center",
                "latitude": 37.7849,
                "longitude": -122.4094,
                "capacity": 100,
                "current_occupancy": 45,
                "has_medical_staff": True
            }
        }


class ResourcesResponse(BaseModel):
    hospitals: List[Hospital]
    shelters: List[Shelter]
    
    class Config:
        json_schema_extra = {
            "example": {
                "hospitals": [],
                "shelters": []
            }
        }


# Authentication Models
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: str = "hospital_staff"


class UserInDB(User):
    hashed_password: str


class LoginRequest(BaseModel):
    username: str
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "admin",
                "password": "admin123"
            }
        }


# ============================================================================
# HOSPITAL DASHBOARD MODELS (Extended for Hospital Management Frontend)
# ============================================================================

from datetime import datetime as dt

# Bed Management Models
class BedStatus(str, Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    CLEANING = "cleaning"
    MAINTENANCE = "maintenance"


class BedType(str, Enum):
    ICU = "icu"
    ER = "er"
    GENERAL = "general"


class Bed(BaseModel):
    id: str
    bed_number: str
    ward: str
    type: BedType
    status: BedStatus
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    equipment: List[str] = []
    last_cleaned: Optional[str] = None


class BedStats(BaseModel):
    icu: dict  # {occupied: int, total: int}
    er: dict
    general: dict
    total_occupied: int
    total_available: int
    occupancy_percentage: float


# Patient Management
class PatientCondition(str, Enum):
    STABLE = "stable"
    CRITICAL = "critical"
    IMPROVING = "improving"
    DETERIORATING = "deteriorating"


class Patient(BaseModel):
    id: str
    name: str
    age: int
    condition: PatientCondition
    severity: Severity
    admission_time: str
    bed_id: Optional[str] = None
    symptoms: List[str] = []


class TriageQueueItem(BaseModel):
    patient_id: str
    name: str
    age: int
    severity: Severity
    symptoms: List[str]
    eta_minutes: int
    transport_method: str


# Resource Management
class ResourceCategory(str, Enum):
    MEDICAL = "medical"
    COOLING = "cooling"
    SUPPLIES = "supplies"


class Resource(BaseModel):
    id: str
    name: str
    category: ResourceCategory
    total: int
    available: int
    threshold_low: int
    status: str


class ResourceAlert(BaseModel):
    resource_id: str
    resource_name: str
    level: str
    available: int
    threshold: int


# Staff Management
class StaffRole(str, Enum):
    DOCTOR = "doctor"
    NURSE = "nurse"
    TECHNICIAN = "technician"


class StaffMember(BaseModel):
    id: str
    name: str
    role: StaffRole
    on_duty: bool = False
    fatigue_level: int = 0


class SurgeLevel(BaseModel):
    percentage: int
    level: str
    doctors_on_duty: int
    nurses_on_duty: int
    total_staff: int


# Analytics
class HospitalAnalytics(BaseModel):
    admissions_today: int
    temperature: float
    trend: str


# Status Models  
class HospitalStatusEnum(str, Enum):
    ACCEPTING = "accepting"
    DIVERTING = "diverting"


class BedCapacityUpdate(BaseModel):
    icu_beds: int
    er_beds: int
    general_beds: int


class HospitalOverview(BaseModel):
    status: str
    icu_occupied: int
    icu_total: int
    er_occupied: int
    er_total: int
    surge_level: int
    alerts_count: int
