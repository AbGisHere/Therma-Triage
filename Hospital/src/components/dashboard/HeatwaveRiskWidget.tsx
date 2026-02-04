'use client'

import React from 'react'
import { Thermometer, Droplets, Sun, AlertTriangle } from 'lucide-react'

export const HeatwaveRiskWidget: React.FC = () => {
  const wbgtData = {
    current: 28.5,
    threshold: 28.0,
    city: 'Mumbai',
    lastUpdated: '2 mins ago'
  }

  const getRiskLevel = (wbgt: number) => {
    if (wbgt >= 28.0) return { level: 'EXTREME', color: 'red' }
    if (wbgt >= 26.0) return { level: 'HIGH', color: 'orange' }
    if (wbgt >= 24.0) return { level: 'MODERATE', color: 'yellow' }
    return { level: 'LOW', color: 'green' }
  }

  const risk = getRiskLevel(wbgtData.current)

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Heatwave Risk
        </h3>
        <div className="flex items-center space-x-2">
          <Sun className="w-5 h-5 text-orange-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {wbgtData.city}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Thermometer className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {wbgtData.current}°C
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                WBGT Index
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`px-3 py-1 bg-${risk.color}-100 dark:bg-${risk.color}-900/30 text-${risk.color}-600 dark:text-${risk.color}-400 text-sm font-semibold rounded-full`}>
              {risk.level}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Threshold</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {wbgtData.threshold}°C
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className={`bg-${risk.color}-500 h-2 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min((wbgtData.current / 35) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Droplets className="w-4 h-4" />
            <span>Humidity: 65%</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {wbgtData.lastUpdated}
          </span>
        </div>

        {wbgtData.current >= wbgtData.threshold && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Heat Advisory Active
                </p>
                <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                  Increase cooling resources and monitor patients closely
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
