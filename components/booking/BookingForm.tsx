'use client'

import { useState } from 'react'
import { BookingFormData, BookingStep, BOOKING_STEPS } from '@/types/booking'
import StepIndicator from '@/components/ui/StepIndicator'
import CartSelectionStep from './steps/CartSelectionStep'
import FoodSelectionStep from './steps/FoodSelectionStep'
import ServicesSelectionStep from './steps/ServicesSelectionStep'
import DynamicTimingStep from './steps/DynamicTimingStep'
import CustomerInfoStep from './steps/CustomerInfoStep'
import PaymentStep from './steps/PaymentStep'

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('cart-selection')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    selectedItems: [],
    selectedServices: [],
    totalAmount: 0
  })

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const goToNextStep = () => {
    const currentIndex = BOOKING_STEPS.findIndex(step => step.id === currentStep)
    if (currentIndex < BOOKING_STEPS.length - 1) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep])
      }
      
      // Move to next step
      const nextStep = BOOKING_STEPS[currentIndex + 1].id as BookingStep
      setCurrentStep(nextStep)
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = BOOKING_STEPS.findIndex(step => step.id === currentStep)
    if (currentIndex > 0) {
      const previousStep = BOOKING_STEPS[currentIndex - 1].id as BookingStep
      setCurrentStep(previousStep)
    }
  }

  const goToStep = (stepId: BookingStep) => {
    setCurrentStep(stepId)
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'cart-selection':
        return (
          <CartSelectionStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
          />
        )
      case 'food-selection':
        return (
          <FoodSelectionStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )
      case 'services-selection':
        return (
          <ServicesSelectionStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )
      case 'timing':
        return (
          <DynamicTimingStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )
      case 'customer-info':
        return (
          <CustomerInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )
      case 'payment':
        return (
          <PaymentStep
            formData={formData}
            updateFormData={updateFormData}
            onPrevious={goToPreviousStep}
            onComplete={() => {
              // Handle booking completion
              console.log('Booking completed:', formData)
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900 opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_70%)]"></div>
      
      <div className="relative z-10">
        {/* Back Button */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-20">
          <a
            href="https://havana.gr"
            className="flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm transition-all duration-300 text-sm lg:text-base border border-slate-600/50 hover:border-slate-500/50"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-white font-medium">Back to Havana.gr</span>
          </a>
        </div>

        {/* Header with Logo */}
        <div className="text-center pt-8 pb-4">
          <div className="flex justify-center mb-6">
            <img 
              src="https://havana.gr/wp-content/uploads/2025/05/cropped-Logo.png" 
              alt="Havana Logo" 
              className="h-16 w-16 lg:h-20 lg:w-20 object-contain"
            />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-2 tracking-wider">
            BOOKING
          </h1>
          <p className="text-red-500 text-sm lg:text-base font-medium tracking-wide">
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }).toUpperCase()}
          </p>
        </div>

        {/* Main Content */}
        <div className="px-4 lg:px-8 pb-8">
          <div className="max-w-4xl mx-auto">
                    {/* Step Indicator */}
        <StepIndicator
          steps={[...BOOKING_STEPS]}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

            {/* Form Content */}
            <div className="backdrop-blur-sm shadow-2xl border border-slate-600/50" style={{backgroundColor: '#22303d'}}>
              <div className="p-6 lg:p-12">
                {renderCurrentStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}