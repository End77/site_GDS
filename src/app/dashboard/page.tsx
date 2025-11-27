// ============================================
// app/dashboard/page.tsx - Страница дашборда
// ============================================
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dashboard } from '@/components/Dashboard'
import { AuthProvider, useAuth } from '@/components/auth/auth-provider'

// Компонент-обертка для проверки авторизации
function DashboardPageContent() {
  // 1. Получаем функцию logout из useAuth
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Если загрузка завершена и пользователя нет, перенаправляем на страницу логина
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else {
        setIsChecking(false)
      }
    }
  }, [user, loading, router])

  // Показываем спиннер, пока проверяем авторизацию
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  // 2. Передаем функцию logout как пропс onLogout в компонент Dashboard
  return <Dashboard user={user} onLogout={logout} />
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardPageContent />
    </AuthProvider>
  )
}