'use client'

import { useState, useMemo, useEffect } from 'react'
import { BookingFormData } from '@/types/booking'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { useCreateBookingMutation } from '../../../lib/api/bookingsApi'
import { DollarSign, CheckCircle, Calendar, Users, Clock, Receipt, Shield, Truck, MapPin, CreditCard, Building2, BookmarkCheck, Upload, FileText, Check, X } from 'lucide-react'
import PaymentSkeleton from '@/components/ui/skeletons/PaymentSkeleton'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useI18n } from '@/lib/i18n/context'

interface PaymentStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onPrevious: () => void
  onComplete: () => void
}

export default function PaymentStep({ formData, updateFormData, onPrevious, onComplete }: PaymentStepProps) {
  const { t } = useI18n()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'bank_transfer' | 'reservation'>('paypal')
  const [bankConfig, setBankConfig] = useState<any>(null)
  const [paymentSlipUrl, setPaymentSlipUrl] = useState<string>('')
  const [urlStatus, setUrlStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  // RTK Query mutation
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation()

  // Fetch bank configuration
  useEffect(() => {
    const fetchBankConfig = async () => {
      try {
        const response = await fetch('/api/admin/bank-config')
        const data = await response.json()
        if (data.success) {
          setBankConfig(data.bankConfig)
        }
      } catch (error) {
        console.error('Error fetching bank config:', error)
      }
    }
    
    if (selectedPaymentMethod === 'bank_transfer') {
      fetchBankConfig()
    }
  }, [selectedPaymentMethod])

  // PayPal configuration (fallback to hardcoded LIVE client ID if env is missing)
  const PAYPAL_CLIENT_ID_FALLBACK = 'AaAvl-glJBrSlcZRjsc14h8MTLK03fxDnhTQlE1_gW-TrMyFbmsHB3d3JBQP3j411BVIju9nK8zcn3hA'
  const resolvedClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID_FALLBACK
  const hasPayPalCredentials = !!resolvedClientId
  const paypalOptions = {
    clientId: resolvedClientId,
    currency: 'EUR',
    intent: 'capture',
    disableFunding: 'paylater,credit',
    enableFunding: 'card,paypal'
  }

  // Create PayPal order
  const createOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total.toFixed(2),
          currency: 'EUR',
          description: `Food Cart Booking - ${formData.eventType} for ${formData.guestCount} guests`
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || t('failed_to_create_paypal_order'))
      }

      return data.orderID
    } catch (error) {
      console.error('Create order error:', error)
      alert(`Failed to create PayPal order: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error
    }
  }

  // Capture PayPal payment
  const onApprove = async (data: any) => {
    setIsProcessing(true)
    
    try {
      // First, create the booking in our database
      const finalFormData: BookingFormData = {
        // Cart Selection
        selectedCartId: formData.selectedCartId!,
        
        // Food & Services
        selectedItems: formData.selectedItems || [],
        selectedServices: formData.selectedServices || [],
        
        // Multiple Dates
        selectedDates: formData.selectedDates || [],
        
        // Timing (legacy compatibility)
        bookingDate: formData.bookingDate!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        totalHours: formData.totalHours!,
        isCustomTiming: formData.isCustomTiming || false,
        timeSlotType: formData.timeSlotType,
        
        // Customer Info
        customerFirstName: formData.customerFirstName!,
        customerLastName: formData.customerLastName!,
        customerEmail: formData.customerEmail!,
        customerPhone: formData.customerPhone!,
        customerAddress: formData.customerAddress!,
        customerCity: formData.customerCity!,
        customerState: formData.customerState!,
        customerZip: formData.customerZip!,
        customerCountry: formData.customerCountry!,
        eventType: formData.eventType!,
        guestCount: formData.guestCount!,
        specialNotes: formData.specialNotes,
        
        // Delivery
        deliveryMethod: formData.deliveryMethod || 'pickup',
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingState: formData.shippingState,
        shippingZip: formData.shippingZip,
        shippingAmount: formData.shippingAmount || 0,
        
        // Payment
        paymentMethod: 'paypal',
        totalAmount: total,
        cartServiceAmount: formData.cartServiceAmount || 0,
        servicesAmount: formData.servicesAmount || 0,
        foodAmount: formData.selectedItems?.reduce((sum, item) => sum + item.price, 0) || 0
      }

      const booking = await createBooking(finalFormData).unwrap()

      // Then capture the PayPal payment
      const captureResponse = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID
        })
      })

      const captureData = await captureResponse.json()
      
      if (!captureResponse.ok) {
        throw new Error(captureData.error || t('failed_to_capture_paypal'))
      }

      if (captureData.success) {
        updateFormData(finalFormData)
        
        alert(
          `${t('payment_success_title')}\n\n` +
          `${t('booking_id_label')}: ${booking.id}\n` +
          `${t('transaction_id_label')}: ${captureData.captureId}\n` +
          `${t('amount_paid_label')}: $${captureData.amount} ${captureData.currency}\n` +
          `${t('payment_method_label')}: ${t('payment_method_paypal')}\n\n` +
          `${t('confirmation_email_sent').replace('{email}', formData.customerEmail || '')}\n\n` +
          `${t('thank_you_booking')}`
        )
        onComplete()
      } else {
        throw new Error(t('payment_failed_title'))
      }
    } catch (error) {
      console.error('Payment capture failed:', error)
      alert(
        `${t('payment_failed_title')}\n\n` +
        `${error instanceof Error ? error.message : t('unknown_error_occurred')}\n\n` +
        `${t('try_again_or_contact_support')}`
      )
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle PayPal errors
  const onError = (error: any) => {
    console.error('PayPal error:', error)
    alert(`${t('payment_failed_title')}\n\n${error.message || t('unknown_error_occurred')}`)
    setIsProcessing(false)
  }

  // Handle PayPal cancel
  const onCancel = () => {
    alert(t('payment_cancelled_message'))
    setIsProcessing(false)
  }

  // Handle bank transfer booking creation
  const handleBankTransferBooking = async () => {
    setIsProcessing(true)

    try {
      // Create the booking first
      const finalFormData: BookingFormData = {
        // Cart Selection
        selectedCartId: formData.selectedCartId!,
        
        // Food & Services
        selectedItems: formData.selectedItems || [],
        selectedServices: formData.selectedServices || [],
        
        // Multiple Dates
        selectedDates: formData.selectedDates || [],
        
        // Timing (legacy compatibility)
        bookingDate: formData.bookingDate!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        totalHours: formData.totalHours!,
        isCustomTiming: formData.isCustomTiming || false,
        timeSlotType: formData.timeSlotType,
        
        // Customer Info
        customerFirstName: formData.customerFirstName!,
        customerLastName: formData.customerLastName!,
        customerEmail: formData.customerEmail!,
        customerPhone: formData.customerPhone!,
        customerAddress: formData.customerAddress!,
        customerCity: formData.customerCity!,
        customerState: formData.customerState!,
        customerZip: formData.customerZip!,
        customerCountry: formData.customerCountry!,
        eventType: formData.eventType!,
        guestCount: formData.guestCount!,
        specialNotes: formData.specialNotes,
        
        // Delivery
        deliveryMethod: formData.deliveryMethod || 'pickup',
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingState: formData.shippingState,
        shippingZip: formData.shippingZip,
        shippingAmount: formData.shippingAmount || 0,
        
        // Payment
        paymentMethod: 'bank_transfer',
        paymentSlipUrl: paymentSlipUrl, // Include payment slip URL in booking data
        totalAmount: total,
        cartServiceAmount: formData.cartServiceAmount || 0,
        servicesAmount: formData.servicesAmount || 0,
        foodAmount: formData.selectedItems?.reduce((sum, item) => sum + item.price, 0) || 0
      }

      const booking = await createBooking(finalFormData).unwrap()

      updateFormData(finalFormData)
      
      alert(
        `Booking Created Successfully!\n\n` +
        `${t('booking_id_label')}: ${booking.id}\n` +
        `${t('total_amount')}: €${total.toFixed(2)}\n` +
        `${t('payment_method_label')}: Bank Transfer\n\n` +
        `Payment slip URL saved successfully!\nAdmin will verify your payment.\n\n` +
        `${t('confirmation_email_sent').replace('{email}', formData.customerEmail || '')}\n\n` +
        `${t('thank_you_booking')}`
      )
      
      onComplete()
    } catch (error) {
      console.error('Bank transfer booking failed:', error)
      setUrlStatus('error')
      alert(
        `Booking Failed\n\n` +
        `${error instanceof Error ? error.message : 'Unknown error occurred'}\n\n` +
        `Please try again or contact support`
      )
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle reservation without payment
  const handleReservationBooking = async () => {
    setIsProcessing(true)

    try {
      const finalFormData: BookingFormData = {
        // Cart Selection
        selectedCartId: formData.selectedCartId!,
        
        // Food & Services
        selectedItems: formData.selectedItems || [],
        selectedServices: formData.selectedServices || [],
        
        // Multiple Dates
        selectedDates: formData.selectedDates || [],
        
        // Timing (legacy compatibility)
        bookingDate: formData.bookingDate!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        totalHours: formData.totalHours!,
        isCustomTiming: formData.isCustomTiming || false,
        timeSlotType: formData.timeSlotType,
        
        // Customer Info
        customerFirstName: formData.customerFirstName!,
        customerLastName: formData.customerLastName!,
        customerEmail: formData.customerEmail!,
        customerPhone: formData.customerPhone!,
        customerAddress: formData.customerAddress!,
        customerCity: formData.customerCity!,
        customerState: formData.customerState!,
        customerZip: formData.customerZip!,
        customerCountry: formData.customerCountry!,
        eventType: formData.eventType!,
        guestCount: formData.guestCount!,
        specialNotes: formData.specialNotes,
        
        // Delivery
        deliveryMethod: formData.deliveryMethod || 'pickup',
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingState: formData.shippingState,
        shippingZip: formData.shippingZip,
        shippingAmount: formData.shippingAmount || 0,
        
        // Payment
        paymentMethod: 'reservation',
        totalAmount: total,
        cartServiceAmount: formData.cartServiceAmount || 0,
        servicesAmount: formData.servicesAmount || 0,
        foodAmount: formData.selectedItems?.reduce((sum, item) => sum + item.price, 0) || 0
      }

      const booking = await createBooking(finalFormData).unwrap()

      updateFormData(finalFormData)
        
        alert(
        `Reservation Created Successfully!\n\n` +
          `${t('booking_id_label')}: ${booking.id}\n` +
        `${t('total_amount')}: €${total.toFixed(2)}\n` +
        `${t('payment_method_label')}: Reservation (No Payment)\n\n` +
        `Your reservation has been confirmed. Payment can be made later.\n\n` +
          `${t('confirmation_email_sent').replace('{email}', formData.customerEmail || '')}\n\n` +
          `${t('thank_you_booking')}`
        )
      
      onComplete()
    } catch (error) {
      console.error('Reservation booking failed:', error)
      alert(
        `Booking Failed\n\n` +
        `${error instanceof Error ? error.message : t('unknown_error_occurred')}\n\n` +
        `${t('try_again_or_contact_support')}`
      )
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle URL input for bank transfer slip
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentSlipUrl(event.target.value)
    setUrlStatus('idle')
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Calculate order totals (NO TAX) - Supporting multiple dates
  const calculateTotals = useMemo(() => {
    const foodTotal = formData.selectedItems?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0
    const servicesTotal = formData.selectedServices?.reduce((sum, service) => sum + (service.quantity * service.price), 0) || 0
    
    // Calculate cart total from multiple dates or single date
    const cartTotal = formData.selectedDates && formData.selectedDates.length > 0
      ? formData.selectedDates.reduce((sum, date) => sum + date.cartCost, 0)
      : (formData.cartServiceAmount || 0)
    
    const shippingTotal = formData.shippingAmount || 0
    const total = foodTotal + servicesTotal + cartTotal + shippingTotal
    
    const daysCount = formData.selectedDates?.length || (cartTotal > 0 ? 1 : 0)
    const totalHours = formData.selectedDates?.reduce((sum, date) => sum + date.totalHours, 0) || formData.totalHours || 0

    return { foodTotal, servicesTotal, cartTotal, shippingTotal, total, daysCount, totalHours }
  }, [formData.selectedItems, formData.selectedServices, formData.selectedDates, formData.cartServiceAmount, formData.shippingAmount, formData.totalHours])

  const { foodTotal, servicesTotal, cartTotal, shippingTotal, total, daysCount, totalHours } = calculateTotals

  // Show loading skeleton if data is still loading
  if (creating) {
    return <PaymentSkeleton />
  }

  return (
    <div className="space-y-[3vh] lg:space-y-[1.5vw]">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-[3.5vh] lg:text-[1.8vw] font-bold text-white mb-[1vh] lg:mb-[0.5vw]">
          {t('payment_title')}
        </h2>
        <p className="text-gray-400 text-[2vh] lg:text-[1vw]">
          {t('payment_subtitle')}
        </p>
      </div>

      {/* Order Summary */}
      <div className="max-w-[100vh] lg:max-w-[50vw] mx-auto">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-[3vh] lg:p-[1.5vw] mx-[2vh] lg:mx-[1vw] border border-slate-600/50">
          {/* Summary Header */}
          <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.75vw] mb-[2.5vh] lg:mb-[1.25vw]">
            <Receipt className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw] text-teal-400" />
            <h3 className="text-[2.5vh] lg:text-[1.25vw] font-semibold text-white">{t('order_summary')}</h3>
        </div>

          {/* Order Details */}
          <div className="space-y-[2vh] lg:space-y-[1vw]">
            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2vh] lg:gap-[1vw]">
              <div className="space-y-[1.5vh] lg:space-y-[0.75vw]">
                {daysCount > 1 ? (
                  <>
                    <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                      <Calendar className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                      <span className="text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                        {daysCount} {t('days_booked')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                      <Clock className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                      <span className="text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                        {t('total')}: {totalHours} {t('hours')}
                      </span>
                    </div>
                    <div className="text-[1.3vh] lg:text-[0.65vw] text-gray-400 mt-[1vh] lg:mt-[0.5vw]">
                      {formData.selectedDates?.map((date, index) => (
                        <div key={index} className="mb-[0.5vh] lg:mb-[0.25vw]">
                          {new Date(date.date).toLocaleDateString()}: {date.startTime} - {date.endTime} ({date.totalHours}h)
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                  <Calendar className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                  <span className="text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                    {new Date(formData.bookingDate || '').toLocaleDateString()}
                  </span>
                      </div>
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                  <Clock className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                  <span className="text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                    {formData.startTime} - {formData.endTime} ({formData.totalHours}h)
                  </span>
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                  <Users className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                  <span className="text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                    {formData.guestCount} {t('guests')} • {(() => {
                      const map: Record<string, string> = {
                        'birthday': t('event_birthday'),
                        'wedding': t('event_wedding'),
                        'corporate': t('event_corporate'),
                        'graduation': t('event_graduation'),
                        'anniversary': t('event_anniversary'),
                        'family-gathering': t('event_family_gathering'),
                        'community-event': t('event_community_event'),
                        'other': t('event_other'),
                      }
                      return map[formData.eventType || ''] || (formData.eventType || '')
                    })()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-[1.5vh] lg:space-y-[0.75vw]">
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                  <CheckCircle className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                  <span className="text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                    {formData.customerFirstName} {formData.customerLastName}
                  </span>
              </div>
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                  {formData.deliveryMethod === 'shipping' ? (
                    <Truck className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                  ) : (
                    <MapPin className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                  )}
                  <span className="text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                    {formData.deliveryMethod === 'shipping' ? t('shipping_option') : t('pickup_option')}
                    {formData.deliveryMethod === 'shipping' && ` - $${shippingTotal.toFixed(2)}`}
                  </span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
            <div className="border-t border-slate-600 pt-[2vh] lg:pt-[1vw] mt-[2vh] lg:mt-[1vw]">
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                {cartTotal > 0 && (
                  <div className="flex justify-between text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                    <span>{t('food_cart_service')}</span>
                    <span>€{cartTotal.toFixed(2)}</span>
                </div>
                )}
                {foodTotal > 0 && (
                  <div className="flex justify-between text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                    <span>{t('food_items_with_count').replace('{count}', (formData.selectedItems?.length || 0).toString())}</span>
                    <span>€{foodTotal.toFixed(2)}</span>
                  </div>
                )}
                {servicesTotal > 0 && (
                  <div className="flex justify-between text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                    <span>{t('additional_services_with_count').replace('{count}', (formData.selectedServices?.length || 0).toString())}</span>
                    <span>€{servicesTotal.toFixed(2)}</span>
                  </div>
                )}
                {shippingTotal > 0 && (
                  <div className="flex justify-between text-[1.6vh] lg:text-[0.8vw] text-gray-300">
                    <span>{t('delivery_fee')}</span>
                    <span>€{shippingTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[2.2vh] lg:text-[1.1vw] font-bold text-white pt-[1vh] lg:pt-[0.5vw] border-t border-slate-600">
                    <span>{t('total')}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="max-w-[100vh] lg:max-w-[50vw] mx-auto">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-[3vh] lg:p-[1.5vw] mx-[2vh] lg:mx-[1vw] border border-slate-600/50">
          {/* Payment Header */}
          <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.75vw] mb-[3vh] lg:mb-[1.5vw]">
            <Shield className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw] text-teal-400" />
            <div>
              <h3 className="text-[2.5vh] lg:text-[1.25vw] font-semibold text-white">{t('choose_payment_method')}</h3>
              <p className="text-[1.4vh] lg:text-[0.7vw] text-gray-400">{t('select_preferred_payment_option')}</p>
            </div>
          </div>

          {/* Payment Method Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2vh] lg:gap-[1vw] mb-[3vh] lg:mb-[1.5vw]">
            {/* PayPal Option */}
            <button
              onClick={() => setSelectedPaymentMethod('paypal')}
              className={clsx(
                'p-[2vh] lg:p-[1vw] rounded-lg border-2 transition-all duration-300 text-center',
                selectedPaymentMethod === 'paypal'
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500'
              )}
            >
              <CreditCard className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw] mx-auto mb-[1vh] lg:mb-[0.5vw] text-blue-400" />
              <h4 className="text-[1.6vh] lg:text-[0.8vw] font-semibold mb-[0.5vh] lg:mb-[0.25vw]">PayPal</h4>
              <p className="text-[1.2vh] lg:text-[0.6vw] text-gray-400">{t('instant_payment_paypal_card')}</p>
            </button>

            {/* Bank Transfer Option */}
            <button
              onClick={() => setSelectedPaymentMethod('bank_transfer')}
              className={clsx(
                'p-[2vh] lg:p-[1vw] rounded-lg border-2 transition-all duration-300 text-center',
                selectedPaymentMethod === 'bank_transfer'
                  ? 'border-green-500 bg-green-500/20 text-white'
                  : 'border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500'
              )}
            >
              <Building2 className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw] mx-auto mb-[1vh] lg:mb-[0.5vw] text-green-400" />
              <h4 className="text-[1.6vh] lg:text-[0.8vw] font-semibold mb-[0.5vh] lg:mb-[0.25vw]">{t('bank_transfer')}</h4>
              <p className="text-[1.2vh] lg:text-[0.6vw] text-gray-400">{t('transfer_bank_upload_receipt')}</p>
            </button>

            {/* Reservation Option */}
            <button
              onClick={() => setSelectedPaymentMethod('reservation')}
              className={clsx(
                'p-[2vh] lg:p-[1vw] rounded-lg border-2 transition-all duration-300 text-center',
                selectedPaymentMethod === 'reservation'
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500'
              )}
            >
              <BookmarkCheck className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw] mx-auto mb-[1vh] lg:mb-[0.5vw] text-orange-400" />
              <h4 className="text-[1.6vh] lg:text-[0.8vw] font-semibold mb-[0.5vh] lg:mb-[0.25vw]">{t('reservation')}</h4>
              <p className="text-[1.2vh] lg:text-[0.6vw] text-gray-400">{t('reserve_without_payment')}</p>
            </button>
          </div>

          {/* Total Display */}
          <div className="bg-slate-700/50 rounded-lg p-[2vh] lg:p-[1vw] border border-slate-600 mb-[3vh] lg:mb-[1.5vw]">
            <div className="text-[2vh] lg:text-[1vw] text-gray-300 mb-[0.5vh] lg:mb-[0.25vw]">{t('total_amount')}</div>
            <div className="text-[3.5vh] lg:text-[1.75vw] font-bold text-white">€{total.toFixed(2)}</div>
          </div>

          {/* Payment Method Content */}
          {selectedPaymentMethod === 'paypal' && (
            <div className="space-y-[2vh] lg:space-y-[1vw]">
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-[2vh] lg:p-[1vw]">
              <div className="flex items-center justify-center space-x-[1vh] lg:space-x-[0.5vw] mb-[1vh] lg:mb-[0.5vw]">
                <svg className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw]" viewBox="0 0 24 24" fill="currentColor">
                  <path fill="#0070ba" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.198-.398c2.306.686 3.82 2.799 3.82 6.068 0 6.749-5.451 12.22-12.2 12.22H9.98a.641.641 0 0 1-.633-.74l.905-5.751h1.848c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437a7.649 7.649 0 0 0-.402-4.165z"/>
                </svg>
                <span className="text-[1.8vh] lg:text-[0.9vw] font-medium text-blue-400">{t('paypal_secure_payment')}</span>
              </div>
                <p className="text-[1.4vh] lg:text-[0.7vw] text-gray-300 text-center">
                {t('click_below_to_process_payment')}
              </p>
            </div>

            <div className="w-full">
              {isProcessing ? (
                <div className="bg-gray-600 rounded-lg py-[2vh] lg:py-[1vw] flex items-center justify-center space-x-[1vh] lg:space-x-[0.5vw]">
                  <div className="animate-spin rounded-full h-[2vh] w-[2vh] lg:h-[1vw] lg:w-[1vw] border-2 border-white border-t-transparent"></div>
                  <span className="text-white text-[2.2vh] lg:text-[1.1vw] font-bold">{t('processing_payment')}</span>
                </div>
              ) : hasPayPalCredentials ? (
                <PayPalScriptProvider options={paypalOptions}>
                  <PayPalButtons
                    style={{
                      layout: 'vertical',
                      color: 'blue',
                      shape: 'rect',
                      label: 'paypal',
                      height: 50
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={onCancel}
                    disabled={isProcessing}
                  />
                </PayPalScriptProvider>
              ) : (
                  <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-[1.5vh] lg:p-[0.8vw]">
                    <p className="text-yellow-300 text-[1.4vh] lg:text-[0.7vw] text-center">
                      {t('paypal_credentials_missing')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedPaymentMethod === 'bank_transfer' && (
            <div className="space-y-[2vh] lg:space-y-[1vw]">
              {bankConfig ? (
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-[2vh] lg:p-[1vw]">
                  <h4 className="text-[1.8vh] lg:text-[0.9vw] font-semibold text-green-400 mb-[1vh] lg:mb-[0.5vw]">
                    {t('bank_transfer_details')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[1vh] lg:gap-[0.5vw] text-[1.4vh] lg:text-[0.7vw]">
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
                      <p className="text-white font-medium font-mono">{bankConfig.iban}</p>
                    </div>
                    {bankConfig.swiftCode && (
                      <div>
                        <span className="text-gray-400">{t('swift_code')}:</span>
                        <p className="text-white font-medium">{bankConfig.swiftCode}</p>
                      </div>
                    )}
                  </div>
                  {bankConfig.instructions && (
                    <div className="mt-[1vh] lg:mt-[0.5vw] p-[1vh] lg:p-[0.5vw] bg-slate-600/50 rounded">
                      <span className="text-gray-400 text-[1.2vh] lg:text-[0.6vw]">{t('instructions')}:</span>
                      <p className="text-white text-[1.3vh] lg:text-[0.65vw] mt-[0.5vh] lg:mt-[0.25vw]">{bankConfig.instructions}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-[2vh] lg:p-[1vw]">
                  <p className="text-red-300 text-[1.4vh] lg:text-[0.7vw] text-center">
                    {t('bank_transfer_details_not_configured')}
                  </p>
                </div>
              )}

              {/* Payment Slip URL Section */}
              <div className="bg-slate-700/50 rounded-lg p-[2vh] lg:p-[1vw] border border-slate-600">
                <h4 className="text-[1.6vh] lg:text-[0.8vw] font-semibold text-white mb-[1vh] lg:mb-[0.5vw]">
                  {t('payment_receipt_link')} <span className="text-red-400">*</span>
                </h4>
                <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                  <input
                    type="url"
                    value={paymentSlipUrl}
                    onChange={handleUrlChange}
                    placeholder={t('payment_receipt_url_placeholder')}
                    className="w-full p-[1vh] lg:p-[0.5vw] bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none text-[1.4vh] lg:text-[0.7vw]"
                  />
                  
                  {paymentSlipUrl && validateUrl(paymentSlipUrl) && (
                    <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] text-[1.3vh] lg:text-[0.65vw]">
                      <FileText className="w-[1.5vh] h-[1.5vh] lg:w-[0.75vw] lg:h-[0.75vw] text-green-400" />
                      <span className="text-green-400">✓ {t('valid_url_provided')}</span>
                    </div>
                  )}
                  
                  {paymentSlipUrl && !validateUrl(paymentSlipUrl) && (
                    <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] text-[1.3vh] lg:text-[0.65vw]">
                      <span className="text-yellow-400">⚠ {t('please_enter_valid_url')}</span>
                    </div>
                  )}
                  
                  <p className="text-[1.2vh] lg:text-[0.6vw] text-gray-400">
                    <span className="text-red-400 font-medium">{t('required')}:</span> {t('upload_receipt_instructions')}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleBankTransferBooking}
                disabled={isProcessing || !bankConfig || !paymentSlipUrl || !validateUrl(paymentSlipUrl)}
                size="lg"
                className="w-full py-[2vh] lg:py-[1vw] text-[2.2vh] lg:text-[1.1vw] font-bold bg-green-600 hover:bg-green-700 text-white"
              >
                <div className="flex items-center justify-center space-x-[1vh] lg:space-x-[0.5vw]">
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-[2vh] w-[2vh] lg:h-[1vw] lg:w-[1vw] border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Building2 className="w-[2.2vh] h-[2.2vh] lg:w-[1.1vw] lg:h-[1.1vw]" />
                  )}
                  <span>{t('complete_bank_transfer_booking')}</span>
                </div>
              </Button>
            </div>
          )}

          {selectedPaymentMethod === 'reservation' && (
            <div className="space-y-[2vh] lg:space-y-[1vw]">
              <div className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-[2vh] lg:p-[1vw]">
                <h4 className="text-[1.8vh] lg:text-[0.9vw] font-semibold text-orange-400 mb-[1vh] lg:mb-[0.5vw]">
                  {t('reservation_without_payment')}
                </h4>
                <p className="text-[1.4vh] lg:text-[0.7vw] text-gray-300 mb-[1vh] lg:mb-[0.5vw]">
                  {t('reserve_booking_pay_later_instructions')}
                </p>
                <ul className="text-[1.3vh] lg:text-[0.65vw] text-gray-300 space-y-[0.5vh] lg:space-y-[0.25vw] ml-[2vh] lg:ml-[1vw]">
                  <li>• {t('contacting_us_directly')}</li>
                  <li>• {t('bank_transfer_before_event')}</li>
                  <li>• {t('cash_payment_on_delivery_pickup')}</li>
                </ul>
                <div className="mt-[1vh] lg:mt-[0.5vw] p-[1vh] lg:p-[0.5vw] bg-orange-500/20 rounded">
                  <p className="text-orange-300 text-[1.2vh] lg:text-[0.6vw] font-medium">
                    ⚠️ {t('reservation_subject_to_confirmation')}
                  </p>
                </div>
              </div>

                  <Button
                onClick={handleReservationBooking}
                    disabled={isProcessing}
                    size="lg"
                className="w-full py-[2vh] lg:py-[1vw] text-[2.2vh] lg:text-[1.1vw] font-bold bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <div className="flex items-center justify-center space-x-[1vh] lg:space-x-[0.5vw]">
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-[2vh] w-[2vh] lg:h-[1vw] lg:w-[1vw] border-2 border-white border-t-transparent"></div>
                  ) : (
                    <BookmarkCheck className="w-[2.2vh] h-[2.2vh] lg:w-[1.1vw] lg:h-[1.1vw]" />
                  )}
                  <span>{t('complete_reservation')}</span>
                    </div>
                  </Button>
          </div>
        )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-[1vh] lg:gap-[0.5vw] max-w-[100vh] lg:max-w-[50vw] mx-auto px-[2vh] lg:px-[1vw]">
          <Button
            variant="outline"
            onClick={onPrevious}
            size="md"
            className="px-[3vh] lg:px-[2vw] py-[1vh] lg:py-[0.6vw] text-[1.6vh] lg:text-[0.9vw] font-semibold"
          >
            {t('previous')}
          </Button>
        
        <div className="text-center">
          <p className="text-[1.4vh] lg:text-[0.7vw] text-gray-400">
            {t('payment_protected_by_paypal')}
          </p>
        </div>
      </div>
    </div>
  )
}