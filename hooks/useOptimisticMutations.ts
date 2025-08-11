import { useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import {
  addPendingBooking,
  removePendingBooking,
  addPendingService,
  removePendingService,
  addPendingFoodCart,
  removePendingFoodCart,
  addPendingFoodItem,
  removePendingFoodItem
} from '../lib/api/optimisticUpdates'

export const useOptimisticMutations = () => {
  const dispatch = useDispatch()

  const createOptimisticBooking = async <T>(
    mutationFn: () => Promise<T>,
    optimisticData?: any
  ) => {
    const tempId = nanoid()
    dispatch(addPendingBooking(tempId))

    try {
      const result = await mutationFn()
      return result
    } catch (error) {
      throw error
    } finally {
      dispatch(removePendingBooking(tempId))
    }
  }

  const createOptimisticService = async <T>(
    mutationFn: () => Promise<T>,
    optimisticData?: any
  ) => {
    const tempId = nanoid()
    dispatch(addPendingService(tempId))

    try {
      const result = await mutationFn()
      return result
    } catch (error) {
      throw error
    } finally {
      dispatch(removePendingService(tempId))
    }
  }

  const createOptimisticFoodCart = async <T>(
    mutationFn: () => Promise<T>,
    optimisticData?: any
  ) => {
    const tempId = nanoid()
    dispatch(addPendingFoodCart(tempId))

    try {
      const result = await mutationFn()
      return result
    } catch (error) {
      throw error
    } finally {
      dispatch(removePendingFoodCart(tempId))
    }
  }

  const createOptimisticFoodItem = async <T>(
    mutationFn: () => Promise<T>,
    optimisticData?: any
  ) => {
    const tempId = nanoid()
    dispatch(addPendingFoodItem(tempId))

    try {
      const result = await mutationFn()
      return result
    } catch (error) {
      throw error
    } finally {
      dispatch(removePendingFoodItem(tempId))
    }
  }

  return {
    createOptimisticBooking,
    createOptimisticService,
    createOptimisticFoodCart,
    createOptimisticFoodItem
  }
}