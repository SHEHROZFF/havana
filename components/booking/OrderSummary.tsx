'use client'

import { useMemo } from 'react'
import { BookingFormData } from '@/types/booking'
import { clsx } from 'clsx'
import Skeleton from '@/components/ui/Skeleton'
import { useI18n } from '@/lib/i18n/context'

interface OrderSummaryProps {
  formData: Partial<BookingFormData>
  className?: string
}

export default function OrderSummary({ formData, className }: OrderSummaryProps) {
  const { t } = useI18n()
  const summary = useMemo(() => {
    let total = 0
    let itemCount = 0
    
    // Add food items
    const foodTotal = (formData.selectedItems || []).reduce((sum, item) => {
      itemCount += item.quantity
      return sum + (item.quantity * item.price)
    }, 0)
    total += foodTotal
    
    // Add services
    const servicesTotal = (formData.selectedServices || []).reduce((sum, service) => {
      itemCount += service.quantity
      return sum + (service.quantity * service.price)
    }, 0)
    total += servicesTotal
    
    // Calculate cart cost from multiple dates or single date
    let cartTotal = 0
    let totalDays = 0
    let totalHours = 0
    
    if (formData.selectedDates && formData.selectedDates.length > 0) {
      // Multiple dates mode
      cartTotal = formData.selectedDates.reduce((sum, date) => sum + date.cartCost, 0)
      totalDays = formData.selectedDates.length
      totalHours = formData.selectedDates.reduce((sum, date) => sum + date.totalHours, 0)
    } else {
      // Legacy single date mode
      cartTotal = formData.cartServiceAmount || 0
      totalDays = cartTotal > 0 ? 1 : 0
      totalHours = formData.totalHours || 0
    }
    
    total += cartTotal
    
    // Add shipping cost
    const shippingTotal = formData.shippingAmount || 0
    total += shippingTotal
    
    return {
      foodTotal,
      servicesTotal,
      cartTotal,
      shippingTotal,
      total,
      itemCount,
      totalDays,
      totalHours,
      hasFoodItems: (formData.selectedItems || []).length > 0,
      hasServices: (formData.selectedServices || []).length > 0,
      hasCart: !!formData.selectedCartId && cartTotal > 0,
      hasShipping: formData.deliveryMethod === 'shipping' && shippingTotal > 0,
      hasMultipleDates: (formData.selectedDates && formData.selectedDates.length > 1)
    }
  }, [formData])

  if (summary.total === 0) {
    return null
  }

  return (
    <div className={clsx(
      "bg-slate-800/90 backdrop-blur-md border border-slate-600 rounded-xl shadow-lg",
      className
    )}>
      <div className="p-[2vh] lg:p-[1vw] space-y-[1.5vh] lg:space-y-[0.8vw]">
        <div className="flex items-center justify-between border-b border-slate-600 pb-[1vh] lg:pb-[0.5vw]">
          <h3 className="font-bold text-[1.8vh] lg:text-[0.9vw] text-white">{t('order_summary')}</h3>
          <span className="text-[1.4vh] lg:text-[0.7vw] text-gray-400">{t('items_count').replace('{count}', summary.itemCount.toString())}</span>
        </div>
        
        <div className="space-y-[1vh] lg:space-y-[0.5vw] text-[1.5vh] lg:text-[0.7vw]">
          {summary.hasCart && (
            <div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">
                  {summary.hasMultipleDates 
                    ? `Cart Rental (${summary.totalDays} days)`
                    : t('cart_rental')
                  }
                </span>
                <span className="text-white font-medium">€{summary.cartTotal.toFixed(2)}</span>
              </div>
              {summary.hasMultipleDates && (
                <div className="text-[1.2vh] lg:text-[0.6vw] text-gray-400 mt-[0.5vh] lg:mt-[0.25vw]">
                  Total: {summary.totalHours} hours across {summary.totalDays} days
                </div>
              )}
            </div>
          )}
          
          {summary.hasFoodItems && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{t('food_items')}</span>
              <span className="text-white font-medium">€{summary.foodTotal.toFixed(2)}</span>
            </div>
          )}
          
          {summary.hasServices && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{t('additional_services')}</span>
              <span className="text-white font-medium">€{summary.servicesTotal.toFixed(2)}</span>
            </div>
          )}
          
          {summary.hasShipping && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{t('shipping_option')}</span>
              <span className="text-white font-medium">€{summary.shippingTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <div className="border-t border-slate-600 pt-[1vh] lg:pt-[0.5vw]">
          <div className="flex justify-between items-center">
            <span className="text-white font-bold text-[1.8vh] lg:text-[0.9vw]">{t('total')}</span>
            <span className="text-teal-400 font-bold text-[2vh] lg:text-[1vw]">
              €{summary.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}