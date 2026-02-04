import { Layout } from '@/components/Layout'
import { SettingsDashboard } from '@/components/settings/SettingsDashboard'

export default function SettingsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">System configuration and preferences</p>
          </div>
        </div>

        <SettingsDashboard />
      </div>
    </Layout>
  )
}
