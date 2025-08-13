'use client'

import { clsx } from 'clsx'
import { useI18n } from '@/lib/i18n/context'

interface Step {
  id: string
  title: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: string
  completedSteps: string[]
}

export default function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  const { t } = useI18n()
  
  // Function to get translated step title and description
  const getTranslatedStep = (step: Step) => {
    const stepTranslations: Record<string, { title: string; description: string }> = {
      'cart-selection': {
        title: t('step_cart_selection_title'),
        description: t('step_cart_selection_desc')
      },
      'extras': {
        title: t('step_extras_title'),
        description: t('step_extras_desc')
      },
      'timing': {
        title: t('step_timing_title'),
        description: t('step_timing_desc')
      },
      'delivery': {
        title: t('step_delivery_title'),
        description: t('step_delivery_desc')
      },
      'customer-info': {
        title: t('step_customer_info_title'),
        description: t('step_customer_info_desc')
      },
      'payment': {
        title: t('step_payment_title'),
        description: t('step_payment_desc')
      }
    }
    return stepTranslations[step.id] || { title: step.title, description: step.description || '' }
  }

  return (
    <nav aria-label="Progress" className="mb-[6vh] lg:mb-[1.5vw]">
      <div className="flex items-center justify-center">
        <ol className="flex items-center space-x-[2vh] lg:space-x-[0.8vw]">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = step.id === currentStep
            const isUpcoming = !isCompleted && !isCurrent
            const translatedStep = getTranslatedStep(step)

            return (
              <li key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'flex items-center justify-center w-[6vh] h-[6vh] lg:w-[2vw] lg:h-[2vw] rounded-full text-[1.8vh] lg:text-[0.7vw] font-bold border-2 transition-all duration-300',
                      {
                        'bg-teal-500 text-white border-teal-500 shadow-lg': isCompleted,
                        'bg-teal-500 text-white border-teal-500 shadow-lg ring-4 ring-teal-500/20': isCurrent,
                        'bg-slate-600 text-gray-300 border-slate-500': isUpcoming
                      }
                    )}
                  >
                    {isCompleted ? (
                      <svg className="w-[3vh] h-[3vh] lg:w-[1vw] lg:h-[1vw]" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {/* Hide titles/descriptions on mobile; only show numbered circles */}
                  <div className="mt-[1.5vh] lg:mt-[0.4vw] text-center hidden lg:block">
                    <p
                      className={clsx(
                        'text-[1.8vh] lg:text-[0.6vw] font-medium',
                        {
                          'text-teal-400': isCompleted || isCurrent,
                          'text-gray-400': isUpcoming
                        }
                      )}
                    >
                      {translatedStep.title}
                    </p>
                    {translatedStep.description && (
                      <p className="text-[1.4vh] lg:text-[0.5vw] text-white mt-[0.5vh] lg:mt-[0.2vw] max-w-[10vh] lg:max-w-[4vw]">
                        {translatedStep.description}
                      </p>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block w-[8vh] lg:w-[3vw] h-[0.3vh] lg:h-[0.1vw] bg-slate-600 ml-[2vh] lg:ml-[0.8vw]" />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}