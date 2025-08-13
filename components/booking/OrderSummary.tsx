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
    
    // Add cart cost (from formData amounts)
    const cartTotal = formData.cartServiceAmount || 0
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
      hasFoodItems: (formData.selectedItems || []).length > 0,
      hasServices: (formData.selectedServices || []).length > 0,
      hasCart: !!formData.selectedCartId && cartTotal > 0,
      hasShipping: formData.deliveryMethod === 'shipping' && shippingTotal > 0
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
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{t('cart_rental')}</span>
              <span className="text-white font-medium">€{summary.cartTotal.toFixed(2)}</span>
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