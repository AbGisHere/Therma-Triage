import { Layout } from '@/components/Layout'
import { BedManagementDashboard } from '@/components/beds/BedManagementDashboard'

export default function BedsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bed Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive bed capacity and allocation tracking</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <BedManagementDashboard />
      </div>
    </Layout>
  )
}
