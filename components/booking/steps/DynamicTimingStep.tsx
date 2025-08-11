'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { BookingFormData, TimeSlot } from '@/types/booking'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'
import { useGetAvailabilityQuery } from '../../../lib/api/bookingsApi'
import { useGetFoodCartByIdQuery } from '../../../lib/api/foodCartsApi'
import { Target, AlertTriangle, Clock, Calendar, Check, Sunrise, Sun, Moon, Star } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

interface DynamicTimingStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function DynamicTimingStep({ formData, updateFormData, onNext, onPrevious }: DynamicTimingStepProps) {
  const [selectedDate, setSelectedDate] = useState(formData.bookingDate || '')
  const [selectedStartTime, setSelectedStartTime] = useState(formData.startTime || '')
  const [selectedEndTime, setSelectedEndTime] = useState(formData.endTime || '')
  const [selectedPresetSlot, setSelectedPresetSlot] = useState(formData.timeSlotType || '')
  const [selectedCategory, setSelectedCategory] = useState<'preset' | 'custom'>('preset')
  const swiperRef = useRef<any>(null)

  // Use RTK Query to check availability
  const {
    data: availabilityData,
    isLoading: loading,
    error
  } = useGetAvailabilityQuery(
    { 
      cartId: formData.selectedCartId!, 
      date: selectedDate 
    },
    { 
      skip: !formData.selectedCartId || !selectedDate 
    }
  )

  // Fetch cart data to get pricePerHour
  const {
    data: cartData,
    isLoading: cartLoading
  } = useGetFoodCartByIdQuery(formData.selectedCartId!, {
    skip: !formData.selectedCartId
  })

  const conflicts = availabilityData?.bookedSlots?.map(slot => `${slot.startTime}-${slot.endTime}`) || []

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

  // Preset time slots for quick selection (with dynamic pricing)
  const presetSlots = useMemo(() => {
    const cartPricePerHour = cartData?.pricePerHour || 150
    return [
      { id: 'morning', name: 'Morning Event', startTime: '09:00', endTime: '13:00', hours: 4, price: cartPricePerHour * 4, description: 'Perfect for brunch events', icon: Sunrise },
      { id: 'afternoon', name: 'Afternoon Event', startTime: '14:00', endTime: '18:00', hours: 4, price: cartPricePerHour * 4, description: 'Ideal for lunch gatherings', icon: Sun },
      { id: 'evening', name: 'Evening Event', startTime: '19:00', endTime: '23:00', hours: 4, price: cartPricePerHour * 4, description: 'Great for dinner parties', icon: Moon },
      { id: 'full-day', name: 'Full Day Event', startTime: '10:00', endTime: '22:00', hours: 12, price: cartPricePerHour * 12, description: 'Complete event coverage', icon: Star },
    ]
  }, [cartData?.pricePerHour])

  const categories = ['preset', 'custom']
  
  const filteredSlots = useMemo(() => {
    return selectedCategory === 'preset' ? presetSlots : []
  }, [selectedCategory])

  const calculateTotalHours = (start: string, end: string) => {
    if (!start || !end) return 0
    const startHour = parseInt(start.split(':')[0]) + (parseInt(start.split(':')[1]) / 60)
    const endHour = parseInt(end.split(':')[0]) + (parseInt(end.split(':')[1]) / 60)
    return Math.max(0, endHour - startHour)
  }

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        options.push(timeString)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  const handlePresetSlotSelect = (slot: typeof presetSlots[0]) => {
    setSelectedPresetSlot(slot.id)
    setSelectedStartTime(slot.startTime)
    setSelectedEndTime(slot.endTime)
    setSelectedCategory('preset')
    
    // Calculate cart cost for preset slots
    const cartPricePerHour = cartData?.pricePerHour || 150
    const cartServiceAmount = slot.hours * cartPricePerHour
    
    updateFormData({
      startTime: slot.startTime,
      endTime: slot.endTime,
      timeSlotType: slot.id,
      totalHours: slot.hours,
      cartServiceAmount
    })
  }

