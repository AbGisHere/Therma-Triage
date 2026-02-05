/**
 * API Integration Layer for Therma-Triage Frontend
 * Connects to FastAPI backend with authentication and error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Types for API responses
export interface BedStats {
  icu: { total: number; occupied: number; available: number }
  er: { total: number; occupied: number; available: number }
  general: { total: number; occupied: number; available: number }
}

export interface Resource {
  id: string
  name: string
  category: string
  total: number
  available: number
  inUse: number
  location: string
  supplier?: string
  threshold: number
  status: 'normal' | 'low' | 'critical'
}

export interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  contact: string
  certifications: string[]
  onDuty: boolean
  fatigueLevel: number
  patientsAssigned: number
}

export interface TriageQueueItem {
  id: string
  name: string
  age: number
  severity: 'Mild' | 'Moderate' | 'Critical'
  etaMinutes: number
  transport: 'ambulance' | 'helicopter' | 'private'
  department: string
}

export interface HospitalAnalytics {
  admissions: Array<{ date: string; count: number; temperature: number }>
  trends: {
    bedOccupancy: number
    resourceUsage: number
    staffFatigue: number
  }
  predictions: {
    next24h: number
    confidence: number
  }
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface User {
  username: string
  fullName: string
  email: string
  role: string
}

// API Client with authentication
class ApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  getToken(): string | null {
    if (this.token) return this.token
    return localStorage.getItem('auth_token')
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken()
        window.location.href = '/signin'
        throw new Error('Authentication required')
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Authentication
  async login(username: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  // Dashboard Stats
  async getBedStats(): Promise<BedStats> {
    return this.request<BedStats>('/hospital/beds/stats')
  }

  async getResources(): Promise<{ resources: Resource[]; total_resources: number; critical_count: number; low_count: number }> {
    return this.request<{ resources: Resource[]; total_resources: number; critical_count: number; low_count: number }>('/hospital/resources')
  }

  async getStaffSurgeLevel(): Promise<{ percentage: number; onDutyCount: number; totalStaff: number; status: string }> {
    return this.request<{ percentage: number; onDutyCount: number; totalStaff: number; status: string }>('/hospital/staff/surge-level')
  }

  async getHospitalStatus(): Promise<{ status: string; isDiverting: boolean; lastUpdated: string }> {
    return this.request<{ status: string; isDiverting: boolean; lastUpdated: string }>('/hospital/status')
  }

  async getTriageQueue(): Promise<{ queue: TriageQueueItem[]; totalIncoming: number; criticalCount: number; nextArrivalMinutes: number | null }> {
    return this.request<{ queue: TriageQueueItem[]; totalIncoming: number; criticalCount: number; nextArrivalMinutes: number | null }>('/hospital/triage-queue')
  }

  async getAnalytics(): Promise<HospitalAnalytics> {
    return this.request<HospitalAnalytics>('/hospital/analytics')
  }

  // User Actions
  async updateBeds(icuBeds: number, erBeds: number, generalBeds: number): Promise<any> {
    return this.request('/hospital/update-beds', {
      method: 'POST',
      body: JSON.stringify({ icu_beds: icuBeds, er_beds: erBeds, general_beds: generalBeds }),
    })
  }

  async updateHospitalStatus(status: 'accepting' | 'diverting'): Promise<any> {
    return this.request('/hospital/update-status', {
      method: 'POST',
      body: JSON.stringify({ status }),
    })
  }

  async requestStaffBackup(role: string, quantity: number, urgency: string = 'routine'): Promise<any> {
    return this.request('/hospital/staff/backup', {
      method: 'POST',
      body: JSON.stringify({ role, quantity, urgency }),
    })
  }

  async requestResources(resourceId: string, quantity: number, priority: string = 'medium'): Promise<any> {
    return this.request('/hospital/resources/request', {
      method: 'POST',
      body: JSON.stringify({ resource_id: resourceId, quantity, priority }),
    })
  }

  // Detailed Pages
  async getAllBeds(): Promise<{ beds: any[]; totalBeds: number; stats: BedStats }> {
    return this.request<{ beds: any[]; totalBeds: number; stats: BedStats }>('/hospital/beds')
  }

  async getResourceAlerts(): Promise<{ alerts: any[]; totalAlerts: number; criticalAlerts: number; lowAlerts: number }> {
    return this.request<{ alerts: any[]; totalAlerts: number; criticalAlerts: number; lowAlerts: number }>('/hospital/resources/alerts')
  }

  async getStaffRoster(): Promise<{ staff: StaffMember[]; totalStaff: number; onDuty: number; surgeLevel: any }> {
    return this.request<{ staff: StaffMember[]; totalStaff: number; onDuty: number; surgeLevel: any }>('/hospital/staff')
  }

  async getSettings(): Promise<any> {
    return this.request('/hospital/settings')
  }

  async updateSettings(settings: any): Promise<any> {
    return this.request('/hospital/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  // Weather & Triage
  async getWBGT(latitude: number, longitude: number): Promise<any> {
    return this.request(`/weather/wbgt?latitude=${latitude}&longitude=${longitude}`)
  }

  async submitTriage(symptoms: string[], latitude: number, longitude: number, age: number): Promise<any> {
    return this.request('/triage/submit', {
      method: 'POST',
      body: JSON.stringify({
        symptoms,
        location: { latitude, longitude },
        age,
      }),
    })
  }

  async getResourcesMap(): Promise<any> {
    return this.request('/map/resources')
  }
}

// Export singleton instance
export const api = new ApiClient()

// Export hooks for React components
export const useApi = () => {
  return api
}
