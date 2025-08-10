'use client'

import { useState, useEffect } from 'react'
import { BookingFormData, TimeSlot } from '@/types/booking'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'

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
  const [isCustomTiming, setIsCustomTiming] = useState(formData.isCustomTiming ?? true)
  const [selectedPresetSlot, setSelectedPresetSlot] = useState(formData.timeSlotType || '')
  
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [conflicts, setConflicts] = useState<string[]>([])

  // Preset time slots for quick selection
  const presetSlots = [
    { id: 'morning', name: 'Morning Event', startTime: '09:00', endTime: '13:00', price: 150, description: '4 hours - Perfect for brunch events' },
    { id: 'afternoon', name: 'Afternoon Event', startTime: '14:00', endTime: '18:00', price: 150, description: '4 hours - Ideal for lunch gatherings' },
    { id: 'evening', name: 'Evening Event', startTime: '19:00', endTime: '23:00', price: 180, description: '4 hours - Great for dinner parties' },
    { id: 'full-day', name: 'Full Day Event', startTime: '10:00', endTime: '22:00', price: 400, description: '12 hours - Complete event coverage' },
  ]

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
    setIsCustomTiming(false)
  }

  const handleCustomTimeChange = () => {
    setIsCustomTiming(true)
    setSelectedPresetSlot('')
  }

  // Check availability when date and times change
  useEffect(() => {
    if (selectedDate && selectedStartTime && selectedEndTime && formData.selectedCartId) {
      checkAvailability()
    }
  }, [selectedDate, selectedStartTime, selectedEndTime, formData.selectedCartId])

  const checkAvailability = async () => {
    if (!selectedDate || !formData.selectedCartId || !selectedStartTime || !selectedEndTime) return
    
    setLoading(true)
    setConflicts([])
    
    try {
      const response = await fetch(`/api/availability?cartId=${formData.selectedCartId}&date=${selectedDate}`)
      if (response.ok) {
        const availability = await response.json()
        
        // Check for conflicts with existing bookings
        const conflictingBookings = availability.bookedSlots?.filter((booking: any) => {
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
        
        if (conflictingBookings && conflictingBookings.length > 0) {
          setConflicts(conflictingBookings.map((booking: any) => 
            `${booking.startTime} - ${booking.endTime}`
          ))
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (selectedDate && selectedStartTime && selectedEndTime && conflicts.length === 0) {
      const totalHours = calculateTotalHours(selectedStartTime, selectedEndTime)
      updateFormData({
        bookingDate: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        totalHours,
        isCustomTiming,
        timeSlotType: selectedPresetSlot || undefined
      })
      onNext()
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const isFormValid = selectedDate && selectedStartTime && selectedEndTime && conflicts.length === 0
  const totalHours = calculateTotalHours(selectedStartTime, selectedEndTime)
  const currentCartRate = formData.cartServiceAmount ? formData.cartServiceAmount / (formData.totalHours || 1) : 150 // fallback rate

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
          Select preset slots or customize your timing
        </p>
      </div>

      {/* Date Selection */}
      <div className="bg-slate-600/50 backdrop-blur-sm rounded-xl p-6">
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

      {/* Timing Mode Toggle */}
      <div className="bg-slate-600/50 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Timing Options</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setIsCustomTiming(false)}
            className={clsx(
              'px-6 py-3 rounded-xl font-medium transition-all duration-300',
              !isCustomTiming
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            )}
          >
            🎯 Preset Time Slots
          </button>
          <button
            onClick={handleCustomTimeChange}
            className={clsx(
              'px-6 py-3 rounded-xl font-medium transition-all duration-300',
              isCustomTiming
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            )}
          >
            ⏰ Custom Timing
          </button>
        </div>
      </div>

      {/* Preset Time Slots */}
      {!isCustomTiming && (
        <div className="bg-slate-600/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Time Slots</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {presetSlots.map((slot) => (
              <div
                key={slot.id}
                className={clsx(
                  'p-4 border-2 cursor-pointer transition-all duration-300 rounded-xl transform hover:scale-105',
                  selectedPresetSlot === slot.id
                    ? 'border-teal-500 bg-teal-500/20 shadow-lg shadow-teal-500/25'
                    : 'border-slate-500 bg-slate-600/50 hover:border-slate-400'
                )}
                onClick={() => handlePresetSlotSelect(slot)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white">{slot.name}</h4>
                  <span className="text-teal-400 font-bold">${slot.price}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  {slot.startTime} - {slot.endTime}
                </p>
                <p className="text-xs text-gray-400">{slot.description}</p>
                
                {selectedPresetSlot === slot.id && (
                  <div className="mt-3 flex items-center text-teal-400">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Time Selection */}
      {isCustomTiming && (
        <div className="bg-slate-600/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Custom Time Selection</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time
              </label>
              <select
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time
              </label>
              <select
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
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
            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Duration:</span>
                <span className="text-white font-medium">{totalHours.toFixed(1)} hours</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-300">Estimated Cost:</span>
                <span className="text-teal-400 font-bold">${(totalHours * currentCartRate).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Availability Status */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-teal-500 border-t-transparent mr-3"></div>
          <span className="text-gray-300">Checking availability...</span>
        </div>
      )}

      {conflicts.length > 0 && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
          <h4 className="font-bold text-red-400 mb-2">⚠️ Time Conflict Detected</h4>
          <p className="text-red-300 mb-3">
            Your selected time overlaps with existing bookings:
          </p>
          <ul className="text-red-300 text-sm space-y-1">
            {conflicts.map((conflict, index) => (
              <li key={index}>• {conflict}</li>
            ))}
          </ul>
          <p className="text-red-300 text-sm mt-3">
            Please choose a different time slot.
          </p>
        </div>
      )}

      {/* Booking Summary */}
      {isFormValid && (
        <div className="bg-teal-500/20 border border-teal-500/50 rounded-xl p-6">
          <h3 className="font-bold text-xl text-white mb-4">Timing Summary</h3>
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
                {selectedStartTime} - {selectedEndTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium text-white">
                {totalHours.toFixed(1)} hours
              </span>
            </div>
            <div className="flex justify-between">
              <span>Timing Type:</span>
              <span className="font-medium text-white">
                {isCustomTiming ? 'Custom' : 'Preset Slot'}
              </span>
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
          disabled={!isFormValid || loading}
          size="lg"
          className="px-8"
        >
          {loading ? 'Checking...' : 'Next'}
        </Button>
      </div>
    </div>
  )
}