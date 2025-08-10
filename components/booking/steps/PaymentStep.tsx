'use client'

import { useState } from 'react'
import { BookingFormData } from '@/types/booking'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

interface PaymentStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onPrevious: () => void
  onComplete: () => void
}

export default function PaymentStep({ formData, updateFormData, onPrevious, onComplete }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState(formData.paymentMethod || 'credit-card')
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const paymentMethodOptions = [
    { value: 'credit-card', label: 'Credit/Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'cash', label: 'Cash on Delivery' },
  ]

  const handleInputChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (paymentMethod === 'credit-card') {
      if (!paymentInfo.cardNumber) {
        newErrors.cardNumber = 'Card number is required'
      }
      
      if (!paymentInfo.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required'
      }
      
      if (!paymentInfo.cvv) {
        newErrors.cvv = 'CVV is required'
      }
      
      if (!paymentInfo.cardholderName) {
        newErrors.cardholderName = 'Cardholder name is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validatePaymentForm()) return
    
    setProcessing(true)
    
    try {
      // Create booking via API
      const bookingData = {
        userId: 'guest-user',
        cartId: formData.selectedCartId,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        totalHours: formData.totalHours,
        totalAmount: formData.totalAmount,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        eventType: formData.eventType,
        guestCount: formData.guestCount,
        specialNotes: formData.specialNotes,
        selectedItems: formData.selectedItems,
        paymentMethod
      }

      // Create booking via API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      if (response.ok) {
        const booking = await response.json()
        alert(`Booking confirmed! Booking ID: ${booking.id}. You will receive a confirmation email at ${formData.customerEmail}`)
        onComplete()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Booking failed')
      }
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const calculateBreakdown = () => {
    const foodTotal = formData.selectedItems?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0
    const serviceTotal = (formData.totalAmount || 0) - foodTotal
    const taxRate = 0.08
    const subtotal = formData.totalAmount || 0
    const tax = subtotal * taxRate
    const total = subtotal + tax
    
    return { foodTotal, serviceTotal, subtotal, tax, total }
  }

  const { foodTotal, serviceTotal, subtotal, tax, total } = calculateBreakdown()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Complete Your Payment
        </h2>
        <p className="text-gray-400 text-lg">
          Page 5 of 5
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-slate-600/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
          
          <div className="space-y-4">
            {/* Event Details */}
            <div>
              <h4 className="font-semibold text-white mb-2">Event Details</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Date: {formData.bookingDate ? new Date(formData.bookingDate).toLocaleDateString() : 'Not selected'}</p>
                <p>Time: {formData.startTime} - {formData.endTime}</p>
                <p>Duration: {formData.totalHours} hours</p>
                <p>Guests: {formData.guestCount}</p>
                <p>Event: {formData.eventType}</p>
              </div>
            </div>
            
            {/* Customer Info */}
            <div>
              <h4 className="font-semibold text-white mb-2">Contact</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <p>{formData.customerName}</p>
                <p>{formData.customerEmail}</p>
                <p>{formData.customerPhone}</p>
              </div>
            </div>
            
            {/* Price Breakdown */}
            <div className="border-t border-slate-500 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Food & Beverages</span>
                  <span>${foodTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Cart Service</span>
                  <span>${serviceTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="border-slate-500" />
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-teal-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-slate-600/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Payment Information</h3>
          
          <div className="space-y-6">
            <Select
              label="Payment Method"
              options={paymentMethodOptions}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            
            {paymentMethod === 'credit-card' && (
              <div className="space-y-4">
                <Input
                  label="Card Number"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  error={errors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    error={errors.expiryDate}
                    placeholder="MM/YY"
                    required
                  />
                  
                  <Input
                    label="CVV"
                    value={paymentInfo.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    error={errors.cvv}
                    placeholder="123"
                    required
                  />
                </div>
                
                <Input
                  label="Cardholder Name"
                  value={paymentInfo.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  error={errors.cardholderName}
                  placeholder="Full name on card"
                  required
                />
              </div>
            )}
            
            {paymentMethod === 'paypal' && (
              <div className="text-center py-8">
                <div className="bg-blue-500/20 border border-blue-500/50 p-6">
                  <p className="text-blue-300 font-medium">PayPal Payment</p>
                  <p className="text-blue-200 text-sm mt-2">
                    You will be redirected to PayPal to complete your payment
                  </p>
                </div>
              </div>
            )}
            
            {paymentMethod === 'cash' && (
              <div className="text-center py-8">
                <div className="bg-green-500/20 border border-green-500/50 p-6">
                  <p className="text-green-300 font-medium">Cash on Delivery</p>
                  <p className="text-green-200 text-sm mt-2">
                    Pay in cash when the food cart arrives at your event
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          disabled={processing}
          className="px-8"
        >
          Previous
        </Button>
        <Button
          onClick={handlePayment}
          size="lg"
          loading={processing}
          className="px-12"
        >
          {processing ? 'Processing...' : `Complete Booking - $${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  )
}