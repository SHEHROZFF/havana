'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'
import { useGetServicesQuery, useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } from '../../../lib/api/servicesApi'
import { useGetFoodCartsQuery } from '../../../lib/api/foodCartsApi'
import type { Service } from '../../../types/booking'
import { Plus, Users, DollarSign, ClipboardList, Star } from 'lucide-react'
import { useAdminI18n } from '../../../lib/i18n/admin-context'

type ServiceCategory = 'STAFF' | 'KITCHEN' | 'SUPPORT' | 'MANAGEMENT' | 'SPECIAL'

// Moved SERVICE_CATEGORIES inside component to use translations

const SERVICE_ICONS = {
  STAFF: Users,
  KITCHEN: Users,
  SUPPORT: Users,
  MANAGEMENT: ClipboardList,
  SPECIAL: Star
}

const SERVICE_COLORS = {
  STAFF: 'from-blue-500 to-blue-600',
  KITCHEN: 'from-red-500 to-red-600', 
  SUPPORT: 'from-green-500 to-green-600',
  MANAGEMENT: 'from-purple-500 to-purple-600',
  SPECIAL: 'from-yellow-500 to-yellow-600'
}

export default function ServicesPage() {
  const { t } = useAdminI18n()
  
  // Service categories with translations
  const SERVICE_CATEGORIES = [
    { value: 'STAFF', label: `${t('staff_category')} (${t('staff_description')})` },
    { value: 'KITCHEN', label: `${t('kitchen_category')} (${t('kitchen_description')})` },
    { value: 'SUPPORT', label: `${t('support_category')} (${t('support_description')})` },
    { value: 'MANAGEMENT', label: `${t('management_category')} (${t('management_description')})` },
    { value: 'SPECIAL', label: t('special_category') }
  ]
  
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerDay: '',
    category: '' as ServiceCategory,
    cartId: '',
    isActive: true
  })

  // RTK Query hooks
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices
  } = useGetServicesQuery({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    includeInactive: true // Admin should see all services including inactive ones
  })

  const {
    data: foodCarts = [],
    isLoading: cartsLoading,
    error: cartsError
  } = useGetFoodCartsQuery({})

  const [createService, { isLoading: creating }] = useCreateServiceMutation()
  const [updateService, { isLoading: updating }] = useUpdateServiceMutation()
  const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation()

  const loading = servicesLoading || cartsLoading

  const cartOptions = [
    { value: '', label: t('global_service') },
    ...foodCarts.map(cart => ({ value: cart.id, label: cart.name }))
  ]

  const filteredServices = services

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const serviceData = {
        name: formData.name,
        description: formData.description,
        pricePerHour: parseFloat(formData.pricePerDay),
        category: formData.category,
        cartId: formData.cartId || undefined,
        isActive: formData.isActive
      }

      if (editingService) {
        // Update existing service
        await updateService({ id: editingService.id, ...serviceData }).unwrap()
      } else {
        // Create new service
        await createService(serviceData).unwrap()
      }
      
      // Reset form
      resetForm()
    } catch (error) {
      console.error('Error saving service:', error)
      alert(editingService ? t('error_updating_service') : t('error_creating_service'))
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingService(null)
    setFormData({
      name: '',
      description: '',
      pricePerDay: '',
      category: '' as ServiceCategory,
      cartId: '',
      isActive: true
    })
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      pricePerDay: (service.pricePerHour || 0).toString(),
      category: service.category,
      cartId: service.cartId || '',
      isActive: service.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(serviceId).unwrap()
      } catch (error) {
        console.error('Error deleting service:', error)
        alert(t('error_deleting_service'))
      }
    }
  }

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      await updateService({ id: serviceId, isActive }).unwrap()
    } catch (error) {
      console.error('Error updating service status:', error)
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('services_management')}
          </h1>
          <p className="text-gray-400">
            {t('manage_services_description')}
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('add_service')}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('total_services')}</p>
                <p className="text-2xl font-bold text-white">{services.length}</p>
              </div>
              <div className="text-3xl">🎪</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('active_services')}</p>
                <p className="text-2xl font-bold text-green-400">
                  {services.filter(service => service.isActive).length}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('staff_services')}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {services.filter(service => service.category === 'STAFF').length}
                </p>
              </div>
                              <div>
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Daily Rate</p>
                <p className="text-2xl font-bold text-teal-400">
                  €{services.length > 0 ? (services.reduce((sum, s) => sum + (s.pricePerHour || 0), 0) / services.length).toFixed(0) : '0'}
                </p>
              </div>
                              <div>
                  <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={clsx(
                'px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2',
                selectedCategory === 'all'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
              )}
            >
              <span>🏪</span>
              <span>{t('all_categories')}</span>
            </button>
            {SERVICE_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value as ServiceCategory)}
                className={clsx(
                  'px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2',
                  selectedCategory === category.value
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                )}
              >
                {(() => {
                  const IconComponent = SERVICE_ICONS[category.value as ServiceCategory]
                  return <IconComponent className="w-5 h-5" />
                })()}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">
              {editingService ? t('edit') + ' ' + t('service_name') : t('add_service')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t('service_name')}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder={t('service_name_placeholder')}
                />
                
                <Input
                  label="Daily Price"
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                  placeholder="25.00"
                  helperText="Fixed price per day for this service"
                />
                
                <Select
                  label={t('service_category')}
                  options={SERVICE_CATEGORIES}
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ServiceCategory }))}
                  required
                />
                
                <Select
                  label={t('assign_to_cart')}
                  options={cartOptions}
                  value={formData.cartId}
                  onChange={(e) => setFormData(prev => ({ ...prev, cartId: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('description')}
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('description_placeholder')}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500 focus:ring-2"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  {t('available')}
                </label>
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit">
                  {editingService ? t('update_service') : t('create_service')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  {t('cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🎪</div>
            <h3 className="text-xl font-semibold text-white mb-2">{t('no_services_yet')}</h3>
            <p className="text-gray-400 mb-4">
              {t('start_by_adding_services')}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('add_your_first_service')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="bg-slate-700/50 backdrop-blur-sm border-slate-600 hover:border-slate-500 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-0">
                {/* Service Header */}
                <div className={`h-20 bg-gradient-to-r ${SERVICE_COLORS[service.category]} flex items-center justify-center`}>
                  {(() => {
                  const IconComponent = SERVICE_ICONS[service.category]
                  return <IconComponent className="w-10 h-10" />
                })()}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white text-lg">{service.name}</h3>
                    <span className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      service.isActive 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    )}>
                      {service.isActive ? t('available') : t('unavailable')}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t('category_label')}</span>
                      <span className="text-white">{service.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t('price_label')}</span>
                      <span className="text-teal-400 font-bold">€{(service.pricePerHour || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t('cart_label')}</span>
                      <span className="text-white">{service.cartName || t('global_service_label')}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                      className="flex-1"
                    >
                      ✏️ {t('edit')}
                    </Button>
                    <Button
                      size="sm"
                      variant={service.isActive ? "ghost" : "outline"}
                      onClick={() => toggleServiceStatus(service.id, !service.isActive)}
                      className={service.isActive ? "text-yellow-400 hover:bg-yellow-500/20" : "text-green-400 hover:bg-green-500/20"}
                    >
                      {service.isActive ? '⏸️' : '▶️'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(service.id)}
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}