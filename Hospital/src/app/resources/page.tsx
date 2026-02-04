import { Layout } from '@/components/Layout'
import { CriticalResourcesDashboard } from '@/components/resources/CriticalResourcesDashboard'

export default function ResourcesPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Critical Resources</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Heatwave emergency equipment and supply management</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <CriticalResourcesDashboard />
      </div>
    </Layout>
  )
}
