'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bot, Settings, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from './auth-provider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function UserMenu() {
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      setIsOpen(false)
      // После выхода перенаправляем на главную страницу, а не на /
      router.push('/')
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Button>Get Started</Button>
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-600 text-white">
              {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{user.name || user.username}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center space-x-2">
          <Bot className="w-4 h-4" />
          <span>My Account</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          {/* ИЗМЕНЕНИЕ: Ссылка теперь ведет на /dashboard */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center space-x-2 text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}