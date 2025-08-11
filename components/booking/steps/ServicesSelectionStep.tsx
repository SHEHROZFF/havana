'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { BookingFormData, Service, ServiceCategory } from '@/types/booking'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'
import { useGetServicesQuery } from '../../../lib/api/servicesApi'
import { Users, ChefHat, Wrench, ClipboardList, Star, Store, Check } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

interface ServicesSelectionStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

const SERVICE_ICONS = {
  STAFF: Users,
  KITCHEN: ChefHat,
  SUPPORT: Wrench,
  MANAGEMENT: ClipboardList,
  SPECIAL: Star
}

const SERVICE_COLORS = {
  STAFF: 'from-blue-500 to-blue-600',
  KITCHEN: 'from-red-500 to-red-600', 
  SUPPORT: 'from-green-500 to-green-600',
  MANAGEMENT: 'from-purple-500 to-purple-600',
  SPECIAL: 'from-yellow-500 to-yellow-600'
}

export default function ServicesSelectionStep({ formData, updateFormData, onNext, onPrevious }: ServicesSelectionStepProps) {
  const [selectedServices, setSelectedServices] = useState(formData.selectedServices || [])
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all')
  const swiperRef = useRef<any>(null)

  // RTK Query hook
  const {
    data: services = [],
    isLoading: loading,
    error
  } = useGetServicesQuery({ 
    cartId: formData.selectedCartId 
  }, {
    skip: !formData.selectedCartId
  })

  const categories: (ServiceCategory | 'all')[] = ['all', 'STAFF', 'KITCHEN', 'SUPPORT', 'MANAGEMENT', 'SPECIAL']
  
  const filteredServices = useMemo(() => {
    return selectedCategory === 'all' ? services : services.filter(service => service.category === selectedCategory)
  }, [selectedCategory, services])

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

  const getServiceQuantity = (serviceId: string) => {
    const service = selectedServices.find(s => s.serviceId === serviceId)
    return service ? service.quantity : 0
  }

  const getServiceHours = (serviceId: string) => {
    const service = selectedServices.find(s => s.serviceId === serviceId)
    return service ? service.hours : 4
  }

  const updateServiceSelection = (serviceId: string, quantity: number, pricePerHour: number, hours: number = 4) => {
    let newSelectedServices = [...selectedServices]
    const existingIndex = newSelectedServices.findIndex(s => s.serviceId === serviceId)
    
    if (quantity === 0) {
      if (existingIndex > -1) {
        newSelectedServices.splice(existingIndex, 1)
      }
    } else {
      if (existingIndex > -1) {
        newSelectedServices[existingIndex] = { serviceId, quantity, hours, pricePerHour }
      } else {
        newSelectedServices.push({ serviceId, quantity, hours, pricePerHour })
      }
    }
    
    setSelectedServices(newSelectedServices)
    const servicesAmount = newSelectedServices.reduce((sum, service) => sum + (service.quantity * service.hours * service.pricePerHour), 0)
    updateFormData({ selectedServices: newSelectedServices, servicesAmount })
  }

  const updateServiceHours = (serviceId: string, hours: number) => {
    const existingService = selectedServices.find(s => s.serviceId === serviceId)
    if (existingService) {
      updateServiceSelection(serviceId, existingService.quantity, existingService.pricePerHour, hours)
    }
  }

  const handleNext = () => {
    onNext()
  }

  if (loading) {
    return (
      <div className="text-center py-[8vh] lg:py-[4vw]">
        <div className="animate-spin rounded-full h-[8vh] w-[8vh] lg:h-[4vw] lg:w-[4vw] border-4 border-teal-500 border-t-transparent mx-auto mb-[2vh] lg:mb-[1vw]"></div>
        <p className="text-white text-[2.5vh] lg:text-[1.2vw]">Loading services...</p>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-[8vh] lg:py-[4vw]">
        <div className="text-[6vh] lg:text-[3vw] mb-[2vh] lg:mb-[1vw]">🎪</div>
        <h2 className="text-[3vh] lg:text-[1.5vw] font-bold text-white mb-[2vh] lg:mb-[1vw]">No Services Available</h2>
        <p className="text-gray-400 mb-[4vh] lg:mb-[2vw] text-[2vh] lg:text-[1vw] px-[4vh] lg:px-[2vw]">
          This food cart doesn't have any additional services set up yet.
          <br />
          You can proceed without selecting any services.
        </p>
        <div className="flex justify-between max-w-[160vh] lg:max-w-[80vw] mx-auto px-[2vh] lg:px-[1vw]">
          <Button
            variant="outline"
            onClick={onPrevious}
            size="md"
            className="px-[3vh] lg:px-[1.5vw] py-[1vh] lg:py-[0.5vw] text-[1.6vh] lg:text-[0.8vw] font-semibold"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            size="md"
            className="px-[3vh] lg:px-[1.5vw] py-[1vh] lg:py-[0.5vw] text-[1.6vh] lg:text-[0.8vw] font-semibold"
          >
            Skip Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-[3vh] lg:space-y-[1vw]">
      <div className="text-center">
        <h2 className="text-[3.5vh] lg:text-[1.4vw] font-bold text-white mb-[1vh] lg:mb-[0.3vw]">
          Select Additional Services
        </h2>
        <p className="text-gray-400 text-[2vh] lg:text-[0.7vw]">
          Step 3 of 5
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-[1.5vh] lg:gap-[0.5vw] justify-center px-[2vh] lg:px-[0.8vw]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={clsx(
              'px-[3vh] lg:px-[1vw] py-[1vh] lg:py-[0.3vw] rounded-full font-medium transition-all duration-300 text-[1.8vh] lg:text-[0.6vw] flex items-center space-x-[1vh] lg:space-x-[0.3vw]',
              selectedCategory === category
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            )}
          >
            {category === 'all' ? (
              <Store className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
            ) : (
              (() => {
                const IconComponent = SERVICE_ICONS[category as ServiceCategory]
                return <IconComponent className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
              })()
            )}
            <span>{category === 'all' ? 'All Services' : category}</span>
          </button>
        ))}
      </div>

      {/* Horizontal Slider for Selected Category */}
      <div className="relative">
        <div className="flex items-center justify-between px-[2vh] lg:px-[1vw] mb-[2vh] lg:mb-[0.8vw]">
          <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.5vw]">
            <h3 className="text-[2.2vh] lg:text-[0.9vw] font-medium text-gray-300">
              {selectedCategory === 'all' ? 'All Services' : selectedCategory}
            </h3>
            <span className="bg-teal-500/20 text-teal-400 px-[1.5vh] lg:px-[0.5vw] py-[0.5vh] lg:py-[0.2vw] rounded-full text-[1.4vh] lg:text-[0.6vw] font-medium">
              {filteredServices.length} services
            </span>
          </div>
          {filteredServices.length > 4 && (
            <div className="text-gray-400 text-[1.4vh] lg:text-[0.6vw] flex items-center space-x-[0.5vh] lg:space-x-[0.2vw]">
              <span>Swipe to see more</span>
              <svg className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )}
        </div>

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
              className="services-swiper"
              style={{
                paddingLeft: '2vh',
                paddingRight: '2vh'
              }}
            >
              {filteredServices.map((service) => {
                const quantity = getServiceQuantity(service.id)
                const hours = getServiceHours(service.id)
                const totalPrice = quantity * hours * service.pricePerHour
                
                return (
                  <SwiperSlide key={service.id} style={{ width: '26vh', minWidth: '26vh' }}>
                    <div className={clsx(
                      'relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden group flex-shrink-0',
                      'bg-slate-800 border shadow-sm hover:shadow-md',
                      quantity > 0 
                        ? 'border-green-500 ring-2 ring-green-500/20' 
                        : 'border-slate-600 hover:border-slate-500'
                    )}>
                      {/* Selection Badge */}
                      {quantity > 0 && (
                        <div className="absolute top-[0.8vh] lg:top-[0.4vw] right-[0.8vh] lg:right-[0.4vw] z-10">
                          <div className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] text-white" />
                          </div>
                        </div>
                      )}

                      {/* Service Icon Header */}
                      <div className="relative h-[12vh] lg:h-[6vw] bg-slate-700 overflow-hidden flex items-center justify-center">
                        {(() => {
                          const IconComponent = SERVICE_ICONS[service.category]
                          return <IconComponent className="w-[5vh] h-[5vh] lg:w-[2.5vw] lg:h-[2.5vw] text-teal-400" />
                        })()}
                        
                        {/* Price Badge */}
                        <div className="absolute top-[0.8vh] lg:top-[0.4vw] left-[0.8vh] lg:left-[0.4vw]">
                          <div className="bg-teal-600 px-[1vh] lg:px-[0.5vw] py-[0.4vh] lg:py-[0.2vw] rounded text-white text-[1.2vh] lg:text-[0.6vw] font-semibold">
                            ${service.pricePerHour}/hr
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute bottom-[0.8vh] lg:bottom-[0.4vw] right-[0.8vh] lg:right-[0.4vw]">
                          <div className="bg-slate-600 px-[0.8vh] lg:px-[0.4vw] py-[0.3vh] lg:py-[0.15vw] rounded text-gray-300 text-[1vh] lg:text-[0.5vw] font-medium">
                            {service.category}
                          </div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="p-[1.5vh] lg:p-[0.8vw] space-y-[1vh] lg:space-y-[0.5vw]">
                        {/* Service Name */}
                        <div>
                          <h3 className="text-white font-semibold text-[1.6vh] lg:text-[0.8vw] leading-tight line-clamp-2">
                            {service.name}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-[1.2vh] lg:text-[0.6vw] leading-relaxed line-clamp-2">
                          {service.description}
                        </p>

                        {/* Staff Count and Hours Controls */}
                        <div className="space-y-[0.8vh] lg:space-y-[0.4vw]">
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-[1.3vh] lg:text-[0.6vw]">Staff Count:</span>
                            <div className="flex items-center space-x-[0.8vh] lg:space-x-[0.4vw]">
                              <button
                                onClick={() => updateServiceSelection(service.id, Math.max(0, quantity - 1), service.pricePerHour, hours)}
                                disabled={quantity === 0}
                                className="w-[3vh] h-[3vh] lg:w-[1.2vw] lg:h-[1.2vw] bg-slate-500 text-white rounded-full flex items-center justify-center hover:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[1.4vh] lg:text-[0.6vw]"
                              >
                                -
                              </button>
                              <span className="w-[4vh] lg:w-[1.5vw] text-center font-bold text-white text-[1.4vh] lg:text-[0.7vw]">{quantity}</span>
                              <button
                                onClick={() => updateServiceSelection(service.id, quantity + 1, service.pricePerHour, hours)}
                                className="w-[3vh] h-[3vh] lg:w-[1.2vw] lg:h-[1.2vw] bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors text-[1.4vh] lg:text-[0.6vw]"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Hours Controls */}
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-[1.3vh] lg:text-[0.6vw]">Hours:</span>
                            <div className="flex items-center space-x-[0.8vh] lg:space-x-[0.4vw]">
                              <button
                                onClick={() => updateServiceHours(service.id, Math.max(1, hours - 1))}
                                disabled={quantity === 0 || hours <= 1}
                                className="w-[3vh] h-[3vh] lg:w-[1.2vw] lg:h-[1.2vw] bg-slate-500 text-white rounded-full flex items-center justify-center hover:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[1.4vh] lg:text-[0.6vw]"
                              >
                                -
                              </button>
                              <span className="w-[4vh] lg:w-[1.5vw] text-center font-bold text-white text-[1.4vh] lg:text-[0.7vw]">{hours}h</span>
                              <button
                                onClick={() => updateServiceHours(service.id, Math.min(24, hours + 1))}
                                disabled={quantity === 0 || hours >= 24}
                                className="w-[3vh] h-[3vh] lg:w-[1.2vw] lg:h-[1.2vw] bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[1.4vh] lg:text-[0.6vw]"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Total Cost - Always present to maintain height */}
                        <div className={`text-right font-medium text-[1.3vh] lg:text-[0.6vw] pt-[0.5vh] lg:pt-[0.2vw] min-h-[2.5vh] lg:min-h-[1.2vw] ${
                          quantity > 0 
                            ? 'text-teal-400 border-t border-slate-700' 
                            : 'text-transparent'
                        }`}>
                          {quantity > 0 ? `$${totalPrice.toFixed(2)}` : '$0.00'}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="text-center space-y-[1.5vh] lg:space-y-[0.8vw] pt-[2vh] lg:pt-[1vw] max-w-[160vh] lg:max-w-[80vw] mx-auto px-[2vh] lg:px-[0.8vw]">
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
            onClick={handleNext}
            size="md"
            className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold"
          >
            {selectedServices.length > 0 ? (
              <div className="flex items-center">
                <Check className="w-[1.8vh] h-[1.8vh] lg:w-[0.9vw] lg:h-[0.9vw] mr-[0.8vh] lg:mr-[0.4vw]" />
                Continue with Services
              </div>
            ) : (
              'Skip Services'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}