'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CalendarIcon, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  User, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  ArrowLeft,
  Settings,
  LogOut,
  Bot,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Message {
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

interface ChatInfo {
  chat_id: string;
  last_message_date: string;
  message_count: number;
}

interface SenderInfo {
  sender_id: string;
  message_count: number;
  last_message_date: string;
}

interface HistoryResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    chats: ChatInfo[];
    senders: SenderInfo[];
  };
}

export default function HistoryPage() {
  const { user, logout } = useAuth();
  const { translate } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [senders, setSenders] = useState<SenderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Фильтры
  const [selectedChat, setSelectedChat] = useState<string>('all');
  const [selectedSender, setSelectedSender] = useState<string>('all');
  const [direction, setDirection] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  const fetchHistory = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50'
      });

      if (selectedChat !== 'all') params.append('chatId', selectedChat);
      if (selectedSender !== 'all') params.append('senderId', selectedSender);
      if (direction !== 'all') params.append('direction', direction);
      if (dateFrom) params.append('dateFrom', dateFrom.toISOString());
      if (dateTo) params.append('dateTo', dateTo.toISOString());
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/messages/history?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch history');
      }
      
      const data: HistoryResponse = await response.json();
      setMessages(data.messages);
      setChats(data.filters.chats);
      setSenders(data.filters.senders);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotalMessages(data.pagination.total);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.botDatabaseId) {
      fetchHistory();
    }
  }, [user?.botDatabaseId, selectedChat, selectedSender, direction, dateFrom, dateTo, searchQuery]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchHistory(page);
    }
  };

  const clearFilters = () => {
    setSelectedChat('all');
    setSelectedSender('all');
    setDirection('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const exportHistory = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (selectedChat !== 'all') params.append('chatId', selectedChat);
      if (selectedSender !== 'all') params.append('senderId', selectedSender);
      if (direction !== 'all') params.append('direction', direction);
      if (dateFrom) params.append('dateFrom', dateFrom.toISOString());
      if (dateTo) params.append('dateTo', dateTo.toISOString());
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/messages/history/download?${params}`);
      if (!response.ok) throw new Error('Failed to export history');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const extension = format === 'json' ? 'json' : 'csv';
      a.download = `telegram-messages-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const getDirectionIcon = (dir: string) => {
    return dir === 'incoming' ? 
      <ArrowDownRight className="h-4 w-4 text-green-500" /> : 
      <ArrowUpRight className="h-4 w-4 text-blue-500" />;
  };

  const getDirectionBadge = (dir: string) => {
    const variant = dir === 'incoming' ? 'default' : 'secondary';
    const text = dir === 'incoming' ? translate('history.incoming') : translate('history.outgoing');
    return <Badge variant={variant}>{text}</Badge>;
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

  const getSenderDisplay = (senderId: string) => {
    if (senderId === 'bot') {
      return {
        name: translate('history.bot'),
        initials: 'BT',
        color: 'bg-purple-500'
      };
    }
    return {
      name: translate('history.user', { id: senderId }),
      initials: getInitials(senderId),
      color: getAvatarColor(senderId)
    };
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {translate('history.back')}
                </Button>
              </Link>
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{translate('history.title')}</h1>
                <p className="text-sm text-slate-500">
                  {translate('history.subtitle', { total: totalMessages, current: currentPage, total: totalPages })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                  {chats.length} {translate('header.chats')}
                </Badge>
                <Badge variant="secondary" className="text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                  {messages.length} {translate('header.messages')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={clearFilters} variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <Filter className="h-4 w-4 mr-2" />
                  {translate('history.resetFilters')}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                      <Download className="h-4 w-4 mr-2" />
                      {translate('history.export')}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => exportHistory('csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      {translate('history.exportCsv')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportHistory('json')}>
                      <Download className="h-4 w-4 mr-2" />
                      {translate('history.exportJson')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

        {/* No Bot Connected */}
        {!user.botDatabaseId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bot className="h-20 w-20 text-slate-400 mb-6" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">{translate('dashboard.botNotConnected')}</h2>
              <p className="text-slate-600 text-center mb-6 max-w-md">
                {translate('dashboard.botNotConnectedDesc')}
              </p>
              <Link href="/">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                  <Settings className="h-5 w-5 mr-2" />
                  {translate('dashboard.setupConnection')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Фильтры */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {translate('history.filters')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Поиск */}
                  <div className="space-y-2">
                    <Label htmlFor="search">{translate('history.search')}</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder={translate('history.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Чат */}
                  <div className="space-y-2">
                    <Label>{translate('history.chat')}</Label>
                    <Select value={selectedChat} onValueChange={setSelectedChat}>
                      <SelectTrigger>
                        <SelectValue placeholder={translate('history.allChats')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{translate('history.allChats')}</SelectItem>
                        {chats.map((chat) => (
                          <SelectItem key={chat.chat_id} value={chat.chat_id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={`text-xs ${getAvatarColor(chat.chat_id)}`}>
                                  {getInitials(chat.chat_id)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{translate('history.chat')} {chat.chat_id}</span>
                              <Badge variant="secondary" className="ml-auto text-xs bg-slate-100 text-slate-800 border border-slate-300">
                                {chat.message_count}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Отправитель */}
                  <div className="space-y-2">
                    <Label>{translate('history.sender')}</Label>
                    <Select value={selectedSender} onValueChange={setSelectedSender}>
                      <SelectTrigger>
                        <SelectValue placeholder={translate('history.allSenders')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{translate('history.allSenders')}</SelectItem>
                        {senders.map((sender) => (
                          <SelectItem key={sender.sender_id} value={sender.sender_id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={`text-xs ${getSenderDisplay(sender.sender_id).color}`}>
                                  {getSenderDisplay(sender.sender_id).initials}
                                </AvatarFallback>
                              </Avatar>
                              <span>{getSenderDisplay(sender.sender_id).name}</span>
                              <Badge variant="secondary" className="ml-auto text-xs bg-slate-100 text-slate-800 border border-slate-300">
                                {sender.message_count}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Направление */}
                  <div className="space-y-2">
                    <Label>{translate('history.direction')}</Label>
                    <Select value={direction} onValueChange={setDirection}>
                      <SelectTrigger>
                        <SelectValue placeholder={translate('history.allDirections')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{translate('history.allDirections')}</SelectItem>
                        <SelectItem value="incoming">
                          <div className="flex items-center gap-2">
                            <ArrowDownRight className="h-4 w-4 text-green-500" />
                            {translate('history.incoming')}
                          </div>
                        </SelectItem>
                        <SelectItem value="outgoing">
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-blue-500" />
                            {translate('history.outgoing')}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Дата */}
                  <div className="space-y-2">
                    <Label>{translate('history.dateFrom')} - {translate('history.dateTo')}</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1 text-xs">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {dateFrom ? format(dateFrom, 'dd.MM') : 'От'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={setDateFrom}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1 text-xs">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {dateTo ? format(dateTo, 'dd.MM') : 'До'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Сообщения */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>{translate('history.title')}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Total: {totalMessages}</span>
                  <span>|</span>
                  <span>{translate('history.pageOf', { current: currentPage, total: totalPages })}</span>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">
                    <p>Ошибка: {error}</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>{translate('history.noMessages')}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Аватар отправителя */}
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className={`text-xs ${getSenderDisplay(message.sender_id.toString()).color}`}>
                              {getSenderDisplay(message.sender_id.toString()).initials}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* Информация о сообщении */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {getSenderDisplay(message.sender_id.toString()).name}
                              </span>
                              <Badge 
                                variant={message.direction === 'incoming' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {message.direction === 'incoming' ? translate('history.incoming') : translate('history.outgoing')}
                              </Badge>
                              {message.is_bot && (
                                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 border-purple-300">
                                  {translate('history.bot')}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Текст сообщения */}
                            <div className="text-sm text-gray-800 p-2 bg-gray-50 rounded-md border border-gray-200">
                              {message.message_text || (
                                <span className="text-gray-500 italic">{translate('history.mediaFile')}</span>
                              )}
                            </div>
                            
                            {/* Метаданные */}
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                              <span className="font-medium">{translate('history.chatId', { id: message.user_id })}</span>
                              <span className="font-medium">{translate('history.messageId', { id: message.message_id })}</span>
                              <span>{formatTime(message.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Действия */}
                        <div className="flex items-center gap-1">
                          {getDirectionIcon(message.direction)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Пагинация */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Показано {messages.length} из {totalMessages} сообщений
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Назад
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >
                        Вперед
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}