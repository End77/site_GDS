'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { config } from '@/config';
import { 
  Bot, 
  User, 
  ArrowLeftRight, 
  FileText, 
  Image, 
  Search, 
  Settings, 
  LogOut,
  Loader2,
  RefreshCw,
  Database,
  MessageSquare,
  Send,
  Download,
  History,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface BotMessage {
  id: number;
  user_id: number;
  message_id: number;
  sender_id: number;
  message_text?: string;
  message_type: string;
  media_file_id?: string;
  is_media: boolean;
  is_bot: boolean;
  direction: 'incoming' | 'outgoing';
  created_at: string;
}

interface ChatGroup {
  userId: string;
  messages: BotMessage[];
  lastMessage: string;
  messageCount: number;
}

interface MessageStats {
  total: number;
  incoming: number;
  outgoing: number;
  textMessages: number;
  mediaMessages: number;
}

export function Dashboard() {
  const { user, logout, refreshUser } = useAuth();
  const { translate } = useTranslation();
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [botDatabaseId, setBotDatabaseId] = useState(user?.botDatabaseId || '');
  const [filters, setFilters] = useState({
    messageType: 'all',
    direction: 'all',
    search: '',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Group messages by chat (user_id)
  const groupMessagesByChat = (msgs: BotMessage[]) => {
    const groups: { [key: string]: BotMessage[] } = {};
    
    msgs.forEach(msg => {
      const userId = msg.user_id.toString();
      if (!groups[userId]) {
        groups[userId] = [];
      }
      groups[userId].push(msg);
    });

    const chatArray: ChatGroup[] = Object.entries(groups).map(([userId, msgs]) => {
      const sortedMsgs = msgs.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      return {
        userId,
        messages: sortedMsgs,
        lastMessage: msgs[msgs.length - 1]?.message_text || '',
        messageCount: msgs.length
      };
    }).sort((a, b) => {
      const aTime = a.messages[a.messages.length - 1]?.created_at || '';
      const bTime = b.messages[b.messages.length - 1]?.created_at || '';
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    setChatGroups(chatArray);
    if (chatArray.length > 0 && !selectedChat) {
      setSelectedChat(chatArray[0].userId);
    }
  };

  const fetchMessages = async (pageNum = page) => {
    if (!user?.botDatabaseId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: config.messages.pageSize.toString(),
        ...(filters.messageType && filters.messageType !== 'all' && { messageType: filters.messageType }),
        ...(filters.direction && filters.direction !== 'all' && { direction: filters.direction }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/messages?${params}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.data.messages);
        setTotal(data.data.total);
        setStats(data.data.stats);
        setPagination(data.data.pagination);
        setPage(pageNum);
        groupMessagesByChat(data.data.messages);
      } else {
        setError(data.error || 'Ошибка загрузки сообщений');
      }
    } catch (error) {
      setError('Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  const reloadHistory = async () => {
    if (!user?.botDatabaseId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/messages/reload', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        setMessages(data.data.messages);
        setTotal(data.data.total);
        setStats(data.data.stats);
        setPage(1);
        setFilters({ messageType: 'all', direction: 'all', search: '' });
        groupMessagesByChat(data.data.messages);
      } else {
        setError(data.error || 'Ошибка при перезагрузке истории');
      }
    } catch (error) {
      setError('Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.botDatabaseId) {
      fetchMessages();
    }
  }, [user?.botDatabaseId]);

  useEffect(() => {
    if (user?.botDatabaseId) {
      setPage(1);
      fetchMessages(1);
    }
  }, [filters]);

  const handleConnectBot = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/settings/bot-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botDatabaseId: botDatabaseId || null }),
      });

      const data = await response.json();

      if (response.ok) {
        await refreshUser();
        setShowSettings(false);
        if (botDatabaseId) {
          setMessages([]);
          setPage(1);
          setFilters({ messageType: 'all', direction: 'all', search: '' });
          setChatGroups([]);
          setSelectedChat(null);
        }
      } else {
        setError(data.error || 'Ошибка подключения');
      }
    } catch (error) {
      setError('Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedMessages = async () => {
    if (!user?.botDatabaseId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/seed-messages', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        await fetchMessages();
      } else {
        setError(data.error || 'Ошибка при добавлении сообщений');
      }
    } catch (error) {
      setError('Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(selectedChat),
          message_text: newMessage,
          sender_id: 1,
          message_type: 'text',
          is_media: false,
          is_bot: false,
          direction: 'incoming'
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (userId: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ];
    return colors[userId.charCodeAt(0) % colors.length];
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const selectedChatMessages = chatGroups.find(group => group.userId === selectedChat)?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      const scrollElement = messagesContainerRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [selectedChatMessages]);

  if (!user) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{translate('header.title')}</h1>
                <p className="text-sm text-slate-500">{translate('header.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                  {chatGroups.length} {translate('header.chats')}
                </Badge>
                <Badge variant="secondary" className="text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                  {messages.length} {translate('header.messages')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSelector />
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ messageType: 'all', direction: 'all', search: '' })}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  {translate('history.resetFilters')}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {translate('history.export')}
                </Button>
                <Link href="/history">
                  <Button 
                    variant="outline" 
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <History className="h-4 w-4 mr-2" />
                    {translate('header.history')}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettings(!showSettings)} 
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {translate('header.settings')}
                </Button>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user.username}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Button variant="outline" onClick={logout} className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  {translate('header.logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {translate('settings.title')}
              </CardTitle>
              <CardDescription>
                {translate('settings.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="botDatabaseId">{translate('dashboard.botDatabaseId')}</Label>
                <Input
                  id="botDatabaseId"
                  value={botDatabaseId}
                  onChange={(e) => setBotDatabaseId(e.target.value)}
                  placeholder="Например: my-telegram-bot-123"
                />
                <p className="text-sm text-slate-600">
                  {translate('dashboard.botDatabaseIdDesc')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConnectBot} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {translate('common.loading')}...
                    </>
                  ) : user.botDatabaseId ? (
                    translate('dashboard.updateConnection')
                  ) : (
                    translate('dashboard.connectBot')
                  )}
                </Button>
                {user.botDatabaseId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBotDatabaseId('');
                      handleConnectBot();
                    }}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    {translate('dashboard.disconnect')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Bot Connected */}
        {!user.botDatabaseId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bot className="h-20 w-20 text-slate-400 mb-6" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">{translate('dashboard.botNotConnected')}</h2>
              <p className="text-slate-600 text-center mb-6 max-w-md">
                {translate('dashboard.botNotConnectedDesc')}
              </p>
              <Button onClick={() => setShowSettings(true)} size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                <Settings className="h-5 w-5 mr-2" />
                {translate('dashboard.setupConnection')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex gap-4 h-[calc(100vh-8rem)]">
            {/* Список контактов */}
            <Card className="w-80 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {translate('dashboard.contacts')}
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={translate('dashboard.searchContacts')}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="p-2">
                    {chatGroups
                      .filter(group => 
                        group.userId.toLowerCase().includes(filters.search.toLowerCase()) ||
                        group.lastMessage.toLowerCase().includes(filters.search.toLowerCase())
                      )
                      .map(group => (
                        <div
                          key={group.userId}
                          onClick={() => setSelectedChat(group.userId)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                            selectedChat === group.userId 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={`${getAvatarColor(group.userId)} text-white text-sm font-semibold`}>
                                {getInitials(group.userId)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-sm text-gray-900 truncate">
                                  {group.userId}
                                </p>
                                <Badge variant="secondary" className="text-xs">
                                  {group.messageCount}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">Sender_id</p>
                              <p className="text-xs text-gray-600 truncate">
                                {group.lastMessage}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">last message</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Область диалога */}
            <Card className="flex-1 flex flex-col h-full">
              <CardHeader className="pb-3 border-b flex-shrink-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`${getAvatarColor(selectedChat || '')} text-white text-sm font-semibold`}>
                      {selectedChat ? getInitials(selectedChat) : '?'}
                    </AvatarFallback>
                  </Avatar>
                  {selectedChat || translate('dashboard.selectChat')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                {selectedChat ? (
                  <>
                    {selectedChatMessages.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="mb-4">{translate('dashboard.noMessages')}</p>
                          <Button 
                            onClick={handleSeedMessages} 
                            disabled={isLoading}
                            className="border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {translate('dashboard.loadTestMessages')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 min-h-0">
                          <ScrollArea className="h-full px-4 py-4" ref={messagesContainerRef}>
                          <div className="space-y-4">
                            {selectedChatMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.direction === 'incoming' ? 'justify-start' : 'justify-end'}`}
                              >
                                {message.direction === 'incoming' ? (
                                  // Sender message - слева
                                  <div className="flex gap-2 max-w-xs lg:max-w-md">
                                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0 mt-1">
                                      S
                                    </div>
                                    <div
                                      className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tl-none"
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <User className="h-3 w-3" />
                                        <span className="text-xs font-medium">Sender message</span>
                                      </div>
                                      <p className="text-sm break-words">{message.message_text}</p>
                                      <p className="text-xs opacity-75 mt-1">
                                        {formatTime(message.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  // Bot message - справа
                                  <div className="flex gap-2 max-w-xs lg:max-w-md">
                                    <div
                                      className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-tr-none"
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <Bot className="h-3 w-3" />
                                        <span className="text-xs font-medium text-gray-600">bot message</span>
                                      </div>
                                      <p className="text-sm break-words">{message.message_text}</p>
                                      <p className="text-xs opacity-75 mt-1 text-gray-500">
                                        {formatTime(message.created_at)}
                                      </p>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0 mt-1">
                                      B
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        </div>
                        <div className="p-4 border-t flex-shrink-0">
                          <div className="flex gap-2">
                            <Input
                              placeholder={translate('dashboard.typeMessage')}
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                              className="flex-1"
                            />
                            <Button onClick={sendMessage} size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="mb-4">{translate('dashboard.selectChat')}</p>
                      {chatGroups.length === 0 && (
                        <Button 
                          onClick={handleSeedMessages} 
                          disabled={isLoading}
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Загрузить тестовые сообщения
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}