'use client'

import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '../../lib/store'
import { initializeAuth } from '../../lib/slices/authSlice'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      // Initialize auth state from localStorage on app start
      store.dispatch(initializeAuth())
      initialized.current = true
    }
  }, [])

  return <Provider store={store}>{children}</Provider>
}