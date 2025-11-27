'use client';

import { useState } from 'react';
import { Bot, MessageSquare, Languages, Shield, LogOut, User, ArrowRight, Sparkles } from 'lucide-react';
import { LanguageProvider } from '@/lib/i18n/language-context'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

interface DashboardProps {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    company: string;
  };
  onLogout: () => void;
}

// Create the DashboardContent component
function DashboardContent({ user, onLogout }: DashboardProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const isAdmin = user?.role?.trim() === 'admin';

  const apps = [
    {
      id: 'chat',
      title: 'Внутренний чат',
      description: 'Общайтесь с коллегами в вашей компании',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      url: '/chat',
      available: true
    },
    {
      id: 'bot',
      title: 'Telegram Bot (3 языка)',
      description: 'Бот с поддержкой нескольких языков',
      icon: Languages,
      color: 'from-purple-500 to-purple-600',
      url: '/bot',
      available: true
    },
    {
      id: 'admin',
      title: 'Админ панель',
      description: 'Управление пользователями и просмотр всех сообщений',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      url: '/admin',
      available: isAdmin,
      adminOnly: true
    }
  ];

  const handleAppSelect = (app: typeof apps[0]) => {
    setSelectedApp(app.id);

    // Внутренняя навигация по приложению
    window.location.href = app.url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Gentle Droid Solutions</h1>
                <p className="text-sm text-slate-500">{user.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user.username}</p>
                <p className="text-xs text-slate-500">
                  {user.email}
                  {isAdmin && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Admin
                    </span>
                  )}
                </p>
              </div>
              <LanguageSwitcher />

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Выход</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900">
              Добро пожаловать, {user.username.split(' ')[0]}!
            </h2>
          </div>
          <p className="text-lg text-slate-600">
            Выберите приложение для начала работы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => {
            if (!app.available) return null;

            const Icon = app.icon;
            const isSelected = selectedApp === app.id;

            return (
              <button
                key={app.id}
                onClick={() => handleAppSelect(app)}
                className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-left border-2 ${
                  isSelected
                    ? 'border-blue-500 scale-105'
                    : 'border-transparent hover:scale-105'
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${app.color} opacity-10 rounded-2xl blur-2xl group-hover:opacity-20 transition-opacity`} />

                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    {app.title}
                    {app.adminOnly && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Admin
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {app.description}
                  </p>

                  <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                    <span>Открыть</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Ваша роль</h4>
            </div>
            <p className="text-slate-600 text-sm">
              {isAdmin ? 'Администратор с полным доступом' : 'Стандартный доступ пользователя'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Доступные приложения</h4>
            </div>
            <p className="text-slate-600 text-sm">
              {apps.filter(a => a.available).length} приложений готово к использованию
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Компания</h4>
            </div>
            <p className="text-slate-600 text-sm">
              {user.company}
            </p>
          </div>
        </div>

        {selectedApp && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-sm text-blue-800">
              <strong>Информация:</strong> Выполняется переход в приложение...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// Wrap the component with LanguageProvider
export function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <LanguageProvider>
      <DashboardContent user={user} onLogout={onLogout} />
    </LanguageProvider>
  )
}