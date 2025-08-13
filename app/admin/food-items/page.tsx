'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'
import { useGetFoodItemsQuery, useCreateFoodItemMutation, useUpdateFoodItemMutation, useDeleteFoodItemMutation } from '../../../lib/api/foodItemsApi'
import { useGetFoodCartsQuery } from '../../../lib/api/foodCartsApi'
import type { FoodItem, FoodCart } from '../../../types/booking'
import { Plus, ChefHat } from 'lucide-react'
import { useAdminI18n } from '../../../lib/i18n/admin-context'

export default function FoodItemsPage() {
  const { t } = useAdminI18n()
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

  // RTK Query hooks
  const {
    data: foodItems = [],
    isLoading: itemsLoading,
    error: itemsError,
    refetch: refetchItems
  } = useGetFoodItemsQuery({ includeInactive: true }) // Admin should see all items including inactive ones

  const {
    data: foodCarts = [],
    isLoading: cartsLoading,
    error: cartsError
  } = useGetFoodCartsQuery({})

  const [createFoodItem, { isLoading: creating }] = useCreateFoodItemMutation()
  const [updateFoodItem, { isLoading: updating }] = useUpdateFoodItemMutation()
  const [deleteFoodItem, { isLoading: deleting }] = useDeleteFoodItemMutation()

  const loading = itemsLoading || cartsLoading

  const resetForm = () => {
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
  }

  // Computed data from RTK Query
  const categories = ['all', ...Array.from(new Set(foodItems.map(item => item.category)))]
  const cartOptions = [
    { value: '', label: t('select_cart') },
    ...foodCarts.map(cart => ({ value: cart.id, label: cart.name }))
  ]
  const categoryOptions = [
    { value: 'Sandwiches', label: 'Sandwiches' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Sides', label: 'Sides' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Desserts', label: 'Desserts' }
  ]

  // Enhanced food items with cart names
  const enhancedFoodItems = foodItems.map(item => ({
    ...item,
    cartName: foodCarts.find(cart => cart.id === item.cartId)?.name || 'Unknown Cart'
  }))

  const filteredItems = enhancedFoodItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesCart = selectedCart === 'all' || item.cartId === selectedCart
    return matchesCategory && matchesCart
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        cartId: formData.cartId,
        isAvailable: formData.isAvailable
      }

      if (editingItem) {
        // Update existing item via RTK Query
        await updateFoodItem({ id: editingItem.id, ...itemData }).unwrap()
      } else {
        // Create new item via RTK Query
        await createFoodItem(itemData).unwrap()
      }
      
      // Reset form
      resetForm()
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
              alert(t('error_creating_item'))
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
        await deleteFoodItem(itemId).unwrap()
      } catch (error) {
        console.error('Error deleting item:', error)
        alert(t('error_deleting_item'))
      }
    }
  }

  const toggleItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      await updateFoodItem({ id: itemId, isAvailable }).unwrap()
    } catch (error) {
      console.error('Error updating availability:', error)
              alert(t('error_updating_item'))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <span className="ml-4 text-white">{t('loading')}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('food_items_management')}
          </h1>
          <p className="text-gray-400">
            {t('manage_menu_items')}
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('add_food_item')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label={t('filter_by_cart')}
              options={[
                { value: 'all', label: t('all_carts') },
                ...foodCarts.map(cart => ({ value: cart.id, label: cart.name }))
              ]}
              value={selectedCart}
              onChange={(e) => setSelectedCart(e.target.value)}
            />
            <Select
              label={t('filter_by_category')}
              options={[
                { value: 'all', label: t('all_categories') },
                ...categories.filter(cat => cat !== 'all').map(cat => ({ value: cat, label: cat }))
              ]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />

          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">
              {editingItem ? t('edit') + ' ' + t('item_name') : t('add_food_item')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t('item_name')}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder={t('item_name_placeholder')}
                />
                
                <Input
                  label={t('price')}
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                />
                
                <Select
                  label={t('food_cart')}
                  options={cartOptions}
                  value={formData.cartId}
                  onChange={(e) => setFormData(prev => ({ ...prev, cartId: e.target.value }))}
                  required
                />
                
                <Select
                  label={t('category')}
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('description')}
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('description_placeholder')}
                  required
                />
              </div>
              
              <Input
                label={t('image_url_optional')}
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder={t('image_placeholder')}
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
                  {t('available')}
                </label>
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit">
                  {editingItem ? t('update_item') : t('create_item')}
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
                  {t('cancel')}
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
                    {item.isAvailable ? t('available') : t('unavailable')}
                  </span>
                </div>
                
                <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="space-y-1 mb-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('price_label')}</span>
                    <span className="text-teal-400 font-bold">€{item.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('category_label')}</span>
                    <span className="text-white">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('cart_label')}</span>
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
            <h3 className="text-xl font-semibold text-white mb-2">{t('no_food_items_yet')}</h3>
            <p className="text-gray-400 mb-4">
              {selectedCategory !== 'all' || selectedCart !== 'all' 
                ? t('start_by_adding_items') 
                : t('start_by_adding_items')}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('add_your_first_item')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}