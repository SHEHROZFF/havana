'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'

interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  isAvailable: boolean
  cartId: string
  cartName?: string
}

interface FoodCart {
  id: string
  name: string
}

export default function FoodItemsPage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [foodCarts, setFoodCarts] = useState<FoodCart[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCart, setSelectedCart] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    cartId: '',
    isAvailable: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch food carts first
      const cartsResponse = await fetch('/api/food-carts')
      if (cartsResponse.ok) {
        const cartsData = await cartsResponse.json()
        setFoodCarts(cartsData)
      }

      // Fetch food items
      const itemsResponse = await fetch('/api/food-items')
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json()
        // Add cartName from carts data
        const itemsWithCartName = itemsData.map((item: FoodItem) => ({
          ...item,
          cartName: foodCarts.find(cart => cart.id === item.cartId)?.name
        }))
        setFoodItems(itemsWithCartName)
      } else {
        console.error('Failed to fetch food items')
        setFoodItems([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...Array.from(new Set(foodItems.map(item => item.category)))]
  const cartOptions = [
    { value: '', label: 'Select a food cart' },
    ...foodCarts.map(cart => ({ value: cart.id, label: cart.name }))
  ]
  const categoryOptions = [
    { value: 'Sandwiches', label: 'Sandwiches' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Sides', label: 'Sides' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Desserts', label: 'Desserts' }
  ]

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesCart = selectedCart === 'all' || item.cartId === selectedCart
    return matchesCategory && matchesCart
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price)
      }

      if (editingItem) {
        // Update existing item via API
        const response = await fetch(`/api/food-items/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData)
        })

        if (response.ok) {
          const updatedItem = await response.json()
          setFoodItems(prev => prev.map(item => 
            item.id === editingItem.id ? updatedItem : item
          ))
        } else {
          throw new Error('Failed to update item')
        }
      } else {
        // Create new item via API
        const response = await fetch('/api/food-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData)
        })

        if (response.ok) {
          const newItem = await response.json()
          setFoodItems(prev => [...prev, newItem])
        } else {
          throw new Error('Failed to create item')
        }
      }
      
      // Reset form
      setShowForm(false)
      setEditingItem(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        cartId: '',
        isAvailable: true
      })
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Failed to save food item. Please try again.')
    }
  }

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image || '',
      category: item.category,
      cartId: item.cartId,
      isAvailable: item.isAvailable
    })
    setShowForm(true)
  }

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this food item?')) {
      try {
        const response = await fetch(`/api/food-items/${itemId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setFoodItems(prev => prev.filter(item => item.id !== itemId))
        } else {
          throw new Error('Failed to delete item')
        }
      } catch (error) {
        console.error('Error deleting item:', error)
        alert('Failed to delete food item. Please try again.')
      }
    }
  }

  const toggleItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/food-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable })
      })

      if (response.ok) {
        const updatedItem = await response.json()
        setFoodItems(prev => prev.map(item => 
          item.id === itemId ? updatedItem : item
        ))
      } else {
        throw new Error('Failed to update availability')
      }
    } catch (error) {
      console.error('Error updating availability:', error)
      alert('Failed to update item availability. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Food Items Management
          </h1>
          <p className="text-gray-400">
            Manage menu items for all your food carts
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button onClick={() => setShowForm(true)}>
            ➕ Add New Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Filter by Cart"
              options={[
                { value: 'all', label: 'All Carts' },
                ...foodCarts.map(cart => ({ value: cart.id, label: cart.name }))
              ]}
              value={selectedCart}
              onChange={(e) => setSelectedCart(e.target.value)}
            />
            <Select
              label="Filter by Category"
              options={[
                { value: 'all', label: 'All Categories' },
                ...categories.filter(cat => cat !== 'all').map(cat => ({ value: cat, label: cat }))
              ]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                📊 Export Menu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">
              {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Item Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g., Cuban Sandwich"
                />
                
                <Input
                  label="Price ($)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                />
                
                <Select
                  label="Food Cart"
                  options={cartOptions}
                  value={formData.cartId}
                  onChange={(e) => setFormData(prev => ({ ...prev, cartId: e.target.value }))}
                  required
                />
                
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the food item..."
                  required
                />
              </div>
              
              <Input
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
              
              {formData.image && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preview
                  </label>
                  <div className="w-32 h-20 bg-slate-600 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Item preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  className="w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500 focus:ring-2"
                />
                <label htmlFor="isAvailable" className="text-sm text-gray-300">
                  Item is available for ordering
                </label>
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingItem(null)
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      image: '',
                      category: '',
                      cartId: '',
                      isAvailable: true
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-slate-700/50 backdrop-blur-sm border-slate-600 hover:border-slate-500 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-0">
              {/* Food Image */}
              <div className="h-32 bg-slate-600 rounded-t-xl overflow-hidden">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop&auto=format'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white text-sm">{item.name}</h3>
                  <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    item.isAvailable 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  )}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="space-y-1 mb-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-teal-400 font-bold">${item.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cart:</span>
                    <span className="text-white text-xs">{item.cartName}</span>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    className="flex-1 text-xs"
                  >
                    ✏️
                  </Button>
                  <Button
                    size="sm"
                    variant={item.isAvailable ? "ghost" : "outline"}
                    onClick={() => toggleItemAvailability(item.id, !item.isAvailable)}
                    className={item.isAvailable ? "text-yellow-400 hover:bg-yellow-500/20" : "text-green-400 hover:bg-green-500/20"}
                  >
                    {item.isAvailable ? '⏸️' : '▶️'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">No food items found</h3>
            <p className="text-gray-400 mb-4">
              {selectedCategory !== 'all' || selectedCart !== 'all' 
                ? 'Try adjusting your filters or add new items.' 
                : 'Get started by adding your first food item.'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              ➕ Add Food Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}