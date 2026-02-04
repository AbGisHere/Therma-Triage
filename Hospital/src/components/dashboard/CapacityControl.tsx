'use client'

import React, { useState } from 'react'
import { Bed, Plus, Minus, AlertCircle } from 'lucide-react'

interface BedCapacity {
  icu: {
    total: number
    available: number
    occupied: number
  }
  er: {
    total: number
    available: number
    occupied: number
  }
}

export const CapacityControl: React.FC = () => {
  const [capacity, setCapacity] = useState<BedCapacity>({
    icu: {
      total: 19,
      available: 1,
      occupied: 18
    },
    er: {
      total: 35,
      available: 8,
      occupied: 27
    }
  })

  const [isUpdating, setIsUpdating] = useState(false)

  const updateBeds = async (type: 'icu' | 'er', action: 'increase' | 'decrease') => {
    setIsUpdating(true)
    
    // Simulate API call
    try {
      const response = await fetch('/hospital/update-beds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          action,
          timestamp: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        setCapacity(prev => {
          const newCapacity = { ...prev }
          if (action === 'increase') {
            newCapacity[type].available += 1
            newCapacity[type].total += 1
          } else {
            if (newCapacity[type].available > 0) {
              newCapacity[type].available -= 1
              newCapacity[type].total -= 1
            }
          }
          return newCapacity
        })
      }
    } catch (error) {
      console.error('Failed to update beds:', error)
    } finally {
      setTimeout(() => setIsUpdating(false), 500)
    }
  }

  const getCapacityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage <= 10) return 'text-red-600 dark:text-red-400'
    if (percentage <= 25) return 'text-orange-600 dark:text-orange-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getProgressColor = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage <= 10) return 'bg-red-500'
    if (percentage <= 25) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const BedCard = ({ type, data }: { type: 'icu' | 'er', data: BedCapacity['icu'] | BedCapacity['er'] }) => {
    const availablePercentage = (data.available / data.total) * 100
    const isCritical = availablePercentage <= 10

    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              <Bed className={`w-6 h-6 ${isCritical ? 'text-red-500' : 'text-blue-500'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {type.toUpperCase()} Beds
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Real-time capacity management
              </p>
            </div>
          </div>
          {isCritical && (
            <div className="flex items-center space-x-1 text-red-500">
              <AlertCircle className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-semibold">CRITICAL</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Capacity Display */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-2xl font-bold ${getCapacityColor(data.available, data.total)}`}>
                {data.available}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.occupied}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Occupied</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.total}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
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
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(data.available, data.total)}`}
                style={{ width: `${availablePercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Adjust Capacity
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateBeds(type, 'decrease')}
                disabled={data.available === 0 || isUpdating}
                className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
              <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                {data.total}
              </span>
              <button
                onClick={() => updateBeds(type, 'increase')}
                disabled={isUpdating}
                className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BedCard type="icu" data={capacity.icu} />
      <BedCard type="er" data={capacity.er} />
    </div>
  )
}
