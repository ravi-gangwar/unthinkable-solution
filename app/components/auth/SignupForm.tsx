'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSignupMutation } from '@/lib/api/authApi'
import { setCredentials } from '@/lib/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

interface SignupFormProps {
  onSwitchToLogin?: () => void
  onAuthSuccess?: () => void
}

export default function SignupForm({ onSwitchToLogin, onAuthSuccess }: SignupFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signup, { isLoading, error }] = useSignupMutation()
  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signup({ name, email, password }).unwrap()
      dispatch(setCredentials({ user: result.data }))
      localStorage.setItem('user', JSON.stringify(result.data))
      onAuthSuccess?.()
    } catch (error) {
      console.error('Signup failed:', error)
    }
  }

  return (
    <Card className="w-full max-w-md bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-white">Sign Up</CardTitle>
        <CardDescription className="text-gray-300">Create a new account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          {error && (
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/30">
              <AlertDescription className="text-red-300">
                {'data' in error ? (error.data as { message?: string })?.message : 'Signup failed'}
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
          {onSwitchToLogin && (
            <Button type="button" variant="ghost" className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-white/10" onClick={onSwitchToLogin}>
              Already have an account? Login
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
