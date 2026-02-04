'use client'

import React, { useState, useEffect } from 'react'
import { Users, Clock, AlertTriangle, Activity, RefreshCw } from 'lucide-react'

interface TriagePatient {
  id: string
  name: string
  age: number
  severity: 'critical' | 'high' | 'moderate' | 'low'
  condition: string
  eta: number
  transport: 'ambulance' | 'helicopter' | 'private'
  assignedDepartment: string
  lastUpdated: string
}

export const TriageQueue: React.FC = () => {
  const [patients, setPatients] = useState<TriagePatient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastPoll, setLastPoll] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  const mockPatients: TriagePatient[] = [
    {
      id: 'PAT001',
      name: 'Raj Kumar',
      age: 45,
      severity: 'critical',
      condition: 'Heatstroke, Unconscious',
      eta: 5,
      transport: 'ambulance',
      assignedDepartment: 'ICU',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'PAT002',
      name: 'Priya Sharma',
      age: 32,
      severity: 'high',
      condition: 'Severe Dehydration',
      eta: 12,
      transport: 'ambulance',
      assignedDepartment: 'ER',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'PAT003',
      name: 'Amit Patel',
      age: 28,
      severity: 'moderate',
      condition: 'Heat Exhaustion',
      eta: 18,
      transport: 'private',
      assignedDepartment: 'ER',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'PAT004',
      name: 'Sunita Reddy',
      age: 67,
      severity: 'critical',
      condition: 'Heatstroke, Cardiac Stress',
      eta: 8,
      transport: 'helicopter',
      assignedDepartment: 'ICU',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'PAT005',
      name: 'Vikram Singh',
      age: 52,
      severity: 'low',
      condition: 'Mild Dehydration',
      eta: 25,
      transport: 'private',
      assignedDepartment: 'Urgent Care',
      lastUpdated: new Date().toISOString()
    }
  ]

  const fetchTriageQueue = async () => {
    try {
      setError(null)
      // Simulate API call to GET /hospital/triage-queue
      const response = await fetch('/hospital/triage-queue')
      
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      } else {
        // Use mock data for demo
        setPatients(mockPatients)
      }
    } catch (error) {
      console.error('Failed to fetch triage queue:', error)
      // Use mock data for demo
      setPatients(mockPatients)
    } finally {
      setIsLoading(false)
      setLastPoll(new Date())
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchTriageQueue()

    // Set up polling every 30 seconds
    const interval = setInterval(fetchTriageQueue, 30000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>CRITICAL</span>
          </span>
        )
      case 'high':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full">
            <Activity className="w-3 h-3" />
            <span>HIGH</span>
          </span>
        )
      case 'moderate':
        return (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-semibold rounded-full">
            MODERATE
          </span>
        )
      case 'low':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
            LOW
          </span>
        )
      default:
        return null
    }
  }

  const getTransportIcon = (transport: string) => {
    switch (transport) {
      case 'ambulance':
        return '🚑'
      case 'helicopter':
        return '🚁'
      case 'private':
        return '🚗'
      default:
        return '🚐'
    }
  }

  const getEtaColor = (eta: number) => {
    if (eta <= 10) return 'text-red-600 dark:text-red-400 font-semibold'
    if (eta <= 20) return 'text-orange-600 dark:text-orange-400 font-medium'
    return 'text-gray-600 dark:text-gray-400'
  }

  if (isLoading && patients.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Incoming Triage Queue
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Patients en route to facility
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchTriageQueue}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Last updated</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {lastPoll.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error loading triage queue. Using cached data.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Severity
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Condition
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                ETA
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Transport
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="py-3 px-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {patient.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Age {patient.age} • ID: {patient.id}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-2">
                  {getSeverityBadge(patient.severity)}
                </td>
                <td className="py-3 px-2">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {patient.condition}
                  </p>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${getEtaColor(patient.eta)}`}>
                      {patient.eta} min
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">{getTransportIcon(patient.transport)}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {patient.transport}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {patient.assignedDepartment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {patients.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No patients currently in queue
          </p>
        </div>
      )}

      {/* Queue Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {patients.filter(p => p.severity === 'critical').length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Critical</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {patients.filter(p => p.severity === 'high').length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">High</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {patients.filter(p => p.severity === 'moderate').length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Moderate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {patients.filter(p => p.severity === 'low').length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Low</p>
          </div>
        </div>
      </div>
    </div>
  )
}
