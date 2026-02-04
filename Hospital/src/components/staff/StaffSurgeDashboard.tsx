'use client'

import React, { useState } from 'react'
import { 
  Users, 
  UserPlus, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Phone,
  MapPin,
  Star,
  Activity,
  Filter,
  Search,
  Download
} from 'lucide-react'

interface StaffMember {
  id: string
  name: string
  role: 'doctor' | 'nurse' | 'technician' | 'admin' | 'specialist'
  department: string
  status: 'on-duty' | 'on-call' | 'off-duty' | 'emergency' | 'resting'
  shiftStart: string
  shiftEnd: string
  hoursWorked: number
  patientsAssigned: number
  experience: number
  contact: string
  location: string
  fatigue: 'low' | 'medium' | 'high'
  certifications: string[]
}

interface ShiftInfo {
  currentShift: 'day' | 'night' | 'transition'
  shiftChangeTime: string
  nextStaffCount: number
  emergencyStaffRequested: boolean
  surgeLevel: number
}

export const StaffSurgeDashboard: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      role: 'doctor',
      department: 'Emergency Medicine',
      status: 'on-duty',
      shiftStart: '07:00',
      shiftEnd: '19:00',
      hoursWorked: 6,
      patientsAssigned: 8,
      experience: 12,
      contact: '+91-98765-43210',
      location: 'Emergency Room',
      fatigue: 'medium',
      certifications: ['ALS', 'ATLS', 'Heatstroke Treatment']
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'nurse',
      department: 'ICU',
      status: 'on-duty',
      shiftStart: '07:00',
      shiftEnd: '19:00',
      hoursWorked: 6,
      patientsAssigned: 4,
      experience: 8,
      contact: '+91-98765-43211',
      location: 'ICU Ward A',
      fatigue: 'low',
      certifications: ['Critical Care', 'IV Therapy']
    },
    {
      id: '3',
      name: 'Dr. Raj Kumar',
      role: 'doctor',
      department: 'Internal Medicine',
      status: 'emergency',
      shiftStart: '08:00',
      shiftEnd: '20:00',
      hoursWorked: 5,
      patientsAssigned: 12,
      experience: 15,
      contact: '+91-98765-43212',
      location: 'General Ward',
      fatigue: 'high',
      certifications: ['Internal Medicine', 'Emergency Response']
    },
    {
      id: '4',
      name: 'Amit Patel',
      role: 'technician',
      department: 'Radiology',
      status: 'on-call',
      shiftStart: '09:00',
      shiftEnd: '21:00',
      hoursWorked: 4,
      patientsAssigned: 6,
      experience: 6,
      contact: '+91-98765-43213',
      location: 'Radiology Department',
      fatigue: 'low',
      certifications: ['Radiology Tech', 'Safety Protocol']
    },
    {
      id: '5',
      name: 'Sunita Reddy',
      role: 'nurse',
      department: 'Emergency',
      status: 'on-duty',
      shiftStart: '14:00',
      shiftEnd: '02:00',
      hoursWorked: 2,
      patientsAssigned: 5,
      experience: 10,
      contact: '+91-98765-43214',
      location: 'Emergency Room',
      fatigue: 'low',
      certifications: ['Emergency Nursing', 'Trauma Care']
    },
    {
      id: '6',
      name: 'Dr. Vikram Singh',
      role: 'specialist',
      department: 'Cardiology',
      status: 'off-duty',
      shiftStart: '19:00',
      shiftEnd: '07:00',
      hoursWorked: 0,
      patientsAssigned: 0,
      experience: 18,
      contact: '+91-98765-43215',
      location: 'Off-Site',
      fatigue: 'low',
      certifications: ['Cardiology', 'Interventional Cardiology']
    }
  ])

  const [shiftInfo, setShiftInfo] = useState<ShiftInfo>({
    currentShift: 'day',
    shiftChangeTime: '19:00',
    nextStaffCount: 15,
    emergencyStaffRequested: true,
    surgeLevel: 78
  })

  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-duty':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
            <Activity className="w-3 h-3" />
            <span>On Duty</span>
          </span>
        )
      case 'on-call':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
            <Phone className="w-3 h-3" />
            <span>On Call</span>
          </span>
        )
      case 'emergency':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>Emergency</span>
          </span>
        )
      case 'off-duty':
        return (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
            Off Duty
          </span>
        )
      case 'resting':
        return (
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
            Resting
          </span>
        )
      default:
        return null
    }
  }

  const getFatigueBadge = (fatigue: string) => {
    switch (fatigue) {
      case 'low':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
            Low
          </span>
        )
      case 'medium':
        return (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
            Medium
          </span>
        )
      case 'high':
        return (
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
            High
          </span>
        )
      default:
        return null
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return '👨‍⚕️'
      case 'nurse':
        return '👩‍⚕️'
      case 'technician':
        return '🔧'
      case 'admin':
        return '📋'
      case 'specialist':
        return '⭐'
      default:
        return '👤'
    }
  }

  const filteredStaff = staff.filter(member => {
    const matchesFilter = filter === 'all' || member.role === filter || member.status === filter
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const staffStats = {
    total: staff.length,
    onDuty: staff.filter(s => s.status === 'on-duty').length,
    onCall: staff.filter(s => s.status === 'on-call').length,
    emergency: staff.filter(s => s.status === 'emergency').length,
    offDuty: staff.filter(s => s.status === 'off-duty').length,
    highFatigue: staff.filter(s => s.fatigue === 'high').length
  }

  return (
    <div className="space-y-6">
      {/* Surge Level Overview */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Surge Status</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              shiftInfo.surgeLevel >= 80 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : shiftInfo.surgeLevel >= 60
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            }`}>
              {shiftInfo.surgeLevel}% Capacity
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="transform -rotate-90 w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - shiftInfo.surgeLevel / 100)}`}
                  className={shiftInfo.surgeLevel >= 80 ? 'text-red-500' : shiftInfo.surgeLevel >= 60 ? 'text-orange-500' : 'text-green-500'}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {shiftInfo.surgeLevel}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Strain Level</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {staffStats.onDuty}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">On Duty</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {staffStats.emergency}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Emergency</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              {staffStats.highFatigue}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">High Fatigue</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Next Shift Change
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {shiftInfo.shiftChangeTime} - {shiftInfo.nextStaffCount} staff arriving
              </p>
            </div>
          </div>
          {shiftInfo.emergencyStaffRequested && (
            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">Emergency Staff Requested</span>
            </div>
          )}
        </div>
      </div>

      {/* Staff Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{staffStats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Staff</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{staffStats.onDuty}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">On Duty</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Phone className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{staffStats.onCall}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">On Call</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{staffStats.emergency}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Emergency</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{staffStats.offDuty}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Off Duty</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{staffStats.highFatigue}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">High Fatigue</p>
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
                <option value="all">All Staff</option>
                <option value="doctor">Doctors</option>
                <option value="nurse">Nurses</option>
                <option value="technician">Technicians</option>
                <option value="specialist">Specialists</option>
                <option value="on-duty">On Duty</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Request Backup</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Staff Member</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Department</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Shift</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Workload</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Fatigue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getRoleIcon(member.role)}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{member.role}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{member.experience} years</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(member.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{member.department}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{member.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{member.shiftStart} - {member.shiftEnd}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{member.hoursWorked}h worked</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{member.patientsAssigned} patients</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.certifications.slice(0, 2).map((cert, index) => (
                          <span
                            key={index}
                            className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-xs text-blue-600 dark:text-blue-400 rounded"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getFatigueBadge(member.fatigue)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{member.contact}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStaff.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No staff found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
