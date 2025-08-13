'use client'

import Skeleton from '../Skeleton'

export default function PaymentSkeleton() {
  return (
    <div className="space-y-[3vh] lg:space-y-[1.5vw]">
      {/* Header Section */}
      <div className="text-center space-y-[1vh] lg:space-y-[0.5vw]">
        <Skeleton className="h-[4vh] lg:h-[2vw] w-[35vh] lg:w-[17vw] mx-auto" />
        <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[25vh] lg:w-[12vw] mx-auto" />
        <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[60vh] lg:w-[30vw] mx-auto" />
      </div>

      {/* Order Summary & Payment Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[3vh] lg:gap-[2vw]">
        {/* Order Summary Section */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[3vh] lg:p-[1.5vw]">
          <div className="space-y-[2.5vh] lg:space-y-[1.25vw]">
            {/* Summary Header */}
            <div className="flex items-center justify-between pb-[2vh] lg:pb-[1vw] border-b border-slate-600/50">
              <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
                <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
                <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[20vh] lg:w-[10vw]" />
              </div>
              <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[12vh] lg:w-[6vw]" />
            </div>

            {/* Booking Details */}
            <div className="space-y-[1.5vh] lg:space-y-[0.8vw]">
              {/* Cart Details */}
              <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.8vw] p-[1.5vh] lg:p-[0.8vw] bg-slate-700/30 rounded-lg">
                <Skeleton className="h-[8vh] lg:h-[4vw] w-[12vh] lg:w-[6vw] rounded-lg" />
                <div className="flex-1 space-y-[0.8vh] lg:space-y-[0.4vw]">
                  <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[20vh] lg:w-[10vw]" />
                  <Skeleton className="h-[1.3vh] lg:h-[0.65vw] w-[15vh] lg:w-[7vw]" />
                  <Skeleton className="h-[1.3vh] lg:h-[0.65vw] w-[18vh] lg:w-[9vw]" />
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[18vh] lg:w-[9vw]" />
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[15vh] lg:w-[7vw]" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[15vh] lg:w-[7vw]" />
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[12vh] lg:w-[6vw]" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[20vh] lg:w-[10vw]" />
                  <Skeleton className="h-[1.4vh] lg:h-[0.7vw] w-[12vh] lg:w-[6vw]" />
                </div>
                <div className="flex items-center justify-between pt-[1vh] lg:pt-[0.5vw] border-t border-slate-600/50">
                  <Skeleton className="h-[2vh] lg:h-[1vw] w-[12vh] lg:w-[6vw]" />
                  <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[20vh] lg:w-[10vw]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 p-[3vh] lg:p-[1.5vw]">
          <div className="space-y-[2.5vh] lg:space-y-[1.25vw]">
            {/* Payment Header */}
            <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] pb-[2vh] lg:pb-[1vw] border-b border-slate-600/50">
              <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
              <Skeleton className="h-[2.2vh] lg:h-[1.1vw] w-[25vh] lg:w-[12vw]" />
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-[1.5vh] lg:space-y-[0.8vw]">
              <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[22vh] lg:w-[11vw]" />
              <div className="grid grid-cols-1 gap-[1vh] lg:gap-[0.5vw]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-[1.5vh] lg:space-x-[0.8vw] p-[2vh] lg:p-[1vw] border border-slate-600/50 rounded-lg">
                    <Skeleton variant="circular" className="w-[2.5vh] h-[2.5vh] lg:w-[1.25vw] lg:h-[1.25vw]" />
                    <Skeleton variant="circular" className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw]" />
                    <div className="flex-1 space-y-[0.5vh] lg:space-y-[0.3vw]">
                      <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[18vh] lg:w-[9vw]" />
                      <Skeleton className="h-[1.2vh] lg:h-[0.6vw] w-[25vh] lg:w-[12vw]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-[2vh] lg:space-y-[1vw]">
              {/* Card Number */}
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[18vh] lg:w-[9vw]" />
                <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-[2vh] lg:gap-[1vw]">
                <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                  <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[15vh] lg:w-[7vw]" />
                  <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
                </div>
                <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                  <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[8vh] lg:w-[4vw]" />
                  <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-[1vh] lg:space-y-[0.5vw]">
                <Skeleton className="h-[1.8vh] lg:h-[0.9vw] w-[22vh] lg:w-[11vw]" />
                <Skeleton className="h-[5vh] lg:h-[2.5vw] w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-[2vh] lg:p-[1vw]">
        <div className="flex items-center space-x-[1.5vh] lg:space-x-[0.8vw]">
          <Skeleton variant="circular" className="w-[3vh] h-[3vh] lg:w-[1.5vw] lg:h-[1.5vw] bg-green-400/30" />
          <div className="space-y-[0.5vh] lg:space-y-[0.3vw]">
            <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[40vh] lg:w-[20vw] bg-green-400/30" />
            <Skeleton className="h-[1.2vh] lg:h-[0.6vw] w-[60vh] lg:w-[30vw] bg-green-400/20" />
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-slate-700/30 rounded-lg p-[2vh] lg:p-[1vw]">
        <div className="space-y-[1vh] lg:space-y-[0.5vw]">
          <div className="flex items-center space-x-[1vh] lg:space-x-[0.5vw]">
            <Skeleton variant="circular" className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw]" />
            <Skeleton className="h-[1.6vh] lg:h-[0.8vw] w-[35vh] lg:w-[17vw]" />
          </div>
          <Skeleton className="h-[1.2vh] lg:h-[0.6vw] w-[80vh] lg:w-[40vw] ml-[3vh] lg:ml-[1.5vw]" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-[2vh] lg:pt-[1vw] border-t border-slate-600">
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[25vh] lg:w-[12vw] rounded-lg" />
        <Skeleton className="h-[5vh] lg:h-[2.5vw] w-[45vh] lg:w-[22vw] rounded-lg" />
      </div>
    </div>
  )
}