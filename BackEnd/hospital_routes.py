"""
Hospital Dashboard API Endpoints
Extended endpoints for hospital management frontend.
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime

from schemas import (
    User, Bed, BedStats, Resource, ResourceAlert, StaffMember,
    SurgeLevel, TriageQueueItem, HospitalAnalytics,
    HospitalOverview, BedCapacityUpdate, HospitalStatusEnum
)
from auth import get_current_active_user
from hospital_db import hospital_db
from database import db

router = APIRouter(prefix="/hospital", tags=["Hospital Dashboard"])


# ============================================================================
# Dashboard Stats Endpoints
# ============================================================================

@router.get("/beds/stats", response_model=BedStats)
async def get_bed_stats(current_user: User = Depends(get_current_active_user)):
    """
    Get ICU/ER/General bed capacity and availability stats.
    Real-time occupancy percentages for dashboard.
    """
    return hospital_db.get_bed_stats()


@router.get("/resources")
async def get_resources(current_user: User = Depends(get_current_active_user)):
    """
    Get current resource inventory counts.
    Includes cooling baths, IV packs, mist fans, etc.
    """
    return {
        "resources": hospital_db.get_all_resources(),
        "total_resources": len(hospital_db.resources),
        "critical_count": len([r for r in hospital_db.resources.values() if r["status"] == "critical"]),
        "low_count": len([r for r in hospital_db.resources.values() if r["status"] == "low"])
    }


@router.get("/staff/surge-level", response_model=SurgeLevel)
async def get_surge_level(current_user: User = Depends(get_current_active_user)):
    """
    Get staff strain percentage and on-duty counts.
    Calculates surge level based on patients-per-staff ratio.
    """
    return hospital_db.get_surge_level()


@router.get("/status")
async def get_hospital_status(current_user: User = Depends(get_current_active_user)):
    """
    Get current hospital divert/accepting status.
    """
    hospital = db.get_hospital("hosp_001")
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    return {
        "status": "diverting" if hospital["is_diverting"] else "accepting",
        "is_diverting": hospital["is_diverting"],
        "last_updated": hospital["last_updated"]
    }


@router.get("/triage-queue")
async def get_triage_queue(current_user: User = Depends(get_current_active_user)):
    """
    Get incoming patients queue (polls every 30s on frontend).
    Shows ETA, severity, and transport method.
    """
    queue = hospital_db.get_triage_queue()
    return {
        "queue": queue,
        "total_incoming": len(queue),
        "critical_count": len([p for p in queue if p["severity"] == "Critical"]),
        "next_arrival_minutes": queue[0]["eta_minutes"] if queue else None
    }


@router.get("/analytics", response_model=HospitalAnalytics)
async def get_analytics(current_user: User = Depends(get_current_active_user)):
    """
    Get admissions vs temperature correlation data.
    Includes trends and resource usage statistics.
    """
    return hospital_db.get_analytics()


# ============================================================================
# User Action Endpoints
# ============================================================================

@router.post("/update-beds")
async def update_beds(
    update: BedCapacityUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """
    Increase/decrease ICU/ER bed capacity.
    Updates hospital bed counts.
    """
    # Update the main hospital record
    total_beds = update.icu_beds + update.er_beds
    success = db.update_hospital(
        "hosp_001",
        update.icu_beds,
        update.er_beds,
        db.get_hospital("hosp_001")["is_diverting"]
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update beds")
    
    return {
        "message": "Bed capacity updated successfully",
        "updated_by": current_user.username,
        "icu_beds": update.icu_beds,
        "er_beds": update.er_beds,
        "general_beds": update.general_beds,
        "total_beds": total_beds + update.general_beds
    }


@router.post("/update-status")
async def update_status(
    status: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Toggle hospital divert status.
    Changes between accepting/diverting modes.
    """
    hospital = db.get_hospital("hosp_001")
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    is_diverting = status == "diverting"
    
    success = db.update_hospital(
        "hosp_001",
        hospital["icu_beds"],
        hospital["er_beds"],
        is_diverting
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update status")
    
    return {
        "message": f"Hospital status changed to {status}",
        "status": status,
        "updated_by": current_user.username,
        "timestamp": datetime.now().isoformat()
    }


@router.post("/staff/backup")
async def request_staff_backup(
    role: str,
    quantity: int,
    urgency: str = "routine",
    current_user: User = Depends(get_current_active_user)
):
    """
    Request emergency staff backup.
    Notifies off-duty staff or external agencies.
    """
    return {
        "message": f"Backup request submitted for {quantity} {role}(s)",
        "role": role,
        "quantity": quantity,
        "urgency": urgency,
        "requested_by": current_user.username,
        "ticket_id": f"BACKUP-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "estimated_response_time": "30-60 minutes" if urgency == "urgent" else "2-4 hours"
    }


@router.post("/resources/request")
async def request_resources(
    resource_id: str,
    quantity: int,
    priority: str = "medium",
    current_user: User = Depends(get_current_active_user)
):
    """
    Order additional supplies from suppliers.
    Creates purchase orders for low-stock items.
    """
    resource = hospital_db.resources.get(resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    return {
        "message": f"Order placed for {quantity} units of {resource['name']}",
        "resource_name": resource["name"],
        "quantity": quantity,
        "priority": priority,
        "ordered_by": current_user.username,
        "order_id": f"PO-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "estimated_delivery": "2-4 hours" if priority == "urgent" else "24-48 hours",
        "supplier": resource.get("supplier", "Unknown")
    }


# ============================================================================
# Detailed Pages Endpoints
# ============================================================================

@router.get("/beds")
async def get_all_beds(current_user: User = Depends(get_current_active_user)):
    """
    Complete bed inventory with patient details.
    Shows bed number, status, patient name, equipment.
    """
    beds = hospital_db.get_all_beds()
    stats = hospital_db.get_bed_stats()
    
    return {
        "beds": beds,
        "total_beds": len(beds),
        "stats": stats
    }


@router.get("/resources/alerts")
async def get_resource_alerts(current_user: User = Depends(get_current_active_user)):
    """
    Low stock and critical resource alerts.
    Prioritized list of items needing immediate attention.
    """
    alerts = hospital_db.get_resource_alerts()
    
    return {
        "alerts": alerts,
        "total_alerts": len(alerts),
        "critical_alerts": len([a for a in alerts if a["level"] == "critical"]),
        "low_alerts": len([a for a in alerts if a["level"] == "low"])
    }


@router.get("/staff")
async def get_staff_roster(current_user: User = Depends(get_current_active_user)):
    """
    Full staff roster with fatigue levels.
    Shows on-duty status, role, and patient assignments.
    """
    staff = hospital_db.get_all_staff()
    surge = hospital_db.get_surge_level()
    
    return {
        "staff": staff,
        "total_staff": len(staff),
        "on_duty": len([s for s in staff if s["on_duty"]]),
        "surge_level": surge
    }


@router.get("/settings")
async def get_settings(current_user: User = Depends(get_current_active_user)):
    """
    System configuration and preferences.
    Hospital-specific settings and thresholds.
    """
    return {
        "hospital_id": "hosp_001",
        "hospital_name": "San Francisco General Hospital",
        "auto_divert_threshold": 90,  # percentage
        "staff_alert_fatigue": 75,
        "resource_auto_order": True,
        "wbgt_alert_threshold": 32.0,
        "notification_preferences": {
            "email": True,
            "sms": True,
            "push": True,
            "critical_only": False
        }
    }


@router.put("/settings")
async def update_settings(
    settings: dict,
    current_user: User = Depends(get_current_active_user)
):
    """
    Update system settings.
    Modify hospital configuration parameters.
    """
    return {
        "message": "Settings updated successfully",
        "updated_by": current_user.username,
        "timestamp": datetime.now().isoformat(),
        "settings": settings
    }


# ============================================================================
# Overview/Summary Endpoint
# ============================================================================

@router.get("/overview", response_model=HospitalOverview)
async def get_hospital_overview(current_user: User = Depends(get_current_active_user)):
    """
    Complete hospital overview for dashboard homepage.
    Combines key metrics from all systems.
    """
    hospital = db.get_hospital("hosp_001")
    bed_stats = hospital_db.get_bed_stats()
    surge = hospital_db.get_surge_level()
    alerts = hospital_db.get_resource_alerts()
    queue = hospital_db.get_triage_queue()
    
    return {
        "status": "diverting" if hospital["is_diverting"] else "accepting",
        "icu_occupied": bed_stats["icu"]["occupied"],
        "icu_total": bed_stats["icu"]["total"],
        "er_occupied": bed_stats["er"]["occupied"],
        "er_total": bed_stats["er"]["total"],
        "surge_level": surge["percentage"],
        "alerts_count": len(alerts),
    }
