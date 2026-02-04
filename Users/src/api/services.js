import api from './config';

// Map backend heat_stress_level to frontend status
const mapHeatStressToStatus = (heatStressLevel) => {
    const level = heatStressLevel?.toLowerCase() || '';
    if (level.includes('extreme') || level.includes('very high')) return 'danger';
    if (level.includes('high') || level.includes('moderate')) return 'caution';
    return 'safe';
};

// Mock data for development when backend is unavailable
const mockWBGTData = {
    wbgt: 28.5,
    status: 'caution',
    temperature: 35,
    humidity: 65,
    heat_stress_level: 'High',
    recommendation: 'Take frequent breaks and stay hydrated',
};

const mockNearbyResources = {
    hospitals: [
        { id: 'hosp_001', name: 'City General Hospital', latitude: 28.6129, longitude: 77.2070, icu_beds: 12, er_beds: 20, is_diverting: false },
        { id: 'hosp_002', name: 'Emergency Care Center', latitude: 28.6169, longitude: 77.2050, icu_beds: 8, er_beds: 15, is_diverting: false },
    ],
    shelters: [
        { id: 'shelter_001', name: 'Community Center', latitude: 28.6139, longitude: 77.2090, capacity: 150, current_occupancy: 78, has_medical_staff: true },
        { id: 'shelter_002', name: 'Public Library', latitude: 28.6159, longitude: 77.2110, capacity: 100, current_occupancy: 45, has_medical_staff: false },
    ],
};

const mockTriageResult = (symptoms) => {
    const criticalSymptoms = symptoms.confusion || symptoms.fever;
    const severity = criticalSymptoms ? 'Critical' : 'Mild';
    return {
        severity,
        routing: criticalSymptoms ? 'Emergency Room' : 'Cooling Center',
        symptoms_detected: Object.entries(symptoms).filter(([, v]) => v).map(([k]) => k),
        recommended_facility: criticalSymptoms
            ? { id: 'hosp_001', name: 'City General Hospital', distance_km: 1.72, available_beds: 32 }
            : null,
        instructions: criticalSymptoms
            ? '🚨 CRITICAL: Seek immediate medical attention.'
            : 'Move to a cool place, hydrate, and rest. Monitor your symptoms.',
        estimated_wait_time: criticalSymptoms ? 10 : null,
    };
};

// API Services - Updated to match backend

export const weatherService = {
    getWBGT: async (latitude = 28.6139, longitude = 77.2090) => {
        try {
            // Backend uses POST with location coordinates
            const response = await api.post('/weather/wbgt', {
                latitude,
                longitude,
            });

            const data = response.data;

            // Transform backend response to frontend format
            return {
                wbgt: data.wbgt,
                status: mapHeatStressToStatus(data.heat_stress_level),
                temperature: data.temperature,
                humidity: data.humidity,
                heat_stress_level: data.heat_stress_level,
                recommendation: data.recommendation,
                location: data.location,
            };
        } catch (error) {
            console.warn('Using mock WBGT data - backend unavailable');
            return {
                ...mockWBGTData,
                wbgt: Math.round((25 + Math.random() * 10) * 10) / 10,
                status: Math.random() > 0.7 ? 'danger' : Math.random() > 0.4 ? 'caution' : 'safe',
            };
        }
    },
};

export const triageService = {
    submit: async (symptoms) => {
        try {
            const response = await api.post('/triage/submit', { symptoms });
            const data = response.data;

            // Normalize severity to lowercase for frontend comparison
            const severityLower = data.severity?.toLowerCase() || 'mild';
            const isCritical = severityLower === 'critical';

            // Transform backend response to frontend format
            return {
                severity: isCritical ? 'critical' : 'mild', // Treat "Moderate" as "mild"
                recommendation: data.instructions,
                symptoms_detected: data.symptoms_detected,
                routing: data.routing,
                estimated_wait_time: data.estimated_wait_time,
                hospital: isCritical && data.recommended_facility ? {
                    name: data.recommended_facility.name,
                    address: `${data.recommended_facility.distance_km} km away`,
                    id: data.recommended_facility.id,
                    available_beds: data.recommended_facility.available_beds,
                } : null,
                shelters: !isCritical ? mockNearbyResources.shelters.map(s => ({
                    id: s.id,
                    name: s.name,
                    address: `Capacity: ${s.capacity - s.current_occupancy} spots available`,
                    lat: s.latitude,
                    lng: s.longitude,
                })) : [],
            };
        } catch (error) {
            console.warn('Using mock triage result - backend unavailable');
            const result = mockTriageResult(symptoms);
            const isCritical = result.severity === 'Critical';
            return {
                severity: isCritical ? 'critical' : 'mild',
                recommendation: result.instructions,
                hospital: result.recommended_facility ? {
                    name: result.recommended_facility.name,
                    address: `${result.recommended_facility.distance_km} km away`,
                } : null,
                shelters: !isCritical ? mockNearbyResources.shelters.map(s => ({
                    id: s.id,
                    name: s.name,
                    address: `Capacity: ${s.capacity - s.current_occupancy} spots available`,
                    lat: s.latitude,
                    lng: s.longitude,
                })) : [],
            };
        }
    },
};

export const mapService = {
    getNearby: async () => {
        try {
            // Backend endpoint is /map/resources (not /map/nearby)
            const response = await api.get('/map/resources');
            const data = response.data;

            // Transform nested arrays to flat array with type field
            const resources = [];

            // Add hospitals
            if (data.hospitals) {
                data.hospitals.forEach(h => {
                    resources.push({
                        id: h.id,
                        type: 'hospital',
                        name: h.name,
                        lat: h.latitude,
                        lng: h.longitude,
                        address: `ICU: ${h.icu_beds} beds, ER: ${h.er_beds} beds`,
                        is_diverting: h.is_diverting,
                        last_updated: h.last_updated,
                    });
                });
            }

            // Add shelters
            if (data.shelters) {
                data.shelters.forEach(s => {
                    resources.push({
                        id: s.id,
                        type: 'shelter',
                        name: s.name,
                        lat: s.latitude,
                        lng: s.longitude,
                        address: `${s.capacity - s.current_occupancy}/${s.capacity} spots available`,
                        has_medical_staff: s.has_medical_staff,
                    });
                });
            }

            return { resources };
        } catch (error) {
            console.warn('Using mock nearby resources - backend unavailable');

            // Transform mock data same way
            const resources = [];
            mockNearbyResources.hospitals.forEach(h => {
                resources.push({
                    id: h.id,
                    type: 'hospital',
                    name: h.name,
                    lat: h.latitude,
                    lng: h.longitude,
                    address: `ICU: ${h.icu_beds} beds, ER: ${h.er_beds} beds`,
                });
            });
            mockNearbyResources.shelters.forEach(s => {
                resources.push({
                    id: s.id,
                    type: 'shelter',
                    name: s.name,
                    lat: s.latitude,
                    lng: s.longitude,
                    address: `${s.capacity - s.current_occupancy}/${s.capacity} spots available`,
                });
            });

            return { resources };
        }
    },
};
