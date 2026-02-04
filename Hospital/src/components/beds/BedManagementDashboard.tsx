'use client'

import React, { useState } from 'react'
import { Bed, Users, Plus, Minus, Search, Filter, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface BedDetails {
  id: string
  bedNumber: string
  ward: string
  type: 'icu' | 'er' | 'general' | 'pediatric' | 'maternity'
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  patient?: {
    name: string
    age: number
    condition: string
    admissionTime: string
    severity: 'critical' | 'stable' | 'recovering'
  }
  lastCleaned: string
  equipment: string[]
}

export const BedManagementDashboard: React.FC = () => {
  const [beds, setBeds] = useState<BedDetails[]>([
    {
      id: '1',
      bedNumber: 'ICU-001',
      ward: 'Intensive Care Unit',
      type: 'icu',
      status: 'occupied',
      patient: {
        name: 'Raj Kumar',
        age: 45,
        condition: 'Heatstroke, Respiratory Support',
        admissionTime: '2024-02-05 08:30',
        severity: 'critical'
      },
      lastCleaned: '2024-02-05 06:00',
      equipment: ['Ventilator', 'Cardiac Monitor', 'IV Pump']
    },
    {
      id: '2',
      bedNumber: 'ICU-002',
      ward: 'Intensive Care Unit',
      type: 'icu',
      status: 'available',
      lastCleaned: '2024-02-05 07:15',
      equipment: ['Ventilator', 'Cardiac Monitor', 'IV Pump']
    },
    {
      id: '3',
      bedNumber: 'ER-001',
      ward: 'Emergency Room',
      type: 'er',
      status: 'occupied',
      patient: {
        name: 'Priya Sharma',
        age: 32,
        condition: 'Severe Dehydration',
        admissionTime: '2024-02-05 11:45',
        severity: 'stable'
      },
      lastCleaned: '2024-02-05 10:30',
      equipment: ['IV Pump', 'Oxygen Monitor']
    },
    {
      id: '4',
      bedNumber: 'ER-002',
      ward: 'Emergency Room',
      type: 'er',
      status: 'maintenance',
      lastCleaned: '2024-02-05 09:00',
      equipment: ['IV Pump', 'Oxygen Monitor']
    },
    {
      id: '5',
      bedNumber: 'GEN-101',
      ward: 'General Ward A',
      type: 'general',
      status: 'occupied',
      patient: {
        name: 'Amit Patel',
        age: 28,
        condition: 'Heat Exhaustion',
        admissionTime: '2024-02-05 14:20',
        severity: 'recovering'
      },
      lastCleaned: '2024-02-05 13:00',
      equipment: ['IV Stand']
    },
    {
      id: '6',
      bedNumber: 'GEN-102',
      ward: 'General Ward A',
      type: 'general',
      status: 'available',
      lastCleaned: '2024-02-05 12:45',
      equipment: ['IV Stand']
    }
  ])

  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span>Available</span>
          </span>
        )
      case 'occupied':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
            <Users className="w-3 h-3" />
            <span>Occupied</span>
          </span>
        )
      case 'maintenance':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>Maintenance</span>
          </span>
        )
      case 'reserved':
        return (
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
            Reserved
          </span>
        )
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
            CRITICAL
          </span>
        )
      case 'stable':
        return (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-semibold rounded-full">
            STABLE
          </span>
        )
      case 'recovering':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
            RECOVERING
          </span>
        )
      default:
        return null
    }
  }

  const filteredBeds = beds.filter(bed => {
    const matchesFilter = filter === 'all' || bed.type === filter
    const matchesSearch = bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bed.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    return matchesFilter && matchesSearch
  })

  const bedStats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
    reserved: beds.filter(b => b.status === 'reserved').length
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Bed className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{bedStats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Beds</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{bedStats.available}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bedStats.occupied}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Occupied</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{bedStats.maintenance}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Maintenance</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{bedStats.reserved}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reserved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="icu">ICU</option>
                <option value="er">Emergency</option>
                <option value="general">General</option>
                <option value="pediatric">Pediatric</option>
                <option value="maternity">Maternity</option>
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search beds, patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Beds Table */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Bed Details</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Equipment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Last Cleaned</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredBeds.map((bed) => (
                <tr key={bed.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{bed.bedNumber}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{bed.ward}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{bed.type}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(bed.status)}
                  </td>
                  <td className="py-4 px-4">
                    {bed.patient ? (
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{bed.patient.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Age {bed.patient.age}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{bed.patient.condition}</p>
                        <div className="mt-1">{getSeverityBadge(bed.patient.severity)}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">No patient</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {bed.equipment.map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{bed.lastCleaned}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {bed.status === 'available' && (
                        <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                      {bed.status === 'occupied' && (
                        <button className="p-1 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded">
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded">
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBeds.length === 0 && (
          <div className="text-center py-8">
            <Bed className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No beds found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
