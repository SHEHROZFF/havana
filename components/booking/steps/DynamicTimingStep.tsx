'use client'

import { useState } from 'react'
import { BookingFormData } from '@/types/booking'
import Button from '@/components/ui/Button'
import { useGetAvailabilityQuery } from '../../../lib/api/bookingsApi'
import { useGetFoodCartByIdQuery } from '../../../lib/api/foodCartsApi'
import { AlertTriangle, Clock, Calendar, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import TimingSkeleton from '@/components/ui/skeletons/TimingSkeleton'
import { useI18n } from '@/lib/i18n/context'

interface DynamicTimingStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function DynamicTimingStep({ formData, updateFormData, onNext, onPrevious }: DynamicTimingStepProps) {
  const { t, language } = useI18n()
  const [selectedDate, setSelectedDate] = useState(formData.bookingDate || '')
  const [selectedStartTime, setSelectedStartTime] = useState(formData.startTime || '')
  const [selectedEndTime, setSelectedEndTime] = useState(formData.endTime || '')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarView, setCalendarView] = useState(new Date())

  // Use RTK Query to check availability - only when time is selected
  const {
    data: availabilityData,
    isLoading: loading,
    error
  } = useGetAvailabilityQuery(
    { 
      cartId: formData.selectedCartId!, 
      date: selectedDate,
      startTime: selectedStartTime,
      endTime: selectedEndTime
    },
    { 
      skip: !formData.selectedCartId || !selectedDate || !selectedStartTime || !selectedEndTime
    }
  )

  // Fetch cart data for pricing
  const {
    data: cartData,
    isLoading: cartLoading
  } = useGetFoodCartByIdQuery(formData.selectedCartId!, {
    skip: !formData.selectedCartId
  })

  // Calculate total hours between start and end time
  const calculateTotalHours = (start: string, end: string) => {
    const startTime = new Date(`2023-01-01T${start}:00`)
    const endTime = new Date(`2023-01-01T${end}:00`)
    
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1)
    }
    
    return Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
  }

  // Calculate cart cost with tiered pricing
  const calculateCartCost = (hours: number) => {
    if (!cartData) return 0
    
    const basePrice = cartData.pricePerHour || 150 // Base price for up to 4 hours
    const extraHourPrice = cartData.extraHourPrice || 0 // Extra hour price
    
    if (hours <= 4) {
      return basePrice
    } else {
      const extraHours = hours - 4
      return basePrice + (extraHours * extraHourPrice)
    }
  }

  // Check for booking conflicts using the API response
  const hasConflict = availabilityData?.isAvailable === false
  const conflictingBooking = availabilityData?.conflictingBooking
  const conflicts = hasConflict && conflictingBooking ? [conflictingBooking] : []

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  }

  const isDateDisabled = (dateStr: string) => {
    const today = new Date()
    const selectedDateObj = new Date(dateStr)
    today.setHours(0, 0, 0, 0)
    selectedDateObj.setHours(0, 0, 0, 0)
    return selectedDateObj < today
  }

  const totalHours = selectedStartTime && selectedEndTime ? calculateTotalHours(selectedStartTime, selectedEndTime) : 0
  const cartCost = calculateCartCost(totalHours)

  const handleNext = () => {
    if (selectedDate && selectedStartTime && selectedEndTime && conflicts.length === 0) {
      updateFormData({
        bookingDate: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        totalHours: totalHours,
        cartServiceAmount: cartCost,
        isCustomTiming: true,
        timeSlotType: undefined
      })
      onNext()
    }
  }

  // Generate time options (24-hour format)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeOptions.push(timeString)
    }
  }

  const isFormValid = selectedDate && selectedStartTime && selectedEndTime && conflicts.length === 0 && totalHours > 0

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(calendarView)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCalendarView(newDate)
  }

  // Locale helpers for month and weekday names
  const locale = language === 'el' ? 'el-GR' : 'en-US'
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long' })
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weekdayHeaders = Array.from({ length: 7 }, (_, i) => {
    const baseSunday = new Date(Date.UTC(2021, 7, 1 + i)) // 2021-08-01 is a Sunday
    return weekdayFormatter.format(baseSunday)
  })

  const renderCalendar = () => {
    const year = calendarView.getFullYear()
    const month = calendarView.getMonth()
    const daysInMonth = getDaysInMonth(calendarView)
    const firstDay = getFirstDayOfMonth(calendarView)
    
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-[3.5vh] lg:h-[1.8vw]"></div>
      )
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(year, month, day)
      const isDisabled = isDateDisabled(dateStr)
      const isSelected = selectedDate === dateStr
      const isToday = new Date().toDateString() === new Date(dateStr).toDateString()
      
      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && setSelectedDate(dateStr)}
          disabled={isDisabled}
          className={`
            h-[3.5vh] lg:h-[1.8vw] rounded-lg text-[1.2vh] lg:text-[0.6vw] font-medium transition-all duration-200
            ${isSelected 
              ? 'bg-teal-500 text-white shadow-lg' 
              : isToday
              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
              : isDisabled 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-white hover:bg-slate-700 hover:text-teal-400'
            }
          `}
        >
          {day}
        </button>
      )
    }
    
    return (
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[1.5vh] lg:p-[0.8vw]">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-[1.5vh] lg:mb-[0.8vw]">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-[0.8vh] lg:p-[0.4vw] rounded-lg hover:bg-slate-700 text-white transition-colors"
          >
            <ChevronLeft className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
          </button>
          
          <h3 className="text-white font-semibold text-[1.5vh] lg:text-[0.75vw]">
            {monthFormatter.format(calendarView)} {year}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-[0.8vh] lg:p-[0.4vw] rounded-lg hover:bg-slate-700 text-white transition-colors"
          >
            <ChevronRight className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
          </button>
        </div>
        
        {/* Days of week headers */}
        <div className="grid grid-cols-7 gap-[0.3vh] lg:gap-[0.2vw] mb-[0.8vh] lg:mb-[0.4vw]">
          {weekdayHeaders.map(day => (
            <div key={day} className="text-center text-gray-400 text-[1vh] lg:text-[0.5vw] font-medium py-[0.3vh] lg:py-[0.2vw]">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-[0.3vh] lg:gap-[0.2vw]">
          {days}
        </div>
      </div>
    )
  }

  if (cartLoading) {
    return <TimingSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-[8vh] lg:py-[4vw]">
        <AlertTriangle className="w-[8vh] h-[8vh] lg:w-[4vw] lg:h-[4vw] text-red-400 mx-auto mb-[2vh] lg:mb-[1vw]" />
        <h3 className="text-white text-[2.5vh] lg:text-[1.2vw] font-semibold mb-[1vh] lg:mb-[0.5vw]">{t('unable_to_load_availability_error')}</h3>
        <p className="text-gray-400 text-[1.8vh] lg:text-[0.9vw]">{t('please_try_again_later')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-[3vh] lg:space-y-[1.5vw]">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-[3.5vh] lg:text-[1.4vw] font-bold text-white mb-[1vh] lg:mb-[0.3vw]">
          {t('choose_date_time')}
        </h2>
        <p className="text-gray-400 text-[1.8vh] lg:text-[0.9vw]">{t('step_3_of_5')}</p>
        {/* <p className="text-gray-300 text-[1.6vh] lg:text-[0.8vw] mt-[1vh] lg:mt-[0.5vw]">
          Select your preferred date and time for the event
        </p> */}
      </div>

      {/* Main Content - Calendar Left, Time Slots Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2vh] lg:gap-[1.5vw]">
        
        {/* Left Side - Calendar */}
        <div className="order-1 lg:order-1">
          <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] mb-[1.5vh] lg:mb-[0.8vw]">
            <Calendar className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
            <h3 className="text-white font-semibold text-[1.8vh] lg:text-[0.9vw]">{t('select_date_calendar')}</h3>
          </div>
          {renderCalendar()}
        </div>

        {/* Right Side - Time Selection (appears when date is selected) */}
        <div className="order-2 lg:order-2">
          {selectedDate ? (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[2vh] lg:p-[1vw]">
              <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] mb-[2vh] lg:mb-[1vw]">
                <Clock className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
                <h3 className="text-white font-semibold text-[1.6vh] lg:text-[0.8vw]">
                  {t('time_for_date').replace('{date}', new Date(selectedDate).toLocaleDateString())}
                </h3>
              </div>

              {/* Time Selection */}
              <div className="space-y-[1.5vh] lg:space-y-[0.8vw] mb-[2vh] lg:mb-[1vw]">
                {/* Start Time */}
                <div>
                  <label className="block text-white font-medium text-[1.4vh] lg:text-[0.7vw] mb-[0.8vh] lg:mb-[0.4vw]">
                    {t('start_time')}
                  </label>
                  <select
                    value={selectedStartTime}
                    onChange={(e) => setSelectedStartTime(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-[1.5vh] lg:px-[0.8vw] py-[1.2vh] lg:py-[0.6vw] text-white text-[1.4vh] lg:text-[0.7vw] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('select_start_time')}</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-white font-medium text-[1.4vh] lg:text-[0.7vw] mb-[0.8vh] lg:mb-[0.4vw]">
                    {t('end_time')}
                  </label>
                  <select
                    value={selectedEndTime}
                    onChange={(e) => setSelectedEndTime(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-[1.5vh] lg:px-[0.8vw] py-[1.2vh] lg:py-[0.6vw] text-white text-[1.4vh] lg:text-[0.7vw] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('select_end_time')}</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration and Pricing Info */}
              {totalHours > 0 && (
                <div className="bg-slate-700/50 rounded-lg p-[1.5vh] lg:p-[0.8vw] mb-[2vh] lg:mb-[1vw]">
                  <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                    <div>
                      <h4 className="text-white font-medium text-[1.3vh] lg:text-[0.65vw] mb-[0.5vh] lg:mb-[0.3vw]">{t('duration')}</h4>
                      <p className="text-teal-400 font-semibold text-[1.5vh] lg:text-[0.75vw]">
                        {totalHours} hour{totalHours !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-[1.3vh] lg:text-[0.65vw] mb-[0.5vh] lg:mb-[0.3vw]">{t('cart_cost')}</h4>
                      <div className="space-y-[0.3vh] lg:space-y-[0.2vw]">
                        {totalHours <= 4 ? (
                          <p className="text-teal-400 font-semibold text-[1.5vh] lg:text-[0.75vw]">
                            {t('base_price_text').replace('{amount}', `€${cartCost.toFixed(2)}`)}
                          </p>
                        ) : (
                          <>
                            <p className="text-gray-400 text-[1.1vh] lg:text-[0.55vw]">
                              Base (4hrs): €{cartData?.pricePerHour || 150}
                            </p>
                            <p className="text-gray-400 text-[1.1vh] lg:text-[0.55vw]">
                              Extra ({totalHours - 4}hrs): €{((totalHours - 4) * (cartData?.extraHourPrice || 0)).toFixed(2)}
                            </p>
                            <p className="text-teal-400 font-semibold text-[1.5vh] lg:text-[0.75vw]">
                              Total: €{cartCost.toFixed(2)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {conflicts.length > 0 && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-[1.5vh] lg:p-[0.8vw] mb-[1.5vh] lg:mb-[0.8vw]">
                  <div className="flex items-center space-x-[0.8vh] lg:space-x-[0.4vw]">
                    <AlertTriangle className="w-[1.8vh] h-[1.8vh] lg:w-[0.9vw] lg:h-[0.9vw] text-red-400" />
                    <div>
                      <h4 className="text-red-400 font-medium text-[1.2vh] lg:text-[0.6vw]">⚠️ {t('time_slot_unavailable')}</h4>
                      <p className="text-red-300 text-[1vh] lg:text-[0.5vw]">
                        {t('time_conflict_message').replace('{start}', conflictingBooking?.startTime || '').replace('{end}', conflictingBooking?.endTime || '')}
                      </p>
                      <p className="text-red-200 text-[0.9vh] lg:text-[0.45vw] mt-[0.5vh] lg:mt-[0.25vw]">
                        {t('select_different_time')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isFormValid && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-[1.5vh] lg:p-[0.8vw]">
                  <div className="flex items-center space-x-[0.8vh] lg:space-x-[0.4vw]">
                    <Check className="w-[1.8vh] h-[1.8vh] lg:w-[0.9vw] lg:h-[0.9vw] text-green-400" />
                    <div>
                              <h4 className="text-green-400 font-medium text-[1.2vh] lg:text-[0.6vw]">{t('time_available')}</h4>
        <p className="text-green-300 text-[1vh] lg:text-[0.5vw]">{t('ready_to_proceed')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[4vh] lg:p-[2vw] text-center">
              <Calendar className="w-[6vh] h-[6vh] lg:w-[3vw] lg:h-[3vw] text-gray-400 mx-auto mb-[1.5vh] lg:mb-[0.8vw]" />
              <h3 className="text-white font-semibold text-[1.6vh] lg:text-[0.8vw] mb-[0.8vh] lg:mb-[0.4vw]">
                {t('select_a_date')}
              </h3>
              <p className="text-gray-400 text-[1.2vh] lg:text-[0.6vw]">
                {t('choose_date_from_calendar')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="md"
          className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold"
        >
          {t('previous')}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          size="md"
          className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('continue')}
        </Button>
      </div>
    </div>
  )
}