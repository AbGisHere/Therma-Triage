'use client'

import React from 'react'
import { Package, Wind, Droplets, Snowflake, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface EquipmentItem {
  id: string
  name: string
  total: number
  available: number
  inUse: number
  status: 'available' | 'in-use' | 'critical-low'
  location: string
  lastMaintenance: string
}

export const ResourceManagement: React.FC = () => {
  const equipment: EquipmentItem[] = [
    {
      id: '1',
      name: 'Cooling Baths',
      total: 8,
      available: 2,
      inUse: 6,
      status: 'critical-low',
      location: 'ICU Ward A',
      lastMaintenance: '2 days ago'
    },
    {
      id: '2',
      name: 'Cold IV Saline Packs',
      total: 50,
      available: 15,
      inUse: 35,
      status: 'in-use',
      location: 'Emergency Room',
      lastMaintenance: '1 week ago'
    },
    {
      id: '3',
      name: 'Mist Fans',
      total: 12,
      available: 8,
      inUse: 4,
      status: 'available',
      location: 'General Ward',
      lastMaintenance: '3 days ago'
    },
    {
      id: '4',
      name: 'Ice Packs',
      total: 100,
      available: 45,
      inUse: 55,
      status: 'in-use',
      location: 'All Wards',
      lastMaintenance: 'Daily'
    }
  ]

  const getEquipmentIcon = (name: string) => {
    switch (name) {
      case 'Cooling Baths':
        return Wind
      case 'Cold IV Saline Packs':
        return Droplets
      case 'Mist Fans':
        return Package
      case 'Ice Packs':
        return Snowflake
      default:
        return Package
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span>Available</span>
          </span>
        )
      case 'in-use':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            <span>In Use</span>
          </span>
        )
      case 'critical-low':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full animate-pulse">
            <XCircle className="w-3 h-3" />
            <span>Critical Low</span>
          </span>
        )
      default:
        return null
    }
  }

  const getProgressColor = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage <= 25) return 'bg-red-500'
    if (percentage <= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Resource Management
        </h3>
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
          Request Resources
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipment.map((item) => {
          const Icon = getEquipmentIcon(item.name)
          const availablePercentage = (item.available / item.total) * 100
          
          return (
            <div
              key={item.id}
              className="bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white dark:bg-slate-600 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.location}
                    </p>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Availability</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.available}/{item.total}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.available, item.total)}`}
                    style={{ width: `${availablePercentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>In Use: {item.inUse}</span>
                  <span>Last: {item.lastMaintenance}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <Package className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Resource Optimization Tip
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
              Consider reallocating 2 mist fans from General Ward to ICU for critical patients
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
