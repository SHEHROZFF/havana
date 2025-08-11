'use client'

import { useMemo } from 'react'
import { BookingFormData } from '@/types/booking'
import { clsx } from 'clsx'

interface OrderSummaryProps {
  formData: Partial<BookingFormData>
  className?: string
}

export default function OrderSummary({ formData, className }: OrderSummaryProps) {
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
      return sum + (service.quantity * service.pricePerHour * (service.hours || 1))
    }, 0)
    total += servicesTotal
    
    // Add cart cost (from formData amounts)
    const cartTotal = formData.cartServiceAmount || 0
    total += cartTotal
    
    return {
      foodTotal,
      servicesTotal,
      cartTotal,
      total,
      itemCount,
      hasFoodItems: (formData.selectedItems || []).length > 0,
      hasServices: (formData.selectedServices || []).length > 0,
      hasCart: !!formData.selectedCartId && cartTotal > 0
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
          <h3 className="font-bold text-[1.8vh] lg:text-[0.9vw] text-white">Order Summary</h3>
          <span className="text-[1.4vh] lg:text-[0.7vw] text-gray-400">{summary.itemCount} items</span>
        </div>
        
        <div className="space-y-[1vh] lg:space-y-[0.5vw] text-[1.5vh] lg:text-[0.7vw]">
          {summary.hasCart && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Cart Rental</span>
              <span className="text-white font-medium">${summary.cartTotal.toFixed(2)}</span>
            </div>
          )}
          
          {summary.hasFoodItems && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Food Items</span>
              <span className="text-white font-medium">${summary.foodTotal.toFixed(2)}</span>
            </div>
          )}
          
          {summary.hasServices && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Services</span>
              <span className="text-white font-medium">${summary.servicesTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <div className="border-t border-slate-600 pt-[1vh] lg:pt-[0.5vw]">
          <div className="flex justify-between items-center">
            <span className="text-white font-bold text-[1.8vh] lg:text-[0.9vw]">Total</span>
            <span className="text-teal-400 font-bold text-[2vh] lg:text-[1vw]">
              ${summary.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}