'use client'

import Skeleton from '../Skeleton'

export default function DeliveryStepSkeleton() {
  return (
    <div className="space-y-[3vh] lg:space-y-[1.5vw]">
      {/* Header Section */}
      <div className="text-center space-y-[1vh] lg:space-y-[0.5vw]">
        <Skeleton className="h-[4vh] lg:h-[2vw] w-[40vh] lg:w-[20vw] mx-auto" />
        <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[30vh] lg:w-[15vw] mx-auto" />
        <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[70vh] lg:w-[35vw] mx-auto" />
      </div>

      {/* Delivery Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[3vh] lg:gap-[1.5vw]">
        {/* Pickup Option Skeleton */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[3vh] lg:p-[1.5vw]">
          <div className="space-y-[2vh] lg:space-y-[1vw]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.8vw]">
                <Skeleton variant="circular" className="w-[5vh] h-[5vh] lg:w-[2.5vw] lg:h-[2.5vw]" />
                <div className="space-y-[0.5vh] lg:space-y-[0.3vw]">
                  <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[12vh] lg:w-[6vw]" />
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[20vh] lg:w-[10vw]" />
                </div>
              </div>
              <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
            </div>

            {/* Features List */}
            <div className="space-y-[1vh] lg:space-y-[0.5vw]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                  <Skeleton variant="circular" className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw]" />
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[25vh] lg:w-[12vw]" />
                </div>
              ))}
            </div>

            {/* Price Section */}
            <div className="pt-[1.5vh] lg:pt-[0.8vw] border-t border-slate-600/50">
              <div className="flex items-center justify-between">
                <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[8vh] lg:w-[4vw]" />
                <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[12vh] lg:w-[6vw]" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Option Skeleton */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-teal-500/50 p-[3vh] lg:p-[1.5vw]">
          <div className="space-y-[2vh] lg:space-y-[1vw]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.8vw]">
                <Skeleton variant="circular" className="w-[5vh] h-[5vh] lg:w-[2.5vw] lg:h-[2.5vw] bg-teal-500/20" />
                <div className="space-y-[0.5vh] lg:space-y-[0.3vw]">
                  <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[15vh] lg:w-[7vw]" />
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[22vh] lg:w-[11vw]" />
                </div>
              </div>
              <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw] bg-teal-400/30" />
            </div>

            {/* Features List */}
            <div className="space-y-[1vh] lg:space-y-[0.5vw]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                  <Skeleton variant="circular" className="w-[1.6vh] h-[1.6vh] lg:w-[0.8vw] lg:h-[0.8vw] bg-teal-400/30" />
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[28vh] lg:w-[14vw]" />
                </div>
              ))}
            </div>

            {/* Price Section */}
            <div className="pt-[1.5vh] lg:pt-[0.8vw] border-t border-slate-600/50">
              <div className="flex items-center justify-between">
                <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[15vh] lg:w-[7vw]" />
                <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[15vh] lg:w-[7vw] bg-teal-400/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Form Skeleton */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[3vh] lg:p-[1.5vw]">
        <div className="space-y-[2.5vh] lg:space-y-[1.25vw]">
          {/* Form Header */}
          <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
            <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
            <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[25vh] lg:w-[12vw]" />
          </div>
          
          {/* Address Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2vh] lg:gap-[1vw]">
            {/* Street Address - Full Width */}
            <div className="md:col-span-2 space-y-[1vh] lg:space-y-[0.5vw]">
              <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[20vh] lg:w-[10vw]" />
              <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
            </div>
            
            {/* City */}
            <div className="space-y-[1vh] lg:space-y-[0.5vw]">
              <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[8vh] lg:w-[4vw]" />
              <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
            </div>
            
            {/* State */}
            <div className="space-y-[1vh] lg:space-y-[0.5vw]">
              <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[10vh] lg:w-[5vw]" />
              <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
            </div>
            
            {/* ZIP Code */}
            <div className="space-y-[1vh] lg:space-y-[0.5vw]">
              <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[15vh] lg:w-[7vw]" />
              <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
            </div>
          </div>

          {/* Delivery Information Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-[2vh] lg:p-[1vw]">
            <div className="flex items-start space-x-[1vh] lg:space-x-[0.5vw]">
              <Skeleton variant="circular" className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] bg-blue-400/30 mt-[0.2vh] lg:mt-[0.1vw]" />
              <div className="flex-1 space-y-[0.5vh] lg:space-y-[0.3vw]">
                <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[25vh] lg:w-[12vw] bg-blue-400/30" />
                <Skeleton className="h-[1.2vh] lg:h-[0.6vw] w-full bg-blue-400/20" />
                <Skeleton className="h-[1.2vh] lg:h-[0.6vw] w-4/5 bg-blue-400/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Message Skeleton */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-[2vh] lg:p-[1vw]">
        <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
          <Skeleton variant="circular" className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] bg-amber-400/30" />
          <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[50vh] lg:w-[25vw] bg-amber-400/20" />
        </div>
      </div>

      {/* Navigation Skeleton */}
      <div className="flex justify-between items-center pt-[2vh] lg:pt-[1vw] border-t border-slate-600">
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[25vh] lg:w-[12vw] rounded-lg" />
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[40vh] lg:w-[20vw] rounded-lg" />
      </div>
    </div>
  )
}