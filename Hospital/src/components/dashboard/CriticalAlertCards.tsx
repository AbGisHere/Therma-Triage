'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, Activity, Users } from 'lucide-react'
import { api } from '@/lib/api'

interface AlertCard {
  title: string
  value: string
  status: 'critical' | 'warning' | 'normal'
  change: string
  icon: React.ReactNode
}

export const CriticalAlertCards: React.FC = () => {
  const [bedStats, setBedStats] = useState<any>(null)
  const [resourceAlerts, setResourceAlerts] = useState<any>(null)
  const [staffSurge, setStaffSurge] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bedsData, resourcesData, staffData] = await Promise.all([
          api.getBedStats(),
          api.getResourceAlerts(),
          api.getStaffSurgeLevel()
        ])

        setBedStats(bedsData)
        setResourceAlerts(resourcesData)
        setStaffSurge(staffData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getAlertCards = (): AlertCard[] => {
    if (!bedStats || !resourceAlerts || !staffSurge) return []

    const icuOccupancy = (bedStats.icu.occupied / bedStats.icu.total) * 100
    const erOccupancy = (bedStats.er.occupied / bedStats.er.total) * 100

    return [
      {
        title: 'ICU Capacity',
        value: `${bedStats.icu.occupied}/${bedStats.icu.total}`,
        status: icuOccupancy >= 90 ? 'critical' : icuOccupancy >= 75 ? 'warning' : 'normal',
        change: '+2 from yesterday',
        icon: <AlertTriangle className="w-5 h-5" />
      },
      {
        title: 'Cooling Units',
        value: `${resourceAlerts.criticalAlerts} Critical`,
        status: resourceAlerts.criticalAlerts > 0 ? 'critical' : resourceAlerts.lowAlerts > 0 ? 'warning' : 'normal',
        change: '-3 from yesterday',
        icon: <Activity className="w-5 h-5" />
      },
      {
        title: 'Staff Status',
        value: `${staffSurge.percentage}% Strain`,
        status: staffSurge.percentage >= 85 ? 'critical' : staffSurge.percentage >= 70 ? 'warning' : 'normal',
        change: '+12% from baseline',
        icon: <Users className="w-5 h-5" />
      }
    ]
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const alertCards = getAlertCards()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {alertCards.map((card, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl border ${
            card.status === 'critical'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              : card.status === 'warning'
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {card.change}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                card.status === 'critical'
                  ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
                  : card.status === 'warning'
                  ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
                  : 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
              }`}
            >
              {card.icon}
            </div>
          </div>
          {card.status === 'critical' && (
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-red-600 dark:text-red-400">
                Critical Alert
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
