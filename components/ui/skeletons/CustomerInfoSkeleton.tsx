'use client'

import Skeleton from '../Skeleton'

export default function CustomerInfoSkeleton() {
  return (
    <div className="space-y-[3vh] lg:space-y-[1.5vw]">
      {/* Header Section */}
      <div className="text-center space-y-[1vh] lg:space-y-[0.5vw]">
        <Skeleton className="h-[4vh] lg:h-[2vw] w-[45vh] lg:w-[22vw] mx-auto" />
        <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[30vh] lg:w-[15vw] mx-auto" />
        <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[65vh] lg:w-[32vw] mx-auto" />
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-center space-x-[2vh] lg:space-x-[1vw]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
            <div className="flex items-center space-x-[0.5vh] lg:space-x-[0.3vw]">
              <Skeleton variant="circular" className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw]" />
              <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[12vh] lg:w-[6vw]" />
            </div>
            {i < 3 && <Skeleton className="h-[0.3vh] lg:h-[0.15vw] w-[4vh] lg:w-[2vw]" />}
          </div>
        ))}
      </div>

      {/* Main Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[3vh] lg:gap-[2vw]">
        {/* Personal Information Section */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[3vh] lg:p-[1.5vw]">
          <div className="space-y-[2.5vh] lg:space-y-[1.25vw]">
            {/* Section Header */}
            <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] pb-[1.5vh] lg:pb-[0.8vw] border-b border-slate-600/50">
              <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
              <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[25vh] lg:w-[12vw]" />
            </div>

            {/* Form Fields */}
            <div className="space-y-[2vh] lg:space-y-[1vw]">
              {/* Full Name */}
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[15vh] lg:w-[7vw]" />
                <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
              </div>

              {/* Email */}
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[18vh] lg:w-[9vw]" />
                <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
              </div>

              {/* Phone */}
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[20vh] lg:w-[10vw]" />
                <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[3vh] lg:p-[1.5vw]">
          <div className="space-y-[2.5vh] lg:space-y-[1.25vw]">
            {/* Section Header */}
            <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] pb-[1.5vh] lg:pb-[0.8vw] border-b border-slate-600/50">
              <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
              <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[22vh] lg:w-[11vw]" />
            </div>

            {/* Event Type Selection */}
            <div className="space-y-[1.5vh] lg:space-y-[0.8vw]">
              <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[18vh] lg:w-[9vw]" />
              <div className="grid grid-cols-2 gap-[1vh] lg:gap-[0.5vw]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] p-[1.5vh] lg:p-[0.8vw] border border-slate-600/50 rounded-lg">
                    <Skeleton variant="circular" className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw]" />
                    <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[12vh] lg:w-[6vw]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Count */}
            <div className="space-y-[1vh] lg:space-y-[0.5vw]">
              <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[20vh] lg:w-[10vw]" />
              <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Special Notes Section */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[3vh] lg:p-[1.5vw]">
        <div className="space-y-[2vh] lg:space-y-[1vw]">
          <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
            <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
            <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[28vh] lg:w-[14vw]" />
          </div>
          <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[80vh] lg:w-[40vw]" />
          <Skeleton className="h-[15vh] lg:h-[7.5vw] w-full rounded-lg" />
        </div>
      </div>

      {/* Form Validation Messages */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-[2vh] lg:p-[1vw]">
        <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
          <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw] bg-amber-400/30" />
          <div className="space-y-[0.5vh] lg:space-y-[0.3vw]">
            <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[35vh] lg:w-[17vw] bg-amber-400/30" />
            <Skeleton className="h-[1.2vh] lg:h-[0.6vw] w-[50vh] lg:w-[25vw] bg-amber-400/20" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-[2vh] lg:pt-[1vw] border-t border-slate-600">
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[25vh] lg:w-[12vw] rounded-lg" />
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[40vh] lg:w-[20vw] rounded-lg" />
      </div>
    </div>
  )
}