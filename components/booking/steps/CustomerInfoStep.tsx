'use client'

import { useState } from 'react'
import { BookingFormData } from '@/types/booking'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

interface CustomerInfoStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function CustomerInfoStep({ formData, updateFormData, onNext, onPrevious }: CustomerInfoStepProps) {
  const [customerInfo, setCustomerInfo] = useState({
    customerName: formData.customerName || '',
    customerEmail: formData.customerEmail || '',
    customerPhone: formData.customerPhone || '',
    eventType: formData.eventType || '',
    guestCount: formData.guestCount?.toString() || '',
    specialNotes: formData.specialNotes || ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const eventTypeOptions = [
    { value: 'birthday', label: 'Birthday Party' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'family-gathering', label: 'Family Gathering' },
    { value: 'community-event', label: 'Community Event' },
    { value: 'other', label: 'Other' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!customerInfo.customerName.trim()) {
      newErrors.customerName = 'Full name is required'
    }
    
    if (!customerInfo.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address'
    }
    
    if (!customerInfo.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required'
    }
    
    if (!customerInfo.eventType) {
      newErrors.eventType = 'Event type is required'
    }
    
    const guestCount = parseInt(customerInfo.guestCount)
    if (!customerInfo.guestCount || isNaN(guestCount) || guestCount < 1) {
      newErrors.guestCount = 'Guest count must be at least 1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      updateFormData({
        customerName: customerInfo.customerName,
        customerEmail: customerInfo.customerEmail,
        customerPhone: customerInfo.customerPhone,
        eventType: customerInfo.eventType,
        guestCount: parseInt(customerInfo.guestCount),
        specialNotes: customerInfo.specialNotes || undefined
      })
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Your Information
        </h2>
        <p className="text-gray-400 text-lg">
          Page 4 of 5
        </p>
      </div>

      {/* Contact Information */}
      <div className="bg-slate-600/50 backdrop-blur-sm p-6">
        <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={customerInfo.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            error={errors.customerName}
            required
            placeholder="Enter your full name"
          />
          
          <Input
            label="Email Address"
            type="email"
            value={customerInfo.customerEmail}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            error={errors.customerEmail}
            required
            placeholder="your@email.com"
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={customerInfo.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            error={errors.customerPhone}
            required
            placeholder="+1 (555) 123-4567"
          />
          
          <Select
            label="Event Type"
            options={eventTypeOptions}
            value={customerInfo.eventType}
            onChange={(e) => handleInputChange('eventType', e.target.value)}
            error={errors.eventType}
            required
          />
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-slate-600/50 backdrop-blur-sm p-6">
        <h3 className="text-xl font-bold text-white mb-6">Event Details</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Expected Guest Count"
            type="number"
            value={customerInfo.guestCount}
            onChange={(e) => handleInputChange('guestCount', e.target.value)}
            error={errors.guestCount}
            required
            min="1"
            placeholder="Number of guests"
            helperText="This helps us ensure we bring enough food"
          />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Special Notes or Requests
            </label>
            <textarea
              className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
              rows={4}
              value={customerInfo.specialNotes}
              onChange={(e) => handleInputChange('specialNotes', e.target.value)}
              placeholder="Any dietary restrictions, special requests, or additional information..."
            />
            <p className="mt-2 text-sm text-gray-400">
              Optional: Let us know about any special requirements or preferences
            </p>
          </div>
        </div>
      </div>

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
          Next
        </Button>
      </div>
    </div>
  )
}