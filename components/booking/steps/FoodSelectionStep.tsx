'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { BookingFormData, FoodItem } from '@/types/booking'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'
import { useGetFoodItemsQuery } from '../../../lib/api/foodItemsApi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

interface FoodSelectionStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

const FOOD_FALLBACK_IMAGES = {
  sandwich: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop&auto=format',
  main: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop&auto=format',
  sides: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=300&h=200&fit=crop&auto=format',
  beverages: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop&auto=format',
  desserts: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop&auto=format',
  default: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop&auto=format'
}

const getFoodFallbackImage = (category: string): string => {
  const cat = category.toLowerCase()
  if (cat.includes('sandwich')) return FOOD_FALLBACK_IMAGES.sandwich
  if (cat.includes('main')) return FOOD_FALLBACK_IMAGES.main
  if (cat.includes('side')) return FOOD_FALLBACK_IMAGES.sides
  if (cat.includes('beverage') || cat.includes('drink')) return FOOD_FALLBACK_IMAGES.beverages
  if (cat.includes('dessert')) return FOOD_FALLBACK_IMAGES.desserts
  return FOOD_FALLBACK_IMAGES.default
}

export default function FoodSelectionStep({ formData, updateFormData, onNext, onPrevious }: FoodSelectionStepProps) {
  const [selectedItems, setSelectedItems] = useState(formData.selectedItems || [])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const swiperRef = useRef<any>(null)

  // RTK Query hook
  const {
    data: foodItems = [],
    isLoading: loading,
    error
  } = useGetFoodItemsQuery({ 
    cartId: formData.selectedCartId 
  }, {
    skip: !formData.selectedCartId
  })

  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(foodItems.map(item => item.category)))]
  }, [foodItems])
  
  const filteredItems = useMemo(() => {
    return selectedCategory === 'all' ? foodItems : foodItems.filter(item => item.category === selectedCategory)
  }, [selectedCategory, foodItems])

  // Reset swiper position when category changes
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      setTimeout(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.slideTo(0, 500) // Slide to first item smoothly
        }
      }, 100)
    }
  }, [selectedCategory])

  const getItemQuantity = (itemId: string) => {
    const item = selectedItems.find(item => item.itemId === itemId)
    return item ? item.quantity : 0
  }

  const updateItemQuantity = (itemId: string, quantity: number, price: number) => {
    let newSelectedItems = [...selectedItems]
    const existingIndex = newSelectedItems.findIndex(item => item.itemId === itemId)
    
    if (quantity === 0) {
      if (existingIndex > -1) {
        newSelectedItems.splice(existingIndex, 1)
      }
    } else {
      if (existingIndex > -1) {
        newSelectedItems[existingIndex] = { itemId, quantity, price }
      } else {
        newSelectedItems.push({ itemId, quantity, price })
      }
    }
    
    setSelectedItems(newSelectedItems)
    const totalAmount = newSelectedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    updateFormData({ selectedItems: newSelectedItems, totalAmount })
  }

  const handleNext = () => {
    if (selectedItems.length > 0) {
      onNext()
    }
  }

  if (loading) {
    return (
      <div className="text-center py-[8vh] lg:py-[4vw]">
        <div className="animate-spin rounded-full h-[8vh] w-[8vh] lg:h-[4vw] lg:w-[4vw] border-4 border-teal-500 border-t-transparent mx-auto mb-[2vh] lg:mb-[1vw]"></div>
        <p className="text-white text-[2.5vh] lg:text-[1.2vw]">Loading menu items...</p>
      </div>
    )
  }

  if (foodItems.length === 0) {
    return (
      <div className="text-center py-[10vh] lg:py-[5vw]">
        <div className="text-[8vh] lg:text-[4vw] mb-[3vh] lg:mb-[1.5vw]">🍽️</div>
        <h2 className="text-[3vh] lg:text-[1.5vw] font-bold text-white mb-[2vh] lg:mb-[1vw]">No Menu Items Available</h2>
        <p className="text-gray-400 mb-[4vh] lg:mb-[2vw] text-[2vh] lg:text-[1vw] px-[4vh] lg:px-[2vw]">
          This food cart doesn't have any menu items set up yet.
          <br />
          Please contact the admin to add menu items for this cart.
        </p>
        <button
          onClick={onPrevious}
          className="px-[4vh] lg:px-[2vw] py-[1.5vh] lg:py-[0.8vw] bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors duration-300 text-[2vh] lg:text-[1vw]"
        >
          ← Back to Cart Selection
        </button>
      </div>
    )
  }

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-[3vh] lg:space-y-[1vw]">
      <div className="text-center">
        <h2 className="text-[3.5vh] lg:text-[1.4vw] font-bold text-white mb-[1vh] lg:mb-[0.3vw]">
          Select Your Menu Items
        </h2>
        <p className="text-gray-400 text-[2vh] lg:text-[0.7vw]">
          Step 2 of 5
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-[1.5vh] lg:gap-[0.5vw] justify-center px-[2vh] lg:px-[0.8vw]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={clsx(
              'px-[3vh] lg:px-[1vw] py-[1vh] lg:py-[0.3vw] rounded-full font-medium transition-all duration-300 text-[1.8vh] lg:text-[0.6vw]',
              selectedCategory === category
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            )}
          >
            {category === 'all' ? 'All Items' : category}
          </button>
        ))}
      </div>

      {/* Horizontal Slider for Selected Category */}
      <div className="relative">
        <div className="flex items-center justify-between px-[2vh] lg:px-[1vw] mb-[2vh] lg:mb-[0.8vw]">
          <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.5vw]">
            <h3 className="text-[2.2vh] lg:text-[0.9vw] font-medium text-gray-300">
              {selectedCategory === 'all' ? 'All Menu Items' : selectedCategory}
            </h3>
            <span className="bg-teal-500/20 text-teal-400 px-[1.5vh] lg:px-[0.5vw] py-[0.5vh] lg:py-[0.2vw] rounded-full text-[1.4vh] lg:text-[0.6vw] font-medium">
              {filteredItems.length} items
            </span>
          </div>
          {filteredItems.length > 4 && (
            <div className="text-gray-400 text-[1.4vh] lg:text-[0.6vw] flex items-center space-x-[0.5vh] lg:space-x-[0.2vw]">
              <span>Scroll to see more</span>
              <svg className="w-[1.8vh] h-[1.8vh] lg:w-[0.8vw] lg:h-[0.8vw] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )}
        </div>

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
              640: {
                spaceBetween: 20,
              },
              1024: {
                spaceBetween: 24,
              },
            }}
            className="food-swiper"
            style={{
              paddingLeft: '2vh',
              paddingRight: '2vh'
            }}
          >
            {filteredItems.map((item) => {
              const quantity = getItemQuantity(item.id)
              
              return (
                <SwiperSlide key={item.id} style={{ width: '26vh', minWidth: '26vh' }}>
                  <div className="bg-slate-800 border border-slate-600 hover:border-slate-500 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-lg">
                    {/* Food Image */}
                    <div className="h-[12vh] lg:h-[6vw] bg-slate-700 overflow-hidden relative">
                      <img 
                        src={item.image || getFoodFallbackImage(item.category)}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.src = getFoodFallbackImage(item.category)
                        }}
                      />
                      {/* Price Badge */}
                      <div className="absolute top-[0.8vh] lg:top-[0.4vw] right-[0.8vh] lg:right-[0.4vw]">
                        <div className="bg-teal-600 px-[1vh] lg:px-[0.4vw] py-[0.5vh] lg:py-[0.2vw] rounded text-white text-[1.2vh] lg:text-[0.6vw] font-semibold">
                          ${item.price}
                        </div>
                      </div>
                      {/* Quantity Badge */}
                      {quantity > 0 && (
                        <div className="absolute top-[0.8vh] lg:top-[0.4vw] left-[0.8vh] lg:left-[0.4vw]">
                          <div className="bg-green-500 w-[2.5vh] h-[2.5vh] lg:w-[1.2vw] lg:h-[1.2vw] rounded-full flex items-center justify-center text-white text-[1.2vh] lg:text-[0.6vw] font-bold">
                            {quantity}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Food Details */}
                    <div className="p-[1.5vh] lg:p-[0.8vw] space-y-[1vh] lg:space-y-[0.4vw]">
                      {/* Name */}
                      <h4 className="text-white font-semibold text-[1.8vh] lg:text-[0.8vw] leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      
                      {/* Description */}
                      <p className="text-gray-400 text-[1.3vh] lg:text-[0.6vw] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between pt-[0.5vh] lg:pt-[0.2vw]">
                        <span className="text-gray-300 text-[1.3vh] lg:text-[0.6vw]">Qty:</span>
                        <div className="flex items-center space-x-[1vh] lg:space-x-[0.4vw]">
                          <button
                            onClick={() => updateItemQuantity(item.id, Math.max(0, quantity - 1), item.price)}
                            disabled={quantity === 0}
                            className="w-[3vh] h-[3vh] lg:w-[1.2vw] lg:h-[1.2vw] bg-slate-600 text-white rounded-full flex items-center justify-center hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[1.4vh] lg:text-[0.6vw]"
                          >
                            -
                          </button>
                          <span className="w-[3vh] lg:w-[1.2vw] text-center font-bold text-white text-[1.4vh] lg:text-[0.6vw]">{quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, quantity + 1, item.price)}
                            className="w-[3vh] h-[3vh] lg:w-[1.2vw] lg:h-[1.2vw] bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors text-[1.4vh] lg:text-[0.6vw]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal - Always present to maintain consistent height */}
                      <div className={`text-right font-medium text-[1.3vh] lg:text-[0.6vw] pt-[0.5vh] lg:pt-[0.2vw] min-h-[2.5vh] lg:min-h-[1.2vw] ${
                        quantity > 0 
                          ? 'text-teal-400 border-t border-slate-700' 
                          : 'text-transparent'
                      }`}>
                        {quantity > 0 ? `$${(quantity * item.price).toFixed(2)}` : '$0.00'}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>



      {/* Navigation */}
      <div className="flex justify-between pt-[3vh] lg:pt-[1vw] max-w-[160vh] lg:max-w-[80vw] mx-auto px-[2vh] lg:px-[0.8vw]">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          className="px-[4vh] lg:px-[1.5vw] py-[1.5vh] lg:py-[0.5vw] text-[2vh] lg:text-[0.7vw]"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedItems.length === 0}
          size="lg"
          className="px-[4vh] lg:px-[1.5vw] py-[1.5vh] lg:py-[0.5vw] text-[2vh] lg:text-[0.7vw]"
        >
          Next
        </Button>
      </div>
    </div>
  )
}