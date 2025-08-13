'use client'

import { useState, useEffect } from 'react'
import { BookingFormData } from '@/types/booking'
import { useGetFoodCartByIdQuery } from '@/lib/api/foodCartsApi'
import Button from '@/components/ui/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import { Check, ChefHat, Users, Wrench, Star, Crown, ShoppingCart, Coffee, Plus, Minus, SkipForward, X, Package } from 'lucide-react'
import ExtrasSkeleton from '@/components/ui/skeletons/ExtrasSkeleton'
import { clsx } from 'clsx'
import 'swiper/css'
import 'swiper/css/free-mode'
import { useI18n } from '@/lib/i18n/context'

interface ExtrasStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

// Service category icons
const SERVICE_ICONS = {
  STAFF: Users,
  KITCHEN: ChefHat,
  SUPPORT: Wrench,
  MANAGEMENT: Star,
  SPECIAL: Crown
} as const

interface CartItem {
  id: string
  type: 'food' | 'service' | 'extras'
  name: string
  price: number
  quantity: number
  image?: string
  category?: string
}

export default function ExtrasStep({ formData, updateFormData, onNext, onPrevious }: ExtrasStepProps) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<'food' | 'services'>('food')
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Use RTK Query to fetch cart data with food items and services
  const {
    data: cartData,
    isLoading: loading,
    error
  } = useGetFoodCartByIdQuery(formData.selectedCartId!, {
    skip: !formData.selectedCartId
  })

  const foodItems = cartData?.foodItems || []
  const services = cartData?.services || []

  // Initialize cart with default extras item and existing form data
  useEffect(() => {
    const initialCart: CartItem[] = []
    
    // Always add default "Extras" item
    initialCart.push({
      id: 'default-extras',
      type: 'extras',
      name: t('extras'),
      price: 10,
      quantity: 1
    })
    
    // Add existing food items if cart data is available
    if (cartData?.foodItems && formData.selectedItems && formData.selectedItems.length > 0) {
      formData.selectedItems.forEach(item => {
        const foodItem = cartData.foodItems?.find(f => f.id === item.itemId)
        if (foodItem) {
          initialCart.push({
            id: item.itemId,
            type: 'food',
            name: foodItem.name,
            price: item.price,
            quantity: item.quantity,
            image: foodItem.image
          })
        }
      })
    }

    // Add existing services if cart data is available
    if (cartData?.services && formData.selectedServices && formData.selectedServices.length > 0) {
      formData.selectedServices.forEach(service => {
        const serviceItem = cartData.services?.find(s => s.id === service.serviceId)
        if (serviceItem) {
          initialCart.push({
            id: service.serviceId,
            type: 'service',
            name: serviceItem.name,
            price: service.price,
            quantity: service.quantity,
            category: serviceItem.category
          })
        }
      })
    }

    setCartItems(initialCart)
  }, [cartData?.id, formData.selectedCartId]) // Only depend on stable IDs

  // Helper function to get item quantity in cart
  const getItemQuantityInCart = (id: string, type: 'food' | 'service') => {
    const item = cartItems.find(item => item.id === id && item.type === type)
    return item ? item.quantity : 0
  }

  // Add item to cart
  const addToCart = (id: string, type: 'food' | 'service', name: string, price: number, image?: string, category?: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === id && item.type === type)
      
      if (existingItem) {
        return prev.map(item =>
          item.id === id && item.type === type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prev, { id, type, name, price, quantity: 1, image, category }]
    })
  }

  // Remove item from cart
  const removeFromCart = (id: string, type: string) => {
    if (id === 'default-extras') return // Can't remove default extras
    
    setCartItems(prev => prev.filter(item => !(item.id === id && item.type === type)))
  }

  // Update cart item quantity
  const updateCartItemQuantity = (id: string, type: string, newQuantity: number) => {
    // For extras, allow quantity changes but minimum 1
    if (id === 'default-extras' && newQuantity < 1) return
    
    if (newQuantity <= 0 && id !== 'default-extras') {
      removeFromCart(id, type)
      return
    }
    
    setCartItems(prev => prev.map(item =>
      item.id === id && item.type === type
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  // Calculate totals (excluding extras from total)
  const foodCartItems = cartItems.filter(item => item.type === 'food')
  const serviceCartItems = cartItems.filter(item => item.type === 'service')
  const extrasCartItems = cartItems.filter(item => item.type === 'extras')
  
  const foodTotal = foodCartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const servicesTotal = serviceCartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  
  // Exclude extras from grand total calculation
  const grandTotal = foodTotal + servicesTotal
  const totalItems = foodCartItems.reduce((sum, item) => sum + item.quantity, 0) + serviceCartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Save cart data to form before proceeding
  const handleNext = () => {
    const foodItemsData = cartItems
      .filter(item => item.type === 'food')
      .map(item => ({
        itemId: item.id,
        quantity: item.quantity,
        price: item.price
      }))

    const servicesData = cartItems
      .filter(item => item.type === 'service')
      .map(item => ({
        serviceId: item.id,
        quantity: item.quantity,
        price: item.price
      }))

    updateFormData({
      selectedItems: foodItemsData,
      selectedServices: servicesData
    })
    
    onNext()
  }

  // Skip extras
  const handleSkip = () => {
    updateFormData({
      selectedItems: [],
      selectedServices: []
    })
    onNext()
  }

  if (loading) {
    return <ExtrasSkeleton />
  }

  // Check if we have items to show
  const hasItems = foodItems.length > 0 || services.length > 0

      return (
      <div className="space-y-[1vh] lg:space-y-[0.5vw]">
        <div className="text-center">
          <h2 className="text-[3.5vh] lg:text-[1.4vw] font-bold text-white mb-[1vh] lg:mb-[0.3vw]">
            {t('step_extras_title')}
          </h2>
          <p className="text-gray-400 text-[1.8vh] lg:text-[0.9vw]">{t('extras_step_2_of_5')}</p>
          {/* <p className="text-gray-300 text-[1.6vh] lg:text-[0.8vw] mt-[1vh] lg:mt-[0.5vw]">
            Add food items and services to your booking (optional)
          </p> */}
        </div>

        {/* Browse Area - Full Width Above */}
        <div className="space-y-[1vh] lg:space-y-[0.5vw]">
        {/* Tab Navigation - Only show if items exist */}
        {hasItems && (
          <div className="flex space-x-[1vh] lg:space-x-[0.5vw] bg-slate-800/60 backdrop-blur-sm rounded-lg p-[1vh] lg:p-[0.5vw] border border-slate-600/50">
            {foodItems.length > 0 && (
              <button
                onClick={() => setActiveTab('food')}
                className={clsx(
                  'flex-1 flex items-center justify-center space-x-[1vh] lg:space-x-[0.5vw] py-[1.5vh] lg:py-[0.8vw] px-[2vh] lg:px-[1vw] rounded-md transition-all duration-300 text-[1.6vh] lg:text-[0.8vw] font-medium',
                  activeTab === 'food'
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-slate-700/50'
                )}
              >
                <Coffee className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw]" />
                <span>{t('food_count').replace('{count}', foodItems.length.toString())}</span>
              </button>
            )}
            
            {services.length > 0 && (
              <button
                onClick={() => setActiveTab('services')}
                className={clsx(
                  'flex-1 flex items-center justify-center space-x-[1vh] lg:space-x-[0.5vw] py-[1.5vh] lg:py-[0.8vw] px-[2vh] lg:px-[1vw] rounded-md transition-all duration-300 text-[1.6vh] lg:text-[0.8vw] font-medium',
                  activeTab === 'services'
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-slate-700/50'
                )}
              >
                <Users className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw]" />
                <span>{t('services_count').replace('{count}', services.length.toString())}</span>
              </button>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className="min-h-[10vh] lg:min-h-[5vw]">
          {activeTab === 'food' && (
            <div className="space-y-[2vh] lg:space-y-[1vw]">
              {foodItems.length === 0 ? (
                <div className="text-center py-[4vh] lg:py-[2vw]">
                  <ShoppingCart className="w-[6vh] h-[6vh] lg:w-[3vw] lg:h-[3vw] text-gray-400 mx-auto mb-[2vh] lg:mb-[1vw]" />
                  <p className="text-gray-400 text-[1.8vh] lg:text-[0.9vw]">{t('no_extras_available')}</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <Swiper
                    modules={[FreeMode, Mousewheel]}
                    spaceBetween={16}
                    slidesPerView="auto"
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
                    className="food-swiper"
                    style={{
                      paddingLeft: '2vh',
                      paddingRight: '2vh'
                    }}
                  >
                    {foodItems.map((item) => {
                      const quantityInCart = getItemQuantityInCart(item.id, 'food')
                      
                      return (
                        <SwiperSlide key={item.id} style={{ width: '24vh', minWidth: '24vh' }}>
                          <div className="bg-slate-800 border border-slate-600 hover:border-slate-500 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-lg relative">
                            
                            {/* Cart Badge */}
                            {quantityInCart > 0 && (
                              <div className="absolute top-[0.8vh] lg:top-[0.4vw] right-[0.8vh] lg:right-[0.4vw] z-10">
                                <div className="w-[2.5vh] h-[2.5vh] lg:w-[1.2vw] lg:h-[1.2vw] rounded-full bg-green-500 flex items-center justify-center">
                                  <span className="text-white text-[1.2vh] lg:text-[0.6vw] font-bold">{quantityInCart}</span>
                                </div>
                              </div>
                            )}

                            {/* Food Image */}
                            <div className="relative h-[10vh] lg:h-[5vw] bg-slate-700 overflow-hidden">
                              <img
                                src={item.image || 'https://via.placeholder.com/300x200?text=Food+Item'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Price Badge */}
                              <div className="absolute top-[0.8vh] lg:top-[0.4vw] left-[0.8vh] lg:left-[0.4vw]">
                                <div className="bg-teal-600 px-[1vh] lg:px-[0.5vw] py-[0.4vh] lg:py-[0.2vw] rounded text-white text-[1.2vh] lg:text-[0.6vw] font-semibold">
                                  ${item.price}
                                </div>
                              </div>
                            </div>

                            {/* Food Details */}
                            <div className="p-[1.5vh] lg:p-[0.8vw] space-y-[1vh] lg:space-y-[0.5vw]">
                              <div>
                                <h3 className="text-white font-semibold text-[1.4vh] lg:text-[0.7vw] leading-tight line-clamp-2">
                                  {item.name}
                                </h3>
                              </div>
                              
                              <p className="text-gray-400 text-[1.1vh] lg:text-[0.55vw] leading-relaxed line-clamp-2">
                                {item.description}
                              </p>

                              {/* Add to Cart Button */}
                              <Button
                                onClick={() => addToCart(item.id, 'food', item.name, item.price, item.image)}
                                size="sm"
                                className="w-full text-[1.3vh] lg:text-[0.65vw] py-[0.8vh] lg:py-[0.4vw]"
                              >
                                <Plus className="w-[1.4vh] h-[1.4vh] lg:w-[0.7vw] lg:h-[0.7vw] mr-[0.5vh] lg:mr-[0.3vw]" />
                                {t('add_to_cart')}
                              </Button>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-[2vh] lg:space-y-[1vw]">
              {services.length === 0 ? (
                <div className="text-center py-[4vh] lg:py-[2vw]">
                  <Users className="w-[6vh] h-[6vh] lg:w-[3vw] lg:h-[3vw] text-gray-400 mx-auto mb-[2vh] lg:mb-[1vw]" />
                  <p className="text-gray-400 text-[1.8vh] lg:text-[0.9vw]">{t('no_services_available_cart')}</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <Swiper
                    modules={[FreeMode, Mousewheel]}
                    spaceBetween={16}
                    slidesPerView="auto"
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
                    className="services-swiper"
                    style={{
                      paddingLeft: '2vh',
                      paddingRight: '2vh'
                    }}
                  >
                    {services.map((service) => {
                      const Icon = SERVICE_ICONS[service.category] || Users
                      const quantityInCart = getItemQuantityInCart(service.id, 'service')
                      
                      return (
                        <SwiperSlide key={service.id} style={{ width: '24vh', minWidth: '24vh' }}>
                          <div className="bg-slate-800 border border-slate-600 hover:border-slate-500 rounded-lg p-[2vh] lg:p-[1vw] shadow-sm hover:shadow-md transition-all duration-300 h-full relative">
                            
                            {/* Cart Badge */}
                            {quantityInCart > 0 && (
                              <div className="absolute top-[0.8vh] lg:top-[0.4vw] right-[0.8vh] lg:right-[0.4vw] z-10">
                                <div className="w-[2.5vh] h-[2.5vh] lg:w-[1.2vw] lg:h-[1.2vw] rounded-full bg-green-500 flex items-center justify-center">
                                  <span className="text-white text-[1.2vh] lg:text-[0.6vw] font-bold">{quantityInCart}</span>
                                </div>
                              </div>
                            )}

                            <div className="space-y-[1.5vh] lg:space-y-[0.8vw] h-full flex flex-col">
                              {/* Service Icon & Category */}
                              <div className="flex items-center justify-between">
                                <div className="w-[5vh] h-[5vh] lg:w-[2.5vw] lg:h-[2.5vw] bg-teal-600 rounded-lg flex items-center justify-center">
                                  <Icon className="w-[2.5vh] h-[2.5vh] lg:w-[1.2vw] lg:h-[1.2vw] text-white" />
                                </div>
                                <div className="bg-teal-600 px-[1vh] lg:px-[0.5vw] py-[0.4vh] lg:py-[0.2vw] rounded text-white text-[1.2vh] lg:text-[0.6vw] font-semibold">
                                  ${service.pricePerHour}
                                </div>
                              </div>

                              {/* Service Details */}
                              <div className="flex-1">
                                <h3 className="text-white font-semibold text-[1.4vh] lg:text-[0.7vw] leading-tight mb-[0.5vh] lg:mb-[0.3vw] line-clamp-2">
                                  {service.name}
                                </h3>
                                <p className="text-gray-400 text-[1.1vh] lg:text-[0.55vw] leading-relaxed line-clamp-3">
                                  {service.description}
                                </p>
                              </div>

                              {/* Add to Cart Button */}
                              <Button
                                onClick={() => addToCart(service.id, 'service', service.name, service.pricePerHour, undefined, service.category)}
                                size="sm"
                                className="w-full text-[1.3vh] lg:text-[0.65vw] py-[0.8vh] lg:py-[0.4vw] mt-auto"
                              >
                                <Plus className="w-[1.4vh] h-[1.4vh] lg:w-[0.7vw] lg:h-[0.7vw] mr-[0.5vh] lg:mr-[0.3vw]" />
                                {t('add_to_cart')}
                              </Button>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>
              )}
            </div>
          )}

          {/* No Items Available */}
          {/* {!hasItems && (
            <div className="text-center py-[6vh] lg:py-[3vw]">
              <Package className="w-[8vh] h-[8vh] lg:w-[4vw] lg:h-[4vw] text-gray-400 mx-auto mb-[2vh] lg:mb-[1vw]" />
                        <h3 className="text-white text-[2.2vh] lg:text-[1.1vw] font-semibold mb-[1vh] lg:mb-[0.5vw]">{t('no_items_available_title')}</h3>
          <p className="text-gray-400 text-[1.6vh] lg:text-[0.8vw]">{t('no_items_available_desc')}</p>
            </div>
          )} */}
        </div>
      </div>

      {/* Simple Cart List */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[2vh] lg:p-[1vw]">
          <div className="space-y-[1.5vh] lg:space-y-[0.8vw]">
            {cartItems.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center justify-between py-[1vh] lg:py-[0.5vw] border-b border-slate-700 last:border-b-0">
                <div className="flex-1">
                  <h4 className="text-white font-medium text-[1.4vh] lg:text-[0.7vw]">{item.name}</h4>
                  {item.type !== 'extras' && (
                    <p className="text-gray-400 text-[1.2vh] lg:text-[0.6vw] capitalize">{item.type}</p>
                  )}
                </div>
                
                {/* Quantity controls for all items */}
                <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                  <button
                    onClick={() => updateCartItemQuantity(item.id, item.type, item.quantity - 1)}
                    className="w-[2.2vh] h-[2.2vh] lg:w-[1.1vw] lg:h-[1.1vw] bg-slate-600 text-white rounded-full flex items-center justify-center hover:bg-slate-500 transition-colors"
                  >
                    <Minus className="w-[1vh] h-[1vh] lg:w-[0.5vw] lg:h-[0.5vw]" />
                  </button>
                  <span className="text-white font-medium text-[1.3vh] lg:text-[0.65vw] min-w-[2vh] lg:min-w-[1vw] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartItemQuantity(item.id, item.type, item.quantity + 1)}
                    className="w-[2.2vh] h-[2.2vh] lg:w-[1.1vw] lg:h-[1.1vw] bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                  >
                    <Plus className="w-[1vh] h-[1vh] lg:w-[0.5vw] lg:h-[0.5vw]" />
                  </button>
                  {item.type !== 'extras' && (
                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-[0.3vh] lg:p-[0.15vw] ml-[1vh] lg:ml-[0.5vw]"
                    >
                      <X className="w-[1.4vh] h-[1.4vh] lg:w-[0.7vw] lg:h-[0.7vw]" />
                    </button>
                  )}
                </div>
                
                <div className="text-right ml-[2vh] lg:ml-[1vw]">
                  <span className="text-white font-semibold text-[1.4vh] lg:text-[0.7vw]">
                    €{(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Total */}
            <div className="flex items-center justify-between pt-[1vh] lg:pt-[0.5vw] border-t border-slate-600">
              <span className="text-white font-semibold text-[1.6vh] lg:text-[0.8vw]">{t('total')}</span>
              <span className="text-teal-400 font-bold text-[1.8vh] lg:text-[0.9vw]">
                €{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-[1vh] lg:gap-[0.5vw]">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="md"
          className="px-[3vh] lg:px-[2vw] py-[1vh] lg:py-[0.6vw] text-[1.6vh] lg:text-[0.9vw] font-semibold"
        >
          {t('previous')}
        </Button>

        <div className="flex space-x-[1vh] lg:space-x-[0.5vw]">
          <Button
            variant="outline"
            onClick={handleSkip}
            size="md"
            className="px-[3vh] lg:px-[1.5vw] py-[1.2vh] lg:py-[0.6vw] text-[1.6vh] lg:text-[0.8vw] font-medium flex items-center space-x-[0.5vh] lg:space-x-[0.3vw]"
          >
            <SkipForward className="w-[1.8vh] h-[1.8vh] lg:w-[0.9vw] lg:h-[0.9vw]" />
            <span>{t('skip')}</span>
          </Button>
          
          <Button
            onClick={handleNext}
            size="md"
            className="px-[3vh] lg:px-[2vw] py-[1vh] lg:py-[0.6vw] text-[1.6vh] lg:text-[0.9vw] font-semibold"
          >
            {t('continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}