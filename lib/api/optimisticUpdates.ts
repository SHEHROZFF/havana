import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface OptimisticState {
  pendingBookings: string[]
  pendingServices: string[]
  pendingFoodCarts: string[]
  pendingFoodItems: string[]
}

const initialState: OptimisticState = {
  pendingBookings: [],
  pendingServices: [],
  pendingFoodCarts: [],
  pendingFoodItems: []
}

export const optimisticSlice = createSlice({
  name: 'optimistic',
  initialState,
  reducers: {
    addPendingBooking: (state, action: PayloadAction<string>) => {
      state.pendingBookings.push(action.payload)
    },
    removePendingBooking: (state, action: PayloadAction<string>) => {
      state.pendingBookings = state.pendingBookings.filter(id => id !== action.payload)
    },
    addPendingService: (state, action: PayloadAction<string>) => {
      state.pendingServices.push(action.payload)
    },
    removePendingService: (state, action: PayloadAction<string>) => {
      state.pendingServices = state.pendingServices.filter(id => id !== action.payload)
    },
    addPendingFoodCart: (state, action: PayloadAction<string>) => {
      state.pendingFoodCarts.push(action.payload)
    },
    removePendingFoodCart: (state, action: PayloadAction<string>) => {
      state.pendingFoodCarts = state.pendingFoodCarts.filter(id => id !== action.payload)
    },
    addPendingFoodItem: (state, action: PayloadAction<string>) => {
      state.pendingFoodItems.push(action.payload)
    },
    removePendingFoodItem: (state, action: PayloadAction<string>) => {
      state.pendingFoodItems = state.pendingFoodItems.filter(id => id !== action.payload)
    },
    clearAllPending: (state) => {
      state.pendingBookings = []
      state.pendingServices = []
      state.pendingFoodCarts = []
      state.pendingFoodItems = []
    }
  }
})

export const {
  addPendingBooking,
  removePendingBooking,
  addPendingService,
  removePendingService,
  addPendingFoodCart,
  removePendingFoodCart,
  addPendingFoodItem,
  removePendingFoodItem,
  clearAllPending
} = optimisticSlice.actions

export default optimisticSlice.reducer