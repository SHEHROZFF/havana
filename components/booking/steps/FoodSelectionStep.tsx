'use client'

import { useState, useEffect } from 'react'
import { BookingFormData, FoodItem } from '@/types/booking'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'

interface FoodSelectionStepProps {
  formData: Partial<BookingFormData>
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

const FOOD_FALLBACK_IMAGES = {
  sandwich: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop&auto=format',
  main: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop&auto=format',
  sides: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=300&h=200&fit=crop&auto=format',
  beverages: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop&auto=format',
  desserts: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop&auto=format',
  default: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop&auto=format'
}

const getFoodFallbackImage = (category: string): string => {
  const cat = category.toLowerCase()
  if (cat.includes('sandwich')) return FOOD_FALLBACK_IMAGES.sandwich
  if (cat.includes('main')) return FOOD_FALLBACK_IMAGES.main
  if (cat.includes('side')) return FOOD_FALLBACK_IMAGES.sides
  if (cat.includes('beverage') || cat.includes('drink')) return FOOD_FALLBACK_IMAGES.beverages
  if (cat.includes('dessert')) return FOOD_FALLBACK_IMAGES.desserts
  return FOOD_FALLBACK_IMAGES.default
}

export default function FoodSelectionStep({ formData, updateFormData, onNext, onPrevious }: FoodSelectionStepProps) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState(formData.selectedItems || [])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!formData.selectedCartId) return
      
      setLoading(true)
      try {
        const response = await fetch(`/api/food-carts/${formData.selectedCartId}`)
        if (response.ok) {
          const cartData = await response.json()
          setFoodItems(cartData.foodItems || [])
        } else {
          console.error('Failed to fetch food items')
          setFoodItems([])
        }
      } catch (error) {
        console.error('Error fetching food items:', error)
        setFoodItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchFoodItems()
  }, [formData.selectedCartId])

  const categories = ['all', ...Array.from(new Set(foodItems.map(item => item.category)))]
  const filteredItems = selectedCategory === 'all' ? foodItems : foodItems.filter(item => item.category === selectedCategory)

  const getItemQuantity = (itemId: string) => {
    const item = selectedItems.find(item => item.itemId === itemId)
    return item ? item.quantity : 0
  }

  const updateItemQuantity = (itemId: string, quantity: number, price: number) => {
    let newSelectedItems = [...selectedItems]
    const existingIndex = newSelectedItems.findIndex(item => item.itemId === itemId)
    
    if (quantity === 0) {
      if (existingIndex > -1) {
        newSelectedItems.splice(existingIndex, 1)
      }
    } else {
      if (existingIndex > -1) {
        newSelectedItems[existingIndex] = { itemId, quantity, price }
      } else {
        newSelectedItems.push({ itemId, quantity, price })
      }
    }
    
    setSelectedItems(newSelectedItems)
    const totalAmount = newSelectedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    updateFormData({ selectedItems: newSelectedItems, totalAmount })
  }

  const handleNext = () => {
    if (selectedItems.length > 0) {
      onNext()
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading menu items...</p>
      </div>
    )
  }

  if (foodItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🍽️</div>
        <h2 className="text-2xl font-bold text-white mb-4">No Menu Items Available</h2>
        <p className="text-gray-400 mb-8">
          This food cart doesn't have any menu items set up yet.
          <br />
          Please contact the admin to add menu items for this cart.
        </p>
        <button
          onClick={onPrevious}
          className="px-8 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors duration-300"
        >
          ← Back to Cart Selection
        </button>
      </div>
    )
  }

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Select Your Menu Items
        </h2>
        <p className="text-gray-400 text-lg">
          Page 2 of 5
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={clsx(
              'px-6 py-2 rounded-full font-medium transition-all duration-300',
              selectedCategory === category
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
            )}
          >
            {category === 'all' ? 'All Items' : category}
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const quantity = getItemQuantity(item.id)
          
          return (
            <div key={item.id} className="bg-slate-600/50 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="h-32 bg-slate-500 overflow-hidden">
                <img 
                  src={item.image || getFoodFallbackImage(item.category)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.src = getFoodFallbackImage(item.category)
                  }}
                />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-bold text-lg">{item.name}</h3>
                  <span className="text-xs bg-teal-500 text-white px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-teal-400 font-bold text-xl">
                    ${item.price}
                  </span>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Quantity:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateItemQuantity(item.id, Math.max(0, quantity - 1), item.price)}
                      disabled={quantity === 0}
                      className="w-8 h-8 bg-slate-500 text-white rounded-full flex items-center justify-center hover:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.id, quantity + 1, item.price)}
                      className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {quantity > 0 && (
                  <div className="mt-2 text-right text-teal-400 font-medium">
                    Subtotal: ${(quantity * item.price).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Summary */}
      {selectedItems.length > 0 && (
        <div className="bg-teal-500/20 border border-teal-500/50 rounded-xl p-6">
          <h3 className="font-bold text-xl text-white mb-3">Order Summary</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">{totalItems} items selected</span>
            <span className="text-2xl font-bold text-teal-400">
              Total: ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          className="px-8"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedItems.length === 0}
          size="lg"
          className="px-8"
        >
          Next
        </Button>
      </div>
    </div>
  )
}