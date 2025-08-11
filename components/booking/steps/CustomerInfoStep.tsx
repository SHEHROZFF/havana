'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { BookingFormData } from '@/types/booking'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'
import { User, Mail, Phone, Calendar, Users, MessageSquare, Check, UserCheck, FileText } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

interface CustomerInfoStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function CustomerInfoStep({ formData, updateFormData, onNext, onPrevious }: CustomerInfoStepProps) {
  const [customerInfo, setCustomerInfo] = useState({
    customerName: formData.customerName || '',
    customerEmail: formData.customerEmail || '',
    customerPhone: formData.customerPhone || '',
    eventType: formData.eventType || '',
    guestCount: formData.guestCount?.toString() || '',
    specialNotes: formData.specialNotes || ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedCategory, setSelectedCategory] = useState<'contact' | 'event'>('contact')
  const swiperRef = useRef<any>(null)

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

  const eventTypeOptions = [
    { value: 'birthday', label: 'Birthday Party', description: 'Celebrate special birthdays', icon: Calendar },
    { value: 'wedding', label: 'Wedding', description: 'Perfect for wedding celebrations', icon: Users },
    { value: 'corporate', label: 'Corporate Event', description: 'Professional business gatherings', icon: FileText },
    { value: 'graduation', label: 'Graduation', description: 'Celebrate academic achievements', icon: UserCheck },
    { value: 'anniversary', label: 'Anniversary', description: 'Mark special milestones', icon: Calendar },
    { value: 'family-gathering', label: 'Family Gathering', description: 'Bring family together', icon: Users },
    { value: 'community-event', label: 'Community Event', description: 'Local community celebrations', icon: Users },
    { value: 'other', label: 'Other', description: 'Custom event type', icon: Calendar }
  ]

  const categories = ['contact', 'event']
  
  const contactFields = useMemo(() => [
    { id: 'name', label: 'Full Name', value: customerInfo.customerName, field: 'customerName', type: 'text', icon: User, placeholder: 'Enter your full name' },
    { id: 'email', label: 'Email Address', value: customerInfo.customerEmail, field: 'customerEmail', type: 'email', icon: Mail, placeholder: 'your@email.com' },
    { id: 'phone', label: 'Phone Number', value: customerInfo.customerPhone, field: 'customerPhone', type: 'tel', icon: Phone, placeholder: '+1 (555) 123-4567' }
  ], [customerInfo])

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!customerInfo.customerName.trim()) {
      newErrors.customerName = 'Full name is required'
    }
    
    if (!customerInfo.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address'
    }
    
    if (!customerInfo.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required'
    }
    
    if (!customerInfo.eventType) {
      newErrors.eventType = 'Event type is required'
    }
    
