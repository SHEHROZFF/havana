export interface FoodCart {
  id: string
  name: string
  description: string
  image?: string
  location: string
  pricePerHour: number
  capacity: number
  isActive: boolean
}

export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  isAvailable: boolean
  cartId: string
}

export interface Service {
  id: string
  name: string
  description: string
  pricePerHour: number
  category: ServiceCategory
  isActive: boolean
  cartId?: string
  cartName?: string
}

export interface BookingFormData {
  // Step 1: Cart Selection
  selectedCartId: string
  
  // Step 2: Food Selection
  selectedItems: {
    itemId: string
    quantity: number
    price: number
  }[]
  
  // Step 2.5: Services Selection (NEW)
  selectedServices: {
    serviceId: string
    quantity: number
    hours: number
    pricePerHour: number
  }[]
  
  // Step 3: Timing (ENHANCED - Now Dynamic)
  bookingDate: string
  startTime: string
  endTime: string
  totalHours: number
  isCustomTiming: boolean
  timeSlotType?: string
  
  // Step 4: Customer Information
  customerName: string
  customerEmail: string
  customerPhone: string
  eventType: string
  guestCount: number
  specialNotes?: string
  
  // Step 5: Payment (ENHANCED)
  totalAmount: number
  cartServiceAmount: number
  servicesAmount: number
  foodAmount: number
  paymentMethod: string
}

export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
  price: number
}

export type ServiceCategory = 'STAFF' | 'KITCHEN' | 'SUPPORT' | 'MANAGEMENT' | 'SPECIAL'

export const BOOKING_STEPS = [
  {
    id: 'cart-selection',
    title: 'Select Cart',
    description: 'Choose your food cart'
  },
  {
    id: 'food-selection',
    title: 'Select Food',
    description: 'Pick your menu items'
  },
  {
    id: 'services-selection',
    title: 'Select Services',
    description: 'Add staff & services'
  },
  {
    id: 'timing',
    title: 'Choose Time',
    description: 'Select date and time'
  },
  {
    id: 'customer-info',
    title: 'Your Details',
    description: 'Personal information'
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Complete booking'
  }
] as const

export type BookingStep = typeof BOOKING_STEPS[number]['id']