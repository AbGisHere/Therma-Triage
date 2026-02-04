import { Layout } from '@/components/Layout'
import { StaffSurgeDashboard } from '@/components/staff/StaffSurgeDashboard'

export default function StaffPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Surge Status</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time staff management and surge capacity tracking</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <StaffSurgeDashboard />
      </div>
    </Layout>
  )
}
