'use client'

import { useState, useEffect } from 'react'
import { BookingFormData, FoodCart } from '@/types/booking'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'

interface CartSelectionStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
}

// Havana van images as fallbacks
const HAVANA_VAN_IMAGES = [
  'https://havana.gr/wp-content/uploads/2025/06/Desktop.d7abe289.vw_t2_lissabon.webp',
  'https://havana.gr/wp-content/uploads/2025/06/vintage-van-on-transparent-background-free-png.webp'
]

export default function CartSelectionStep({ formData, updateFormData, onNext }: CartSelectionStepProps) {
  const [foodCarts, setFoodCarts] = useState<FoodCart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCartId, setSelectedCartId] = useState(formData.selectedCartId || '')

  useEffect(() => {
    const fetchFoodCarts = async () => {
      try {
        setError(null)
        const response = await fetch('/api/food-carts')
        
        if (response.ok) {
          const carts = await response.json()
          setFoodCarts(carts)
          
          if (carts.length === 0) {
            setError('No food carts available. Please contact admin to add carts.')
          }
        } else {
          setError('Failed to load food carts. Please try again later.')
        }
      } catch (error) {
        console.error('Error fetching food carts:', error)
        setError('Unable to connect to server. Please check your internet connection.')
      } finally {
        setLoading(false)
      }
    }

    fetchFoodCarts()
  }, [])

  const handleCartSelect = (cartId: string) => {
    setSelectedCartId(cartId)
    updateFormData({ selectedCartId: cartId })
  }

  const handleNext = () => {
    if (selectedCartId) {
      onNext()
    }
  }

  const getCartImage = (cart: FoodCart) => {
    if (cart.image) return cart.image
    // Use Havana van images as fallback
    return HAVANA_VAN_IMAGES[0] // Default to first van image
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading available carts...</p>
        <p className="text-gray-400 text-sm mt-2">Fetching from admin settings</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚚</div>
        <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Carts</h3>
        <p className="text-red-400 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          🔄 Try Again
        </Button>
      </div>
    )
  }

  if (foodCarts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚛</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Carts Available</h3>
        <p className="text-gray-400 mb-4">
          Our admin team is currently setting up food carts. Please check back soon!
        </p>
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-yellow-400 text-sm">
            🔧 Admin Panel Required: Food carts need to be added by administrators
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Select Your Food Cart
        </h2>
        <p className="text-gray-400 text-lg">
          Page 1 of 5
        </p>
        <p className="text-teal-400 text-sm mt-1">
          {foodCarts.length} cart{foodCarts.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Cart Selection Grid */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {foodCarts.map((cart) => (
          <div
            key={cart.id}
            className={clsx(
              'cursor-pointer transition-all duration-300 border-2 p-6 lg:p-8 bg-slate-600/50 backdrop-blur-sm hover:bg-slate-600/70 transform hover:scale-105',
              selectedCartId === cart.id 
                ? 'border-teal-500 shadow-2xl shadow-teal-500/25 bg-slate-600/80 ring-2 ring-teal-500/30' 
                : 'border-slate-500 hover:border-slate-400'
            )}
            onClick={() => handleCartSelect(cart.id)}
          >
            {/* Radio button */}
            <div className="flex justify-end mb-4">
              <div className={clsx(
              'w-6 h-6 border-2 flex items-center justify-center transition-all duration-300',
                selectedCartId === cart.id 
                  ? 'bg-teal-500 border-teal-500 shadow-lg shadow-teal-500/50' 
                  : 'border-gray-400 bg-transparent'
              )}>
                {selectedCartId === cart.id && (
                  <div className="w-3 h-3 bg-white"></div>
                )}
              </div>
            </div>

            {/* Cart image */}
            <div className="flex justify-center mb-6">
              <div className="w-full max-w-xs h-32 lg:h-40 bg-slate-500/30 overflow-hidden shadow-lg border border-slate-500/50">
                <img 
                  src={getCartImage(cart)}
                  alt={cart.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.src = HAVANA_VAN_IMAGES[1] // Fallback to second van image
                  }}
                />
              </div>
            </div>
            
            {/* Cart details */}
            <div className="text-center space-y-3">
              <h3 className="text-white font-bold text-xl lg:text-2xl">
                {cart.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-500/30 rounded-lg p-2">
                  <p className="text-teal-400 font-semibold">${cart.pricePerHour}</p>
                  <p className="text-gray-400 text-xs">per hour</p>
                </div>
                <div className="bg-slate-500/30 rounded-lg p-2">
                  <p className="text-white font-semibold">{cart.capacity}</p>
                  <p className="text-gray-400 text-xs">capacity</p>
                </div>
              </div>
              
              <div className="bg-slate-500/20 rounded-lg p-3">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {cart.description}
                </p>
                <p className="text-teal-400 text-xs mt-2 font-medium">
                  📍 {cart.location}
                </p>
              </div>
            </div>

            {/* Selection indicator */}
            {selectedCartId === cart.id && (
              <div className="mt-4 flex items-center justify-center text-teal-400 bg-teal-500/20 rounded-lg py-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Selected Cart</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={handleNext}
          disabled={!selectedCartId}
          size="lg"
          className="px-16 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedCartId ? 'Continue to Menu' : 'Select a Cart'}
        </Button>
      </div>

      {/* Admin Info */}
      <div className="text-center text-xs text-gray-500">
        Cart availability and pricing managed by admin
      </div>
    </div>
  )
}