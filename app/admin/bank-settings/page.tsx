'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'
import { useAdminI18n } from '../../../lib/i18n/admin-context'
import { Building2, Save, Edit, Eye, EyeOff } from 'lucide-react'

interface BankConfig {
  id?: string
  bankName: string
  accountHolder: string
  iban: string
  swiftCode?: string
  accountNumber?: string
  bankAddress?: string
  instructions?: string
  isActive: boolean
}

export default function BankSettingsPage() {
  const { t } = useAdminI18n()
  const [bankConfig, setBankConfig] = useState<BankConfig>({
    bankName: '',
    accountHolder: '',
    iban: '',
    swiftCode: '',
    accountNumber: '',
    bankAddress: '',
    instructions: '',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSensitive, setShowSensitive] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch current bank configuration
  useEffect(() => {
    const fetchBankConfig = async () => {
      try {
        const response = await fetch('/api/admin/bank-config')
        const data = await response.json()
        if (data.success && data.bankConfig) {
          setBankConfig(data.bankConfig)
        }
      } catch (error) {
        console.error('Error fetching bank config:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBankConfig()
  }, [])

  // Handle input changes
  const handleInputChange = (field: keyof BankConfig, value: string) => {
    setBankConfig(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!bankConfig.bankName.trim()) {
      newErrors.bankName = t('bank_name_is_required')
    }

    if (!bankConfig.accountHolder.trim()) {
      newErrors.accountHolder = t('account_holder_is_required')
    }

    if (!bankConfig.iban.trim()) {
      newErrors.iban = t('iban_is_required')
    } else {
      // Basic IBAN validation (can be improved)
      const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/
      if (!ibanRegex.test(bankConfig.iban.replace(/\s/g, '').toUpperCase())) {
        newErrors.iban = t('please_enter_valid_iban')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save bank configuration
  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/bank-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bankConfig,
          iban: bankConfig.iban.replace(/\s/g, '').toUpperCase() // Clean and format IBAN
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setBankConfig(data.bankConfig)
        alert(t('bank_configuration_saved_successfully'))
      } else {
        throw new Error(data.error || t('failed_to_save_bank_configuration'))
      }
    } catch (error) {
      console.error('Error saving bank config:', error)
      alert(`${t('failed_to_save_bank_configuration')}: ${error instanceof Error ? error.message : t('unknown_error')}`)
    } finally {
      setSaving(false)
    }
  }

  // Format IBAN for display
  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white text-lg">{t('loading_bank_settings')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('bank_transfer_settings')}
          </h1>
          <p className="text-gray-400">
            {t('configure_bank_details')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowSensitive(!showSensitive)}
            size="sm"
          >
            {showSensitive ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                {t('hide_values')}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                {t('show_values')}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Bank Configuration Form */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building2 className="w-6 h-6 mr-3 text-teal-400" />
            {t('bank_account_information')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Information Notice */}
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              {t('sensitivity_tip')}
            </p>
          </div>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label={t('bank_name_required')}
                value={bankConfig.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                error={errors.bankName}
                placeholder={t('bank_name_placeholder')}
                className="text-white"
              />
            </div>
            <div>
              <Input
                label={t('account_holder_required')}
                value={bankConfig.accountHolder}
                onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                error={errors.accountHolder}
                placeholder={t('account_holder_placeholder')}
                className="text-white"
              />
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label={t('iban_required')}
                value={showSensitive ? formatIBAN(bankConfig.iban) : bankConfig.iban}
                onChange={(e) => handleInputChange('iban', e.target.value.replace(/\s/g, ''))}
                error={errors.iban}
                placeholder={t('iban_placeholder')}
                className="text-white font-mono"
                type={showSensitive ? "text" : "password"}
              />
            </div>
            <div>
              <Input
                label={t('swift_code_optional')}
                value={bankConfig.swiftCode || ''}
                onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                placeholder={t('swift_code_placeholder')}
                className="text-white"
                type={showSensitive ? "text" : "password"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label={t('account_number_optional')}
                value={bankConfig.accountNumber || ''}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                placeholder={t('account_number_placeholder')}
                className="text-white"
                type={showSensitive ? "text" : "password"}
              />
            </div>
            <div>
              <Input
                label={t('bank_address_optional')}
                value={bankConfig.bankAddress}
                onChange={(e) => handleInputChange('bankAddress', e.target.value)}
                placeholder={t('bank_address_placeholder')}
                className="text-white"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('payment_instructions_optional')}
            </label>
            <textarea
              value={bankConfig.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              placeholder={t('payment_instructions_placeholder')}
              rows={4}
              className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
            />
            <p className="mt-2 text-sm text-gray-400">
              {t('instructions_help_text')}
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-slate-600">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="px-8"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  {t('saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('save_configuration')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {bankConfig.bankName && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">{t('customer_preview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-3">{t('bank_transfer_details')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">{t('bank_name')}:</span>
                  <p className="text-white font-medium">{bankConfig.bankName}</p>
                </div>
                <div>
                  <span className="text-gray-400">{t('account_holder')}:</span>
                  <p className="text-white font-medium">{bankConfig.accountHolder}</p>
                </div>
                <div>
                  <span className="text-gray-400">{t('iban')}:</span>
                  <p className="text-white font-medium font-mono">{formatIBAN(bankConfig.iban)}</p>
                </div>
                {bankConfig.swiftCode && (
                  <div>
                    <span className="text-gray-400">{t('swift_code')}:</span>
                    <p className="text-white font-medium">{bankConfig.swiftCode}</p>
                  </div>
                )}
              </div>
              {bankConfig.instructions && (
                <div className="mt-3 p-3 bg-slate-600/50 rounded">
                  <span className="text-gray-400 text-xs">{t('instructions')}:</span>
                  <p className="text-white text-sm mt-1">{bankConfig.instructions}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}