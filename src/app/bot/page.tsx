'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Bot, 
  LogOut, 
  ArrowLeft,
  Settings,
  MessageSquare,
  Users,
  BarChart3,
  Languages,
  Download,
  RefreshCw
} from 'lucide-react'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

interface BotUser {
  id: number
  telegramId: number
  username?: string
  firstName?: string
  lastName?: string
  isActive: boolean
  createdAt: string
}

interface BotMessage {
  id: number
  userId: number
  messageId: number
  senderId: number
  messageText?: string
  messageType: string
  isMedia: boolean
  isBot: boolean
  direction: string
  createdAt: string
  user?: BotUser
}

interface BotStats {
  totalUsers: number
  activeUsers: number
  totalMessages: number
  incomingMessages: number
  outgoingMessages: number
}

export default function BotPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [botUsers, setBotUsers] = useState<BotUser[]>([])
  const [botMessages, setBotMessages] = useState<BotMessage[]>([])
  const [botStats, setBotStats] = useState<BotStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    incomingMessages: 0,
    outgoingMessages: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [botToken, setBotToken] = useState('')
  const [botLanguage, setBotLanguage] = useState('ru')
  const [savingSettings, setSavingSettings] = useState(false)
  const router = useRouter()

  // Проверка авторизации
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
        loadBotData()
        loadBotSettings()
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadBotData = async () => {
    await Promise.all([
      loadBotUsers(),
      loadBotMessages(),
      loadBotStats()
    ])
  }

  const loadBotUsers = async () => {
    try {
      const response = await fetch('/api/bot/users', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setBotUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to load bot users:', error)
    }
  }

  const loadBotMessages = async () => {
    try {
      const response = await fetch('/api/bot/messages', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setBotMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to load bot messages:', error)
    }
  }

  const loadBotStats = async () => {
    try {
      const response = await fetch('/api/bot/stats', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setBotStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load bot stats:', error)
    }
  }

  const loadBotSettings = async () => {
    try {
      const response = await fetch('/api/bot/settings', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setBotToken(data.settings.bot_token || '')
        setBotLanguage(data.settings.bot_language || 'ru')
      }
    } catch (error) {
      console.error('Failed to load bot settings:', error)
    }
  }

  const saveBotSettings = async () => {
    setSavingSettings(true)
    try {
      const response = await fetch('/api/bot/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_token: botToken,
          bot_language: botLanguage
        }),
        credentials: 'include'
      })

      if (response.ok) {
        // Настройки сохранены
      }
    } catch (error) {
      console.error('Failed to save bot settings:', error)
    } finally {
      setSavingSettings(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка Telegram Bot...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                <h1 className="text-lg font-semibold">Telegram Bot (3 языка)</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{currentUser.username}</p>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{botStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {botStats.activeUsers} активных
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Все сообщения</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{botStats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                {botStats.incomingMessages} входящих
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Исходящие</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{botStats.outgoingMessages}</div>
              <p className="text-xs text-muted-foreground">
                Ответы бота
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Языки</CardTitle>
              <Languages className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                RU, EN, HY
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Основной контент */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="messages">Сообщения</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Последние пользователи</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {botUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {user.firstName || user.username || `User ${user.telegramId}`}
                            </p>
                            <p className="text-xs text-slate-500">ID: {user.telegramId}</p>
                          </div>
                        </div>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Последние сообщения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {botMessages.slice(0, 5).map((message) => (
                      <div key={message.id} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          message.isBot ? 'bg-purple-100' : 'bg-blue-100'
                        }`}>
                          <Bot className={`w-3 h-3 ${message.isBot ? 'text-purple-600' : 'text-blue-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {message.user?.firstName || message.user?.username || `User ${message.userId}`}
                            </span>
                            <Badge variant={message.isBot ? 'destructive' : 'secondary'} className="text-xs">
                              {message.isBot ? 'Bot' : 'User'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {message.direction}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 truncate">{message.messageText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Пользователи Telegram Bot</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Telegram ID</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Зарегистрирован</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {botUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName || 'N/A'} {user.lastName || ''}
                        </TableCell>
                        <TableCell>@{user.username || 'N/A'}</TableCell>
                        <TableCell>{user.telegramId}</TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Активен' : 'Неактивен'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Сообщения Telegram Bot</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadBotMessages}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Обновить
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {botMessages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={message.isBot ? 'destructive' : 'secondary'}>
                              {message.isBot ? 'Bot' : 'User'}
                            </Badge>
                            <span className="text-sm font-medium">
                              {message.user?.firstName || message.user?.username || `User ${message.userId}`}
                            </span>
                            <Badge variant="outline">{message.direction}</Badge>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.messageText}</p>
                        {message.isMedia && (
                          <Badge variant="outline" className="mt-2">
                            📎 Медиа файл
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Настройки Telegram Bot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bot_token">Bot Token</Label>
                  <Input
                    id="bot_token"
                    type="password"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="Введите Telegram Bot Token"
                  />
                  <p className="text-xs text-slate-500">
                    Получите токен у @BotFather в Telegram
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bot_language">Язык по умолчанию</Label>
                  <select
                    id="bot_language"
                    value={botLanguage}
                    onChange={(e) => setBotLanguage(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="hy">Հայերեն</option>
                  </select>
                  <p className="text-xs text-slate-500">
                    Бот поддерживает 3 языка: русский, английский, армянский
                  </p>
                </div>

                <Button 
                  onClick={saveBotSettings}
                  disabled={savingSettings}
                  className="w-full"
                >
                  {savingSettings ? 'Сохранение...' : 'Сохранить настройки'}
                </Button>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Информация о боте</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>• Бот автоматически определяет язык пользователя</p>
                    <p>• Поддерживает текстовые сообщения и медиа</p>
                    <p>• Вся история сохраняется в базе данных</p>
                    <p>• Возможен экспорт истории сообщений</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </LanguageProvider>
  )
}