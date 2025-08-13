'use client'

import Skeleton from '../Skeleton'

export default function ExtrasSkeleton() {
  return (
    <div className="space-y-[2vh] lg:space-y-[1vw]">
      {/* Header Section */}
      <div className="text-center space-y-[1vh] lg:space-y-[0.5vw]">
        <Skeleton className="h-[3.5vh] lg:h-[1.75vw] w-[35vh] lg:w-[17vw] mx-auto" />
        <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[25vh] lg:w-[12vw] mx-auto" />
        <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[60vh] lg:w-[30vw] mx-auto" />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-[1vh] lg:space-x-[0.5vw] bg-slate-800/60 backdrop-blur-sm rounded-lg p-[1vh] lg:p-[0.5vw] border border-slate-600/50">
        <Skeleton className="h-[4.5vh] lg:h-[2.25vw] w-[22vh] lg:w-[11vw] rounded-lg" />
        <Skeleton className="h-[4.5vh] lg:h-[2.25vw] w-[25vh] lg:w-[12vw] rounded-lg" />
      </div>

      {/* Items Browse Area */}
      <div className="min-h-[25vh] lg:min-h-[12vw] bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-600/30 p-[2vh] lg:p-[1vw]">
        <div className="space-y-[2vh] lg:space-y-[1vw]">
          {/* Category Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
              <Skeleton variant="circular" className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw]" />
              <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[20vh] lg:w-[10vw]" />
            </div>
            <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[15vh] lg:w-[7vw]" />
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2vh] lg:gap-[1vw]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 overflow-hidden">
                {/* Item Image */}
                <div className="relative">
                  <Skeleton className="h-[18vh] lg:h-[9vw] w-full" />
                  {/* Add Badge */}
                  <div className="absolute top-[1vh] lg:top-[0.5vw] right-[1vh] lg:right-[0.5vw]">
                    <Skeleton variant="circular" className="w-[4vh] h-[4vh] lg:w-[2vw] lg:h-[2vw]" />
                  </div>
                  {/* Cart Badge */}
                  <div className="absolute bottom-[1vh] lg:bottom-[0.5vw] right-[1vh] lg:right-[0.5vw]">
                    <Skeleton className="h-[3vh] lg:h-[1.5vw] w-[8vh] lg:w-[4vw] rounded-full" />
                  </div>
                </div>
                
                {/* Item Content */}
                <div className="p-[1.5vh] lg:p-[0.8vw] space-y-[1vh] lg:space-y-[0.5vw]">
                  <div className="space-y-[0.5vh] lg:space-y-[0.3vw]">
                    <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-4/5" />
                    <Skeleton className="h-[1.3vh] lg:h-[0.65vw] w-full" />
                    <Skeleton className="h-[1.3vh] lg:h-[0.65vw] w-3/4" />
                  </div>
                  
                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-[1vh] lg:pt-[0.5vw]">
                    <Skeleton className="h-[2vh] lg:h-[1vw] w-[12vh] lg:w-[6vw]" />
                    <Skeleton className="h-[4vh] lg:h-[2vw] w-[18vh] lg:w-[9vw] rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[2vh] lg:p-[1vw]">
        <div className="space-y-[1.5vh] lg:space-y-[0.8vw]">
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-[1vh] lg:pb-[0.5vw] border-b border-slate-600/50">
            <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
              <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
              <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[15vh] lg:w-[7vw]" />
            </div>
            <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[10vh] lg:w-[5vw]" />
          </div>

          {/* Cart Items */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-[1vh] lg:py-[0.5vw] border-b border-slate-700/50 last:border-b-0">
              <div className="flex-1 space-y-[0.5vh] lg:space-y-[0.3vw]">
                <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[25vh] lg:w-[12vw]" />
                <Skeleton className="h-[1.2vh] lg:h-[0.6vw] w-[18vh] lg:w-[9vw]" />
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] mx-[2vh] lg:mx-[1vw]">
                <Skeleton variant="circular" className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw]" />
                <Skeleton className="h-[1.5vh] lg:h-[0.75vw] w-[3vh] lg:w-[1.5vw]" />
                <Skeleton variant="circular" className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw]" />
                <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
              </div>
              
              {/* Price */}
              <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[12vh] lg:w-[6vw]" />
            </div>
          ))}

          {/* Cart Totals */}
          <div className="space-y-[1vh] lg:space-y-[0.5vw] pt-[1vh] lg:pt-[0.5vw] border-t border-slate-600">
            <div className="flex items-center justify-between">
              <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[15vh] lg:w-[7vw]" />
              <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[12vh] lg:w-[6vw]" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[18vh] lg:w-[9vw]" />
              <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[12vh] lg:w-[6vw]" />
            </div>
            <div className="flex items-center justify-between pt-[0.5vh] lg:pt-[0.3vw] border-t border-slate-600/50">
              <Skeleton className="h-[2vh] lg:h-[1vw] w-[12vh] lg:w-[6vw]" />
              <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[18vh] lg:w-[9vw]" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-[1vh] lg:pt-[0.5vw]">
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[25vh] lg:w-[12vw] rounded-lg" />
        <div className="flex space-x-[1vh] lg:space-x-[0.5vw]">
          <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[20vh] lg:w-[10vw] rounded-lg" />
          <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[25vh] lg:w-[12vw] rounded-lg" />
        </div>
      </div>
    </div>
  )
}