    const guestCount = parseInt(customerInfo.guestCount)
    if (!customerInfo.guestCount || isNaN(guestCount) || guestCount < 1) {
      newErrors.guestCount = 'Guest count must be at least 1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      updateFormData({
        customerName: customerInfo.customerName,
        customerEmail: customerInfo.customerEmail,
        customerPhone: customerInfo.customerPhone,
        eventType: customerInfo.eventType,
        guestCount: parseInt(customerInfo.guestCount),
        specialNotes: customerInfo.specialNotes || undefined
      })
      onNext()
    }
  }

  // Check if all required fields are completed
  const isContactInfoComplete = customerInfo.customerName.trim() && 
                                customerInfo.customerEmail.trim() && 
                                customerInfo.customerPhone.trim()
  
  const isEventDetailsComplete = customerInfo.eventType && 
                                customerInfo.guestCount && 
                                parseInt(customerInfo.guestCount) > 0

  const isAllDataComplete = isContactInfoComplete && isEventDetailsComplete

  return (
    <div className="space-y-[3vh] lg:space-y-[1vw]">
      <div className="text-center">
        <h2 className="text-[3.5vh] lg:text-[1.4vw] font-bold text-white mb-[1vh] lg:mb-[0.3vw]">
          Your Information
        </h2>
        <p className="text-gray-400 text-[2vh] lg:text-[0.7vw]">
          Step 5 of 5
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-[1.5vh] lg:gap-[0.5vw] justify-center px-[2vh] lg:px-[0.8vw]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as 'contact' | 'event')}
            className={clsx(
              'px-[3vh] lg:px-[1vw] py-[1vh] lg:py-[0.3vw] rounded-full font-medium transition-all duration-300 text-[1.8vh] lg:text-[0.6vw] flex items-center space-x-[1vh] lg:space-x-[0.3vw]',
              selectedCategory === category
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            )}
          >
            {category === 'contact' ? (
              <User className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
            ) : (
              <Calendar className="w-[2vh] h-[2vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
            )}
            <span>{category === 'contact' ? 'Contact Info' : 'Event Details'}</span>
          </button>
        ))}
      </div>

      {/* Information Cards */}
      <div className="relative">
        <div className="flex items-center justify-between px-[2vh] lg:px-[1vw] mb-[2vh] lg:mb-[0.8vw]">
          <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.5vw]">
            <h3 className="text-[2.2vh] lg:text-[0.9vw] font-medium text-gray-300">
              {selectedCategory === 'contact' ? 'Contact Information' : 'Event & Guest Details'}
            </h3>
          </div>
        </div>

        {selectedCategory === 'contact' ? (
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
                className="customer-swiper"
                style={{
                  paddingLeft: '2vh',
                  paddingRight: '2vh'
                }}
              >
                {contactFields.map((field) => (
                  <SwiperSlide key={field.id} style={{ width: '26vh', minWidth: '26vh' }}>
                    <div className={clsx(
                      'relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden group flex-shrink-0',
                      'bg-slate-800 border shadow-sm hover:shadow-md',
                      field.value 
                        ? 'border-green-500 ring-2 ring-green-500/20' 
                        : 'border-slate-600 hover:border-slate-500'
                    )}>
                      {/* Selection Badge */}
                      {field.value && (
                        <div className="absolute top-[0.8vh] lg:top-[0.4vw] right-[0.8vh] lg:right-[0.4vw] z-10">
                          <div className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] text-white" />
                          </div>
                        </div>
                      )}

                      {/* Field Icon Header */}
                      <div className="relative h-[8vh] lg:h-[4vw] bg-slate-700 overflow-hidden flex items-center justify-center">
                        {(() => {
                          const IconComponent = field.icon
                          return <IconComponent className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw] text-teal-400" />
                        })()}
                      </div>

                      {/* Field Details */}
                      <div className="p-[1.2vh] lg:p-[0.6vw] space-y-[0.8vh] lg:space-y-[0.4vw]">
                        {/* Field Label */}
                        <div>
                          <h3 className="text-white font-semibold text-[1.4vh] lg:text-[0.7vw] leading-tight">
                            {field.label}
                          </h3>
                        </div>

                        {/* Input Field */}
          <Input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => handleInputChange(field.field, e.target.value)}
                          error={errors[field.field]}
            required
                          placeholder={field.placeholder}
                          className="text-[1.2vh] lg:text-[0.6vw]"
                        />

                        {/* Status - Always present to maintain height */}
                        <div className={`text-right font-medium text-[1.2vh] lg:text-[0.6vw] pt-[0.4vh] lg:pt-[0.2vw] min-h-[2vh] lg:min-h-[1vw] ${
                          field.value 
                            ? 'text-teal-400 border-t border-slate-700' 
                            : 'text-transparent'
                        }`}>
                          {field.value ? 'Completed' : 'Required'}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
        </div>
      </div>
        ) : (
          /* Event Details Section */
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-[2vh] lg:p-[1vw] mx-[2vh] lg:mx-[1vw]">
            <div className="grid md:grid-cols-2 gap-[2vh] lg:gap-[1vw]">
              {/* Event Type Selection */}
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <label className="block text-[1.4vh] lg:text-[0.7vw] font-medium text-gray-300">
                  Event Type
                </label>
                <div className="grid grid-cols-2 gap-[1vh] lg:gap-[0.5vw]">
                  {eventTypeOptions.slice(0, 4).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('eventType', option.value)}
                      className={clsx(
                        'p-[1vh] lg:p-[0.5vw] rounded-lg border text-left transition-all duration-300',
                        customerInfo.eventType === option.value
                          ? 'border-green-500 bg-green-500/20 text-white'
                          : 'border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500'
                      )}
                    >
                      <div className="flex items-center space-x-[0.5vh] lg:space-x-[0.3vw]">
                        {(() => {
                          const IconComponent = option.icon
                          return <IconComponent className="w-[1.5vh] h-[1.5vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                        })()}
                        <span className="text-[1.2vh] lg:text-[0.6vw] font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {eventTypeOptions.length > 4 && (
                  <div className="grid grid-cols-2 gap-[1vh] lg:gap-[0.5vw]">
                    {eventTypeOptions.slice(4).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('eventType', option.value)}
                        className={clsx(
                          'p-[1vh] lg:p-[0.5vw] rounded-lg border text-left transition-all duration-300',
                          customerInfo.eventType === option.value
                            ? 'border-green-500 bg-green-500/20 text-white'
                            : 'border-slate-600 bg-slate-700 text-gray-300 hover:border-slate-500'
                        )}
                      >
                        <div className="flex items-center space-x-[0.5vh] lg:space-x-[0.3vw]">
                          {(() => {
                            const IconComponent = option.icon
                            return <IconComponent className="w-[1.5vh] h-[1.5vh] lg:w-[0.8vw] lg:h-[0.8vw] text-teal-400" />
                          })()}
                          <span className="text-[1.2vh] lg:text-[0.6vw] font-medium">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {errors.eventType && (
                  <p className="text-red-400 text-[1.2vh] lg:text-[0.6vw]">{errors.eventType}</p>
                )}
              </div>

              {/* Guest Count and Notes */}
              <div className="space-y-[2vh] lg:space-y-[1vw]">
          <Input
            label="Expected Guest Count"
            type="number"
            value={customerInfo.guestCount}
            onChange={(e) => handleInputChange('guestCount', e.target.value)}
            error={errors.guestCount}
            required
            min="1"
            placeholder="Number of guests"
            helperText="This helps us ensure we bring enough food"
                  className="text-[1.6vh] lg:text-[0.8vw]"
          />
          
                <div>
                  <label className="block text-[1.4vh] lg:text-[0.7vw] font-medium text-gray-300 mb-[1vh] lg:mb-[0.5vw]">
              Special Notes or Requests
            </label>
            <textarea
                    className="w-full px-[2vh] lg:px-[1vw] py-[1.5vh] lg:py-[0.8vw] bg-slate-600 border border-slate-500 rounded-lg text-white text-[1.6vh] lg:text-[0.8vw] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    rows={3}
              value={customerInfo.specialNotes}
              onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                    placeholder="Any dietary restrictions, special requests..."
            />
                  <p className="mt-[0.5vh] lg:mt-[0.3vw] text-[1.2vh] lg:text-[0.6vw] text-gray-400">
                    Optional: Let us know about any special requirements
            </p>
          </div>
        </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="text-center space-y-[1.5vh] lg:space-y-[0.8vw] pt-[2vh] lg:pt-[0vw] max-w-[160vh] lg:max-w-[80vw] mx-auto px-[2vh] lg:px-[0.8vw]">
        {/* Progress Indicator */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-[1.5vh] lg:p-[0.8vw] mb-[2vh] lg:mb-[1vw]">
          <div className="flex items-center justify-center space-x-[2vh] lg:space-x-[1vw]">
            <div className={clsx(
              'flex items-center space-x-[0.8vh] lg:space-x-[0.4vw]',
              isContactInfoComplete ? 'text-green-400' : 'text-gray-400'
            )}>
              <div className={clsx(
                'w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] rounded-full flex items-center justify-center',
                isContactInfoComplete ? 'bg-green-500' : 'bg-slate-600'
              )}>
                {isContactInfoComplete ? (
                  <Check className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] text-white" />
                ) : (
                  <User className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] text-gray-300" />
                )}
              </div>
              <span className="text-[1.4vh] lg:text-[0.7vw] font-medium">Contact Info</span>
            </div>
            
            <div className={clsx(
              'flex items-center space-x-[0.8vh] lg:space-x-[0.4vw]',
              isEventDetailsComplete ? 'text-green-400' : 'text-gray-400'
            )}>
              <div className={clsx(
                'w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] rounded-full flex items-center justify-center',
                isEventDetailsComplete ? 'bg-green-500' : 'bg-slate-600'
              )}>
                {isEventDetailsComplete ? (
                  <Check className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] text-white" />
                ) : (
                  <Calendar className="w-[1.2vh] h-[1.2vh] lg:w-[0.6vw] lg:h-[0.6vw] text-gray-300" />
                )}
              </div>
              <span className="text-[1.4vh] lg:text-[0.7vw] font-medium">Event Details</span>
            </div>
          </div>
          
          {!isAllDataComplete && (
            <p className="text-gray-400 text-[1.3vh] lg:text-[0.65vw] mt-[1vh] lg:mt-[0.5vw]">
              Please complete both Contact Info and Event Details to continue
            </p>
          )}
        </div>

        <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
            size="md"
            className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold"
        >
          Previous
        </Button>
          
          {isAllDataComplete ? (
        <Button
          onClick={handleNext}
              size="md"
              className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold"
            >
              <div className="flex items-center">
                <Check className="w-[1.8vh] h-[1.8vh] lg:w-[0.9vw] lg:h-[0.9vw] mr-[0.8vh] lg:mr-[0.4vw]" />
                Continue to Payment
              </div>
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (!isContactInfoComplete) {
                  setSelectedCategory('contact')
                } else if (!isEventDetailsComplete) {
                  setSelectedCategory('event')
                }
              }}
              variant="outline"
              size="md"
              className="px-[4vh] lg:px-[2vw] py-[1.2vh] lg:py-[0.6vw] text-[1.8vh] lg:text-[0.9vw] font-semibold border-gray-500 text-gray-400 cursor-not-allowed opacity-60"
            >
              <div className="flex items-center">
                <MessageSquare className="w-[1.8vh] h-[1.8vh] lg:w-[0.9vw] lg:h-[0.9vw] mr-[0.8vh] lg:mr-[0.4vw]" />
                Complete Information
              </div>
        </Button>
          )}
        </div>
      </div>
    </div>
  )
}