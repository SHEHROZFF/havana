'use client'

import Skeleton from '../Skeleton'

export default function CartSelectionSkeleton() {
  return (
    <div className="space-y-[3vh] lg:space-y-[1.5vw]">
      {/* Header Section */}
      {/* <div className="text-center space-y-[1vh] lg:space-y-[0.5vw]">
        <Skeleton className="h-[4vh] lg:h-[2vw] w-[45vh] lg:w-[22vw] mx-auto" />
        <Skeleton className="h-[2vh] lg:h-[1vw] w-[30vh] lg:w-[15vw] mx-auto" />
        <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[70vh] lg:w-[35vw] mx-auto" />
      </div> */}

      {/* Featured Cart Stats */}
      {/* <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[2vh] lg:p-[1vw]">
        <div className="grid grid-cols-3 gap-[2vh] lg:gap-[1vw]">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-[1vh] lg:space-y-[0.5vw]">
              <Skeleton variant="circular" className="w-[4vh] h-[4vh] lg:w-[2vw] lg:h-[2vw] mx-auto" />
              <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[12vh] lg:w-[6vw] mx-auto" />
              <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[8vh] lg:w-[4vw] mx-auto" />
            </div>
          ))}
        </div>
      </div> */}

      {/* Available Carts Grid */}
      <div>
        <div className="flex items-center justify-between mb-[2vh] lg:mb-[1vw]">
          <Skeleton className="h-[2.5vh] lg:h-[1.25vw] w-[30vh] lg:w-[15vw]" />
          <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[15vh] lg:w-[7vw]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3vh] lg:gap-[1.5vw]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 overflow-hidden">
              {/* Cart Image */}
              <div className="relative">
                <Skeleton className="h-[25vh] lg:h-[12.5vw] w-full" />
                {/* Status Badge */}
                <div className="absolute top-[1vh] lg:top-[0.5vw] right-[1vh] lg:right-[0.5vw]">
                  <Skeleton className="h-[2.5vh] lg:h-[1.25vw] w-[15vh] lg:w-[7vw] rounded-full" />
                </div>
              </div>
              
              {/* Cart Content */}
              <div className="p-[2vh] lg:p-[1vw] space-y-[1.5vh] lg:space-y-[0.8vw]">
                {/* Title and Description */}
                <div className="space-y-[0.8vh] lg:space-y-[0.4vw]">
                  <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-4/5" />
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-full" />
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-3/4" />
                </div>
                
                {/* Stats Row */}
                <div className="flex items-center justify-between pt-[1vh] lg:pt-[0.5vw] border-t border-slate-700">
                  <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                    <Skeleton variant="circular" className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw]" />
                    <Skeleton className="h-[1.2vh] lg:h-[0.6vw] w-[8vh] lg:w-[4vw]" />
                  </div>
                  <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                    <Skeleton variant="circular" className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw]" />
                    <Skeleton className="h-[1.2vh] lg:h-[0.6vw] w-[10vh] lg:w-[5vw]" />
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="space-y-[0.5vh] lg:space-y-[0.3vw]">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[12vh] lg:w-[6vw]" />
                    <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[15vh] lg:w-[7vw]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[15vh] lg:w-[7vw]" />
                    <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[12vh] lg:w-[6vw]" />
                  </div>
                </div>
                
                {/* Select Button */}
                <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-[2vh] lg:pt-[1vw] border-t border-slate-600">
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[25vh] lg:w-[12vw] rounded-lg" />
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[30vh] lg:w-[15vw] rounded-lg" />
      </div>
    </div>
  )
}