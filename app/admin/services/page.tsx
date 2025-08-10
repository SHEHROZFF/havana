'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'

interface Service {
  id: string
  name: string
  description: string
  pricePerHour: number
  category: ServiceCategory
  isActive: boolean
  cartId?: string
  cartName?: string
}

interface FoodCart {
  id: string
  name: string
}

type ServiceCategory = 'STAFF' | 'KITCHEN' | 'SUPPORT' | 'MANAGEMENT' | 'SPECIAL'

const SERVICE_CATEGORIES = [
  { value: 'STAFF', label: 'Staff (Waiters, Servers)' },
  { value: 'KITCHEN', label: 'Kitchen (Chefs, Cooks)' },
  { value: 'SUPPORT', label: 'Support (Workers, Setup)' },
  { value: 'MANAGEMENT', label: 'Management (Coordinators)' },
  { value: 'SPECIAL', label: 'Special Services' }
]

const SERVICE_ICONS = {
  STAFF: '👨‍🍳',
  KITCHEN: '🍳',
  SUPPORT: '🔧',
  MANAGEMENT: '📋',
  SPECIAL: '⭐'
}

const SERVICE_COLORS = {
  STAFF: 'from-blue-500 to-blue-600',
  KITCHEN: 'from-red-500 to-red-600', 
  SUPPORT: 'from-green-500 to-green-600',
  MANAGEMENT: 'from-purple-500 to-purple-600',
  SPECIAL: 'from-yellow-500 to-yellow-600'
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [foodCarts, setFoodCarts] = useState<FoodCart[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerHour: '',
    category: '' as ServiceCategory,
    cartId: '',
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch food carts
      const cartsResponse = await fetch('/api/food-carts')
      if (cartsResponse.ok) {
        const cartsData = await cartsResponse.json()
        setFoodCarts(cartsData)
      }

      // Fetch services
      const servicesResponse = await fetch('/api/services')
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json()
        setServices(servicesData)
      } else {
        console.error('Failed to fetch services')
        setServices([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const cartOptions = [
    { value: '', label: 'Global Service (All Carts)' },
    ...foodCarts.map(cart => ({ value: cart.id, label: cart.name }))
  ]

  const filteredServices = selectedCategory === 'all' ? services : services.filter(service => service.category === selectedCategory)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const serviceData = {
        ...formData,
        pricePerHour: parseFloat(formData.pricePerHour),
        cartId: formData.cartId || null
      }

      if (editingService) {
        // Update existing service
        const response = await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData)
        })
        
        if (response.ok) {
          const updatedService = await response.json()
          setServices(prev => prev.map(service => 
            service.id === editingService.id ? updatedService : service
          ))
        } else {
          alert('Failed to update service. Please try again.')
        }
      } else {
        // Create new service
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData)
        })
        
        if (response.ok) {
          const newService = await response.json()
          setServices(prev => [...prev, newService])
        } else {
          alert('Failed to create service. Please try again.')
        }
      }
      
      // Reset form
      resetForm()
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Error saving service. Please try again.')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingService(null)
    setFormData({
      name: '',
      description: '',
      pricePerHour: '',
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
      pricePerHour: service.pricePerHour.toString(),
      category: service.category,
      cartId: service.cartId || '',
      isActive: service.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`/api/services/${serviceId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setServices(prev => prev.filter(service => service.id !== serviceId))
        } else {
          alert('Failed to delete service. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting service:', error)
        alert('Error deleting service. Please try again.')
      }
    }
  }

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })
      
      if (response.ok) {
        setServices(prev => prev.map(service => 
          service.id === serviceId ? { ...service, isActive } : service
        ))
      }
    } catch (error) {
      console.error('Error updating service status:', error)
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Services Management
          </h1>
          <p className="text-gray-400">
            Manage additional services like staff, chefs, and support workers
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button onClick={() => setShowForm(true)}>
            ➕ Add New Service
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Services</p>
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
                <p className="text-gray-400 text-sm">Active Services</p>
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
                <p className="text-gray-400 text-sm">Staff Services</p>
                <p className="text-2xl font-bold text-blue-400">
                  {services.filter(service => service.category === 'STAFF').length}
                </p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Rate/Hour</p>
                <p className="text-2xl font-bold text-teal-400">
                  ${services.length > 0 ? (services.reduce((sum, s) => sum + s.pricePerHour, 0) / services.length).toFixed(0) : '0'}
                </p>
              </div>
              <div className="text-3xl">💰</div>
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
              <span>All Services</span>
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
                <span>{SERVICE_ICONS[category.value as ServiceCategory]}</span>
                <span>{category.value}</span>
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
              {editingService ? 'Edit Service' : 'Add New Service'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Service Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g., Professional Waiter"
                />
                
                <Input
                  label="Price per Hour ($)"
                  type="number"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                  placeholder="25.00"
                />
                
                <Select
                  label="Category"
                  options={SERVICE_CATEGORIES}
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ServiceCategory }))}
                  required
                />
                
                <Select
                  label="Associated Cart"
                  options={cartOptions}
                  value={formData.cartId}
                  onChange={(e) => setFormData(prev => ({ ...prev, cartId: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the service and what the staff member will do..."
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
                  Service is active and available for booking
                </label>
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit">
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
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
            <h3 className="text-xl font-semibold text-white mb-2">No Services Found</h3>
            <p className="text-gray-400 mb-4">
              {selectedCategory === 'all' 
                ? 'Get started by adding your first service.'
                : `No ${selectedCategory} services found. Try a different category or add a new service.`}
            </p>
            <Button onClick={() => setShowForm(true)}>
              ➕ Add Service
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
                  <span className="text-4xl">{SERVICE_ICONS[service.category]}</span>
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
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white">{service.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rate/Hour:</span>
                      <span className="text-teal-400 font-bold">${service.pricePerHour}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Scope:</span>
                      <span className="text-white">{service.cartName || 'Global'}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                      className="flex-1"
                    >
                      ✏️ Edit
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