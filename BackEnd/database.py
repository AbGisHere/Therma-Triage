"""
Database layer for Therma-Triage system.
Provides both in-memory storage and SQLAlchemy/SQLite implementation.
"""
from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

Base = declarative_base()


# SQLAlchemy Models
class HospitalModel(Base):
    __tablename__ = "hospitals"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    icu_beds = Column(Integer, default=0)
    er_beds = Column(Integer, default=0)
    is_diverting = Column(Boolean, default=False)
    last_updated = Column(DateTime, default=datetime.utcnow)


class ShelterModel(Base):
    __tablename__ = "shelters"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, nullable=False)
    current_occupancy = Column(Integer, default=0)
    has_medical_staff = Column(Boolean, default=False)


class TriageLogModel(Base):
    __tablename__ = "triage_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    symptoms = Column(String, nullable=False)  # JSON string
    severity = Column(String, nullable=False)
    routing = Column(String, nullable=False)
    wbgt = Column(Float)
    recommended_facility_id = Column(String)


# In-Memory Database (for quick setup/demo)
class InMemoryDatabase:
    """
    Simple in-memory database using dictionaries.
    Useful for development and testing.
    """
    
    def __init__(self):
        self.hospitals: Dict[str, dict] = {}
        self.shelters: Dict[str, dict] = {}
        self.triage_logs: List[dict] = []
        self._init_demo_data()
    
    def _init_demo_data(self):
        """Initialize with demo data."""
        # Demo hospitals
        self.hospitals = {
            "hosp_001": {
                "id": "hosp_001",
                "name": "San Francisco General Hospital",
                "latitude": 37.7599,
                "longitude": -122.4148,
                "icu_beds": 12,
                "er_beds": 20,
                "is_diverting": False,
                "last_updated": datetime.utcnow().isoformat(),
                "type": "hospital"
            },
            "hosp_002": {
                "id": "hosp_002",
                "name": "Mission Bay Medical Center",
                "latitude": 37.7665,
                "longitude": -122.3933,
                "icu_beds": 8,
                "er_beds": 15,
                "is_diverting": False,
                "last_updated": datetime.utcnow().isoformat(),
                "type": "hospital"
            },
            "hosp_003": {
                "id": "hosp_003",
                "name": "Downtown Emergency Hospital",
                "latitude": 37.7849,
                "longitude": -122.4094,
                "icu_beds": 5,
                "er_beds": 10,
                "is_diverting": True,
                "last_updated": datetime.utcnow().isoformat(),
                "type": "hospital"
            }
        }
        
        # Demo shelters
        self.shelters = {
            "shelter_001": {
                "id": "shelter_001",
                "name": "Downtown Cooling Center",
                "latitude": 37.7849,
                "longitude": -122.4094,
                "capacity": 150,
                "current_occupancy": 78,
                "has_medical_staff": True,
                "type": "shelter"
            },
            "shelter_002": {
                "id": "shelter_002",
                "name": "Community Recreation Center",
                "latitude": 37.7599,
                "longitude": -122.4348,
                "capacity": 200,
                "current_occupancy": 95,
                "has_medical_staff": False,
                "type": "shelter"
            },
            "shelter_003": {
                "id": "shelter_003",
                "name": "Public Library Cooling Station",
                "latitude": 37.7794,
                "longitude": -122.4194,
                "capacity": 100,
                "current_occupancy": 45,
                "has_medical_staff": True,
                "type": "shelter"
            }
        }
    
    def get_hospital(self, hospital_id: str) -> Optional[dict]:
        """Get a hospital by ID."""
        return self.hospitals.get(hospital_id)
    
    def get_all_hospitals(self) -> List[dict]:
        """Get all hospitals."""
        return list(self.hospitals.values())
    
    def update_hospital(self, hospital_id: str, icu_beds: int, er_beds: int, is_diverting: bool) -> bool:
        """Update hospital bed counts and divert status."""
        if hospital_id not in self.hospitals:
            return False
        
        self.hospitals[hospital_id].update({
            "icu_beds": icu_beds,
            "er_beds": er_beds,
            "is_diverting": is_diverting,
            "last_updated": datetime.utcnow().isoformat()
        })
        return True
    
    def get_all_shelters(self) -> List[dict]:
        """Get all shelters."""
        return list(self.shelters.values())
    
    def get_all_facilities(self) -> List[dict]:
        """Get all hospitals and shelters combined."""
        return self.get_all_hospitals() + self.get_all_shelters()
    
    def log_triage(self, log_data: dict) -> int:
        """Add a triage log entry."""
        log_entry = {
            "id": len(self.triage_logs) + 1,
            "timestamp": datetime.utcnow().isoformat(),
            **log_data
        }
        self.triage_logs.append(log_entry)
        return log_entry["id"]
    
    def get_triage_logs(self, limit: int = 100) -> List[dict]:
        """Get recent triage logs."""
        return self.triage_logs[-limit:]


