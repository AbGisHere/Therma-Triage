"""
Core business logic for Therma-Triage system.
Contains WBGT calculation, triage engine, and routing algorithms.
"""
import math
import requests
from typing import List, Dict, Optional, Tuple
from datetime import datetime
from schemas import Severity, RoutingDestination


class WBGTCalculator:
    """
    Wet Bulb Globe Temperature calculator using simplified formula.
    
    Standard WBGT formula:
    WBGT = 0.7 * T_wet_bulb + 0.2 * T_globe + 0.1 * T_dry_bulb
    
    For outdoor conditions with natural ventilation, we estimate:
    - Wet bulb temp from humidity and dry bulb temp
    - Globe temp is approximately 1-2°C higher than dry bulb in direct sun
    """
    
    @staticmethod
    def estimate_wet_bulb_temp(temp_celsius: float, humidity_percent: float) -> float:
        """
        Estimate wet bulb temperature using Stull's formula (simplified).
        This is an approximation suitable for temperatures 0-50°C.
        """
        T = temp_celsius
        RH = humidity_percent
        
        # Stull's formula
        Tw = T * math.atan(0.151977 * math.sqrt(RH + 8.313659)) + \
             math.atan(T + RH) - math.atan(RH - 1.676331) + \
             0.00391838 * (RH ** 1.5) * math.atan(0.023101 * RH) - 4.686035
        
        return round(Tw, 2)
    
    @staticmethod
    def calculate_wbgt(temp_celsius: float, humidity_percent: float, in_sun: bool = True) -> float:
        """
        Calculate WBGT using simplified outdoor formula.
        
        Args:
            temp_celsius: Dry bulb temperature in Celsius
            humidity_percent: Relative humidity (0-100)
            in_sun: Whether measurement is in direct sunlight
        
        Returns:
            WBGT value in Celsius
        """
        T_dry = temp_celsius
        T_wet = WBGTCalculator.estimate_wet_bulb_temp(temp_celsius, humidity_percent)
        
        # Globe temperature approximation
        # In direct sun, globe temp can be 2-5°C higher than air temp
        # In shade, it's closer to air temp
        T_globe = T_dry + (3.5 if in_sun else 0.5)
        
        # Standard WBGT formula
        wbgt = (0.7 * T_wet) + (0.2 * T_globe) + (0.1 * T_dry)
        
        return round(wbgt, 2)
    
    @staticmethod
    def get_heat_stress_level(wbgt: float) -> Tuple[str, str]:
        """
        Determine heat stress level based on WBGT.
        
        Returns:
            Tuple of (level, recommendation)
        """
        if wbgt < 27:
            return "Low", "Normal activities can continue with standard hydration"
        elif wbgt < 29:
            return "Moderate", "Take regular breaks and maintain hydration"
        elif wbgt < 31:
            return "High", "Limit strenuous outdoor activities, increase rest periods"
        elif wbgt < 32:
            return "Very High", "Avoid strenuous outdoor activities during peak heat"
        else:
            return "Extreme", "Avoid all outdoor activities. Seek air-conditioned spaces"


