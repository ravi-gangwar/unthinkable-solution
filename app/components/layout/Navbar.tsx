'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { logout } from '@/lib/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChefHat, User, LogOut, LogIn } from 'lucide-react'
import Link from 'next/link'
import AuthModal from '@/components/auth/AuthModal'

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleOpenAuth = () => {
    setShowAuthModal(true)
  }

  const handleCloseAuth = () => {
    setShowAuthModal(false)
  }

  return (
    <>
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md supports-[backdrop-filter]:bg-black/40">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
            <span className="text-lg sm:text-xl font-bold text-white">
              <span className="hidden sm:inline">Recipe App</span>
              <span className="sm:hidden">Recipes</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" className="hidden sm:block">
              <Button variant="ghost" className="text-white hover:text-indigo-300 hover:bg-white/10 text-sm">Home</Button>
            </Link>
            <Link href="/recipes" className="hidden sm:block">
              <Button variant="ghost" className="text-white hover:text-indigo-300 hover:bg-white/10 text-sm">Recipes</Button>
            </Link>
            {isAuthenticated && (
              <Link href="/favorites" className="hidden sm:block">
                <Button variant="ghost" className="text-white hover:text-indigo-300 hover:bg-white/10 text-sm">Favorites</Button>
              </Link>
            )}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-indigo-500 text-white">
                        {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/90 border-white/20 backdrop-blur-md" align="end" forceMount>
                  <DropdownMenuItem className="font-normal text-white hover:bg-white/10">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-gray-300">{user?.email}</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-white/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                onClick={handleOpenAuth}
                className="bg-indigo-600 hover:bg-indigo-700 text-white border-none text-xs sm:text-sm px-2 sm:px-3"
              >
                <LogIn className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">👤</span>
              </Button>
            )}
          </div>
        </div>
      </nav>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseAuth}
        onAuthSuccess={handleCloseAuth}
      />
    </>
  )
}
