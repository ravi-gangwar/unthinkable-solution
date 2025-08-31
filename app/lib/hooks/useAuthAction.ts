'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useRouter, usePathname } from 'next/navigation'

export function useAuthAction() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const executeWithAuth = (action: () => void | Promise<void>) => {
    if (!isAuthenticated) {
      // Store the current path for redirect after login
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', pathname)
      }
      setShowAuthModal(true)
      return
    }
    
    action()
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // Handle redirect after successful authentication
    if (typeof window !== 'undefined') {
      const redirectPath = localStorage.getItem('redirectAfterLogin')
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin')
        // Stay on the same page since the action was attempted here
      }
    }
  }

  return {
    executeWithAuth,
    showAuthModal,
    closeAuthModal,
    handleAuthSuccess,
    isAuthenticated
  }
}
