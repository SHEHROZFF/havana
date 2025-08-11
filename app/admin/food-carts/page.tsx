'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'
import { useGetFoodCartsQuery, useCreateFoodCartMutation, useUpdateFoodCartMutation, useDeleteFoodCartMutation } from '../../../lib/api/foodCartsApi'
import type { FoodCart } from '../../../types/booking'
import { Plus, Truck, AlertTriangle } from 'lucide-react'

export default function FoodCartsPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingCart, setEditingCart] = useState<FoodCart | null>(null)
  const [newCart, setNewCart] = useState({
    name: '',
    description: '',
    cuisine: '',
    location: '',
    pricePerHour: 0,
    capacity: 0,
    features: [] as string[],
    image: ''
  })

  // RTK Query hooks
  const {
    data: foodCarts = [],
    isLoading: loading,
    error,
    refetch
  } = useGetFoodCartsQuery()

  const [createFoodCart, { isLoading: creating }] = useCreateFoodCartMutation()
  const [updateFoodCart, { isLoading: updating }] = useUpdateFoodCartMutation()
  const [deleteFoodCart, { isLoading: deleting }] = useDeleteFoodCartMutation()

  // Handle create cart
  const handleCreateCart = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createFoodCart(newCart).unwrap()
      setNewCart({
        name: '',
        description: '',
        cuisine: '',
        location: '',
        pricePerHour: 0,
        capacity: 0,
        features: [],
        image: ''
      })
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create food cart:', error)
    }
  }

  // Handle update cart
  const handleUpdateCart = async (cartData: Partial<FoodCart>) => {
    if (!editingCart) return
    try {
      await updateFoodCart({ id: editingCart.id, ...cartData }).unwrap()
      setEditingCart(null)
    } catch (error) {
      console.error('Failed to update food cart:', error)
    }
  }

  // Handle delete cart
  const handleDeleteCart = async (cartId: string) => {
    if (confirm('Are you sure you want to delete this food cart?')) {
      try {
        await deleteFoodCart(cartId).unwrap()
      } catch (error) {
        console.error('Failed to delete food cart:', error)
      }
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
          <h1 className="text-3xl font-bold text-white mb-2">Food Carts Management</h1>
          <p className="text-gray-400">
            Manage your food cart fleet and rental options
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <p className="text-red-400 text-sm">Failed to load food carts</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={loading}
          >
            🔄 Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={() => setIsCreating(true)}
            disabled={creating}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Cart
          </Button>
        </div>
      </div>

      {/* Create New Cart Form */}
      {isCreating && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Add New Food Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCart} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Cart Name"
                  value={newCart.name}
                  onChange={(e) => setNewCart({ ...newCart, name: e.target.value })}
                  placeholder="e.g., Havana Street Tacos"
                  required
                />
                <Input
                  label="Cuisine Type"
                  value={newCart.cuisine}
                  onChange={(e) => setNewCart({ ...newCart, cuisine: e.target.value })}
                  placeholder="e.g., Cuban, Mexican"
                  required
                />
              </div>
              
              <Input
                label="Description"
                value={newCart.description}
                onChange={(e) => setNewCart({ ...newCart, description: e.target.value })}
                placeholder="Describe your food cart..."
                required
              />
              
              <Input
                label="Location"
                value={newCart.location}
                onChange={(e) => setNewCart({ ...newCart, location: e.target.value })}
                placeholder="e.g., Athens, Thessaloniki, Mobile Service"
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Price per Hour ($)"
                  type="number"
                  value={newCart.pricePerHour}
                  onChange={(e) => setNewCart({ ...newCart, pricePerHour: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  required
                />
                <Input
                  label="Food Serving Capacity"
                  type="number"
                  value={newCart.capacity}
                  onChange={(e) => setNewCart({ ...newCart, capacity: parseInt(e.target.value) || 0 })}
                  placeholder="50"
                  helperText="How many people can this cart serve food to"
                  required
                />
              </div>

              <Input
                label="Image URL (optional)"
                value={newCart.image}
                onChange={(e) => setNewCart({ ...newCart, image: e.target.value })}
                placeholder="https://..."
              />

              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Cart'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Food Carts Grid */}
      {foodCarts.length === 0 ? (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
            <Truck className="w-24 h-24 text-gray-400 mx-auto" />
          </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Food Carts Yet</h2>
            <p className="text-gray-400 mb-6">
              Start by adding your first food cart to begin accepting bookings.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Cart
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodCarts.map((cart) => (
            <Card key={cart.id} className="bg-slate-700/50 backdrop-blur-sm border-slate-600 hover:border-slate-500 transition-all duration-300">
              <CardContent className="p-6">
                {cart.image && (
                  <div className="w-full h-48 bg-slate-600 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={cart.image} 
                      alt={cart.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{cart.name}</h3>
                      <p className="text-sm text-teal-400">{cart.cuisine}</p>
                    </div>
                    <div className={clsx(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      cart.isActive 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    )}>
                      {cart.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm line-clamp-2">{cart.description}</p>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price/Hour:</span>
                    <span className="text-white font-medium">${cart.pricePerHour}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Serves:</span>
                    <span className="text-white font-medium">Up to {cart.capacity} people</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white font-medium">{cart.location}</span>
                  </div>
                  
                  <div className="flex space-x-2 pt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setEditingCart(cart)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleUpdateCart({ isActive: !cart.isActive })}
                      disabled={updating}
                    >
                      {cart.isActive ? '🔴 Deactivate' : '🟢 Activate'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteCart(cart.id)}
                      disabled={deleting}
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