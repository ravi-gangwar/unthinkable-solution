'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogOverlay } from '@/components/ui/dialog'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess?: () => void
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)

  const handleAuthSuccess = () => {
    onAuthSuccess?.()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm" />
      <DialogContent className="w-[95vw] max-w-md mx-4 bg-gradient-to-br from-black/95 via-indigo-950/80 to-purple-950/70 backdrop-blur-lg border border-indigo-400/20 shadow-2xl shadow-indigo-500/20">
        <DialogTitle className="sr-only">
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </DialogTitle>
        {isLogin ? (
          <LoginForm 
            onSwitchToSignup={() => setIsLogin(false)} 
            onAuthSuccess={handleAuthSuccess}
          />
        ) : (
          <SignupForm 
            onSwitchToLogin={() => setIsLogin(true)} 
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
