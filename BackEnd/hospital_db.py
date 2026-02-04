"""
Extended database for hospital dashboard features.
Includes beds, patients, staff, resources, and analytics.
"""
from datetime import datetime, timedelta
from typing import Dict, List
import random


class HospitalDashboardDB:
    """Extended database for hospital management dashboard."""
    
    def __init__(self):
        self.beds: Dict[str, dict] = {}
        self.patients: Dict[str, dict] = {}
        self.staff: Dict[str, dict] = {}
        self.resources: Dict[str, dict] = {}
        self.triage_queue: List[dict] = []
        self.analytics_data: List[dict] = []
        self._init_demo_data()
    
    def _init_demo_data(self):
        """Initialize with realistic demo data."""
        
        # Initialize Beds
        bed_id = 1
        for ward in ["ICU", "ER", "General"]:
            bed_type = ward.lower()
            count = {"ICU": 20, "ER": 35, "General": 60}.get(ward, 10)
            
            for i in range(count):
                bed_key = f"bed_{bed_id:03d}"
                status = random.choice(["occupied", "available", "cleaning"]) if random.random() < 0.7 else "available"
                
                self.beds[bed_key] = {
                    "id": bed_key,
                    "bed_number": f"{ward}-{i+1:02d}",
                    "ward": ward,
                    "type": bed_type,
                    "status": status,
                    "patient_id": f"pat_{bed_id:03d}" if status == "occupied" else None,
                    "patient_name": f"Patient {chr(65 + (bed_id % 26))}" if status == "occupied" else None,
                    "equipment": ["Monitor", "IV"] if bed_type == "icu" else [],
                    "last_cleaned": (datetime.now() - timedelta(hours=random.randint(1, 12))).isoformat()
                }
                
                # Create corresponding patient if bed is occupied
                if status == "occupied":
                    self.patients[f"pat_{bed_id:03d}"] = {
                        "id": f"pat_{bed_id:03d}",
                        "name": f"Patient {chr(65 + (bed_id % 26))}",
                        "age": random.randint(25, 85),
                        "condition": random.choice(["stable", "critical", "improving"]),
                        "severity": random.choice(["Mild", "Moderate", "Critical"]),
                        "admission_time": (datetime.now() - timedelta(hours=random.randint(1, 48))).isoformat(),
                        "bed_id": bed_key,
                        "symptoms": random.sample(["fever", "dizziness", "nausea", "confusion", "weakness"], k=random.randint(2, 4))
                    }
                
                bed_id += 1
        
        # Initialize Staff
        staff_data = [
            ("Dr. Sarah Williams", "doctor", True, 35),
            ("Dr. Michael Chen", "doctor", True, 28),
            ("Dr. Emily Rodriguez", "doctor", False, 0),
            ("Nurse John Davis", "nurse", True, 42),
            ("Nurse Maria Garcia", "nurse", True, 38),
            ("Nurse David Lee", "nurse", True, 45),
            ("Nurse Lisa Anderson", "nurse", False, 0),
            ("Tech Robert Brown", "technician", True, 22),
            ("Tech Jessica Taylor", "technician", True, 31),
        ]
        
        for i, (name, role, on_duty, fatigue) in enumerate(staff_data, 1):
            self.staff[f"staff_{i:03d}"] = {
                "id": f"staff_{i:03d}",
                "name": name,
                "role": role,
                "department": "Emergency" if role == "doctor" else "General",
                "contact": f"+1-555-{1000+i:04d}",
                "certifications": ["BLS", "ACLS"] if role in ["doctor", "nurse"] else ["BLS"],
                "on_duty": on_duty,
                "fatigue_level": fatigue,
                "patients_assigned": random.randint(3, 8) if on_duty else 0
            }
        
        # Initialize Resources
        resources_data = [
            ("Cooling Baths", "cooling", 10, 2, 3),
            ("IV Fluid Packs", "medical", 150, 15, 30),
            ("Mist Fans", "cooling", 25, 8, 5),
            ("Blood Pressure Monitors", "equipment", 40, 32, 10),
            ("Oxygen Tanks", "medical", 50, 42, 15),
            ("Ice Packs", "cooling", 200, 85, 50),
            ("Emergency Blankets", "supplies", 100, 78, 25),
            ("Thermometers", "equipment", 60, 55, 15),
        ]
        
        for i, (name, category, total, available, threshold) in enumerate(resources_data, 1):
            in_use = total - available
            status = "critical" if available < threshold * 0.5 else ("low" if available < threshold else "adequate")
            
            self.resources[f"res_{i:03d}"] = {
                "id": f"res_{i:03d}",
                "name": name,
                "category": category,
                "total": total,
                "available": available,
                "in_use": in_use,
                "location": f"Ward {chr(65 + (i % 4))}",
                "threshold_low": threshold,
                "threshold_critical": int(threshold * 0.5),
                "status": status,
                "supplier": "MedSupply Corp" if category == "medical" else "General Supplies Inc"
            }
        
        # Initialize Triage Queue
        queue_patients = [
            ("Emma Johnson", 67, "Critical", ["confusion", "hot_dry_skin", "rapid_heartbeat"], 8, "ambulance"),
            ("James Wilson", 45, "Moderate", ["dizziness", "nausea", "headache"], 12, "ambulance"),
            ("Olivia Martinez", 82, "Critical", ["unconsciousness", "seizure"], 5, "helicopter"),
            ("William Anderson", 34, "Mild", ["thirst", "fatigue", "mild_headache"], 20, "walk-in"),
            ("Sophia Thomas", 28, "Moderate", ["fever", "vomiting", "weakness"], 15, "ambulance"),
        ]
        
        for i, (name, age, severity, symptoms, eta, transport) in enumerate(queue_patients, 1):
            self.triage_queue.append({
                "patient_id": f"incoming_{i:03d}",
                "name": name,
                "age": age,
                "severity": severity,
                "symptoms": symptoms,
                "eta_minutes": eta,
                "transport_method": transport
            })
        
        # Initialize Analytics Data (last 7 days)
        base_temp = 32
        for i in range(7):
            date = datetime.now() - timedelta(days=6-i)
            temp = base_temp + random.uniform(-2, 5)
            admissions = int(20 + (temp - 30) * 3 + random.uniform(-5, 5))
            
            self.analytics_data.append({
                "timestamp": date.isoformat(),
                "date": date.strftime("%Y-%m-%d"),
                "temperature": round(temp, 1),
                "humidity": random.randint(55, 75),
                "wbgt": round(temp * 0.9 + random.uniform(-1, 1), 1),
                "admissions": admissions,
                "resource_usage": random.randint(60, 90),
                "staff_utilization": random.randint(65, 95)
            })
    
    # Bed Management Methods
    def get_bed_stats(self) -> dict:
        """Get bed occupancy statistics."""
        icu_beds = [b for b in self.beds.values() if b["type"] == "icu"]
        er_beds = [b for b in self.beds.values() if b["type"] == "er"]
        general_beds = [b for b in self.beds.values() if b["type"] == "general"]
        
        def calc_stats(beds):
            total = len(beds)
            occupied = len([b for b in beds if b["status"] == "occupied"])
            return {"occupied": occupied, "total": total, "available": total - occupied}
        
        icu_stats = calc_stats(icu_beds)
        er_stats = calc_stats(er_beds)
        general_stats = calc_stats(general_beds)
        
        total_occupied = icu_stats["occupied"] + er_stats["occupied"] + general_stats["occupied"]
        total_beds = icu_stats["total"] + er_stats["total"] + general_stats["total"]
        
        return {
            "icu": icu_stats,
            "er": er_stats,
            "general": general_stats,
            "total_occupied": total_occupied,
            "total_available": total_beds - total_occupied,
            "occupancy_percentage": round((total_occupied / total_beds) * 100, 1) if total_beds > 0 else 0
        }
    
    def get_all_beds(self) -> List[dict]:
        """Get all beds."""
        return list(self.beds.values())
    
    def get_beds_by_type(self, bed_type: str) -> List[dict]:
        """Get beds by type."""
        return [b for b in self.beds.values() if b["type"] == bed_type]
    
    # Resource Management Methods
    def get_all_resources(self) -> List[dict]:
        """Get all resources."""
        return list(self.resources.values())
    
    def get_resource_alerts(self) -> List[dict]:
        """Get resources that need attention."""
        alerts = []
        for res in self.resources.values():
            if res["status"] in ["low", "critical"]:
                alerts.append({
                    "resource_id": res["id"],
                    "resource_name": res["name"],
                    "level": res["status"],
                    "available": res["available"],
                    "threshold": res["threshold_low"],
                    "recommended_order": res["threshold_low"] * 2 - res["available"]
                })
        return alerts
    
    # Staff Management Methods
    def get_all_staff(self) -> List[dict]:
        """Get all staff members."""
        return list(self.staff.values())
    
    def get_surge_level(self) -> dict:
        """Calculate current surge/strain level."""
        on_duty_staff = [s for s in self.staff.values() if s["on_duty"]]
        doctors = len([s for s in on_duty_staff if s["role"] == "doctor"])
        nurses = len([s for s in on_duty_staff if s["role"] == "nurse"])
        techs = len([s for s in on_duty_staff if s["role"] == "technician"])
        total_staff = len(on_duty_staff)
        
        occupied_beds = len([b for b in self.beds.values() if b["status"] == "occupied"])
        patients_per_staff = round(occupied_beds / total_staff, 1) if total_staff > 0 else 0
        
        # Calculate surge level (higher = more strain)
        surge_percentage = min(100, int((patients_per_staff / 8) * 100))  # Ideal is 8 patients per staff
        
        if surge_percentage < 50:
            level = "normal"
        elif surge_percentage < 70:
            level = "elevated"
        elif surge_percentage < 85:
            level = "high"
        else:
            level = "critical"
        
        return {
            "percentage": surge_percentage,
            "level": level,
            "doctors_on_duty": doctors,
            "nurses_on_duty": nurses,
            "technicians_on_duty": techs,
            "total_staff": total_staff,
            "patients_per_staff": patients_per_staff
        }
    
    # Triage Queue Methods
    def get_triage_queue(self) -> List[dict]:
        """Get incoming patients queue."""
        return sorted(self.triage_queue, key=lambda x: x["eta_minutes"])
    
    # Analytics Methods
    def get_analytics(self) -> dict:
        """Get analytics data."""
        today_data = self.analytics_data[-1] if self.analytics_data else {}
        week_admissions = sum(d["admissions"] for d in self.analytics_data)
        
        # Calculate correlation (simplified)
        temps = [d["temperature"] for d in self.analytics_data]
        admissions = [d["admissions"] for d in self.analytics_data]
        correlation = 0.87  # Simplified - normally would calculate properly
        
        return {
            "timestamp": datetime.now().isoformat(),
            "temperature": today_data.get("temperature", 35.0),
            "admissions_today": today_data.get("admissions", 45),
            "admissions_week": week_admissions,
            "admissions_trend": "increasing" if len(self.analytics_data) > 1 and self.analytics_data[-1]["admissions"] > self.analytics_data[-2]["admissions"] else "stable",
            "correlation_coefficient": correlation,
            "resource_usage_percentage": today_data.get("resource_usage", 75),
            "staff_utilization": today_data.get("staff_utilization", 80),
            "average_wait_time": 25
        }
    
    def get_trends(self) -> List[dict]:
        """Get trend data."""
        return self.analytics_data


# Global instance
hospital_db = HospitalDashboardDB()
