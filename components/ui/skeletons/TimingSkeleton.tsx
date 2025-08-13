'use client'

import Skeleton from '../Skeleton'

export default function TimingSkeleton() {
  return (
    <div className="space-y-[3vh] lg:space-y-[1.5vw]">
      {/* Header Section */}
      <div className="text-center space-y-[1vh] lg:space-y-[0.5vw]">
        <Skeleton className="h-[4vh] lg:h-[2vw] w-[40vh] lg:w-[20vw] mx-auto" />
        <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[25vh] lg:w-[12vw] mx-auto" />
        <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[70vh] lg:w-[35vw] mx-auto" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[3vh] lg:gap-[2vw]">
        {/* Calendar Section */}
        <div className="order-1 lg:order-1 space-y-[2vh] lg:space-y-[1vw]">
          <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
            <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
            <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[20vh] lg:w-[10vw]" />
          </div>
          
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[2vh] lg:p-[1vw]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-[2vh] lg:mb-[1vw]">
              <Skeleton variant="circular" className="w-[3.5vh] h-[3.5vh] lg:w-[1.75vw] lg:h-[1.75vw]" />
              <Skeleton className="h-[2vh] lg:h-[1vw] w-[25vh] lg:w-[12vw]" />
              <Skeleton variant="circular" className="w-[3.5vh] h-[3.5vh] lg:w-[1.75vw] lg:h-[1.75vw]" />
            </div>
            
            {/* Days of Week Headers */}
            <div className="grid grid-cols-7 gap-[0.4vh] lg:gap-[0.2vw] mb-[1vh] lg:mb-[0.5vw]">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-[1.5vh] lg:h-[0.75vw] w-full rounded" />
              ))}
            </div>
            
            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-[0.4vh] lg:gap-[0.2vw]">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className={`h-[4vh] lg:h-[2vw] w-full rounded-lg ${
                    i % 7 === 0 || i % 7 === 6 ? 'opacity-50' : ''
                  } ${
                    i >= 8 && i <= 12 ? 'bg-teal-500/20' : ''
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Time Selection Section */}
        <div className="order-2 lg:order-2 space-y-[2vh] lg:space-y-[1vw]">
          <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
            <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
            <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[25vh] lg:w-[12vw]" />
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[3vh] lg:p-[1.5vw]">
            {/* Time Input Section */}
            <div className="space-y-[2.5vh] lg:space-y-[1.25vw]">
              {/* Start Time */}
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[15vh] lg:w-[7vw]" />
                <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
              </div>
              
              {/* End Time */}
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[12vh] lg:w-[6vw]" />
                <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
              </div>
            </div>

            {/* Duration Display */}
            <div className="mt-[3vh] lg:mt-[1.5vw] p-[2vh] lg:p-[1vw] bg-slate-700/50 rounded-lg border border-slate-600/30">
              <div className="text-center space-y-[1vh] lg:space-y-[0.5vw]">
                <div className="flex items-center justify-center space-x-[1vh] lg:space-x-[0.5vw]">
                  <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
                  <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[15vh] lg:w-[7vw]" />
                </div>
                <Skeleton className="h-[2.5vh] lg:h-[1.25vw] w-[12vh] lg:w-[6vw] mx-auto" />
                <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[25vh] lg:w-[12vw] mx-auto" />
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mt-[2vh] lg:mt-[1vw] space-y-[1vh] lg:space-y-[0.5vw] p-[1.5vh] lg:p-[0.8vw] bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[20vh] lg:w-[10vw]" />
                <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[15vh] lg:w-[7vw]" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[18vh] lg:w-[9vw]" />
                <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[12vh] lg:w-[6vw]" />
              </div>
              <div className="flex items-center justify-between pt-[1vh] lg:pt-[0.5vw] border-t border-slate-600/50">
                <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[12vh] lg:w-[6vw]" />
                <Skeleton className="h-[2vh] lg:h-[1vw] w-[18vh] lg:w-[9vw]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Warning Skeleton */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-[2vh] lg:p-[1vw]">
        <div className="flex items-start space-x-[1.5vh] lg:space-x-[0.8vw]">
          <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw] bg-red-400/30" />
          <div className="flex-1 space-y-[0.8vh] lg:space-y-[0.4vw]">
            <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[30vh] lg:w-[15vw] bg-red-400/30" />
            <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[60vh] lg:w-[30vw] bg-red-400/20" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-[2vh] lg:pt-[1vw] border-t border-slate-600">
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[25vh] lg:w-[12vw] rounded-lg" />
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[35vh] lg:w-[17vw] rounded-lg" />
      </div>
    </div>
  )
}