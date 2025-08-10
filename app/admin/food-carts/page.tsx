'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'

interface FoodCart {
  id: string
  name: string
  description: string
  image?: string
  location: string
  pricePerHour: number
  capacity: number
  isActive: boolean
  totalBookings?: number
  revenue?: number
}

// Havana van images for easy selection
const HAVANA_VAN_IMAGES = [
  {
    url: 'https://havana.gr/wp-content/uploads/2025/06/Desktop.d7abe289.vw_t2_lissabon.webp',
    name: 'Classic VW Van (Lisbon Style)'
  },
  {
    url: 'https://havana.gr/wp-content/uploads/2025/06/vintage-van-on-transparent-background-free-png.webp',
    name: 'Vintage Van (Transparent)'
  }
]

export default function FoodCartsPage() {
  const [carts, setCarts] = useState<FoodCart[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCart, setEditingCart] = useState<FoodCart | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    location: '',
    pricePerHour: '',
    capacity: '',
    isActive: true
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedVanImage, setSelectedVanImage] = useState<string>('')

  useEffect(() => {
    fetchCarts()
  }, [])

  const fetchCarts = async () => {
    try {
      const response = await fetch('/api/food-carts')
      if (response.ok) {
        const data = await response.json()
        setCarts(data)
      } else {
        console.error('Failed to fetch carts')
        setCarts([]) // Start with empty array - admin will add carts
      }
    } catch (error) {
      console.error('Error fetching carts:', error)
      setCarts([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
      setSelectedVanImage('') // Clear van selection when uploading custom image
    }
  }

  const handleVanImageSelect = (vanImage: string) => {
    setSelectedVanImage(vanImage)
    setImagePreview(vanImage)
    setFormData(prev => ({ ...prev, image: vanImage }))
    setImageFile(null) // Clear file upload when selecting van
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const cartData = {
        ...formData,
        pricePerHour: parseFloat(formData.pricePerHour),
        capacity: parseInt(formData.capacity),
        image: formData.image || HAVANA_VAN_IMAGES[0].url // Default to first van if no image
      }

      if (editingCart) {
        // Update existing cart
        const response = await fetch(`/api/food-carts/${editingCart.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartData)
        })
        
        if (response.ok) {
          setCarts(prev => prev.map(cart => 
            cart.id === editingCart.id ? { ...cart, ...cartData } : cart
          ))
        } else {
          alert('Failed to update cart. Please try again.')
        }
      } else {
        // Create new cart
        const response = await fetch('/api/food-carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartData)
        })
        
        if (response.ok) {
          const newCart = await response.json()
          setCarts(prev => [...prev, newCart])
        } else {
          alert('Failed to create cart. Please check database connection.')
        }
      }
      
      // Reset form
      resetForm()
    } catch (error) {
      console.error('Error saving cart:', error)
      alert('Error saving cart. Please try again.')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCart(null)
    setFormData({
      name: '',
      description: '',
      image: '',
      location: '',
      pricePerHour: '',
      capacity: '',
      isActive: true
    })
    setImageFile(null)
    setImagePreview('')
    setSelectedVanImage('')
  }

  const handleEdit = (cart: FoodCart) => {
    setEditingCart(cart)
    setFormData({
      name: cart.name,
      description: cart.description,
      image: cart.image || '',
      location: cart.location,
      pricePerHour: cart.pricePerHour.toString(),
      capacity: cart.capacity.toString(),
      isActive: cart.isActive
    })
    setImagePreview(cart.image || '')
    
    // Check if current image is one of our van images
    const vanImage = HAVANA_VAN_IMAGES.find(van => van.url === cart.image)
    setSelectedVanImage(vanImage ? vanImage.url : '')
    
    setShowForm(true)
  }

  const handleDelete = async (cartId: string) => {
    if (confirm('Are you sure you want to delete this cart? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/food-carts/${cartId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setCarts(prev => prev.filter(cart => cart.id !== cartId))
        } else {
          alert('Failed to delete cart. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting cart:', error)
        alert('Error deleting cart. Please try again.')
      }
    }
  }

  const toggleCartStatus = async (cartId: string, isActive: boolean) => {
    try {
      setCarts(prev => prev.map(cart => 
        cart.id === cartId ? { ...cart, isActive } : cart
      ))
      // TODO: Update backend
    } catch (error) {
      console.error('Error updating cart status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading food carts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Food Carts Management
          </h1>
          <p className="text-gray-400">
            Manage your fleet of food carts and their availability
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button onClick={() => setShowForm(true)}>
            ➕ Add New Cart
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Carts</p>
                <p className="text-2xl font-bold text-white">{carts.length}</p>
              </div>
              <div className="text-3xl">🚚</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Carts</p>
                <p className="text-2xl font-bold text-green-400">
                  {carts.filter(cart => cart.isActive).length}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Inactive Carts</p>
                <p className="text-2xl font-bold text-red-400">
                  {carts.filter(cart => !cart.isActive).length}
                </p>
              </div>
              <div className="text-3xl">⏸️</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">
              {editingCart ? 'Edit Food Cart' : 'Add New Food Cart'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Cart Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g., Havana Street Tacos"
                />
                
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                  placeholder="e.g., Downtown Miami"
                />
                
                <Input
                  label="Price per Hour ($)"
                  type="number"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                  placeholder="150.00"
                />
                
                <Input
                  label="Capacity (people)"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  required
                  min="1"
                  placeholder="80"
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
                  placeholder="Describe your food cart and what makes it special..."
                  required
                />
              </div>
              
              {/* Havana Van Images Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Havana Van Image
                </label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {HAVANA_VAN_IMAGES.map((van, index) => (
                    <div
                      key={index}
                      className={clsx(
                        'cursor-pointer border-2 rounded-lg p-3 transition-all duration-300',
                        selectedVanImage === van.url
                          ? 'border-teal-500 bg-teal-500/20'
                          : 'border-slate-500 hover:border-slate-400'
                      )}
                      onClick={() => handleVanImageSelect(van.url)}
                    >
                      <img
                        src={van.url}
                        alt={van.name}
                        className="w-full h-20 object-contain mb-2"
                      />
                      <p className="text-white text-sm text-center">{van.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Custom Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Or Upload Custom Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-500 file:text-white hover:file:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                />
              </div>
              
              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preview
                  </label>
                  <div className="w-40 h-24 bg-slate-600 rounded-lg overflow-hidden border border-slate-500">
                    <img
                      src={imagePreview}
                      alt="Cart preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500 focus:ring-2"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  Cart is active and available for booking
                </label>
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit">
                  {editingCart ? 'Update Cart' : 'Add Cart'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Carts Display */}
      {carts.length === 0 ? (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Food Carts Added</h3>
            <p className="text-gray-400 mb-4">
              Get started by adding your first food cart to the system.
            </p>
            <Button onClick={() => setShowForm(true)}>
              ➕ Add Your First Cart
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carts.map((cart) => (
            <Card key={cart.id} className="bg-slate-700/50 backdrop-blur-sm border-slate-600 hover:border-slate-500 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-0">
                {/* Cart Image */}
                <div className="h-48 bg-slate-600/30 rounded-t-xl overflow-hidden">
                  <img
                    src={cart.image || HAVANA_VAN_IMAGES[0].url}
                    alt={cart.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white text-lg">{cart.name}</h3>
                    <span className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      cart.isActive 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    )}>
                      {cart.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {cart.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white">{cart.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price/Hour:</span>
                      <span className="text-teal-400 font-bold">${cart.pricePerHour}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Capacity:</span>
                      <span className="text-white">{cart.capacity} people</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(cart)}
                      className="flex-1"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={cart.isActive ? "ghost" : "outline"}
                      onClick={() => toggleCartStatus(cart.id, !cart.isActive)}
                      className={cart.isActive ? "text-yellow-400 hover:bg-yellow-500/20" : "text-green-400 hover:bg-green-500/20"}
                    >
                      {cart.isActive ? '⏸️' : '▶️'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(cart.id)}
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
      )}
    </div>
  )
}