'use client'

import React, { useState } from 'react'
import { 
  Package, 
  Wind, 
  Droplets, 
  Snowflake, 
  Thermometer, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react'

interface ResourceItem {
  id: string
  name: string
  category: 'cooling' | 'iv-fluids' | 'monitoring' | 'emergency'
  total: number
  available: number
  inUse: number
  maintenance: number
  location: string
  lastRestocked: string
  minThreshold: number
  supplier: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
}

export const CriticalResourcesDashboard: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: '1',
      name: 'Cooling Baths',
      category: 'cooling',
      total: 8,
      available: 2,
      inUse: 6,
      maintenance: 0,
      location: 'ICU Ward A',
      lastRestocked: '2024-02-01',
      minThreshold: 3,
      supplier: 'MediCool Systems',
      urgency: 'critical'
    },
    {
      id: '2',
      name: 'Cold IV Saline Packs',
      category: 'iv-fluids',
      total: 50,
      available: 15,
      inUse: 35,
      maintenance: 0,
      location: 'Emergency Room',
      lastRestocked: '2024-02-03',
      minThreshold: 20,
      supplier: 'LifeFluids Inc',
      urgency: 'high'
    },
    {
      id: '3',
      name: 'Mist Fans',
      category: 'cooling',
      total: 12,
      available: 8,
      inUse: 4,
      maintenance: 0,
      location: 'General Ward',
      lastRestocked: '2024-02-02',
      minThreshold: 5,
      supplier: 'CoolAir Solutions',
      urgency: 'low'
    },
    {
      id: '4',
      name: 'Ice Packs',
      category: 'cooling',
      total: 100,
      available: 45,
      inUse: 55,
      maintenance: 0,
      location: 'All Wards',
      lastRestocked: '2024-02-04',
      minThreshold: 30,
      supplier: 'ColdPack Co',
      urgency: 'medium'
    },
    {
      id: '5',
      name: 'Core Temperature Monitors',
      category: 'monitoring',
      total: 15,
      available: 3,
      inUse: 10,
      maintenance: 2,
      location: 'ICU',
      lastRestocked: '2024-01-28',
      minThreshold: 5,
      supplier: 'TempTech Medical',
      urgency: 'high'
    },
    {
      id: '6',
      name: 'Portable Cooling Units',
      category: 'cooling',
      total: 6,
      available: 1,
      inUse: 5,
      maintenance: 0,
      location: 'Emergency Department',
      lastRestocked: '2024-02-01',
      minThreshold: 2,
      supplier: 'Arctic Medical',
      urgency: 'critical'
    },
    {
      id: '7',
      name: 'Electrolyte Solutions',
      category: 'iv-fluids',
      total: 75,
      available: 40,
      inUse: 35,
      maintenance: 0,
      location: 'ER & Wards',
      lastRestocked: '2024-02-03',
      minThreshold: 25,
      supplier: 'HydroLife Medical',
      urgency: 'low'
    },
    {
      id: '8',
      name: 'Heatstroke Treatment Kits',
      category: 'emergency',
      total: 20,
      available: 4,
      inUse: 16,
      maintenance: 0,
      location: 'Emergency Room',
      lastRestocked: '2024-02-02',
      minThreshold: 8,
      supplier: 'Emergency Response Systems',
      urgency: 'high'
    }
  ])

  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cooling':
        return Wind
      case 'iv-fluids':
        return Droplets
      case 'monitoring':
        return Thermometer
      case 'emergency':
        return Package
      default:
        return Package
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>CRITICAL</span>
          </span>
        )
      case 'high':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>HIGH</span>
          </span>
        )
      case 'medium':
        return (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-semibold rounded-full">
            MEDIUM
          </span>
        )
      case 'low':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span>LOW</span>
          </span>
        )
      default:
        return null
    }
  }

  const getProgressColor = (available: number, minThreshold: number) => {
    if (available <= minThreshold) return 'bg-red-500'
    if (available <= minThreshold * 1.5) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const filteredResources = resources.filter(resource => {
    const matchesFilter = filter === 'all' || resource.category === filter
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const resourceStats = {
    total: resources.reduce((sum, r) => sum + r.total, 0),
    available: resources.reduce((sum, r) => sum + r.available, 0),
    inUse: resources.reduce((sum, r) => sum + r.inUse, 0),
    critical: resources.filter(r => r.urgency === 'critical').length,
    lowStock: resources.filter(r => r.available <= r.minThreshold).length
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{resourceStats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{resourceStats.available}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{resourceStats.inUse}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">In Use</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{resourceStats.critical}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Critical</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{resourceStats.lowStock}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Low Stock</p>
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
                <option value="all">All Categories</option>
                <option value="cooling">Cooling Equipment</option>
                <option value="iv-fluids">IV Fluids</option>
                <option value="monitoring">Monitoring</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Request Supplies</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => {
          const Icon = getCategoryIcon(resource.category)
          const availablePercentage = (resource.available / resource.total) * 100
          
          return (
            <div
              key={resource.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {resource.name}
                    </h4>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {resource.location}
                      </span>
                    </div>
                  </div>
                </div>
                {getUrgencyBadge(resource.urgency)}
              </div>

              <div className="space-y-4">
                {/* Inventory Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {resource.available}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {resource.inUse}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">In Use</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {resource.maintenance}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Maintenance</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Availability</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {availablePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(resource.available, resource.minThreshold)}`}
                      style={{ width: `${availablePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Min: {resource.minThreshold}</span>
                    <span>Total: {resource.total}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Supplier:</span>
                    <span className="text-gray-700 dark:text-gray-300">{resource.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Restocked:</span>
                    <span className="text-gray-700 dark:text-gray-300">{resource.lastRestocked}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-3 border-t border-gray-200 dark:border-slate-700">
                  {resource.available > 0 && (
                    <button className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors">
                      Deploy
                    </button>
                  )}
                  <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors">
                    Details
                  </button>
                  {resource.available <= resource.minThreshold && (
                    <button className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors">
                      Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No resources found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
