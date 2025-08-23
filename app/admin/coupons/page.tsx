'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'
import { 
  useGetCouponsQuery, 
  useCreateCouponMutation, 
  useUpdateCouponMutation, 
  useDeleteCouponMutation,
  Coupon
} from '../../../lib/api/couponsApi'
import { useAdminI18n } from '../../../lib/i18n/admin-context'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  DollarSign,
  Users,
  Tag,
  Percent,
  Euro,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function CouponsPage() {
  const { t } = useAdminI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const itemsPerPage = 10

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // RTK Query hooks
  const {
    data: couponsData,
    isLoading: loading,
    error,
    refetch
  } = useGetCouponsQuery({
    search: debouncedSearchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: currentPage,
    limit: itemsPerPage
  })

  const [createCoupon] = useCreateCouponMutation()
  const [updateCoupon] = useUpdateCouponMutation()
  const [deleteCoupon] = useDeleteCouponMutation()

  const coupons = couponsData?.coupons || []
  const totalPages = couponsData?.pagination?.totalPages || 1

  // Generate random coupon code
  const generateCouponCode = () => {
    const prefix = 'HAVANA'
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}${randomString}`
  }

  // Form state
  const [couponForm, setCouponForm] = useState({
    code: generateCouponCode(), // Auto-generate initial code
    name: '',
    description: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
    value: 0,
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: ''
  })

  const resetForm = () => {
    setCouponForm({
      code: generateCouponCode(), // Auto-generate code
      name: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: ''
    })
  }

  const handleRegenerateCode = () => {
    setCouponForm({...couponForm, code: generateCouponCode()})
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await createCoupon({
        code: couponForm.code.toUpperCase(),
        name: couponForm.name,
        description: couponForm.description || undefined,
        type: couponForm.type,
        value: couponForm.value,
        minOrderAmount: couponForm.minOrderAmount ? parseFloat(couponForm.minOrderAmount) : undefined,
        maxDiscount: couponForm.maxDiscount ? parseFloat(couponForm.maxDiscount) : undefined,
        usageLimit: couponForm.usageLimit ? parseInt(couponForm.usageLimit) : undefined,
        // perUserLimit and isFirstTimeOnly removed - no authentication system
        validFrom: couponForm.validFrom,
        validUntil: couponForm.validUntil,
        createdBy: 'admin' // TODO: Get from auth context
      }).unwrap()

      alert(result.message)
      setShowCreateModal(false)
      resetForm()
      refetch()
    } catch (error: any) {
      alert(`Error: ${error.data?.error || 'Failed to create coupon'}`)
    }
  }

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setCouponForm({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      validFrom: coupon.validFrom.split('T')[0],
      validUntil: coupon.validUntil.split('T')[0]
    })
    setShowEditModal(true)
  }

  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCoupon) return
    
    try {
      const result = await updateCoupon({
        id: selectedCoupon.id,
        data: {
          name: couponForm.name,
          description: couponForm.description || undefined,
          type: couponForm.type,
          value: couponForm.value,
          minOrderAmount: couponForm.minOrderAmount ? parseFloat(couponForm.minOrderAmount) : undefined,
          maxDiscount: couponForm.maxDiscount ? parseFloat(couponForm.maxDiscount) : undefined,
          usageLimit: couponForm.usageLimit ? parseInt(couponForm.usageLimit) : undefined,
          // perUserLimit and isFirstTimeOnly removed - no authentication system
          validFrom: couponForm.validFrom,
          validUntil: couponForm.validUntil
        }
      }).unwrap()

      alert(result.message)
      setShowEditModal(false)
      setSelectedCoupon(null)
      resetForm()
      refetch()
    } catch (error: any) {
      alert(`Error: ${error.data?.error || 'Failed to update coupon'}`)
    }
  }

  const handleDeleteCoupon = async (coupon: Coupon) => {
    if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return
    
    try {
      const result = await deleteCoupon(coupon.id).unwrap()
      alert(result.message)
      refetch()
    } catch (error: any) {
      alert(`Error: ${error.data?.error || 'Failed to delete coupon'}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-500/20'
      case 'INACTIVE': return 'text-gray-400 bg-gray-500/20'
      case 'EXPIRED': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'PERCENTAGE' ? <Percent className="w-4 h-4" /> : <Euro className="w-4 h-4" />
  }

  const formatValue = (type: string, value: number) => {
    return type === 'PERCENTAGE' ? `${value}%` : `€${value.toFixed(2)}`
  }

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  const statusOptions = [
    { value: 'all', label: t('all_status') },
    { value: 'ACTIVE', label: t('active') },
    { value: 'INACTIVE', label: t('inactive') },
    { value: 'EXPIRED', label: t('expired') }
  ]

    if (loading && !couponsData) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">{t('no_coupons_found')}</div>
        <Button onClick={() => refetch()}>{t('create_coupon')}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('coupons')}</h1>
          <p className="text-gray-400">{t('coupons_description')}</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="w-full lg:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          {t('create_coupon')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder={t('search_coupons')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="w-full lg:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coupons List */}
      <div className="space-y-4">
        {coupons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('no_coupons_found')}</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? t('search_coupons')
                  : t('create_first_coupon')
                }
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('create_coupon')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        {getTypeIcon(coupon.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{coupon.code}</h3>
                          <span className={clsx(
                            'px-2 py-1 text-xs font-medium rounded',
                            getStatusColor(coupon.status),
                            isExpired(coupon.validUntil) && coupon.status === 'ACTIVE' && 'text-red-400 bg-red-500/20'
                          )}>
                            {isExpired(coupon.validUntil) && coupon.status === 'ACTIVE' ? 'EXPIRED' : coupon.status}
                          </span>
                          {coupon.isFirstTimeOnly && (
                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                              First Time Only
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 font-medium">{coupon.name}</p>
                        {coupon.description && (
                          <p className="text-gray-400 text-sm">{coupon.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-teal-400" />
                        <span className="text-gray-400">Discount:</span>
                        <span className="text-white font-medium">
                          {formatValue(coupon.type, coupon.value)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">Used:</span>
                        <span className="text-white font-medium">
                          {coupon.usageCount}
                          {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400">Valid Until:</span>
                        <span className="text-white font-medium">
                          {new Date(coupon.validUntil).toLocaleDateString()}
                        </span>
                      </div>

                      {coupon.minOrderAmount && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">Min Order:</span>
                          <span className="text-white">€{coupon.minOrderAmount.toFixed(2)}</span>
                        </div>
                      )}

                      {coupon.maxDiscount && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">Max Discount:</span>
                          <span className="text-white">€{coupon.maxDiscount.toFixed(2)}</span>
                        </div>
                      )}

                      {coupon.perUserLimit && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">Per User Limit:</span>
                          <span className="text-white">{coupon.perUserLimit}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCoupon(coupon)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCoupon(coupon)}
                      className="text-red-400 hover:text-red-300 border-red-500/50 hover:border-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            {t('previous')}
          </Button>
          <span className="text-gray-400">
            {t('page')} {currentPage} {t('of')} {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            {t('next')}
          </Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {showCreateModal ? t('create_coupon') : t('edit_coupon')}
              </h2>
              
              <form onSubmit={showCreateModal ? handleCreateCoupon : handleUpdateCoupon} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">{t('coupon_code')} *</label>
                    <div className="flex gap-2">
                      <Input
                        value={couponForm.code}
                        readOnly
                        className="flex-1 bg-slate-600 cursor-not-allowed"
                        disabled={showEditModal}
                      />
                      {!showEditModal && (
                        <Button
                          type="button"
                          onClick={handleRegenerateCode}
                          variant="outline"
                          className="px-3"
                        >
                          🎲
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">{t('coupon_name')} *</label>
                    <Input
                      value={couponForm.name}
                      onChange={(e) => setCouponForm({...couponForm, name: e.target.value})}
                      placeholder={t('coupon_name_placeholder')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">{t('coupon_description')}</label>
                  <Input
                    value={couponForm.description}
                    onChange={(e) => setCouponForm({...couponForm, description: e.target.value})}
                    placeholder={t('description_placeholder')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Discount Type *</label>
                    <Select
                      value={couponForm.type}
                      onChange={(e) => setCouponForm({...couponForm, type: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT'})}
                      options={[
                        { value: 'PERCENTAGE', label: 'Percentage (%)' },
                        { value: 'FIXED_AMOUNT', label: 'Fixed Amount (€)' }
                      ]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Discount Value * {couponForm.type === 'PERCENTAGE' ? '(%)' : '(€)'}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step={couponForm.type === 'PERCENTAGE' ? '1' : '0.01'}
                      max={couponForm.type === 'PERCENTAGE' ? '100' : undefined}
                      value={couponForm.value || ''}
                      onChange={(e) => setCouponForm({...couponForm, value: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Minimum Order Amount (€)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={couponForm.minOrderAmount}
                      onChange={(e) => setCouponForm({...couponForm, minOrderAmount: e.target.value})}
                      placeholder="Optional minimum order"
                    />
                  </div>
                  
                  {couponForm.type === 'PERCENTAGE' && (
                    <div>
                      <label className="block text-gray-300 mb-2">Maximum Discount (€)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={couponForm.maxDiscount}
                        onChange={(e) => setCouponForm({...couponForm, maxDiscount: e.target.value})}
                        placeholder="Optional max discount cap"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">{t('usage_limit')}</label>
                  <Input
                    type="number"
                    min="1"
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm({...couponForm, usageLimit: e.target.value})}
                    placeholder={t('total_usage_placeholder')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Valid From *</label>
                    <Input
                      type="date"
                      value={couponForm.validFrom}
                      onChange={(e) => setCouponForm({...couponForm, validFrom: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Valid Until *</label>
                    <Input
                      type="date"
                      value={couponForm.validUntil}
                      onChange={(e) => setCouponForm({...couponForm, validUntil: e.target.value})}
                      required
                    />
                  </div>
                </div>



                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {showCreateModal ? t('create_coupon') : t('edit_coupon')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                      setSelectedCoupon(null)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
