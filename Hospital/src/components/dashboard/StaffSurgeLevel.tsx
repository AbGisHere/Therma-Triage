'use client'

import React from 'react'
import { Users, UserPlus, TrendingUp, AlertTriangle } from 'lucide-react'

export const StaffSurgeLevel: React.FC = () => {
  const staffData = {
    strainLevel: 78,
    doctorsOnFloor: 12,
    nursesOnFloor: 28,
    totalDoctors: 20,
    totalNurses: 45,
    emergencyStaffRequested: true,
    nextShiftChange: '3 hours'
  }

  const getStrainColor = (level: number) => {
    if (level >= 80) return 'red'
    if (level >= 60) return 'orange'
    if (level >= 40) return 'yellow'
    return 'green'
  }

  const getStrainLabel = (level: number) => {
    if (level >= 80) return 'CRITICAL'
    if (level >= 60) return 'HIGH'
    if (level >= 40) return 'MODERATE'
    return 'NORMAL'
  }

  const strainColor = getStrainColor(staffData.strainLevel)
  const strainLabel = getStrainLabel(staffData.strainLevel)

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Staff Surge Level
        </h3>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Live Status
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Strain Level Gauge */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Strain Level
            </span>
            <span className={`px-2 py-1 bg-${strainColor}-100 dark:bg-${strainColor}-900/30 text-${strainColor}-600 dark:text-${strainColor}-400 text-xs font-semibold rounded-full`}>
              {strainLabel}
            </span>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4">
              <div
                className={`bg-gradient-to-r from-${strainColor}-400 to-${strainColor}-600 h-4 rounded-full transition-all duration-500 relative`}
                style={{ width: `${staffData.strainLevel}%` }}
              >
                {staffData.strainLevel >= 80 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {staffData.strainLevel}%
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Current Shift Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {staffData.doctorsOnFloor}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  of {staffData.totalDoctors} doctors
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {staffData.nursesOnFloor}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  of {staffData.totalNurses} nurses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Staff Request */}
        {staffData.emergencyStaffRequested && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  Emergency Staff Requested
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                  5 additional doctors and 10 nurses en route
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors">
          <UserPlus className="w-5 h-5" />
          <span>Request Emergency Staff Backup</span>
        </button>

        {/* Next Shift Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>Next shift change:</span>
          </div>
          <span className="font-medium">{staffData.nextShiftChange}</span>
        </div>
      </div>
    </div>
  )
}
