'use client'

import React, { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Smartphone,
  Mail,
  Lock,
  User,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Thermometer,
  Clock
} from 'lucide-react'

interface NotificationSettings {
  criticalAlerts: boolean
  staffChanges: boolean
  bedUpdates: boolean
  resourceWarnings: boolean
  temperatureAlerts: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
}

interface SystemSettings {
  autoRefresh: boolean
  refreshInterval: number
  dataRetention: number
  backupFrequency: string
  maintenanceMode: boolean
  debugMode: boolean
}

interface UserSettings {
  name: string
  email: string
  role: string
  department: string
  language: string
  timezone: string
}

export const SettingsDashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'system' | 'account'>('general')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    criticalAlerts: true,
    staffChanges: true,
    bedUpdates: true,
    resourceWarnings: true,
    temperatureAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    autoRefresh: true,
    refreshInterval: 30,
    dataRetention: 90,
    backupFrequency: 'daily',
    maintenanceMode: false,
    debugMode: false
  })

  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@therma-triage.com',
    role: 'Chief Administrator',
    department: 'Emergency Medicine',
    language: 'en',
    timezone: 'Asia/Kolkata'
  })

  const handleSave = async () => {
    setSaveStatus('saving')
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1000)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
    { id: 'account', label: 'Account', icon: User }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">
        <div className="flex flex-wrap border-b border-gray-200 dark:border-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {theme === 'dark' ? (
                        <Moon className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Sun className="w-5 h-5 text-orange-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Choose between light and dark mode
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Language</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Select your preferred language
                        </p>
                      </div>
                    </div>
                    <select
                      value={userSettings.language}
                      onChange={(e) => setUserSettings({...userSettings, language: e.target.value})}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिन्दी</option>
                      <option value="mr">मराठी</option>
                      <option value="bn">বাংলা</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Timezone</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Set your local timezone
                        </p>
                      </div>
                    </div>
                    <select
                      value={userSettings.timezone}
                      onChange={(e) => setUserSettings({...userSettings, timezone: e.target.value})}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                      <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                      <option value="UTC">Coordinated Universal Time (UTC)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Alert Preferences
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'criticalAlerts', label: 'Critical Alerts', desc: 'Life-threatening emergencies', icon: AlertTriangle },
                    { key: 'staffChanges', label: 'Staff Changes', desc: 'Shift changes and emergencies', icon: User },
                    { key: 'bedUpdates', label: 'Bed Updates', desc: 'Capacity changes and availability', icon: Database },
                    { key: 'resourceWarnings', label: 'Resource Warnings', desc: 'Low stock and equipment issues', icon: Shield },
                    { key: 'temperatureAlerts', label: 'Temperature Alerts', desc: 'Heatwave warnings and WBGT changes', icon: Thermometer }
                  ].map(({ key, label, desc, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({...notificationSettings, [key]: !notificationSettings[key as keyof NotificationSettings]})}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationSettings[key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notification Channels
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive alerts via email', icon: Mail },
                    { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Get critical alerts via SMS', icon: Smartphone },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser and mobile push alerts', icon: Bell }
                  ].map(({ key, label, desc, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({...notificationSettings, [key]: !notificationSettings[key as keyof NotificationSettings]})}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationSettings[key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Data Management
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Auto Refresh</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatically update dashboard data
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSystemSettings({...systemSettings, autoRefresh: !systemSettings.autoRefresh})}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Refresh Interval</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Data update frequency in seconds
                        </p>
                      </div>
                    </div>
                    <select
                      value={systemSettings.refreshInterval}
                      onChange={(e) => setSystemSettings({...systemSettings, refreshInterval: Number(e.target.value)})}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={10}>10 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={300}>5 minutes</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Data Retention</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          How long to keep historical data
                        </p>
                      </div>
                    </div>
                    <select
                      value={systemSettings.dataRetention}
                      onChange={(e) => setSystemSettings({...systemSettings, dataRetention: Number(e.target.value)})}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                      <option value={180}>6 months</option>
                      <option value={365}>1 year</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Backup Frequency</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatic backup schedule
                        </p>
                      </div>
                    </div>
                    <select
                      value={systemSettings.backupFrequency}
                      onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value})}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  System Mode
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Temporarily disable dashboard for maintenance
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Debug Mode</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enable detailed logging and diagnostics
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSystemSettings({...systemSettings, debugMode: !systemSettings.debugMode})}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemSettings.debugMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Profile Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userSettings.name}
                        onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={userSettings.role}
                        onChange={(e) => setUserSettings({...userSettings, role: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={userSettings.department}
                        onChange={(e) => setUserSettings({...userSettings, department: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Security
                </h3>
                <div className="space-y-4">
                  <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5" />
                        <span>Change Password</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </div>
                  </button>
                  
                  <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5" />
                        <span>Two-Factor Authentication</span>
                      </div>
                      <span className="text-green-500 text-sm">Enabled</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              {saveStatus === 'saved' && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Settings saved successfully</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Error saving settings</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
