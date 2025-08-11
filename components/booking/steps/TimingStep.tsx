'use client'

import { useState } from 'react'
import { BookingFormData } from '@/types/booking'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useGetAvailabilityQuery } from '../../../lib/api/bookingsApi'

interface TimingStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function TimingStep({ formData, updateFormData, onNext, onPrevious }: TimingStepProps) {
  const [selectedDate, setSelectedDate] = useState(formData.bookingDate || '')
  const [startTime, setStartTime] = useState(formData.startTime || '')
  const [endTime, setEndTime] = useState(formData.endTime || '')
  
  const today = new Date().toISOString().split('T')[0]

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

  const conflicts = availabilityData?.bookedSlots || []

  // Calculate total hours
  const calculateTotalHours = (start: string, end: string) => {
    if (!start || !end) return 0
    const startDate = new Date(`2000-01-01T${start}:00`)
    const endDate = new Date(`2000-01-01T${end}:00`)
    const diff = endDate.getTime() - startDate.getTime()
    return Math.max(0, diff / (1000 * 60 * 60))
  }

  const totalHours = calculateTotalHours(startTime, endTime)

  // Generate time options (every 30 minutes from 6 AM to 11 PM)
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push(timeString)
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()



  // Check if selected time conflicts with existing bookings
  const hasConflict = () => {
    if (!startTime || !endTime || conflicts.length === 0) return false
    
    return conflicts.some((booking: any) => {
      const bookingStart = booking.startTime
      const bookingEnd = booking.endTime
      
      // Check for time overlap
      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      )
    })
  }

  const isTimeValid = () => {
    if (!startTime || !endTime) return false
    if (startTime >= endTime) return false
    if (totalHours < 1) return false
    if (hasConflict()) return false
    return true
  }

  const handleNext = () => {
    if (!isTimeValid()) return
    
    updateFormData({
      bookingDate: selectedDate,
      startTime,
      endTime,
      totalHours
    })
    onNext()
  }

  // Calculate cart pricing
  const getCartData = () => {
    // This would normally come from the selected cart data
    return {
      pricePerHour: 150, // Default price per hour
      name: 'Selected Cart'
    }
  }

  const cartData = getCartData()
  const cartTotal = totalHours * cartData.pricePerHour

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Choose Your Date & Time
        </h2>
        <p className="text-gray-400 text-lg">
          Page 4 of 6
        </p>
        <p className="text-teal-400 text-sm mt-1">
          Select any date and custom time duration
        </p>
      </div>

      {/* Date Selection */}
      <div className="bg-slate-600/50 backdrop-blur-sm p-6">
        <h3 className="text-xl font-bold text-white mb-4">Event Date</h3>
        <Input
          type="date"
          label="Select Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={today}
          required
        />
      </div>

      {/* Time Selection */}
      <div className="bg-slate-600/50 backdrop-blur-sm p-6">
        <h3 className="text-xl font-bold text-white mb-4">Event Time</h3>
        
        {loading && selectedDate && (
          <div className="flex items-center justify-center py-4 mb-4">
            <div className="animate-spin h-6 w-6 border-4 border-teal-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-300">Checking availability...</span>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Time *
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 bg-slate-600 border border-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
              required
            >
              <option value="">Select start time</option>
              {timeOptions.map(time => (
                <option key={time} value={time} className="bg-slate-600">
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Time *
            </label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 bg-slate-600 border border-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
              required
            >
              <option value="">Select end time</option>
              {timeOptions.map(time => (
                <option key={time} value={time} className="bg-slate-600">
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation Messages */}
        {startTime && endTime && (
          <div className="mt-4">
            {startTime >= endTime && (
              <p className="text-red-400 text-sm">End time must be after start time</p>
            )}
            {totalHours < 1 && startTime < endTime && (
              <p className="text-red-400 text-sm">Minimum booking duration is 1 hour</p>
            )}
            {hasConflict() && (
              <p className="text-red-400 text-sm">
                This time slot conflicts with an existing booking. Please choose a different time.
              </p>
            )}
            {isTimeValid() && (
              <p className="text-green-400 text-sm">
                ✓ Time slot is available ({totalHours} hours)
              </p>
            )}
          </div>
        )}

        {/* Current Conflicts Display */}
        {conflicts.length > 0 && selectedDate && (
          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50">
            <h4 className="font-semibold text-yellow-300 mb-2">Existing Bookings for {selectedDate}:</h4>
            <div className="space-y-1">
              {conflicts.map((booking: any, index: number) => (
                <div key={index} className="text-sm text-yellow-200">
                  {booking.startTime} - {booking.endTime}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Summary */}
      {isTimeValid() && (
        <div className="bg-teal-500/20 border border-teal-500/50 p-6">
          <h3 className="font-bold text-xl text-white mb-4">Booking Summary</h3>
          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium text-white">
                {new Date(selectedDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-medium text-white">
                {startTime} - {endTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium text-white">
                {totalHours} hours
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cart Rate:</span>
              <span className="font-medium text-white">
                ${cartData.pricePerHour}/hour
              </span>
            </div>
            <div className="border-t border-teal-500/30 pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span className="text-white">Cart Total:</span>
                <span className="text-teal-400">${cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          className="px-8"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          size="lg"
          disabled={!isTimeValid()}
          className="px-12"
        >
          Continue to Customer Info
        </Button>
      </div>
    </div>
  )
}