'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { BookingFormData } from '@/types/booking'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'
import { useCreateBookingMutation } from '../../../lib/api/bookingsApi'
import { CreditCard, DollarSign, Wallet, CheckCircle, Calendar, Users, Clock, Receipt, Shield, Lock } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedCategory, setSelectedCategory] = useState<'payment' | 'summary'>('payment')
  const swiperRef = useRef<any>(null)

  // RTK Query mutation
  const [createBooking, { isLoading: processing }] = useCreateBookingMutation()

  // Reset swiper position when category changes
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      setTimeout(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.slideTo(0, 500)
        }
      }, 100)
    }
  }, [selectedCategory])

  const paymentMethodOptions = [
    { value: 'credit-card', label: 'Credit/Debit Card', description: 'Secure card payment', icon: CreditCard },
    { value: 'paypal', label: 'PayPal', description: 'Pay with PayPal account', icon: Wallet },
    { value: 'cash', label: 'Cash on Delivery', description: 'Pay when cart arrives', icon: DollarSign },
  ]

  const categories = ['payment', 'summary']

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
      
      if (!paymentInfo.cardholderName) {
        newErrors.cardholderName = 'Cardholder name is required'
      }
      
      if (!paymentInfo.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required'
      }
      
      if (!paymentInfo.cvv) {
        newErrors.cvv = 'CVV is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validatePaymentForm()) {
      return
    }

    try {
      // Update form data with final payment info
      const finalFormData: BookingFormData = {
        // Cart Selection
        selectedCartId: formData.selectedCartId!,
        
        // Food & Services
        selectedItems: formData.selectedItems || [],
        selectedServices: formData.selectedServices || [],
        
        // Timing
        bookingDate: formData.bookingDate!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        totalHours: formData.totalHours!,
        isCustomTiming: formData.isCustomTiming || false,
        timeSlotType: formData.timeSlotType,
        
        // Customer Info
        customerName: formData.customerName!,
        customerEmail: formData.customerEmail!,
        customerPhone: formData.customerPhone!,
        eventType: formData.eventType!,
        guestCount: formData.guestCount!,
        specialNotes: formData.specialNotes,
        
        // Payment
        paymentMethod,
        totalAmount: total,
        cartServiceAmount: formData.cartServiceAmount || 0,
        servicesAmount: formData.servicesAmount || 0,
        foodAmount: formData.selectedItems?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0
      }

      updateFormData(finalFormData)

      // Create booking via RTK Query
      const booking = await createBooking(finalFormData).unwrap()
      alert(`Booking confirmed! Booking ID: ${booking.id}. You will receive a confirmation email at ${formData.customerEmail}`)
      onComplete()
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Booking failed. Please try again.')
    }
  }

  const calculateBreakdown = () => {
    const foodTotal = formData.selectedItems?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0
    const servicesTotal = formData.selectedServices?.reduce((sum, service) => sum + (service.quantity * service.pricePerHour * (service.hours || 1)), 0) || 0
    const cartTotal = formData.cartServiceAmount || 0
    const taxRate = 0.08
    const subtotal = foodTotal + servicesTotal + cartTotal
    const tax = subtotal * taxRate
    const total = subtotal + tax
    
    return { foodTotal, servicesTotal, cartTotal, subtotal, tax, total }
  }

  const { foodTotal, servicesTotal, cartTotal, subtotal, tax, total } = calculateBreakdown()

  const filteredData = useMemo(() => {
    if (selectedCategory === 'payment') {
      return [
        { id: 'cardNumber', label: 'Card Number', value: paymentInfo.cardNumber, field: 'cardNumber', type: 'text', icon: CreditCard, placeholder: '1234 5678 9012 3456' },
        { id: 'cardholderName', label: 'Cardholder Name', value: paymentInfo.cardholderName, field: 'cardholderName', type: 'text', icon: CreditCard, placeholder: 'John Doe' },
        { id: 'expiryDate', label: 'Expiry Date', value: paymentInfo.expiryDate, field: 'expiryDate', type: 'text', icon: Calendar, placeholder: 'MM/YY' },
        { id: 'cvv', label: 'CVV', value: paymentInfo.cvv, field: 'cvv', type: 'text', icon: Shield, placeholder: '123' }
      ]
    } else {
      return []
    }
  }, [selectedCategory, paymentInfo])

  return (
    <div className="space-y-[3vh] lg:space-y-[1vw]">
      <div className="text-center">
        <h2 className="text-[3.5vh] lg:text-[1.4vw] font-bold text-white mb-[1vh] lg:mb-[0.3vw]">
          Complete Payment
        </h2>
        <p className="text-gray-400 text-[2vh] lg:text-[0.7vw]">
          Step 6 of 6
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-[1.5vh] lg:gap-[0.5vw] justify-center px-[2vh] lg:px-[0.8vw]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as 'payment' | 'summary')}
            className={clsx(
              'px-[3vh] lg:px-[1vw] py-[1vh] lg:py-[0.3vw] rounded-full font-medium transition-all duration-300 text-[1.8vh] lg:text-[0.6vw] flex items-center space-x-[1vh] lg:space-x-[0.3vw]',
              selectedCategory === category
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            )}
          >
            {category === 'payment' ? (
              <CreditCard className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
            ) : (
              <Receipt className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
            )}
            <span>{category === 'payment' ? 'Payment Details' : 'Order Summary'}</span>
          </button>
        ))}
      </div>

      {/* Payment/Summary Content */}
      <div className="relative">
        <div className="flex items-center justify-between px-[2vh] lg:px-[1vw] mb-[2vh] lg:mb-[0.8vw]">
          <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.5vw]">
            <h3 className="text-[2.2vh] lg:text-[0.9vw] font-medium text-gray-300">
              {selectedCategory === 'payment' ? 'Payment Information' : 'Booking Summary'}
            </h3>
          </div>
        </div>

        {selectedCategory === 'payment' ? (
          /* Payment Section */
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-[2vh] lg:p-[1vw] mx-[2vh] lg:mx-[1vw]">
            {/* Payment Method Selection */}
            <div className="mb-[3vh] lg:mb-[1.5vw]">
              <label className="block text-[1.4vh] lg:text-[0.7vw] font-medium text-gray-300 mb-[1vh] lg:mb-[0.5vw]">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[1vh] lg:gap-[0.5vw]">
                {paymentMethodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPaymentMethod(option.value)}
                    className={clsx(
                      'p-[1.5vh] lg:p-[0.8vw] rounded-lg border text-left transition-all duration-300',
                      paymentMethod === option.value
                        ? 'border-green-500 bg-green-500/20 text-white'
                        : 'border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500'
                    )}
                  >
                    <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                      {(() => {
                        const IconComponent = option.icon
                        return <IconComponent className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                      })()}
                      <div>
                        <div className="text-[1.3vh] lg:text-[0.65vw] font-medium">{option.label}</div>
                        <div className="text-[1.1vh] lg:text-[0.55vw] text-gray-400">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'credit-card' && (
              <div className="relative max-w-[160vh] lg:max-w-[80vw] mx-auto">
                <div className="overflow-hidden">
                  <Swiper
                    ref={swiperRef}
                    modules={[FreeMode, Mousewheel]}
                    spaceBetween={16}
                    slidesPerView="auto"
                    centeredSlides={false}
                    freeMode={{
                      enabled: true,
                      sticky: false,
                      momentumRatio: 0.25,
                      momentumVelocityRatio: 0.25
                    }}
                    mousewheel={{
                      forceToAxis: true,
                      sensitivity: 1
                    }}
                    grabCursor={true}
                    watchOverflow={true}
                    breakpoints={{
                      640: { spaceBetween: 20 },
                      1024: { spaceBetween: 24 },
                    }}
                    className="payment-swiper"
                    style={{
                      paddingLeft: '2vh',
                      paddingRight: '2vh'
                    }}
                  >
                    {filteredData.map((field) => (
                      <SwiperSlide key={field.id} style={{ width: '26vh', minWidth: '26vh' }}>
                        <div className={clsx(
                          'relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden group flex-shrink-0',
                          'bg-slate-800 border shadow-sm hover:shadow-md',
                          field.value 
                            ? 'border-green-500 ring-2 ring-green-500/20' 
                            : 'border-slate-600 hover:border-slate-500'
                        )}>
                          {/* Selection Badge */}
                          {field.value && (
                            <div className="absolute top-[0.8vh] lg:top-[0.4vw] right-[0.8vh] lg:right-[0.4vw] z-10">
                              <div className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] text-white" />
                              </div>
                            </div>
                          )}

                          {/* Field Icon Header */}
                          <div className="relative h-[8vh] lg:h-[4vw] bg-slate-700 overflow-hidden flex items-center justify-center">
                            {(() => {
                              const IconComponent = field.icon
                              return <IconComponent className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw] text-teal-400" />
                            })()}
                            {field.id === 'cvv' && (
                              <div className="absolute top-[0.8vh] lg:top-[0.4vw] right-[0.8vh] lg:right-[0.4vw]">
                                <Lock className="w-[1.5vh] h-[1.5vh] lg:w-[0.8vw] lg:h-[0.8vw] text-green-400" />
                              </div>
                            )}
                          </div>

                          {/* Field Details */}
                          <div className="p-[1.2vh] lg:p-[0.6vw] space-y-[0.8vh] lg:space-y-[0.4vw]">
                            {/* Field Label */}
                            <div>
                              <h3 className="text-white font-semibold text-[1.4vh] lg:text-[0.7vw] leading-tight">
                                {field.label}
                              </h3>
                            </div>

                            {/* Input Field */}
                            <Input
                              type={field.type}
                              value={field.value}
                              onChange={(e) => handleInputChange(field.field, e.target.value)}
                              error={errors[field.field]}
                              required
                              placeholder={field.placeholder}
                              className="text-[1.2vh] lg:text-[0.6vw]"
                            />

                            {/* Status - Always present to maintain height */}
                            <div className={`text-right font-medium text-[1.2vh] lg:text-[0.6vw] pt-[0.4vh] lg:pt-[0.2vw] min-h-[2vh] lg:min-h-[1vw] ${
                              field.value 
                                ? 'text-teal-400 border-t border-slate-700' 
                                : 'text-transparent'
                            }`}>
                              {field.value ? 'Entered' : 'Required'}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="text-center py-[4vh] lg:py-[2vw] bg-blue-600/20 rounded-lg">
                <Wallet className="w-[6vh] h-[6vh] lg:w-[3vw] lg:h-[3vw] text-blue-400 mx-auto mb-[2vh] lg:mb-[1vw]" />
                <div className="text-blue-400 font-semibold text-[2vh] lg:text-[1vw]">PayPal Payment</div>
                <p className="text-gray-400 text-[1.4vh] lg:text-[0.7vw] mt-[1vh] lg:mt-[0.5vw]">You will be redirected to PayPal to complete payment</p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="text-center py-[4vh] lg:py-[2vw] bg-green-600/20 rounded-lg">
                <DollarSign className="w-[6vh] h-[6vh] lg:w-[3vw] lg:h-[3vw] text-green-400 mx-auto mb-[2vh] lg:mb-[1vw]" />
                <div className="text-green-400 font-semibold text-[2vh] lg:text-[1vw]">Cash on Delivery</div>
                <p className="text-gray-400 text-[1.4vh] lg:text-[0.7vw] mt-[1vh] lg:mt-[0.5vw]">Pay when our cart arrives at your location</p>
              </div>
            )}
          </div>
        ) : (
          /* Order Summary Section */
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-[2vh] lg:p-[1vw] mx-[2vh] lg:mx-[1vw]">
            <div className="grid md:grid-cols-2 gap-[3vh] lg:gap-[1.5vw]">
              {/* Event & Contact Details */}
              <div className="space-y-[2vh] lg:space-y-[1vw]">
                <div>
                  <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] mb-[1vh] lg:mb-[0.5vw]">
                    <Calendar className="w-[1.5vh] h-[1.5vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                    <h4 className="text-[1.4vh] lg:text-[0.7vw] font-semibold text-white">Event Details</h4>
                  </div>
                  <div className="space-y-[0.5vh] lg:space-y-[0.3vw] text-[1.2vh] lg:text-[0.6vw] text-gray-300 pl-[2.5vh] lg:pl-[1.3vw]">
                    <p>Date: {formData.bookingDate ? new Date(formData.bookingDate).toLocaleDateString() : 'Not selected'}</p>
                    <p>Time: {formData.startTime} - {formData.endTime}</p>
                    <p>Duration: {formData.totalHours} hours</p>
                    <p>Event: {formData.eventType}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] mb-[1vh] lg:mb-[0.5vw]">
                    <Users className="w-[1.5vh] h-[1.5vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                    <h4 className="text-[1.4vh] lg:text-[0.7vw] font-semibold text-white">Contact Information</h4>
                  </div>
                  <div className="space-y-[0.5vh] lg:space-y-[0.3vw] text-[1.2vh] lg:text-[0.6vw] text-gray-300 pl-[2.5vh] lg:pl-[1.3vw]">
                    <p>{formData.customerName}</p>
                    <p>{formData.customerEmail}</p>
                    <p>{formData.customerPhone}</p>
                    <p>Guests: {formData.guestCount}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div>
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] mb-[2vh] lg:mb-[1vw]">
                  <Receipt className="w-[1.5vh] h-[1.5vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                  <h4 className="text-[1.4vh] lg:text-[0.7vw] font-semibold text-white">Price Breakdown</h4>
                </div>
                <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                  <div className="flex justify-between text-[1.2vh] lg:text-[0.6vw] text-gray-300">
                    <span>Food & Beverages</span>
                    <span>${foodTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[1.2vh] lg:text-[0.6vw] text-gray-300">
                    <span>Additional Services</span>
                    <span>${servicesTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[1.2vh] lg:text-[0.6vw] text-gray-300">
                    <span>Cart Service ({formData.totalHours}h)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[1.2vh] lg:text-[0.6vw] text-gray-300 pt-[1vh] lg:pt-[0.5vw] border-t border-slate-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[1.2vh] lg:text-[0.6vw] text-gray-300">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[1.6vh] lg:text-[0.8vw] font-bold text-white pt-[1vh] lg:pt-[0.5vw] border-t border-slate-600">
                    <span>Total</span>
                    <span className="text-teal-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="text-center space-y-[1.5vh] lg:space-y-[0.8vw] pt-[2vh] lg:pt-[0vw] max-w-[160vh] lg:max-w-[80vw] mx-auto px-[2vh] lg:px-[0.8vw]">
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            size="md"
            className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold"
          >
            Previous
          </Button>
          <Button
            onClick={handlePayment}
            disabled={processing}
            size="md"
            className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold"
          >
            {processing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-[1.5vh] w-[1.5vh] lg:h-[0.8vw] lg:w-[0.8vw] border-2 border-white border-t-transparent mr-[1vh] lg:mr-[0.5vw]"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                <CheckCircle className="w-[1.8vh] h-[1.8vh] lg:w-[0.9vw] lg:h-[0.9vw] mr-[0.8vh] lg:mr-[0.4vw]" />
                Complete Payment (${total.toFixed(2)})
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}