'use client'

import { useState, useEffect } from 'react'
import { BookingFormData, Service, ServiceCategory } from '@/types/booking'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'

interface ServicesSelectionStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

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

export default function ServicesSelectionStep({ formData, updateFormData, onNext, onPrevious }: ServicesSelectionStepProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedServices, setSelectedServices] = useState(formData.selectedServices || [])
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all')
  const [estimatedHours, setEstimatedHours] = useState(formData.totalHours || 4)

  useEffect(() => {
    const fetchServices = async () => {
      if (!formData.selectedCartId) return
      
      setLoading(true)
      try {
        const response = await fetch(`/api/services?cartId=${formData.selectedCartId}`)
        if (response.ok) {
          const servicesData = await response.json()
          setServices(servicesData)
        } else {
          console.error('Failed to fetch services')
          setServices([])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [formData.selectedCartId])

  const categories: (ServiceCategory | 'all')[] = ['all', 'STAFF', 'KITCHEN', 'SUPPORT', 'MANAGEMENT', 'SPECIAL']
  const filteredServices = selectedCategory === 'all' ? services : services.filter(service => service.category === selectedCategory)

  const getServiceQuantity = (serviceId: string) => {
    const service = selectedServices.find(s => s.serviceId === serviceId)
    return service ? service.quantity : 0
  }

  const getServiceHours = (serviceId: string) => {
    const service = selectedServices.find(s => s.serviceId === serviceId)
    return service ? service.hours : estimatedHours
  }

  const updateServiceSelection = (serviceId: string, quantity: number, pricePerHour: number, hours?: number) => {
    let newSelectedServices = [...selectedServices]
    const existingIndex = newSelectedServices.findIndex(s => s.serviceId === serviceId)
    
    if (quantity === 0) {
      if (existingIndex > -1) {
        newSelectedServices.splice(existingIndex, 1)
      }
    } else {
      const serviceHours = hours || estimatedHours
      if (existingIndex > -1) {
        newSelectedServices[existingIndex] = { serviceId, quantity, hours: serviceHours, pricePerHour }
      } else {
        newSelectedServices.push({ serviceId, quantity, hours: serviceHours, pricePerHour })
      }
    }
    
    setSelectedServices(newSelectedServices)
    const servicesAmount = newSelectedServices.reduce((sum, service) => sum + (service.quantity * service.hours * service.pricePerHour), 0)
    updateFormData({ selectedServices: newSelectedServices, servicesAmount })
  }

  const updateServiceHours = (serviceId: string, hours: number) => {
    const existingService = selectedServices.find(s => s.serviceId === serviceId)
    if (existingService) {
      updateServiceSelection(serviceId, existingService.quantity, existingService.pricePerHour, hours)
    }
  }

  const handleNext = () => {
    onNext()
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading services...</p>
      </div>
    )
  }

  const totalServicesAmount = selectedServices.reduce((sum, service) => sum + (service.quantity * service.hours * service.pricePerHour), 0)
  const totalServicesCount = selectedServices.reduce((sum, service) => sum + service.quantity, 0)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Select Additional Services
        </h2>
        <p className="text-gray-400 text-lg">
          Page 3 of 6
        </p>
        <p className="text-teal-400 text-sm mt-1">
          Enhance your event with professional staff and services
        </p>
      </div>

      {/* Estimated Hours Input */}
      <div className="bg-slate-600/50 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Service Duration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Estimated Hours for Services"
            type="number"
            value={estimatedHours.toString()}
            onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 4)}
            min="1"
            max="24"
            helperText="Default hours for all services (you can customize per service)"
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                selectedServices.forEach(service => {
                  updateServiceSelection(service.serviceId, service.quantity, service.pricePerHour, estimatedHours)
                })
              }}
              className="w-full"
            >
              Apply to All Services
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={clsx(
              'px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2',
              selectedCategory === category
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            )}
          >
            <span>{category === 'all' ? '🏪' : SERVICE_ICONS[category as ServiceCategory]}</span>
            <span>{category === 'all' ? 'All Services' : category}</span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🎪</div>
          <h2 className="text-2xl font-bold text-white mb-4">No Services Available</h2>
          <p className="text-gray-400 mb-8">
            No additional services are available for this food cart.
            <br />
            You can proceed without selecting any services.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const quantity = getServiceQuantity(service.id)
            const hours = getServiceHours(service.id)
            const totalPrice = quantity * hours * service.pricePerHour
            
            return (
              <div key={service.id} className="bg-slate-600/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`h-20 bg-gradient-to-r ${SERVICE_COLORS[service.category]} flex items-center justify-center`}>
                  <span className="text-4xl">{SERVICE_ICONS[service.category]}</span>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-bold text-lg">{service.name}</h3>
                    <span className="text-xs bg-teal-500 text-white px-2 py-1 rounded-full">
                      {service.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-teal-400 font-bold text-xl">
                        ${service.pricePerHour}/hr
                      </span>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Staff Count:</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateServiceSelection(service.id, Math.max(0, quantity - 1), service.pricePerHour)}
                          disabled={quantity === 0}
                          className="w-8 h-8 bg-slate-500 text-white rounded-full flex items-center justify-center hover:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-white">{quantity}</span>
                        <button
                          onClick={() => updateServiceSelection(service.id, quantity + 1, service.pricePerHour)}
                          className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Hours Input for Selected Services */}
                    {quantity > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-500">
                        <Input
                          label="Hours needed"
                          type="number"
                          value={hours.toString()}
                          onChange={(e) => updateServiceHours(service.id, parseInt(e.target.value) || estimatedHours)}
                          min="1"
                          max="24"
                          className="text-sm"
                        />
                        <div className="text-right text-teal-400 font-medium">
                          Total: ${totalPrice.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Services Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-teal-500/20 border border-teal-500/50 rounded-xl p-6">
          <h3 className="font-bold text-xl text-white mb-4">Services Summary</h3>
          <div className="space-y-2 mb-4">
            {selectedServices.map((selectedService, index) => {
              const service = services.find(s => s.id === selectedService.serviceId)
              return (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">
                    {selectedService.quantity}x {service?.name} ({selectedService.hours}h)
                  </span>
                  <span className="text-teal-400 font-medium">
                    ${(selectedService.quantity * selectedService.hours * selectedService.pricePerHour).toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between items-center border-t border-teal-500/30 pt-3">
            <span className="text-gray-300">{totalServicesCount} staff members</span>
            <span className="text-2xl font-bold text-teal-400">
              Services Total: ${totalServicesAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          className="px-8"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          size="lg"
          className="px-8"
        >
          {selectedServices.length > 0 ? 'Continue with Services' : 'Skip Services'}
        </Button>
      </div>
    </div>
  )
}