'use client'

import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react'

type HospitalStatus = 'accepting' | 'diverting'

export const DivertSwitch: React.FC = () => {
  const [status, setStatus] = useState<HospitalStatus>('accepting')
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleStatus = async () => {
    setIsUpdating(true)
    
    // Simulate API call to update hospital status
    try {
      const response = await fetch('/hospital/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status === 'accepting' ? 'diverting' : 'accepting',
          timestamp: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        setStatus(prev => prev === 'accepting' ? 'diverting' : 'accepting')
      }
    } catch (error) {
      console.error('Failed to update hospital status:', error)
    } finally {
      setTimeout(() => setIsUpdating(false), 500)
    }
  }

  const isAccepting = status === 'accepting'

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isAccepting ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <Shield className={`w-6 h-6 ${isAccepting ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hospital Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Emergency diversion control
            </p>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${
          isAccepting 
            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
        }`}>
          {isAccepting ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
          )}
          <span className={`text-lg font-bold ${
            isAccepting ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
          }`}>
            {isAccepting ? 'ACCEPTING PATIENTS' : 'DIVERTING PATIENTS'}
          </span>
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleStatus}
          disabled={isUpdating}
          className={`relative inline-flex h-14 w-24 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:cursor-not-allowed ${
            isAccepting 
              ? 'bg-green-500 hover:bg-green-600 focus:ring-green-200 dark:focus:ring-green-800' 
              : 'bg-red-500 hover:bg-red-600 focus:ring-red-200 dark:focus:ring-red-800'
          } ${isUpdating ? 'opacity-75' : ''}`}
        >
          <span className="sr-only">Toggle hospital status</span>
          <span
            className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
              isAccepting ? 'translate-x-2' : 'translate-x-12'
            }`}
          >
            <span className="flex h-full w-full items-center justify-center">
              {isAccepting ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
            </span>
          </span>
        </button>
      </div>

      {/* Status Information */}
      <div className="space-y-3">
        {isAccepting ? (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Hospital is Accepting Patients
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                  All emergency departments are open and receiving new patients via ambulance and self-admission.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Hospital is Diverting Patients
                </p>
                <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                  Emergency services are being redirected to other facilities. Critical cases only.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Status Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Capacity</p>
            <p className={`text-lg font-semibold ${
              isAccepting ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isAccepting ? '85%' : '105%'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">ETA Change</p>
            <p className={`text-lg font-semibold ${
              isAccepting ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isAccepting ? '15 min' : '45+ min'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button for Emergency Override */}
      {!isAccepting && (
        <div className="mt-6">
          <button
            onClick={() => setStatus('accepting')}
            className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            Emergency Override - Accept All Patients
          </button>
        </div>
      )}
    </div>
  )
}