  const handleCustomTimeChange = () => {
    setSelectedCategory('custom')
    setSelectedPresetSlot('')
  }

  // Check for conflicts with selected time
  const hasConflicts = () => {
    if (!selectedStartTime || !selectedEndTime || !availabilityData?.bookedSlots) return false
    
    return availabilityData.bookedSlots.some((booking) => {
      const bookingStart = booking.startTime
      const bookingEnd = booking.endTime
      const selectedStart = selectedStartTime
      const selectedEnd = selectedEndTime
      
      // Check for time overlap
      return (
        (bookingStart <= selectedStart && bookingEnd > selectedStart) ||
        (bookingStart < selectedEnd && bookingEnd >= selectedEnd) ||
        (bookingStart >= selectedStart && bookingEnd <= selectedEnd)
      )
    })
  }

  const handleNext = () => {
    if (selectedDate && selectedStartTime && selectedEndTime && conflicts.length === 0) {
      const totalHours = calculateTotalHours(selectedStartTime, selectedEndTime)
      const cartPricePerHour = cartData?.pricePerHour || 150 // fallback rate
      const cartServiceAmount = totalHours * cartPricePerHour
      
      updateFormData({
        bookingDate: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        totalHours,
        cartServiceAmount, // Calculate cart cost based on hours
        isCustomTiming: selectedCategory === 'custom',
        timeSlotType: selectedPresetSlot || undefined
      })
      onNext()
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const isFormValid = selectedDate && selectedStartTime && selectedEndTime && conflicts.length === 0
  const totalHours = calculateTotalHours(selectedStartTime, selectedEndTime)
  const currentCartRate = cartData?.pricePerHour || 150 // Use actual cart pricing

  return (
    <div className="space-y-[3vh] lg:space-y-[1vw]">
      <div className="text-center">
        <h2 className="text-[3.5vh] lg:text-[1.4vw] font-bold text-white mb-[1vh] lg:mb-[0.3vw]">
          Choose Your Date & Time
        </h2>
        <p className="text-gray-400 text-[2vh] lg:text-[0.7vw]">
          Step 4 of 5
        </p>
      </div>

      {/* Date Selection */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-[2vh] lg:p-[1vw] mx-[2vh] lg:mx-[1vw]">
        <div className="date-input-wrapper">
          <Input
            type="date"
            label="Event Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={today}
            required
            className="text-[1.6vh] lg:text-[0.8vw]"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-[1.5vh] lg:gap-[0.5vw] justify-center px-[2vh] lg:px-[0.8vw]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as 'preset' | 'custom')}
            className={clsx(
              'px-[3vh] lg:px-[1vw] py-[1vh] lg:py-[0.3vw] rounded-full font-medium transition-all duration-300 text-[1.8vh] lg:text-[0.6vw] flex items-center space-x-[1vh] lg:space-x-[0.3vw]',
              selectedCategory === category
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            )}
          >
            {category === 'preset' ? (
              <Target className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
            ) : (
              <Clock className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
            )}
            <span>{category === 'preset' ? 'Preset Slots' : 'Custom Time'}</span>
          </button>
        ))}
      </div>

      {/* Timing Options */}
      <div className="relative">
        <div className="flex items-center justify-between px-[2vh] lg:px-[1vw] mb-[2vh] lg:mb-[0.8vw]">
          <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.5vw]">
            <h3 className="text-[2.2vh] lg:text-[0.9vw] font-medium text-gray-300">
              {selectedCategory === 'preset' ? 'Quick Time Slots' : 'Custom Timing'}
            </h3>
            {selectedCategory === 'preset' && (
              <span className="bg-teal-500/20 text-teal-400 px-[1.5vh] lg:px-[0.5vw] py-[0.5vh] lg:py-[0.2vw] rounded-full text-[1.4vh] lg:text-[0.6vw] font-medium">
                {filteredSlots.length} slots
              </span>
            )}
          </div>
          {selectedCategory === 'preset' && filteredSlots.length > 4 && (
            <div className="text-gray-400 text-[1.4vh] lg:text-[0.6vw] flex items-center space-x-[0.5vh] lg:space-x-[0.2vw]">
              <span>Swipe to see more</span>
              <svg className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )}
        </div>

        {selectedCategory === 'preset' ? (
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
                className="timing-swiper"
                style={{
                  paddingLeft: '2vh',
                  paddingRight: '2vh'
                }}
              >
                {presetSlots.map((slot) => (
                  <SwiperSlide key={slot.id} style={{ width: '26vh', minWidth: '26vh' }}>
                    <div 
                      className={clsx(
                        'relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden group flex-shrink-0',
                        'bg-slate-800 border shadow-sm hover:shadow-md',
                        selectedPresetSlot === slot.id 
                          ? 'border-green-500 ring-2 ring-green-500/20' 
                          : 'border-slate-600 hover:border-slate-500'
                      )}
                      onClick={() => handlePresetSlotSelect(slot)}
                    >
                      {/* Selection Badge */}
                      {selectedPresetSlot === slot.id && (
                        <div className="absolute top-[0.8vh] lg:top-[0.4vw] right-[0.8vh] lg:right-[0.4vw] z-10">
                          <div className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] text-white" />
                          </div>
                        </div>
                      )}

                      {/* Time Slot Header */}
                      <div className="relative h-[8vh] lg:h-[4vw] bg-slate-700 overflow-hidden flex items-center justify-center">
                        {(() => {
                          const IconComponent = slot.icon
                          return <IconComponent className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw] text-teal-400" />
                        })()}
                        
                        {/* Price Badge */}
                        <div className="absolute top-[0.8vh] lg:top-[0.4vw] left-[0.8vh] lg:left-[0.4vw]">
                          <div className="bg-teal-600 px-[1vh] lg:px-[0.5vw] py-[0.4vh] lg:py-[0.2vw] rounded text-white text-[1.2vh] lg:text-[0.6vw] font-semibold">
                            ${slot.price}
                          </div>
                        </div>

                        {/* Hours Badge */}
                        <div className="absolute bottom-[0.8vh] lg:bottom-[0.4vw] right-[0.8vh] lg:right-[0.4vw]">
                          <div className="bg-slate-600 px-[0.8vh] lg:px-[0.4vw] py-[0.3vh] lg:py-[0.15vw] rounded text-gray-300 text-[1vh] lg:text-[0.5vw] font-medium">
                            {slot.hours}h
                          </div>
                        </div>
                      </div>

                      {/* Time Slot Details */}
                      <div className="p-[1.2vh] lg:p-[0.6vw] space-y-[0.8vh] lg:space-y-[0.4vw]">
                        {/* Slot Name */}
                        <div>
                          <h3 className="text-white font-semibold text-[1.4vh] lg:text-[0.7vw] leading-tight">
                            {slot.name}
                          </h3>
                        </div>

                        {/* Time Range */}
                        <div className="flex items-center text-gray-300 text-[1.2vh] lg:text-[0.6vw]">
                          <Clock className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] mr-[0.5vh] lg:mr-[0.25vw] text-teal-400" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-[1.1vh] lg:text-[0.55vw] leading-relaxed line-clamp-2">
                          {slot.description}
                        </p>

                        {/* Selection Status - Always present to maintain height */}
                        <div className={`text-right font-medium text-[1.2vh] lg:text-[0.6vw] pt-[0.4vh] lg:pt-[0.2vw] min-h-[2vh] lg:min-h-[1vw] ${
                          selectedPresetSlot === slot.id 
                            ? 'text-teal-400 border-t border-slate-700' 
                            : 'text-transparent'
                        }`}>
                          {selectedPresetSlot === slot.id ? 'Selected' : 'Available'}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ) : (
          /* Custom Time Selection */
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-[2vh] lg:p-[1vw] mx-[2vh] lg:mx-[1vw]">
            <div className="grid md:grid-cols-2 gap-[2vh] lg:gap-[1vw]">
              <div>
                <label className="block text-[1.4vh] lg:text-[0.7vw] font-medium text-gray-300 mb-[1vh] lg:mb-[0.5vw]">
                  Start Time
                </label>
                <select
                  value={selectedStartTime}
                  onChange={(e) => setSelectedStartTime(e.target.value)}
                  className="timing-dropdown w-full px-[2vh] lg:px-[1vw] py-[1.5vh] lg:py-[0.8vw] bg-slate-600 border border-slate-500 rounded-lg text-white text-[1.6vh] lg:text-[0.8vw] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                >
                  <option value="">Select start time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time} className="bg-slate-600">
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[1.4vh] lg:text-[0.7vw] font-medium text-gray-300 mb-[1vh] lg:mb-[0.5vw]">
                  End Time
                </label>
                <select
                  value={selectedEndTime}
                  onChange={(e) => setSelectedEndTime(e.target.value)}
                  className="timing-dropdown w-full px-[2vh] lg:px-[1vw] py-[1.5vh] lg:py-[0.8vw] bg-slate-600 border border-slate-500 rounded-lg text-white text-[1.6vh] lg:text-[0.8vw] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                >
                  <option value="">Select end time</option>
                  {timeOptions.filter(time => time > selectedStartTime).map((time) => (
                    <option key={time} value={time} className="bg-slate-600">
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {selectedStartTime && selectedEndTime && (
              <div className="mt-[2vh] lg:mt-[1vw] p-[2vh] lg:p-[1vw] bg-slate-700/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-[1.4vh] lg:text-[0.7vw]">Duration:</span>
                  <span className="text-white font-medium text-[1.4vh] lg:text-[0.7vw]">{totalHours.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between items-center mt-[0.5vh] lg:mt-[0.3vw]">
                  <span className="text-gray-300 text-[1.4vh] lg:text-[0.7vw]">Estimated Cost:</span>
                  <span className="text-teal-400 font-bold text-[1.6vh] lg:text-[0.8vw]">${(totalHours * currentCartRate).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Messages */}
      {loading && (
        <div className="flex items-center justify-center py-[2vh] lg:py-[1vw]">
          <div className="animate-spin rounded-full h-[3vh] w-[3vh] lg:h-[1.5vw] lg:w-[1.5vw] border-4 border-teal-500 border-t-transparent mr-[1vh] lg:mr-[0.5vw]"></div>
          <span className="text-gray-300 text-[1.6vh] lg:text-[0.8vw]">Checking availability...</span>
        </div>
      )}

      {conflicts.length > 0 && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-[2vh] lg:p-[1vw] mx-[2vh] lg:mx-[1vw]">
          <h4 className="font-bold text-red-400 mb-[1vh] lg:mb-[0.5vw] flex items-center text-[1.6vh] lg:text-[0.8vw]">
            <AlertTriangle className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] mr-[0.5vh] lg:mr-[0.3vw]" />
            Time Conflict Detected
          </h4>
          <p className="text-red-300 text-[1.4vh] lg:text-[0.7vw]">
            Your selected time overlaps with existing bookings. Please choose a different time slot.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="text-center space-y-[1.5vh] lg:space-y-[0.8vw] pt-[2vh] lg:pt-[0vw] max-w-[160vh] lg:max-w-[80vw] mx-auto px-[2vh] lg:px-[0.8vw]">
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
            disabled={!isFormValid || loading}
            size="md"
            className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold"
          >
            {loading ? 'Checking...' : (
              <div className="flex items-center">
                <Check className="w-[1.8vh] h-[1.8vh] lg:w-[0.9vw] lg:h-[0.9vw] mr-[0.8vh] lg:mr-[0.4vw]" />
                Continue
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}