class TriageEngine:
    """
    AI-powered triage engine for heat-related illness assessment.
    Analyzes symptoms and environmental conditions to determine severity and routing.
    """
    
    # Symptom severity mapping
    CRITICAL_SYMPTOMS = {
        "confusion", "unconsciousness", "seizure", "delirium", 
        "hot_dry_skin", "rapid_shallow_breathing", "weak_pulse"
    }
    
    SEVERE_SYMPTOMS = {
        "high_fever", "chest_pain", "difficulty_breathing",
        "severe_headache", "vomiting", "rapid_heartbeat"
    }
    
    MODERATE_SYMPTOMS = {
        "dizziness", "nausea", "muscle_cramps", "heavy_sweating",
        "weakness", "fatigue", "headache", "fever"
    }
    
    MILD_SYMPTOMS = {
        "thirst", "mild_headache", "slight_fatigue", "mild_dizziness"
    }
    
    @staticmethod
    def normalize_symptom(symptom: str) -> str:
        """Normalize symptom strings for matching."""
        return symptom.lower().strip().replace(" ", "_").replace("-", "_")
    
    @classmethod
    def analyze_symptoms(cls, symptoms: List[str], wbgt: float, age: Optional[int] = None) -> Tuple[Severity, RoutingDestination, str]:
        """
        Analyze patient symptoms and environmental conditions.
        
        Args:
            symptoms: List of reported symptoms
            wbgt: Current WBGT value
            age: Patient age (elderly are higher risk)
        
        Returns:
            Tuple of (severity, routing_destination, instructions)
        """
        normalized_symptoms = [cls.normalize_symptom(s) for s in symptoms]
        
        # Count symptoms in each category
        critical_count = sum(1 for s in normalized_symptoms if s in cls.CRITICAL_SYMPTOMS)
        severe_count = sum(1 for s in normalized_symptoms if s in cls.SEVERE_SYMPTOMS)
        moderate_count = sum(1 for s in normalized_symptoms if s in cls.MODERATE_SYMPTOMS)
        
        # Age factor - elderly (65+) and very young are higher risk
        age_risk_factor = 0
        if age is not None:
            if age >= 65 or age <= 5:
                age_risk_factor = 1
        
        # Environmental factor - extreme heat increases severity
        heat_risk_factor = 1 if wbgt >= 32 else 0
        
        # Determine severity and routing
        if critical_count > 0 or (severe_count >= 2 and wbgt >= 31):
            severity = Severity.CRITICAL
            routing = RoutingDestination.EMERGENCY_ROOM
            instructions = "🚨 CRITICAL: Seek immediate emergency medical attention. Call 911 immediately. " \
                          "Move to a cool place, remove excess clothing, and cool the body with water while waiting for help."
        
        elif severe_count > 0 or (moderate_count >= 3) or (moderate_count >= 2 and age_risk_factor == 1):
            severity = Severity.MODERATE if severe_count == 1 else Severity.CRITICAL
            routing = RoutingDestination.HOSPITAL if severe_count > 0 else RoutingDestination.COOLING_SHELTER
            
            if severe_count > 0:
                instructions = "⚠️ MODERATE-SEVERE: Seek medical attention soon. Move to air-conditioned space, " \
                              "drink cool water, and monitor symptoms closely. If symptoms worsen, call 911."
            else:
                instructions = "⚠️ MODERATE: Visit a cooling shelter or air-conditioned space immediately. " \
                              "Drink plenty of water, rest, and monitor symptoms. Seek medical care if symptoms persist."
        
        else:
            severity = Severity.MILD
            routing = RoutingDestination.COOLING_SHELTER
            instructions = "ℹ️ MILD: Move to a cool, air-conditioned place. Drink water slowly. " \
                          "Rest and avoid strenuous activity. Monitor symptoms and seek help if they worsen."
        
        return severity, routing, instructions
    
    @staticmethod
    def find_nearest_facility(
        user_lat: float,
        user_lon: float,
        facilities: List[Dict],
        routing_type: RoutingDestination
    ) -> Optional[Dict]:
        """
        Find the nearest available facility based on routing type.
        
        Args:
            user_lat: User's latitude
            user_lon: User's longitude
            facilities: List of hospital/shelter dictionaries
            routing_type: Type of facility needed
        
        Returns:
            Dictionary with facility info and distance, or None
        """
        if not facilities:
            return None
        
        def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
            """Calculate distance between two points in kilometers."""
            R = 6371  # Earth's radius in km
            
            lat1_rad = math.radians(lat1)
            lat2_rad = math.radians(lat2)
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            
            a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
            c = 2 * math.asin(math.sqrt(a))
            
            return R * c
        
        # Filter facilities based on routing type and availability
        suitable_facilities = []
        
        for facility in facilities:
            if routing_type == RoutingDestination.COOLING_SHELTER:
                # For shelters, check if they have capacity
                if facility.get('type') == 'shelter':
                    if facility.get('current_occupancy', 0) < facility.get('capacity', 0):
                        suitable_facilities.append(facility)
            else:
                # For hospitals, check if they have beds and aren't diverting
                if facility.get('type') == 'hospital':
                    if not facility.get('is_diverting', False):
                        total_beds = facility.get('icu_beds', 0) + facility.get('er_beds', 0)
                        if total_beds > 0:
                            suitable_facilities.append(facility)
        
        if not suitable_facilities:
            return None
        
        # Find nearest facility
        nearest = None
        min_distance = float('inf')
        
        for facility in suitable_facilities:
            distance = haversine_distance(
                user_lat, user_lon,
                facility['latitude'], facility['longitude']
            )
            
            if distance < min_distance:
                min_distance = distance
                nearest = {
                    **facility,
                    'distance_km': round(distance, 2)
                }
        
        return nearest


class WeatherService:
    """
    Service for fetching weather data from OpenWeatherMap API.
    Falls back to mock data if API key is not available.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"
    
    def get_weather_data(self, latitude: float, longitude: float) -> Dict:
        """
        Fetch weather data for given coordinates.
        
        Returns:
            Dictionary with temperature and humidity
        """
        if not self.api_key:
            # Mock data for development/demo
            return {
                "temperature": 35.0,  # Celsius
                "humidity": 65.0,  # Percentage
                "description": "Clear sky (mock data)"
            }
        
        try:
            params = {
                "lat": latitude,
                "lon": longitude,
                "appid": self.api_key,
                "units": "metric"  # Get temperature in Celsius
            }
            
            response = requests.get(self.base_url, params=params, timeout=5)
            response.raise_for_status()
            
            data = response.json()
            
            return {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "description": data["weather"][0]["description"]
            }
        
        except Exception as e:
            print(f"Error fetching weather data: {e}")
            # Fallback to mock data
            return {
                "temperature": 35.0,
                "humidity": 65.0,
                "description": "Data unavailable (using fallback)"
            }
