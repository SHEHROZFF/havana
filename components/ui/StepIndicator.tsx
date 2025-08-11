'use client'

import { clsx } from 'clsx'

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
  return (
    <nav aria-label="Progress" className="mb-[6vh] lg:mb-[1.5vw]">
      <div className="flex items-center justify-center">
        <ol className="flex items-center space-x-[2vh] lg:space-x-[0.8vw]">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = step.id === currentStep
            const isUpcoming = !isCompleted && !isCurrent

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
                  <div className="mt-[1.5vh] lg:mt-[0.4vw] text-center">
                    <p
                      className={clsx(
                        'text-[1.8vh] lg:text-[0.6vw] font-medium',
                        {
                          'text-teal-400': isCompleted || isCurrent,
                          'text-gray-400': isUpcoming
                        }
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-[1.4vh] lg:text-[0.5vw] text-gray-500 mt-[0.5vh] lg:mt-[0.2vw] max-w-[10vh] lg:max-w-[4vw]">
                        {step.description}
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