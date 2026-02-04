'use client'

import React from 'react'
import { AlertTriangle, Bed, Wind, Users } from 'lucide-react'

export const CriticalAlertCards: React.FC = () => {
  const alerts = [
    {
      title: 'ICU Capacity',
      value: '95% Full',
      status: 'critical',
      icon: Bed,
      details: '18/19 beds occupied',
      trend: '+2 admissions in last hour'
    },
    {
      title: 'Cooling Units',
      value: '2 Available',
      status: 'warning',
      icon: Wind,
      details: '8 units total, 6 in use',
      trend: 'Expected shortage in 2 hours'
    },
    {
      title: 'Staff Status',
      value: 'Surge Level: HIGH',
      status: 'warning',
      icon: Users,
      details: '12 doctors, 28 nurses on floor',
      trend: 'Requesting emergency backup'
    }
  ]

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-400',
          icon: 'text-red-500',
          pulse: 'animate-pulse'
        }
      case 'warning':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          text: 'text-orange-700 dark:text-orange-400',
          icon: 'text-orange-500',
          pulse: ''
        }
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-700',
          text: 'text-gray-700 dark:text-gray-400',
          icon: 'text-gray-500',
          pulse: ''
        }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {alerts.map((alert, index) => {
        const styles = getStatusStyles(alert.status)
        const Icon = alert.icon
        
        return (
          <div
            key={index}
            className={`${styles.bg} ${styles.border} border rounded-xl p-6 ${alert.status === 'critical' ? styles.pulse : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${styles.icon} p-2 rounded-lg bg-white dark:bg-slate-800`}>
                <Icon className="w-6 h-6" />
              </div>
              {alert.status === 'critical' && (
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                  CRITICAL
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {alert.title}
            </h3>
            
            <p className={`text-2xl font-bold ${styles.text} mb-3`}>
              {alert.value}
            </p>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {alert.details}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {alert.trend}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
