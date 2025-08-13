'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useAdminI18n } from '../../../lib/i18n/admin-context'

export default function PaymentsSettingsPage() {
  const { t } = useAdminI18n()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    environment: 'live',
    clientId: '',
    clientSecret: ''
  })
  const [displayData, setDisplayData] = useState({
    maskedClientId: '',
    maskedClientSecret: '',
    hasClientId: false,
    hasClientSecret: false
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
            // Keep form fields empty for security - admin needs to paste to change
            clientId: '',
            clientSecret: ''
          }))
          setDisplayData({
            maskedClientId: data.clientId || '',
            maskedClientSecret: data.clientSecret || '',
            hasClientId: data.hasClientId || false,
            hasClientSecret: data.hasClientSecret || false
          })
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
      alert(t('payment_settings_saved'))
      // Clear form fields but update display data to show credentials are now set
      setForm(f => ({ ...f, clientId: '', clientSecret: '' }))
      setDisplayData(prev => ({
        ...prev,
        maskedClientId: form.clientId.replace(/.(?=.{4})/g, '*'),
        maskedClientSecret: '***SECRET_SET***',
        hasClientId: true,
        hasClientSecret: true
      }))
    } catch (e: any) {
      alert(e.message || t('failed_to_save_settings'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <span className="ml-4 text-white">{t('loading')}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('payment_settings')}</h1>
        <p className="text-gray-400">{t('configure_paypal_description')}</p>
      </div>

      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">{t('paypal_server')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t('environment')}
              value={form.environment}
              onChange={(e) => setForm({ ...form, environment: e.target.value })}
              options={[
                { value: 'live', label: t('live_environment') },
                { value: 'sandbox', label: t('sandbox_environment') }
              ]}
              required
            />
            <div />

            <div className="space-y-2">
              <Input
                label={t('client_id')}
                placeholder={displayData.hasClientId ? `Current: ${displayData.maskedClientId} - ${t('client_id_placeholder')}` : t('client_id_placeholder')}
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              />
              {displayData.hasClientId && (
                <p className="text-xs text-green-400">✓ Client ID is configured</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                label={t('client_secret')}
                placeholder={displayData.hasClientSecret ? `Current: ${displayData.maskedClientSecret} - ${t('client_secret_placeholder')}` : t('client_secret_placeholder')}
                value={form.clientSecret}
                onChange={(e) => setForm({ ...form, clientSecret: e.target.value })}
                type="password"
              />
              {displayData.hasClientSecret && (
                <p className="text-xs text-green-400">✓ Client Secret is configured</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-gray-400 text-sm">
              {lastUpdated ? `${t('last_updated')}: ${new Date(lastUpdated).toLocaleString()}` : t('no_settings_saved_yet')}
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t('saving') : t('save_settings')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