# SQLAlchemy Database (for production use)
class SQLDatabase:
    """
    SQLAlchemy-based database with SQLite backend.
    For production deployment.
    """
    
    def __init__(self, database_url: str = "sqlite:///./therma_triage.db"):
        self.engine = create_engine(database_url, connect_args={"check_same_thread": False})
        Base.metadata.create_all(bind=self.engine)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self._init_demo_data()
    
    def get_session(self) -> Session:
        """Get a database session."""
        return self.SessionLocal()
    
    def _init_demo_data(self):
        """Initialize with demo data if empty."""
        session = self.get_session()
        try:
            # Check if data already exists
            if session.query(HospitalModel).count() == 0:
                # Add demo hospitals
                hospitals = [
                    HospitalModel(
                        id="hosp_001",
                        name="San Francisco General Hospital",
                        latitude=37.7599,
                        longitude=-122.4148,
                        icu_beds=12,
                        er_beds=20,
                        is_diverting=False
                    ),
                    HospitalModel(
                        id="hosp_002",
                        name="Mission Bay Medical Center",
                        latitude=37.7665,
                        longitude=-122.3933,
                        icu_beds=8,
                        er_beds=15,
                        is_diverting=False
                    ),
                    HospitalModel(
                        id="hosp_003",
                        name="Downtown Emergency Hospital",
                        latitude=37.7849,
                        longitude=-122.4094,
                        icu_beds=5,
                        er_beds=10,
                        is_diverting=True
                    )
                ]
                session.add_all(hospitals)
            
            if session.query(ShelterModel).count() == 0:
                # Add demo shelters
                shelters = [
                    ShelterModel(
                        id="shelter_001",
                        name="Downtown Cooling Center",
                        latitude=37.7849,
                        longitude=-122.4094,
                        capacity=150,
                        current_occupancy=78,
                        has_medical_staff=True
                    ),
                    ShelterModel(
                        id="shelter_002",
                        name="Community Recreation Center",
                        latitude=37.7599,
                        longitude=-122.4348,
                        capacity=200,
                        current_occupancy=95,
                        has_medical_staff=False
                    ),
                    ShelterModel(
                        id="shelter_003",
                        name="Public Library Cooling Station",
                        latitude=37.7794,
                        longitude=-122.4194,
                        capacity=100,
                        current_occupancy=45,
                        has_medical_staff=True
                    )
                ]
                session.add_all(shelters)
            
            session.commit()
        finally:
            session.close()
    
    def get_all_hospitals(self) -> List[dict]:
        """Get all hospitals."""
        session = self.get_session()
        try:
            hospitals = session.query(HospitalModel).all()
            return [
                {
                    "id": h.id,
                    "name": h.name,
                    "latitude": h.latitude,
                    "longitude": h.longitude,
                    "icu_beds": h.icu_beds,
                    "er_beds": h.er_beds,
                    "is_diverting": h.is_diverting,
                    "last_updated": h.last_updated.isoformat(),
                    "type": "hospital"
                }
                for h in hospitals
            ]
        finally:
            session.close()
    
    def get_all_shelters(self) -> List[dict]:
        """Get all shelters."""
        session = self.get_session()
        try:
            shelters = session.query(ShelterModel).all()
            return [
                {
                    "id": s.id,
                    "name": s.name,
                    "latitude": s.latitude,
                    "longitude": s.longitude,
                    "capacity": s.capacity,
                    "current_occupancy": s.current_occupancy,
                    "has_medical_staff": s.has_medical_staff,
                    "type": "shelter"
                }
                for s in shelters
            ]
        finally:
            session.close()
    
    def update_hospital(self, hospital_id: str, icu_beds: int, er_beds: int, is_diverting: bool) -> bool:
        """Update hospital bed counts and divert status."""
        session = self.get_session()
        try:
            hospital = session.query(HospitalModel).filter(HospitalModel.id == hospital_id).first()
            if not hospital:
                return False
            
            hospital.icu_beds = icu_beds
            hospital.er_beds = er_beds
            hospital.is_diverting = is_diverting
            hospital.last_updated = datetime.utcnow()
            
            session.commit()
            return True
        finally:
            session.close()
    
    def log_triage(self, log_data: dict) -> int:
        """Add a triage log entry."""
        session = self.get_session()
        try:
            import json
            log = TriageLogModel(
                latitude=log_data["latitude"],
                longitude=log_data["longitude"],
                symptoms=json.dumps(log_data["symptoms"]),
                severity=log_data["severity"],
                routing=log_data["routing"],
                wbgt=log_data.get("wbgt"),
                recommended_facility_id=log_data.get("recommended_facility_id")
            )
            session.add(log)
            session.commit()
            return log.id
        finally:
            session.close()


# Database instance (choose one)
# For quick demo, use InMemoryDatabase
db = InMemoryDatabase()

# For production with persistence, use SQLDatabase
# db = SQLDatabase()
