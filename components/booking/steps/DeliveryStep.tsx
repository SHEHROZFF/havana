'use client'

import { useState, useEffect } from 'react'
import { BookingFormData } from '@/types/booking'
import { useGetFoodCartByIdQuery } from '@/lib/api/foodCartsApi'
import Button from '@/components/ui/Button'

import { Truck, MapPin, Check, Home, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import DeliveryStepSkeleton from '@/components/ui/skeletons/DeliveryStepSkeleton'
import { useI18n } from '@/lib/i18n/context'

interface DeliveryStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function DeliveryStep({ formData, updateFormData, onNext, onPrevious }: DeliveryStepProps) {
  const { t } = useI18n()
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'shipping'>(formData.deliveryMethod || 'pickup')


  // Fetch cart data for shipping options
  const {
    data: cartData,
    isLoading: loading
  } = useGetFoodCartByIdQuery(formData.selectedCartId!, {
    skip: !formData.selectedCartId
  })

  // Handle delivery method change
  const handleDeliveryMethodChange = (method: 'pickup' | 'shipping') => {
    setDeliveryMethod(method)
    const shippingAmount = method === 'shipping' ? (cartData?.shippingPrice || 0) : 0
    updateFormData({
      deliveryMethod: method,
      shippingAmount
    })
  }

  const handleNext = () => {
    onNext()
  }

  if (loading) {
    return <DeliveryStepSkeleton />
  }

  if (!cartData) {
    return (
      <div className="text-center py-[8vh] lg:py-[4vw]">
        <AlertCircle className="w-[8vh] h-[8vh] lg:w-[4vw] lg:h-[4vw] text-red-400 mx-auto mb-[2vh] lg:mb-[1vw]" />
        <h3 className="text-[2.8vh] lg:text-[1.4vw] font-semibold text-white mb-[1vh] lg:mb-[0.5vw]">{t('cart_not_found')}</h3>
        <p className="text-red-400 mb-[2vh] lg:mb-[1vw] text-[2vh] lg:text-[1vw]">{t('unable_to_load_delivery_options')}</p>
        <Button onClick={onPrevious} variant="outline">{t('go_back')}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-[3vh] lg:space-y-[1.5vw]">
      {/* Header */}
      <div className="text-center space-y-[1vh] lg:space-y-[0.5vw]">
        <h2 className="text-[4vh] lg:text-[2vw] font-bold text-white">{t('choose_delivery_method')}</h2>
        <p className="text-[1.8vh] lg:text-[0.9vw] text-gray-300">{t('step_4_of_5')}</p>
        <p className="text-[1.6vh] lg:text-[0.8vw] text-gray-400">{t('select_pickup_free_shipping_location')}</p>
      </div>

      {/* Delivery Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[3vh] lg:gap-[1.5vw]">
        {/* Pickup Option */}
        {cartData.pickupAvailable && (
          <div 
            className={clsx(
              "bg-slate-800/60 backdrop-blur-sm rounded-lg border cursor-pointer transition-all duration-300 p-[3vh] lg:p-[1.5vw]",
              deliveryMethod === 'pickup' 
                ? "border-teal-500 ring-2 ring-teal-500/50 bg-teal-500/10" 
                : "border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/80"
            )}
            onClick={() => handleDeliveryMethodChange('pickup')}
          >
            <div className="space-y-[2vh] lg:space-y-[1vw]">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.8vw]">
                  <div className={clsx(
                    "p-[1.5vh] lg:p-[0.8vw] rounded-lg",
                    deliveryMethod === 'pickup' ? "bg-teal-500/20 text-teal-400" : "bg-slate-700 text-gray-400"
                  )}>
                    <Home className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw]" />
                  </div>
                  <div>
                    <h3 className="text-[2.2vh] lg:text-[1.1vw] font-semibold text-white">{t('pickup_option')}</h3>
                    <p className="text-[1.4vh] lg:text-[0.7vw] text-gray-400">{t('collect_from_our_location')}</p>
                  </div>
                </div>
                {deliveryMethod === 'pickup' && (
                  <Check className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw] text-teal-400" />
                )}
              </div>

              {/* Features */}
              {/* <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] text-[1.4vh] lg:text-[0.7vw] text-gray-300">
                  <Clock className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                  <span>{t('ready_in_minutes')}</span>
                </div>
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] text-[1.4vh] lg:text-[0.7vw] text-gray-300">
                  <MapPin className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                  <span>{t('our_warehouse_location')}</span>
                </div>
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] text-[1.4vh] lg:text-[0.7vw] text-gray-300">
                  <DollarSign className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw] text-green-400" />
                  <span>{t('no_additional_charges')}</span>
                </div>
              </div> */}


            </div>
          </div>
        )}

        {/* Shipping Option */}
        {cartData.shippingAvailable && (
          <div 
            className={clsx(
              "bg-slate-800/60 backdrop-blur-sm rounded-lg border cursor-pointer transition-all duration-300 p-[3vh] lg:p-[1.5vw]",
              deliveryMethod === 'shipping' 
                ? "border-teal-500 ring-2 ring-teal-500/50 bg-teal-500/10" 
                : "border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/80"
            )}
            onClick={() => handleDeliveryMethodChange('shipping')}
          >
            <div className="space-y-[2vh] lg:space-y-[1vw]">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.8vw]">
                  <div className={clsx(
                    "p-[1.5vh] lg:p-[0.8vw] rounded-lg",
                    deliveryMethod === 'shipping' ? "bg-teal-500/20 text-teal-400" : "bg-slate-700 text-gray-400"
                  )}>
                    <Truck className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw]" />
                  </div>
                  <div>
                            <h3 className="text-[2.2vh] lg:text-[1.1vw] font-semibold text-white">{t('shipping_option')}</h3>
        <p className="text-[1.4vh] lg:text-[0.7vw] text-gray-400">{t('delivered_to_your_location')}</p>
                  </div>
                </div>
                {deliveryMethod === 'shipping' && (
                  <Check className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw] text-teal-400" />
                )}
              </div>

              {/* Features */}
              {/* <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] text-[1.4vh] lg:text-[0.7vw] text-gray-300">
                  <Clock className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                  <span>{t('delivered_on_event_day')}</span>
                </div>
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] text-[1.4vh] lg:text-[0.7vw] text-gray-300">
                  <Package className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                  <span>{t('professional_setup_included')}</span>
                </div>
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] text-[1.4vh] lg:text-[0.7vw] text-gray-300">
                  <MapPin className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                  <span>{t('to_your_specified_address')}</span>
                </div>
              </div> */}


            </div>
          </div>
        )}
      </div>



      {/* Navigation */}
      <div className="flex justify-between items-center pt-[2vh] lg:pt-[1vw] border-t border-slate-600">
        <Button
          onClick={onPrevious}
          variant="ghost"
          size="md"
          className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw]"
        >
          {t('previous')}
        </Button>
        <Button
          onClick={handleNext}
          size="md"
          className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold"
        >
          {t('continue_to_customer_info')}
        </Button>
      </div>
    </div>
  )
}