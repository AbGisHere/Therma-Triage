import { Layout } from '@/components/Layout'
import { CriticalAlertCards } from '@/components/dashboard/CriticalAlertCards'
import { HeatwaveRiskWidget } from '@/components/dashboard/HeatwaveRiskWidget'
import { ResourceManagement } from '@/components/dashboard/ResourceManagement'
import { StaffSurgeLevel } from '@/components/dashboard/StaffSurgeLevel'
import { CapacityControl } from '@/components/dashboard/CapacityControl'
import { DivertSwitch } from '@/components/dashboard/DivertSwitch'
import { TriageQueue } from '@/components/dashboard/TriageQueue'
import { TrendAnalytics } from '@/components/dashboard/TrendAnalytics'

export default function Home() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time hospital resource management</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <CriticalAlertCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ResourceManagement />
          </div>
          <div className="space-y-6">
            <HeatwaveRiskWidget />
            <StaffSurgeLevel />
          </div>
        </div>

        <CapacityControl />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TriageQueue />
          </div>
          <div>
            <DivertSwitch />
          </div>
        </div>

        <TrendAnalytics />
      </div>
    </Layout>
  )
}
