'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'
import { useAdminI18n } from '../../../lib/i18n/admin-context'
import { Building2, Save, Edit, Eye, EyeOff, Plus, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react'

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
  const [bankConfigs, setBankConfigs] = useState<BankConfig[]>([])
  const [editingBank, setEditingBank] = useState<BankConfig | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSensitive, setShowSensitive] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state for editing/adding
  const [formData, setFormData] = useState<BankConfig>({
    bankName: '',
    accountHolder: '',
    iban: '',
    swiftCode: '',
    accountNumber: '',
    bankAddress: '',
    instructions: '',
    isActive: true
  })

  // Fetch all bank configurations
  useEffect(() => {
    fetchBankConfigs()
  }, [])

  const fetchBankConfigs = async () => {
    try {
      const response = await fetch('/api/admin/bank-config')
      const data = await response.json()
      if (data.success) {
        setBankConfigs(data.bankConfigs || [])
      }
    } catch (error) {
      console.error('Error fetching bank configs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes for form
  const handleInputChange = (field: keyof BankConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Start adding new bank
  const startAddingBank = () => {
    setIsAddingNew(true)
    setEditingBank(null)
    setFormData({
      bankName: '',
      accountHolder: '',
      iban: '',
      swiftCode: '',
      accountNumber: '',
      bankAddress: '',
      instructions: '',
      isActive: true
    })
    setErrors({})
  }

  // Start editing existing bank
  const startEditingBank = (bank: BankConfig) => {
    setEditingBank(bank)
    setIsAddingNew(false)
    setFormData(bank)
    setErrors({})
  }

  // Cancel editing/adding
  const cancelForm = () => {
    setEditingBank(null)
    setIsAddingNew(false)
    setFormData({
      bankName: '',
      accountHolder: '',
      iban: '',
      swiftCode: '',
      accountNumber: '',
      bankAddress: '',
      instructions: '',
      isActive: true
    })
    setErrors({})
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.bankName.trim()) {
      newErrors.bankName = t('bank_name_is_required')
    }

    if (!formData.accountHolder.trim()) {
      newErrors.accountHolder = t('account_holder_is_required')
    }

    if (!formData.iban.trim()) {
      newErrors.iban = t('iban_is_required')
    } else {
      // Basic IBAN validation (can be improved)
      const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/
      if (!ibanRegex.test(formData.iban.replace(/\s/g, '').toUpperCase())) {
        newErrors.iban = t('please_enter_valid_iban')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save bank configuration (add or edit)
  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      const method = editingBank ? 'PUT' : 'POST'
      const url = editingBank 
        ? `/api/admin/bank-config/${editingBank.id}` 
        : '/api/admin/bank-config'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: editingBank?.id,
          iban: formData.iban.replace(/\s/g, '').toUpperCase() // Clean and format IBAN
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message || t('bank_configuration_saved_successfully'))
        await fetchBankConfigs() // Refresh the list
        cancelForm() // Reset form
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

  // Toggle bank status (activate/deactivate)
  const toggleBankStatus = async (bank: BankConfig) => {
    const confirmMessage = bank.isActive ? t('confirm_deactivate_bank') : t('confirm_activate_bank')
    
    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch(`/api/admin/bank-config/${bank.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bank,
          isActive: !bank.isActive
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(bank.isActive ? t('bank_deactivated_successfully') : t('bank_activated_successfully'))
        await fetchBankConfigs() // Refresh the list
      } else {
        throw new Error(data.error || (bank.isActive ? t('failed_to_deactivate_bank') : t('failed_to_activate_bank')))
      }
    } catch (error) {
      console.error('Error toggling bank status:', error)
      alert(`${bank.isActive ? t('failed_to_deactivate_bank') : t('failed_to_activate_bank')}: ${error instanceof Error ? error.message : t('unknown_error')}`)
    }
  }

  // Delete bank (deactivate)
  const deleteBank = async (bank: BankConfig) => {
    if (!confirm(t('confirm_delete_bank'))) return

    try {
      const response = await fetch(`/api/admin/bank-config/${bank.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        alert(t('bank_deleted_successfully'))
        await fetchBankConfigs() // Refresh the list
      } else {
        throw new Error(data.error || t('failed_to_delete_bank'))
      }
    } catch (error) {
      console.error('Error deleting bank:', error)
      alert(`${t('failed_to_delete_bank')}: ${error instanceof Error ? error.message : t('unknown_error')}`)
    }
  }

  // Format IBAN for display
  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim()
  }

  const isFormMode = isAddingNew || editingBank

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
            {t('manage_bank_accounts')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {!isFormMode && (
            <Button
              onClick={startAddingBank}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('add_new_bank')}
            </Button>
          )}
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

      {/* Bank List */}
      {!isFormMode && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Building2 className="w-6 h-6 mr-3 text-teal-400" />
              {t('bank_accounts')} ({bankConfigs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bankConfigs.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{t('no_banks_configured')}</h3>
                <p className="text-gray-400 mb-6">{t('add_first_bank')}</p>
                <Button
                  onClick={startAddingBank}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('add_new_bank')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bankConfigs.map((bank) => (
                  <div
                    key={bank.id}
                    className={clsx(
                      'p-4 rounded-lg border',
                      bank.isActive
                        ? 'border-green-500/30 bg-green-500/10'
                        : 'border-red-500/30 bg-red-500/10'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{bank.bankName}</h4>
                          <span
                            className={clsx(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              bank.isActive
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            )}
                          >
                            {bank.isActive ? t('active') : t('inactive')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">{t('account_holder')}:</span>
                            <span className="text-white ml-2">{bank.accountHolder}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">{t('iban')}:</span>
                            <span className="text-white ml-2 font-mono">
                              {showSensitive ? formatIBAN(bank.iban) : '••••••••••••••••'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingBank(bank)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          {t('edit_bank')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleBankStatus(bank)}
                          className={bank.isActive ? 'text-orange-400' : 'text-green-400'}
                        >
                          {bank.isActive ? (
                            <>
                              <ToggleLeft className="w-4 h-4 mr-1" />
                              {t('deactivate_bank')}
                            </>
                          ) : (
                            <>
                              <ToggleRight className="w-4 h-4 mr-1" />
                              {t('activate_bank')}
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBank(bank)}
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {t('delete_bank')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {isFormMode && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Building2 className="w-6 h-6 mr-3 text-teal-400" />
                {editingBank ? t('edit_bank') : t('add_new_bank')}
              </CardTitle>
              <Button
                variant="outline"
                onClick={cancelForm}
                size="sm"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
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
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  error={errors.bankName}
                  placeholder={t('bank_name_placeholder')}
                  className="text-white"
                />
              </div>
              <div>
                <Input
                  label={t('account_holder_required')}
                  value={formData.accountHolder}
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
                  value={showSensitive ? formatIBAN(formData.iban) : formData.iban}
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
                  value={formData.swiftCode || ''}
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
                  value={formData.accountNumber || ''}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder={t('account_number_placeholder')}
                  className="text-white"
                  type={showSensitive ? "text" : "password"}
                />
              </div>
              <div>
                <Input
                  label={t('bank_address_optional')}
                  value={formData.bankAddress || ''}
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
                value={formData.instructions || ''}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder={t('payment_instructions_placeholder')}
                rows={4}
                className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
              />
              <p className="mt-2 text-sm text-gray-400">
                {t('instructions_help_text')}
              </p>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-600">
              <Button
                variant="outline"
                onClick={cancelForm}
              >
                Cancel
              </Button>
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
                    {editingBank ? t('save_configuration') : t('add_new_bank')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Section for Active Banks */}
      {!isFormMode && bankConfigs.filter(bank => bank.isActive).length > 0 && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">{t('customer_preview')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bankConfigs.filter(bank => bank.isActive).map((bank, index) => (
              <div key={bank.id} className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-3">
                  {t('bank_transfer_details')} {bankConfigs.filter(b => b.isActive).length > 1 ? `(${index + 1})` : ''}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">{t('bank_name')}:</span>
                    <p className="text-white font-medium">{bank.bankName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">{t('account_holder')}:</span>
                    <p className="text-white font-medium">{bank.accountHolder}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">{t('iban')}:</span>
                    <p className="text-white font-medium font-mono">{formatIBAN(bank.iban)}</p>
                  </div>
                  {bank.swiftCode && (
                    <div>
                      <span className="text-gray-400">{t('swift_code')}:</span>
                      <p className="text-white font-medium">{bank.swiftCode}</p>
                    </div>
                  )}
                </div>
                {bank.instructions && (
                  <div className="mt-3 p-3 bg-slate-600/50 rounded">
                    <span className="text-gray-400 text-xs">{t('instructions')}:</span>
                    <p className="text-white text-sm mt-1">{bank.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}