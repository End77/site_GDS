import { Translations } from './types'

// Русские переводы
export const ru: Translations = {
  navigation: {
    home: 'Главная',
    services: 'Услуги',
    pricing: 'Цены',
    portfolio: 'Портфолио',
    testimonials: 'Отзывы',
    contact: 'Контакты',
    login: 'Войти',
    getStarted: 'Начать',
    backToHome: 'На главную'
  },
  hero: {
    badge: '🤖 Интегрированная платформа',
    title: 'Добро пожаловать в Gentle Droid Solutions',
    subtitle: 'Комплексная платформа для управления коммуникациями: внутренний чат, Telegram бот и админ панель',
    getStartedFree: 'Начать работу',
    viewDemo: 'Смотреть демо',
    calculatePrice: 'Рассчитать цену'
  },
  services: {
    title: 'Наши сервисы',
    subtitle: 'Все необходимые инструменты для эффективной коммуникации в одной платформе',
    customDevelopment: {
      title: 'Внутренний чат',
      description: 'Эффективная система коммуникации для вашей команды',
      features: ['Обмен сообщениями в реальном времени', 'История переписки', 'Файловый обмен']
    },
    readyMade: {
      title: 'Telegram Bot',
      description: 'Многоязычный бот с поддержкой 3 языков',
      features: ['Поддержка русского, английского, армянского', 'История сообщений', 'Аналитика']
    },
    integration: {
      title: 'Админ панель',
      description: 'Централизованное управление всеми системами',
      features: ['Управление пользователями', 'Просмотр статистики', 'Мониторинг активности']
    },
    aiTraining: {
      title: 'Разработка решений',
      description: 'Создание кастомных решений под ваши задачи',
      features: ['Индивидуальный подход', 'Современные технологии', 'Масштабируемость']
    },
    support: {
      title: 'Техническая поддержка',
      description: 'Круглосуточная поддержка и обслуживание',
      features: ['24/7 поддержка', 'Быстрое решение проблем', 'Проактивный мониторинг']
    },
    analytics: {
      title: 'Аналитика и отчетность',
      description: 'Детальная статистика использования всех систем',
      features: ['Реальное время', 'Графики и диаграммы', 'Экспорт данных']
    }
  },
  pricing: {
    title: 'Наши тарифы',
    subtitle: 'Гибкие ценовые варианты для бизнеса любого размера',
    calculateCustom: 'Рассчитать индивидуальную цену',
    basic: {
      name: 'Базовый',
      price: '₽2,900',
      description: 'Идеально для малого бизнеса',
      features: [
        'До 10 пользователей',
        'Внутренний чат',
        'Базовая статистика',
        'Email поддержка'
      ]
    },
    pro: {
      name: 'Про',
      price: '₽5,900',
      description: 'Для растущего бизнеса',
      features: [
        'До 50 пользователей',
        'Все функции базового',
        'Telegram Bot',
        'Приоритетная поддержка'
      ]
    },
    premium: {
      name: 'Премиум',
      price: '₽9,900',
      description: 'Для крупных компаний',
      features: [
        'Неограниченно пользователей',
        'Все функции про',
        'API доступ',
        'Выделенный менеджер'
      ]
    },
    choosePlan: 'Выбрать',
    mostPopular: 'Самый популярный'
  },
  testimonials: {
    title: 'Что говорят наши клиенты',
    subtitle: 'Доверяемый бизнесом по всему миру',
    items: [
      {
        name: "Александр Иванов",
        company: "TechStart",
        content: "Отличная платформа! Внутренний чат значительно улучшил коммуникацию в команде.",
        rating: 5
      },
      {
        name: "Мария Петрова",
        company: "Digital Agency",
        content: "Telegram бот стал настоящим спасением для поддержки клиентов. Очень удобно!",
        rating: 5
      },
      {
        name: "Дмитрий Сидоров",
        company: "E-Commerce",
        content: "Админ панель позволяет контролировать все процессы в одном месте. Рекомендую!",
        rating: 5
      }
    ]
  },
  stats: {
    title: 'Наши достижения',
    subtitle: 'Цифры, которые говорят сами за себя',
    projectsCompleted: 'Завершено проектов',
    clientSatisfaction: 'Довольство клиентов',
    conversationsHandled: 'Обработано диалогов',
    supportAvailable: 'Поддержка доступна'
  },
  cta: {
    title: 'Готовы трансформировать ваш бизнес?',
    subtitle: 'Присоединяйтесь к сотням компаний, уже использующих наши решения',
    startFreeTrial: 'Начать бесплатно',
    scheduleDemo: 'Запланировать демо'
  },
  footer: {
    company: 'Gentle Droid Solutions',
    description: 'Комплексная платформа для управления коммуникациями',
    services: 'Услуги',
    companyInfo: 'Компания',
    contact: 'Контакты',
    contactInfo: 'Контактная информация',
    socialMedia: 'Социальные сети',
    rights: '© 2024 Gentle Droid Solutions. Все права защищены.'
  },
  auth: {
    welcomeBack: 'Добро пожаловать',
    signInToAccount: 'Войдите в ваш аккаунт Gentle Droid Solutions',
    email: 'Email',
    password: 'Пароль',
    signIn: 'Войти',
    signingIn: 'Вход...',
    forgotPassword: 'Забыли пароль?',
    dontHaveAccount: 'Нет аккаунта?',
    signUp: 'Зарегистрироваться',
    agreeTo: 'Входя, вы соглашаетесь с нашими',
    termsOfService: 'Условиями использования',
    and: 'и',
    privacyPolicy: 'Политикой конфиденциальности',
    demoAccounts: 'Демо аккаунты:',
    admin: 'Администратор',
    user: 'Пользователь',
    invalidCredentials: 'Неверные учетные данные',
    networkError: 'Ошибка сети. Попробуйте еще раз.'
  },
  calculator: {
    title: 'Рассчитайте ваш идеальный план',
    subtitle: 'Настройте ваше решение чат-бота и получите мгновенное ценовое предложение, адаптированное под потребности вашего бизнеса',
    chatbotType: 'Тип чат-бота',
    chatbotTypeDesc: 'Выберите уровень сложности вашего чат-бота',
    monthlyConversations: 'Ежемесячные диалоги',
    monthlyConversationsDesc: 'Предполагаемое количество диалогов в месяц',
    platforms: 'Платформы',
    platformsDesc: 'Выберите где вы хотите развернуть ваш чат-бот',
    additionalFeatures: 'Дополнительные функции',
    additionalFeaturesDesc: 'Улучшите ваш чат-бот расширенными функциями',
    priceSummary: 'Сводка цен',
    ourInvestment: 'Ваша индивидуальная ежемесячная инвестиция',
    totalMonthlyCost: 'Общая ежемесячная стоимость',
    billedMonthly: 'Ежемесячная оплата',
    priceBreakdown: 'Разбивка цены:',
    basePlan: 'Базовый план',
    extraConversations: 'Дополнительные диалоги',
    platformCosts: 'Платформы',
    additionalFeaturesCost: 'Дополнительные функции',
    total: 'Итого',
    getStartedNow: 'Начать сейчас',
    saveQuote: 'Сохранить предложение',
    freeTrial: '✓ 14-дневный бесплатный пробный период',
    noCreditCard: '✓ Требуется кредитная карта',
    cancelAnytime: '✓ Отмена в любое время',
    needHelp: 'Нужна помощь?',
    expertsAssist: 'Наши эксперты готовы помочь вам',
    contact: 'Связаться',
    included: 'Включено в базовую цену',
    per1000Extra: '+$10 за каждые 1,000 дополнительно',
    free: 'Бесплатно',
    customBranding: 'Кастомный брендинг',
    advancedAI: 'Продвинутый ИИ',
    multiLanguage: 'Мультиязычность',
    analytics: 'Аналитика',
    prioritySupport: 'Приоритетная поддержка',
    integration: 'Интеграция'
  }
}

