'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'
import { useGetFoodCartsQuery, useCreateFoodCartMutation, useUpdateFoodCartMutation, useDeleteFoodCartMutation } from '../../../lib/api/foodCartsApi'
import { useAdminI18n } from '../../../lib/i18n/admin-context'
import type { FoodCart } from '../../../types/booking'
import { Plus, Truck, AlertTriangle } from 'lucide-react'

export default function FoodCartsPage() {
  const { t } = useAdminI18n()
  const [isCreating, setIsCreating] = useState(false)
  const [editingCart, setEditingCart] = useState<FoodCart | null>(null)
  const [newCart, setNewCart] = useState({
    name: '',
    description: '',
    location: '',
    pricePerHour: 0,
    extraHourPrice: 0,
    shippingPrice: 0,
    pickupAvailable: true,
    shippingAvailable: true,
    capacity: 0,
    features: [] as string[],
    image: ''
  })

  // RTK Query hooks - include inactive carts for admin
  const {
    data: foodCarts = [],
    isLoading: loading,
    error,
    refetch
  } = useGetFoodCartsQuery({ includeInactive: true })

  const [createFoodCart, { isLoading: creating }] = useCreateFoodCartMutation()
  const [updateFoodCart, { isLoading: updating }] = useUpdateFoodCartMutation()
  const [deleteFoodCart, { isLoading: deleting }] = useDeleteFoodCartMutation()

  // Handle create cart
  const handleCreateCart = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createFoodCart({
        ...newCart,
        location: newCart.location // Ensure location is included
      }).unwrap()
      setNewCart({
        name: '',
        description: '',
        location: '',
        pricePerHour: 0,
        extraHourPrice: 0,
        shippingPrice: 0,
        pickupAvailable: true,
        shippingAvailable: true,
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
    if (confirm(t('delete_confirm'))) {
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
          <p className="text-white text-lg">{t('loading_food_carts')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('food_carts_management')}</h1>
          <p className="text-gray-400">
            {t('manage_food_cart_fleet')}
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <p className="text-red-400 text-sm">{t('failed_to_load_food_carts')}</p>
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
            {t('refresh')}
          </Button>
          <Button 
            size="sm" 
            onClick={() => setIsCreating(true)}
            disabled={creating}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('add_new_cart')}
          </Button>
        </div>
      </div>

      {/* Create New Cart Form */}
      {isCreating && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">{t('add_new_food_cart')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCart} className="space-y-4">
              <Input
                label={t('cart_name')}
                value={newCart.name}
                onChange={(e) => setNewCart({ ...newCart, name: e.target.value })}
                placeholder={t('cart_name_placeholder')}
                required
              />
              
              <Input
                label={t('description')}
                value={newCart.description}
                onChange={(e) => setNewCart({ ...newCart, description: e.target.value })}
                placeholder={t('description_placeholder')}
                required
              />
              
              <Input
                label={t('location')}
                value={newCart.location}
                onChange={(e) => setNewCart({ ...newCart, location: e.target.value })}
                placeholder={t('location_placeholder')}
                required
              />

              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label={t('base_price_label')}
                  type="number"
                  value={newCart.pricePerHour}
                  onChange={(e) => setNewCart({ ...newCart, pricePerHour: parseFloat(e.target.value) || 0 })}
                  placeholder={t('base_price_placeholder')}
                  helperText={t('base_price_helper')}
                  required
                />
                <Input
                  label={t('extra_hour_price_label')}
                  type="number"
                  value={newCart.extraHourPrice}
                  onChange={(e) => setNewCart({ ...newCart, extraHourPrice: parseFloat(e.target.value) || 0 })}
                  placeholder={t('extra_hour_price_placeholder')}
                  helperText={t('extra_hour_price_helper')}
                />
                <Input
                  label={t('shipping_price_label')}
                  type="number"
                  value={newCart.shippingPrice}
                  onChange={(e) => setNewCart({ ...newCart, shippingPrice: parseFloat(e.target.value) || 0 })}
                  placeholder={t('shipping_price_placeholder')}
                  helperText={t('shipping_price_helper')}
                />
                <Input
                  label={t('food_serving_capacity')}
                  type="number"
                  value={newCart.capacity}
                  onChange={(e) => setNewCart({ ...newCart, capacity: parseInt(e.target.value) || 0 })}
                  placeholder={t('capacity_placeholder')}
                  helperText={t('capacity_helper')}
                  required
                />
              </div>

              <Input
                label={t('image_url_optional')}
                value={newCart.image}
                onChange={(e) => setNewCart({ ...newCart, image: e.target.value })}
                placeholder={t('image_placeholder')}
              />

              {/* Delivery Options */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">{t('delivery_options')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="pickupAvailable"
                      checked={newCart.pickupAvailable}
                      onChange={(e) => setNewCart({ ...newCart, pickupAvailable: e.target.checked })}
                      className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="pickupAvailable" className="text-sm font-medium text-white">
                      {t('pickup_available')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="shippingAvailable"
                      checked={newCart.shippingAvailable}
                      onChange={(e) => setNewCart({ ...newCart, shippingAvailable: e.target.checked })}
                      className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="shippingAvailable" className="text-sm font-medium text-white">
                      {t('shipping_available')}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                  disabled={creating}
                >
                  {t('cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={creating}
                >
                  {creating ? t('creating') : t('create_cart')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Cart Form */}
      {editingCart && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Edit Food Cart: {editingCart.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleUpdateCart({
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                location: formData.get('location') as string,
                pricePerHour: parseFloat(formData.get('pricePerHour') as string),
                extraHourPrice: parseFloat(formData.get('extraHourPrice') as string) || 0,
                shippingPrice: parseFloat(formData.get('shippingPrice') as string) || 0,
                capacity: parseInt(formData.get('capacity') as string),
                image: formData.get('image') as string,
                pickupAvailable: formData.has('pickupAvailable'),
                shippingAvailable: formData.has('shippingAvailable'),
              })
            }} className="space-y-4">
              <Input
                name="name"
                label={t('cart_name')}
                defaultValue={editingCart.name}
                placeholder={t('cart_name_placeholder')}
                required
              />
              
              <Input
                name="description"
                label={t('description')}
                defaultValue={editingCart.description}
                placeholder={t('description_placeholder')}
                required
              />
              
              <Input
                name="location"
                label={t('location')}
                defaultValue={editingCart.location}
                placeholder={t('location_placeholder')}
                required
              />

              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  name="pricePerHour"
                  label={t('base_price_label')}
                  type="number"
                  defaultValue={editingCart.pricePerHour}
                  placeholder={t('base_price_placeholder')}
                  helperText={t('base_price_helper')}
                  required
                />
                <Input
                  name="extraHourPrice"
                  label={t('extra_hour_price_label')}
                  type="number"
                  defaultValue={editingCart.extraHourPrice || 0}
                  placeholder={t('extra_hour_price_placeholder')}
                  helperText={t('extra_hour_price_helper')}
                />
                <Input
                  name="shippingPrice"
                  label={t('shipping_price_label')}
                  type="number"
                  defaultValue={editingCart.shippingPrice || 0}
                  placeholder={t('shipping_price_placeholder')}
                  helperText={t('shipping_price_helper')}
                />
                <Input
                  name="capacity"
                  label={t('food_serving_capacity')}
                  type="number"
                  defaultValue={editingCart.capacity}
                  placeholder={t('capacity_placeholder')}
                  helperText={t('capacity_helper')}
                  required
                />
              </div>

              <Input
                name="image"
                label={t('image_url_optional')}
                defaultValue={editingCart.image || ''}
                placeholder={t('image_placeholder')}
              />

              {/* Delivery Options */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">{t('delivery_options')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="editPickupAvailable"
                      name="pickupAvailable"
                      defaultChecked={editingCart.pickupAvailable}
                      className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="editPickupAvailable" className="text-sm font-medium text-white">
                      {t('pickup_available')}
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="editShippingAvailable"
                      name="shippingAvailable"
                      defaultChecked={editingCart.shippingAvailable}
                      className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="editShippingAvailable" className="text-sm font-medium text-white">
                      {t('shipping_available')}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingCart(null)}
                  disabled={updating}
                >
                  {t('cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={updating}
                >
                  {updating ? t('updating') : t('update_cart')}
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
            <h2 className="text-2xl font-bold text-white mb-2">{t('no_food_carts_yet')}</h2>
            <p className="text-gray-400 mb-6">
              {t('start_by_adding_first_cart')}
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('add_your_first_cart')}
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
                      {cart.isActive ? t('active') : t('inactive')}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm line-clamp-2">{cart.description}</p>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('base_price_display')}</span>
                    <span className="text-white font-medium">€{cart.pricePerHour}</span>
                  </div>
                  
                  {cart.extraHourPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t('extra_hour_price_display')}</span>
                      <span className="text-white font-medium">€{cart.extraHourPrice}/hr</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('shipping_price_display')}</span>
                    <span className="text-white font-medium">€{cart.shippingPrice || 0}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{t('delivery_options_display')}</span>
                    <span className="text-white font-medium">
                      {cart.pickupAvailable && cart.shippingAvailable ? t('pickup_and_shipping') : 
                       cart.pickupAvailable ? t('pickup_only') : 
                       cart.shippingAvailable ? t('shipping_only') : t('none')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('serves')}:</span>
                    <span className="text-white font-medium">{t('up_to_people').replace('{count}', cart.capacity.toString())}</span>
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
                      {t('edit')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setEditingCart(cart)
                        handleUpdateCart({ isActive: !cart.isActive })
                      }}
                      disabled={updating}
                    >
                      {cart.isActive ? t('deactivate') : t('activate')}
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