'use client'

import { useState } from 'react'
import { BookingFormData, FoodCart } from '@/types/booking'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { useGetFoodCartsQuery } from '../../../lib/api/foodCartsApi'
import { Truck, Settings, MapPin, Check, Users } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

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
  const [selectedCartId, setSelectedCartId] = useState(formData.selectedCartId || '')

  // RTK Query hook
  const {
    data: foodCarts = [],
    isLoading: loading,
    error
  } = useGetFoodCartsQuery()

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
      <div className="text-center py-[8vh] lg:py-[6vw]">
        <div className="animate-spin rounded-full h-[8vh] w-[8vh] lg:h-[4vw] lg:w-[4vw] border-4 border-teal-500 border-t-transparent mx-auto mb-[2vh] lg:mb-[1vw]"></div>
        <p className="text-white text-[2.5vh] lg:text-[1.2vw]">Loading available carts...</p>
        <p className="text-gray-400 text-[1.8vh] lg:text-[0.9vw] mt-[1vh] lg:mt-[0.5vw]">Fetching from admin settings</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-[8vh] lg:py-[6vw]">
        <div className="mb-[2vh] lg:mb-[1vw]">
          <Truck className="w-[12vh] h-[12vh] lg:w-[6vw] lg:h-[6vw] text-gray-400 mx-auto" />
        </div>
        <h3 className="text-[2.8vh] lg:text-[1.4vw] font-semibold text-white mb-[1vh] lg:mb-[0.5vw]">Unable to Load Carts</h3>
        <p className="text-red-400 mb-[2vh] lg:mb-[1vw] text-[2vh] lg:text-[1vw]">Failed to load food carts. Please try again.</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-[2vh] lg:text-[1vw] px-[3vh] lg:px-[1.5vw] py-[1.5vh] lg:py-[0.8vw]"
        >
          🔄 Try Again
        </Button>
      </div>
    )
  }

  if (foodCarts.length === 0) {
    return (
      <div className="text-center py-[8vh] lg:py-[6vw]">
        <div className="text-[8vh] lg:text-[4vw] mb-[2vh] lg:mb-[1vw]">🚛</div>
        <h3 className="text-[2.8vh] lg:text-[1.4vw] font-semibold text-white mb-[1vh] lg:mb-[0.5vw]">No Carts Available</h3>
        <p className="text-gray-400 mb-[2vh] lg:mb-[1vw] text-[2vh] lg:text-[1vw] px-[2vh] lg:px-[1vw]">
          Our admin team is currently setting up food carts. Please check back soon!
        </p>
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-[2vh] lg:p-[1vw] max-w-[60vh] lg:max-w-[30vw] mx-auto">
          <p className="text-yellow-400 text-[1.8vh] lg:text-[0.9vw]">
            <div className="flex items-center justify-center">
            <Settings className="w-[2.5vh] h-[2.5vh] lg:w-[1.2vw] lg:h-[1.2vw] mr-[1vh] lg:mr-[0.5vw]" />
            Admin Panel Required: Food carts need to be added by administrators
          </div>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-[4vh] lg:space-y-[1.2vw]">
      {/* Header */}
      <div className="text-center space-y-[1vh] lg:space-y-[0.3vw]">
        <div className="inline-flex items-center justify-center w-[6vh] h-[6vh] lg:w-[2vw] lg:h-[2vw] bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mb-[2vh] lg:mb-[0.6vw]">
          <Truck className="w-[3vh] h-[3vh] lg:w-[1vw] lg:h-[1vw] text-white" />
        </div>
        <h2 className="text-[3.5vh] lg:text-[1.4vw] font-bold text-white">
          Select Your Food Cart
        </h2>
        <div className="flex items-center justify-center space-x-[2vh] lg:space-x-[0.6vw] text-[1.8vh] lg:text-[0.6vw] flex-wrap gap-[1vh] lg:gap-[0.3vw]">
          <span className="bg-slate-700/50 px-[1.5vh] lg:px-[0.5vw] py-[0.5vh] lg:py-[0.2vw] rounded-full text-gray-300">
            Step 1 of 5
          </span>
          <span className="text-teal-400 font-medium">
            {foodCarts.length} cart{foodCarts.length !== 1 ? 's' : ''} available
          </span>
        </div>
        <p className="text-gray-400 max-w-[80vh] lg:max-w-[30vw] mx-auto leading-relaxed text-[2vh] lg:text-[0.7vw] px-[2vh] lg:px-[0.8vw]">
          Choose the perfect food cart for your event. Each cart comes with unique features and pricing.
        </p>
      </div>

      {/* Cart Selection Slider */}
      <div className="relative max-w-[160vh] lg:max-w-[80vw] mx-auto">
        <div className="overflow-hidden">
          <Swiper
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
              640: {
                spaceBetween: 20,
              },
              1024: {
                spaceBetween: 24,
              },
            }}
            className="cart-swiper"
            style={{
              paddingLeft: '2vh',
              paddingRight: '2vh',
              paddingBottom: '2vh'
            }}
          >
            {foodCarts.map((cart) => (
              <SwiperSlide key={cart.id} style={{ width: '24vh', minWidth: '24vh' }}>
                <div
                  className={clsx(
                    'relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden group',
                    'bg-slate-800 border shadow-sm hover:shadow-md',
                    selectedCartId === cart.id 
                      ? 'border-green-500 ring-2 ring-green-500/20' 
                      : 'border-slate-600 hover:border-slate-500'
                  )}
                  onClick={() => handleCartSelect(cart.id)}
                >
            {/* Selection Badge */}
            {selectedCartId === cart.id && (
              <div className="absolute top-[0.8vh] lg:top-[0.4vw] right-[0.8vh] lg:right-[0.4vw] z-10">
                <div className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] text-white" />
                </div>
              </div>
            )}

            {/* Cart Image */}
            <div className="relative h-[12vh] lg:h-[6vw] bg-slate-700 overflow-hidden">
              <img 
                src={getCartImage(cart)}
                alt={cart.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  img.src = HAVANA_VAN_IMAGES[1] // Fallback
                }}
              />
              
              {/* Price Badge */}
              <div className="absolute top-[0.8vh] lg:top-[0.4vw] left-[0.8vh] lg:left-[0.4vw]">
                <div className="bg-teal-600 px-[1vh] lg:px-[0.5vw] py-[0.4vh] lg:py-[0.2vw] rounded text-white text-[1.2vh] lg:text-[0.6vw] font-semibold">
                  ${cart.pricePerHour}/hr
                </div>
              </div>
            </div>
            
                        {/* Cart Details */}
            <div className="p-[1.5vh] lg:p-[0.8vw] space-y-[1vh] lg:space-y-[0.5vw]">
              {/* Cart Name */}
              <div>
                <h3 className="text-white font-semibold text-[1.6vh] lg:text-[0.8vw] leading-tight">
                  {cart.name}
                </h3>
              </div>
              
              {/* Stats Row */}
              <div className="space-y-[0.6vh] lg:space-y-[0.3vw]">
                <div className="flex items-center text-gray-300 text-[1.3vh] lg:text-[0.6vw]">
                  <Users className="w-[1.4vh] h-[1.4vh] lg:w-[0.7vw] lg:h-[0.7vw] mr-[0.6vh] lg:mr-[0.3vw] text-teal-400" />
                  <span>Serves up to {cart.capacity}</span>
                </div>
                <div className="flex items-center text-gray-300 text-[1.3vh] lg:text-[0.6vw]">
                  <MapPin className="w-[1.4vh] h-[1.4vh] lg:w-[0.7vw] lg:h-[0.7vw] mr-[0.6vh] lg:mr-[0.3vw] text-teal-400" />
                  <span className="truncate">{cart.location}</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-400 text-[1.2vh] lg:text-[0.6vw] leading-relaxed line-clamp-2">
                {cart.description}
              </p>
              
              {/* Features */}
              {cart.features && cart.features.length > 0 && (
                <div className="space-y-[0.6vh] lg:space-y-[0.3vw]">
                  <div className="flex flex-wrap gap-[0.3vh] lg:gap-[0.15vw]">
                    {cart.features.slice(0, 2).map((feature, index) => (
                      <span 
                        key={index}
                        className="px-[0.8vh] lg:px-[0.4vw] py-[0.3vh] lg:py-[0.15vw] bg-slate-700 text-gray-300 text-[1vh] lg:text-[0.5vw] rounded border border-slate-600"
                      >
                        {feature}
                      </span>
                    ))}
                    {cart.features.length > 2 && (
                      <span className="px-[0.8vh] lg:px-[0.4vw] py-[0.3vh] lg:py-[0.15vw] bg-slate-600 text-gray-400 text-[1vh] lg:text-[0.5vw] rounded border border-slate-500">
                        +{cart.features.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {/* Scroll Indicator */}
        {foodCarts.length > 3 && (
          <div className="flex justify-center mt-[2vh] lg:mt-[1vw] space-x-[1vh] lg:space-x-[0.5vw]">
            <div className="text-gray-400 text-[1.4vh] lg:text-[0.7vw] flex items-center">
              <span>Swipe to see more</span>
              <svg className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] ml-[0.5vh] lg:ml-[0.3vw] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Continue Section */}
      <div className="text-center space-y-[1.5vh] lg:space-y-[0.8vw] pt-[2vh] lg:pt-[1vw] max-w-[160vh] lg:max-w-[80vw] mx-auto px-[2vh] lg:px-[0.8vw]">
        <Button
          onClick={handleNext}
          disabled={!selectedCartId}
          size="md"
          className={clsx(
            'px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold transition-all duration-300 transform',
            selectedCartId 
              ? 'hover:scale-105 shadow-lg shadow-teal-500/25' 
              : 'opacity-50 cursor-not-allowed'
          )}
        >
          {selectedCartId ? (
            <div className="flex items-center">
              <Check className="w-[1.8vh] h-[1.8vh] lg:w-[0.9vw] lg:h-[0.9vw] mr-[0.8vh] lg:mr-[0.4vw]" />
              Continue to Menu
            </div>
          ) : (
            'Select a Cart to Continue'
          )}
        </Button>

      </div>
    </div>
  )
}