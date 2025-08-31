'use client'

import { useEffect, ReactNode } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { initializeAuth } from '@/lib/slices/authSlice'
import AuthModal from './AuthModal'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  if (!isAuthenticated) {
    return fallback || <AuthModal isOpen={true} onClose={() => {}} />
  }

  return <>{children}</>
}
