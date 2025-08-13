'use client'

import { useI18n } from '@/lib/i18n/context'
import Button from '@/components/ui/Button'
import { Globe, Check, Calendar, Users, Phone, Mail, Home, MapPin } from 'lucide-react'

export default function TranslationDemo() {
  const { t, language, setLanguage } = useI18n()

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Language Switcher */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-teal-400">🇬🇷 Greek & English Translation Demo 🇺🇸</h1>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => setLanguage('el')}
              className={`${language === 'el' ? 'bg-teal-500' : 'bg-gray-600'}`}
            >
              🇬🇷 Ελληνικά
            </Button>
            <Button 
              onClick={() => setLanguage('en')}
              className={`${language === 'en' ? 'bg-teal-500' : 'bg-gray-600'}`}
            >
              🇺🇸 English
            </Button>
          </div>
          <p className="text-gray-400">Current Language: <span className="text-teal-300 font-semibold">{language === 'el' ? 'Ελληνικά' : 'English'}</span></p>
        </div>

        {/* Cart Selection Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            🚛 <span className="ml-2">{t('cart_selection_title')}</span>
          </h2>
          <p className="text-teal-400">{t('cart_selection_subtitle')}</p>
          <p className="text-gray-300">{t('cart_selection_description')}</p>
          <div className="flex space-x-4">
            <span className="bg-blue-600 px-3 py-1 rounded text-sm">{t('select_cart')}</span>
            <span className="bg-green-600 px-3 py-1 rounded text-sm">{t('cart_pickup_available')}</span>
            <span className="bg-purple-600 px-3 py-1 rounded text-sm">{t('cart_delivery_available')}</span>
          </div>
        </div>

        {/* Extras Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            ✨ <span className="ml-2">{t('extras_title')}</span>
          </h2>
          <p className="text-teal-400">{t('extras_subtitle')}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded">
              <h3 className="text-lg font-semibold text-white">{t('food_items')}</h3>
              <p className="text-gray-400">{t('add_to_cart')}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <h3 className="text-lg font-semibold text-white">{t('additional_services')}</h3>
              <p className="text-gray-400">{t('remove_from_cart')}</p>
            </div>
          </div>
        </div>

        {/* Timing Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            ⏰ <span className="ml-2">{t('timing_title')}</span>
          </h2>
          <p className="text-teal-400">{t('timing_subtitle')}</p>
          <div className="grid grid-cols-3 gap-4">
            <span className="bg-slate-700 px-3 py-2 rounded text-center">{t('select_date')}</span>
            <span className="bg-slate-700 px-3 py-2 rounded text-center">{t('start_time')}</span>
            <span className="bg-slate-700 px-3 py-2 rounded text-center">{t('end_time')}</span>
          </div>
          <div className="text-green-400">✅ {t('time_available')}</div>
          <div className="text-red-400">⚠️ {t('time_slot_unavailable')}</div>
        </div>

        {/* Delivery Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            🚚 <span className="ml-2">{t('delivery_title')}</span>
          </h2>
          <p className="text-teal-400">{t('delivery_subtitle')}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded">
              <h3 className="text-lg font-semibold text-white">{t('pickup_option')}</h3>
              <p className="text-gray-400">{t('pickup_description')}</p>
              <span className="text-green-400 font-bold">{t('pickup_free')}</span>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <h3 className="text-lg font-semibold text-white">{t('shipping_option')}</h3>
              <p className="text-gray-400">{t('shipping_description')}</p>
              <span className="text-blue-400 font-bold">{t('delivery_cost')}</span>
            </div>
          </div>
        </div>

        {/* Customer Info Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            👤 <span className="ml-2">{t('customer_info_title')}</span>
          </h2>
          <p className="text-teal-400">{t('customer_info_subtitle')}</p>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Phone className="w-5 h-5 mr-2 text-teal-400" />
              {t('contact_information')}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <span className="bg-slate-700 px-3 py-2 rounded text-sm">{t('first_name')}</span>
              <span className="bg-slate-700 px-3 py-2 rounded text-sm">{t('last_name')}</span>
              <span className="bg-slate-700 px-3 py-2 rounded text-sm">{t('email')}</span>
              <span className="bg-slate-700 px-3 py-2 rounded text-sm">{t('phone')}</span>
              <span className="bg-slate-700 px-3 py-2 rounded text-sm">{t('city')}</span>
              <span className="bg-slate-700 px-3 py-2 rounded text-sm">{t('country')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-teal-400" />
              {t('event_details')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <span className="bg-slate-700 px-3 py-2 rounded text-sm">{t('event_type')}</span>
              <span className="bg-slate-700 px-3 py-2 rounded text-sm">{t('guest_count')}</span>
            </div>
          </div>
        </div>

        {/* Event Types Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">🎉 {t('event_type')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-700 p-3 rounded text-center">
              <div className="text-2xl mb-1">🎂</div>
              <div className="text-sm font-semibold">{t('event_birthday')}</div>
            </div>
            <div className="bg-slate-700 p-3 rounded text-center">
              <div className="text-2xl mb-1">💒</div>
              <div className="text-sm font-semibold">{t('event_wedding')}</div>
            </div>
            <div className="bg-slate-700 p-3 rounded text-center">
              <div className="text-2xl mb-1">🏢</div>
              <div className="text-sm font-semibold">{t('event_corporate')}</div>
            </div>
            <div className="bg-slate-700 p-3 rounded text-center">
              <div className="text-2xl mb-1">🎓</div>
              <div className="text-sm font-semibold">{t('event_graduation')}</div>
            </div>
          </div>
        </div>

        {/* Payment Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            💳 <span className="ml-2">{t('payment_title')}</span>
          </h2>
          <p className="text-teal-400">{t('payment_subtitle')}</p>
          <div className="space-y-2">
            <div className="bg-slate-700 p-3 rounded">{t('secure_payment')}</div>
            <div className="bg-slate-700 p-3 rounded">{t('order_summary')}</div>
            <div className="bg-blue-600 p-3 rounded text-center font-bold">{t('complete_payment')}</div>
          </div>
        </div>

        {/* Countries Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">🌍 {t('country')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <span className="bg-slate-700 px-3 py-2 rounded text-sm">🇬🇷 {t('country_greece')}</span>
            <span className="bg-slate-700 px-3 py-2 rounded text-sm">🇺🇸 {t('country_united_states')}</span>
            <span className="bg-slate-700 px-3 py-2 rounded text-sm">🇨🇦 {t('country_canada')}</span>
            <span className="bg-slate-700 px-3 py-2 rounded text-sm">🇬🇧 {t('country_united_kingdom')}</span>
          </div>
        </div>

        {/* Common Buttons Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">🔘 {t('continue')}</h2>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-blue-600">{t('next')}</Button>
            <Button className="bg-gray-600">{t('previous')}</Button>
            <Button className="bg-green-600">{t('continue')}</Button>
            <Button className="bg-red-600">{t('cancel')}</Button>
            <Button className="bg-teal-600">{t('continue_to_payment')}</Button>
          </div>
        </div>

        {/* Success Messages Demo */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">✅ {t('success')}</h2>
          <div className="space-y-2">
            <div className="bg-green-600/20 border border-green-600 p-3 rounded text-green-300">
              {t('payment_success_title')}
            </div>
            <div className="bg-yellow-600/20 border border-yellow-600 p-3 rounded text-yellow-300">
              {t('paypal_credentials_missing')}
            </div>
            <div className="bg-blue-600/20 border border-blue-600 p-3 rounded text-blue-300">
              {t('thank_you_booking')}
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">
            🎯 <strong>Complete Greek & English Translation System Ready!</strong> 🎯
          </p>
          <p className="text-teal-300 mt-2">
            Default: <strong>Greek (Ελληνικά)</strong> | Switch to: <strong>English</strong>
          </p>
        </div>

      </div>
    </div>
  )
}