// Английские переводы
export const en: Translations = {
  navigation: {
    home: 'Home',
    services: 'Services',
    pricing: 'Pricing',
    portfolio: 'Portfolio',
    testimonials: 'Testimonials',
    contact: 'Contact',
    login: 'Login',
    getStarted: 'Get Started',
    backToHome: 'Back to Home'
  },
  hero: {
    badge: '🤖 Integrated Platform',
    title: 'Welcome to Gentle Droid Solutions',
    subtitle: 'Comprehensive platform for communication management: internal chat, Telegram bot and admin panel',
    getStartedFree: 'Get Started Free',
    viewDemo: 'View Demo',
    calculatePrice: 'Calculate Price'
  },
  services: {
    title: 'Our Services',
    subtitle: 'All necessary tools for effective communication in one platform',
    customDevelopment: {
      title: 'Internal Chat',
      description: 'Effective communication system for your team',
      features: ['Real-time messaging', 'Chat history', 'File sharing']
    },
    readyMade: {
      title: 'Telegram Bot',
      description: 'Multilingual bot with 3 language support',
      features: ['Russian, English, Armenian support', 'Message history', 'Analytics']
    },
    integration: {
      title: 'Admin Panel',
      description: 'Centralized management of all systems',
      features: ['User management', 'Statistics viewing', 'Activity monitoring']
    },
    aiTraining: {
      title: 'Custom Solutions',
      description: 'Creating custom solutions for your tasks',
      features: ['Individual approach', 'Modern technologies', 'Scalability']
    },
    support: {
      title: 'Technical Support',
      description: '24/7 support and maintenance',
      features: ['24/7 support', 'Fast problem resolution', 'Proactive monitoring']
    },
    analytics: {
      title: 'Analytics & Reporting',
      description: 'Detailed usage statistics for all systems',
      features: ['Real-time data', 'Charts and graphs', 'Data export']
    }
  },
  pricing: {
    title: 'Our Pricing',
    subtitle: 'Flexible pricing options for businesses of any size',
    calculateCustom: 'Calculate Custom Price',
    basic: {
      name: 'Basic',
      price: '$29',
      description: 'Perfect for small businesses',
      features: [
        'Up to 10 users',
        'Internal chat',
        'Basic statistics',
        'Email support'
      ]
    },
    pro: {
      name: 'Pro',
      price: '$59',
      description: 'For growing businesses',
      features: [
        'Up to 50 users',
        'All Basic features',
        'Telegram Bot',
        'Priority support'
      ]
    },
    premium: {
      name: 'Premium',
      price: '$99',
      description: 'For large companies',
      features: [
        'Unlimited users',
        'All Pro features',
        'API access',
        'Dedicated manager'
      ]
    },
    choosePlan: 'Choose',
    mostPopular: 'Most Popular'
  },
  testimonials: {
    title: 'What Our Clients Say',
    subtitle: 'Trusted by businesses worldwide',
    items: [
      {
        name: "John Smith",
        company: "TechStart",
        content: "Excellent platform! Internal chat significantly improved team communication.",
        rating: 5
      },
      {
        name: "Sarah Johnson",
        company: "Digital Agency",
        content: "Telegram bot has been a real lifesaver for customer support. Very convenient!",
        rating: 5
      },
      {
        name: "Mike Wilson",
        company: "E-Commerce",
        content: "Admin panel allows controlling all processes in one place. Recommended!",
        rating: 5
      }
    ]
  },
  stats: {
    title: 'Our Achievements',
    subtitle: 'Numbers that speak for themselves',
    projectsCompleted: 'Projects Completed',
    clientSatisfaction: 'Client Satisfaction',
    conversationsHandled: 'Conversations Handled',
    supportAvailable: 'Support Available'
  },
  cta: {
    title: 'Ready to Transform Your Business?',
    subtitle: 'Join hundreds of companies already using our solutions',
    startFreeTrial: 'Start Free Trial',
    scheduleDemo: 'Schedule Demo'
  },
  footer: {
    company: 'Gentle Droid Solutions',
    description: 'Comprehensive platform for communication management',
    services: 'Services',
    companyInfo: 'Company',
    contact: 'Contact',
    contactInfo: 'Contact Information',
    socialMedia: 'Social Media',
    rights: '© 2024 Gentle Droid Solutions. All rights reserved.'
  },
  auth: {
    welcomeBack: 'Welcome Back',
    signInToAccount: 'Sign in to your Gentle Droid Solutions account',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    forgotPassword: 'Forgot password?',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign up',
    agreeTo: 'By signing in, you agree to our',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    demoAccounts: 'Demo Accounts:',
    admin: 'Administrator',
    user: 'User',
    invalidCredentials: 'Invalid credentials',
    networkError: 'Network error. Please try again.'
  },
  calculator: {
    title: 'Calculate Your Perfect Plan',
    subtitle: 'Customize your chatbot solution and get an instant price quote tailored to your business needs',
    chatbotType: 'Chatbot Type',
    chatbotTypeDesc: 'Choose level of sophistication for your chatbot',
    monthlyConversations: 'Monthly Conversations',
    monthlyConversationsDesc: 'Estimated number of conversations per month',
    platforms: 'Platforms',
    platformsDesc: 'Select where you want to deploy your chatbot',
    additionalFeatures: 'Additional Features',
    additionalFeaturesDesc: 'Enhance your chatbot with advanced features',
    priceSummary: 'Price Summary',
    ourInvestment: 'Your customized monthly investment',
    totalMonthlyCost: 'Total Monthly Cost',
    billedMonthly: 'Billed monthly',
    priceBreakdown: 'Price Breakdown:',
    basePlan: 'Base Plan',
    extraConversations: 'Extra Conversations',
    platformCosts: 'Platforms',
    additionalFeaturesCost: 'Additional Features',
    total: 'Total',
    getStartedNow: 'Get Started Now',
    saveQuote: 'Save Quote',
    freeTrial: '✓ 14-day free trial',
    noCreditCard: '✓ No credit card required',
    cancelAnytime: '✓ Cancel anytime',
    needHelp: 'Need help?',
    expertsAssist: 'Our experts are here to assist you',
    contact: 'Contact',
    included: 'Included in base price',
    per1000Extra: '+$10 per 1,000 extra',
    free: 'Free',
    customBranding: 'Custom Branding',
    advancedAI: 'Advanced AI',
    multiLanguage: 'Multi-language',
    analytics: 'Analytics',
    prioritySupport: 'Priority Support',
    integration: 'Integration'
  }
}

// Армянские переводы (базовые)
export const hy: Translations = {
  ...en,
  hero: {
    ...en.hero,
    title: 'Բարի գալուստ Gentle Droid Solutions',
    subtitle: 'Հաղորդակային հարթակարգ հաղորդակցման կառավարման համարան'
  }
}

export const locales = { ru, en, hy }
export const defaultLocale: Language = 'ru'

// Функции для работы с локализацией
export const getClientLocale = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language') as Language
    if (saved && locales[saved]) return saved
    
    // Определение языка браузера
    const browserLang = navigator.language.split('-')[0] as Language
    return locales[browserLang] ? browserLang : defaultLocale
  }
  return defaultLocale
}

export const setClientLocale = (locale: Language) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', locale)
  }
}