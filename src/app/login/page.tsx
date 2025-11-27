// ============================================
// app/login/page.tsx - Страница входа
// ============================================
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { AuthProvider } from '@/components/auth/auth-provider'
import { LanguageProvider, useTranslation } from '@/lib/i18n/language-context'

import { Bot, Eye, EyeOff, ArrowLeft } from 'lucide-react'

function LoginPageContent() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Вызываем функцию login из AuthProvider
      await login(email, password)

      // В случае успеха перенаправляем на дашборд
      router.push('/dashboard')

    } catch (err: any) {
      // Если login выбрасывает ошибку, показываем ее пользователю
      setError(err.message || 'Произошла ошибка при входе. Пожалуйста, попробуйте снова.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo и заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gentle Droid Solutions</h1>
          <p className="text-gray-600">{t('auth.signInToAccount')}</p>
        </div>

        {/* Форма входа */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('auth.signIn')}</CardTitle>
            <CardDescription>
              {t('auth.signInToAccount')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? t('auth.signingIn') : t('auth.signIn')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('navigation.backToHome')}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Демо-аккаунты */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-3">{t('auth.demoAccounts')}</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-blue-800">{t('auth.admin')}:</span>
                <div className="text-blue-700">admin@gds.com / admin123</div>
              </div>
              <div>
                <span className="font-medium text-blue-800">{t('auth.user')}:</span>
                <div className="text-blue-700">user@gds.com / user123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Оборачиваем страницу в провайдеры
export default function LoginPage() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <LoginPageContent />
      </LanguageProvider>
    </AuthProvider>
  )
}