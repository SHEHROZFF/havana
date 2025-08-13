'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

export default function PaymentsSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    environment: 'live',
    clientId: '',
    clientSecret: ''
  })
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/payments')
        const data = await res.json()
        if (res.ok) {
          setForm(f => ({
            ...f,
            environment: data.environment || 'live',
            // clientId is masked in GET; leave empty for security; admin should paste to change
            clientId: '',
            clientSecret: ''
          }))
          setLastUpdated(data.updatedAt || null)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setLastUpdated(data.updatedAt)
      alert('Payment settings saved.')
      setForm(f => ({ ...f, clientId: '', clientSecret: '' }))
    } catch (e: any) {
      alert(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Payment Settings</h1>
        <p className="text-gray-400">Configure PayPal credentials used for checkout.</p>
      </div>

      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">PayPal (Server)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Environment"
              value={form.environment}
              onChange={(e) => setForm({ ...form, environment: e.target.value })}
              options={[
                { value: 'live', label: 'Live' },
                { value: 'sandbox', label: 'Sandbox' }
              ]}
              required
            />
            <div />

            <Input
              label="Client ID"
              placeholder="Paste new Client ID to update"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            />
            <Input
              label="Client Secret"
              placeholder="Paste new Client Secret to update"
              value={form.clientSecret}
              onChange={(e) => setForm({ ...form, clientSecret: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-gray-400 text-sm">
              {lastUpdated ? `Last updated: ${new Date(lastUpdated).toLocaleString()}` : 'No settings saved yet'}
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

