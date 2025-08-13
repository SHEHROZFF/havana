'use client'

import { useState } from 'react'
import { BookingFormData, Service } from '@/types/booking'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { useGetFoodCartByIdQuery } from '../../../lib/api/foodCartsApi'
import { Users } from 'lucide-react'

interface ServiceSelectionStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

interface SelectedService {
  serviceId: string
  quantity: number
  price: number
  hours: number
  pricePerHour: number
}

export default function ServiceSelectionStep({ formData, updateFormData, onNext, onPrevious }: ServiceSelectionStepProps) {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    (formData.selectedServices || []).map(service => ({
      serviceId: service.serviceId,
      quantity: service.quantity,
      price: service.price,
      hours: service.hours || 1,
      pricePerHour: service.pricePerHour || 0
    }))
  )

  // Use RTK Query to fetch cart data with services
  const {
    data: cartData,
    isLoading: loading,
    error
  } = useGetFoodCartByIdQuery(formData.selectedCartId!, {
    skip: !formData.selectedCartId
  })

  const services = cartData?.services || []

  const getServiceSelection = (serviceId: string): SelectedService => {
    return selectedServices.find(item => item.serviceId === serviceId) || { 
      serviceId, 
      quantity: 0, 
      hours: 1, 
      price: 0, 
      pricePerHour: 0 
    }
  }

  const updateServiceSelection = (serviceId: string, quantity: number, hours: number, pricePerHour: number) => {
    setSelectedServices(prev => {
      const filtered = prev.filter(item => item.serviceId !== serviceId)
      if (quantity > 0) {
        const totalPrice = quantity * hours * pricePerHour
        filtered.push({ serviceId, quantity, price: totalPrice, hours, pricePerHour })
      }
      return filtered
    })
  }

  const calculateServiceTotal = () => {
    return selectedServices.reduce((total, service) => {
      return total + service.price
    }, 0)
  }

  const handleNext = () => {
    const serviceTotal = calculateServiceTotal()
    const foodTotal = formData.selectedItems?.reduce((total, item) => total + (item.quantity * item.price), 0) || 0
    const cartTotal = (formData.totalHours || 0) * (formData.selectedCartId ? 150 : 0) // Assuming base cart price
    
    updateFormData({
      selectedServices,
      totalAmount: foodTotal + serviceTotal + cartTotal
    })
    onNext()
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-300">Loading available services...</p>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16">
                    <div className="mb-6">
              <Users className="w-24 h-24 text-gray-400 mx-auto" />
            </div>
        <h2 className="text-2xl font-bold text-white mb-4">No Services Available</h2>
        <p className="text-gray-400 mb-8">
          This food cart doesn't have any services configured yet.
          <br />
          You can skip this step and continue with your booking.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onPrevious}
            className="px-8 py-3 bg-slate-600 text-white hover:bg-slate-500 transition-colors duration-300"
          >
            ← Back to Food Selection
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-teal-500 text-white hover:bg-teal-600 transition-colors duration-300"
          >
            Continue →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Select Services
        </h2>
        <p className="text-gray-400 text-lg">
          Page 3 of 6
        </p>
        <p className="text-teal-400 text-sm mt-1">
          {services.length} service{services.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => {
          const selection = getServiceSelection(service.id)
          const subtotal = selection.quantity * selection.hours * service.pricePerHour
          
          return (
            <div key={service.id} className="bg-slate-600/50 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{service.description}</p>
                    <div className="text-teal-400 font-semibold">
                      ${service.pricePerHour}/hour per person
                    </div>
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Staff
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateServiceSelection(
                          service.id, 
                          Math.max(0, selection.quantity - 1), 
                          selection.hours, 
                          service.pricePerHour
                        )}
                        className="w-10 h-10 bg-slate-500 text-white hover:bg-slate-400 transition-colors duration-300 flex items-center justify-center"
                        disabled={selection.quantity === 0}
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-white font-semibold text-lg">
                        {selection.quantity}
                      </span>
                      <button
                        onClick={() => updateServiceSelection(
                          service.id, 
                          selection.quantity + 1, 
                          selection.hours, 
                          service.pricePerHour
                        )}
                        className="w-10 h-10 bg-teal-500 text-white hover:bg-teal-600 transition-colors duration-300 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {selection.quantity > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Hours Needed
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={selection.hours}
                        onChange={(e) => updateServiceSelection(
                          service.id,
                          selection.quantity,
                          parseInt(e.target.value) || 1,
                          service.pricePerHour
                        )}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                  )}

                  {selection.quantity > 0 && (
                    <div className="bg-teal-500/20 border border-teal-500/50 p-4">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>{selection.quantity} × {selection.hours} hours × €{service.pricePerHour}</span>
                        <span className="font-bold text-teal-400">€{subtotal}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Services Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-teal-500/20 border border-teal-500/50 p-6">
          <h3 className="font-bold text-xl text-white mb-4">Services Summary</h3>
          <div className="space-y-2">
            {selectedServices.map((service) => {
              const serviceData = services.find(s => s.id === service.serviceId)
              return (
                <div key={service.serviceId} className="flex justify-between text-gray-300">
                  <span>
                    {serviceData?.name} × {service.quantity} × {service.hours}h
                  </span>
                  <span className="font-medium text-white">
                    €{service.price}
                  </span>
                </div>
              )
            })}
            <div className="border-t border-teal-500/30 pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span className="text-white">Services Total:</span>
                <span className="text-teal-400">€{calculateServiceTotal()}</span>
              </div>
            </div>
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
          className="px-12"
        >
          Continue to Timing
        </Button>
      </div>
    </div>
  )
}