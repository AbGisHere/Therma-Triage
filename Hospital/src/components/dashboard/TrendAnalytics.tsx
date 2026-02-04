'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Thermometer, Activity, Calendar } from 'lucide-react'

interface DataPoint {
  time: string
  temperature: number
  admissions: number
  humidity: number
}

export const TrendAnalytics: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')

  // Mock data for demonstration - ready to receive from API
  const mockData: DataPoint[] = [
    { time: '00:00', temperature: 24.5, admissions: 3, humidity: 65 },
    { time: '04:00', temperature: 23.8, admissions: 2, humidity: 68 },
    { time: '08:00', temperature: 26.2, admissions: 5, humidity: 62 },
    { time: '12:00', temperature: 31.5, admissions: 12, humidity: 55 },
    { time: '16:00', temperature: 33.2, admissions: 18, humidity: 48 },
    { time: '20:00', temperature: 29.8, admissions: 8, humidity: 58 },
    { time: '23:59', temperature: 27.1, admissions: 4, humidity: 64 },
  ]

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call to get analytics data
      const response = await fetch('/hospital/analytics')
      
      if (response.ok) {
        const apiData = await response.json()
        setData(apiData)
      } else {
        // Use mock data for demo
        setData(mockData)
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
      // Use mock data for demo
      setData(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const getCorrelation = () => {
    if (data.length < 2) return 0
    
    const n = data.length
    const sumX = data.reduce((sum, point) => sum + point.temperature, 0)
    const sumY = data.reduce((sum, point) => sum + point.admissions, 0)
    const sumXY = data.reduce((sum, point) => sum + point.temperature * point.admissions, 0)
    const sumX2 = data.reduce((sum, point) => sum + point.temperature * point.temperature, 0)
    const sumY2 = data.reduce((sum, point) => sum + point.admissions * point.admissions, 0)
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
    
    return isNaN(correlation) ? 0 : correlation
  }

  const correlation = getCorrelation()
  const correlationStrength = Math.abs(correlation) > 0.7 ? 'Strong' : 
                              Math.abs(correlation) > 0.4 ? 'Moderate' : 'Weak'

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-600 dark:text-gray-400">
                {entry.name}:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {entry.name === 'Temperature' ? `${entry.value}°C` : entry.value}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trend Analytics
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Admissions vs Temperature Correlation
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Correlation Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Avg Temperature</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(data.reduce((sum, point) => sum + point.temperature, 0) / data.length).toFixed(1)}°C
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Total Admissions</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, point) => sum + point.admissions, 0)}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Correlation</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {correlationStrength} ({correlation.toFixed(2)})
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              yAxisId="temp"
              orientation="left"
              stroke="#f97316"
              fontSize={12}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="admissions"
              orientation="right"
              stroke="#3b82f6"
              fontSize={12}
              label={{ value: 'Admissions', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Temperature"
            />
            <Line
              yAxisId="admissions"
              type="monotone"
              dataKey="admissions"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Admissions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Key Insights
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
              {correlation > 0.5 
                ? `Strong positive correlation (${correlationStrength}) between temperature and admissions. Consider increasing staff during peak heat hours.`
                : correlation < -0.5
                ? `Negative correlation detected. Unusual pattern requiring further investigation.`
                : `Weak correlation (${correlationStrength}). Other factors may be influencing admission rates more significantly.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
