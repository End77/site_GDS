'use client';

import { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Bot, MessageCircle, Settings, BarChart3, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const getInitials = (userId: string) => userId.substring(0, 2).toUpperCase();

const getAvatarColor = (userId: string) => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
  return colors[userId.charCodeAt(0) % colors.length];
};

const getSenderDisplay = (senderId: string) => {
  if (senderId === 'bot') {
    return { name: 'Бот', initials: 'BT', color: 'bg-purple-500' };
  }
  return { name: `Пользователь ${senderId}`, initials: getInitials(senderId), color: getAvatarColor(senderId) };
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};


function BotPageContent() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalChats: 0,
    todayMessages: 0,
    activeUsers: 0
  });

  // --- Новое состояние для последней активности ---
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [selectedChatForActivity, setSelectedChatForActivity] = useState('all');

  // --- Эффект для загрузки статистики ---
  useEffect(() => {
    if (user?.botDatabaseId) {
      fetchStats();
    }
  }, [user?.botDatabaseId]);

  // --- Новый эффект для загрузки последней активности ---
  useEffect(() => {
    if (user?.botDatabaseId) {
      fetchRecentActivity();
    }
  }, [user?.botDatabaseId, selectedChatForActivity]); // Перезагружаем при смене чата

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/bot/${user.botType}/stats`, {
      credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // --- Новая функция для загрузки активности ---
  const fetchRecentActivity = async () => {
    setActivityLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedChatForActivity !== 'all') {
        params.append('chatId', selectedChatForActivity);
      }
      const response = await fetch(`/api/bot/recent-activity?${params}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setRecentMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-slate-600">Загрузка...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    // ... (код для неавторизованного пользователя остается без изменений)
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-slate-600 mb-4">Пожалуйста, войдите в систему</p>
              <Link href="/login">
                <Button>Войти</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
  }

  // Получаем уникальные чаты из последних сообщений для селектора
  const uniqueChats = Array.from(new Set(recentMessages.map(msg => msg.user_id))).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        {/* ... (код хедера остается без изменений) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Панель управления ботом</h1>
                <p className="text-sm text-slate-500">
                  {user.botDatabaseId ? `Подключен к: ${user.botDatabaseId}` : "Бот не подключен"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user.username}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <Link href="/bot/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Настройки
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user.botDatabaseId ? (
          <Card>
            {/* ... (код для неподключенного бота остается без изменений) */}
             <CardContent className="flex flex-col items-center justify-center py-16">
              <Bot className="h-20 w-20 text-slate-400 mb-6" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">Бот не подключен</h2>
              <p className="text-slate-600 text-center mb-6 max-w-md">
                Для просмотра статистики и истории сообщений необходимо подключить базу данных бота в настройках.
              </p>
              <Link href="/bot/settings">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                  <Settings className="h-5 w-5 mr-2" />
                  Перейти к настройкам
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            {/* ... (карточки статистики остаются без изменений) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего сообщений</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalMessages}</div>
                  <p className="text-xs text-muted-foreground">+{stats.todayMessages} за сегодня</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активные чаты</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalChats}</div>
                  <p className="text-xs text-muted-foreground">{stats.activeUsers} активных пользователей</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Статус бота</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    {user.botDatabaseId}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Активен</div>
                  <p className="text-xs text-muted-foreground">База данных подключена</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Действия</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Link href="/bot/history">
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        История сообщений
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/bot/settings">
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        Настройки
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- ОБНОВЛЕННЫЙ БЛОК ПОСЛЕДНЕЙ АКТИВНОСТИ --- */}
            <Card>
              <CardHeader>
                <CardTitle>Последняя активность</CardTitle>
                <CardDescription>Самые последние сообщения из истории бота</CardDescription>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Селектор для выбора чата */}
                    <Select value={selectedChatForActivity} onValueChange={setSelectedChatForActivity}>
                      <SelectTrigger className="w-full mb-4">
                        <SelectValue placeholder="Выберите чат" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все чаты</SelectItem>
                        {uniqueChats.map(chatId => (
                          <SelectItem key={chatId} value={chatId.toString()}>
                            Чат {chatId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Список сообщений */}
                    <ScrollArea className="h-[300px] w-full border rounded-md p-4">
                      {recentMessages.length === 0 ? (
                        <p className="text-muted-foreground text-center">Нет сообщений для отображения</p>
                      ) : (
                        <div className="space-y-3">
                          {recentMessages.map((msg) => (
                            <div key={msg.id} className="flex items-start space-x-3 text-sm">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className={`text-xs ${getSenderDisplay(msg.sender_id.toString()).color}`}>
                                  {getSenderDisplay(msg.sender_id.toString()).initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-slate-900">
                                    {getSenderDisplay(msg.sender_id.toString()).name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(msg.created_at)}
                                  </p>
                                </div>
                                <p className="text-slate-700 break-words">{msg.message_text || 'Медиа файл'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    {/* Кнопка перехода к полной истории */}
                    <div className="mt-4 pt-4 border-t">
                      <Link href="/bot/history">
                        <Button variant="outline" className="w-full">
                          Перейти к истории
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

// Оборачиваем компонент в AuthProvider
export default function BotPage() {
  return (
    <AuthProvider>
      <BotPageContent />
    </AuthProvider>
  );
}