'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@/lib/api/authApi'
import { setCredentials } from '@/lib/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

interface LoginFormProps {
  onSwitchToSignup?: () => void
  onAuthSuccess?: () => void
}

export default function LoginForm({ onSwitchToSignup, onAuthSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await login({ email, password }).unwrap()
      dispatch(setCredentials({ user: result.data }))
      localStorage.setItem('user', JSON.stringify(result.data))
      onAuthSuccess?.()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <Card className="w-full max-w-md bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-white">Login</CardTitle>
        <CardDescription className="text-gray-300">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 focus:ring-indigo-400/20"
            />
          </div>
          {error && (
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/30">
              <AlertDescription className="text-red-300">
                {'data' in error ? (error.data as { message?: string })?.message : 'Login failed'}
              </AlertDescription>
            </Alert>
          )}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-lg transition-all duration-200" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
          {onSwitchToSignup && (
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 transition-all duration-200" 
              onClick={onSwitchToSignup}
            >
              Don&apos;t have an account? Sign up
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
