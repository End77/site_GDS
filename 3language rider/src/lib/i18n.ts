export interface Translations {
  // Header
  header: {
    title: string;
    subtitle: string;
    chats: string;
    messages: string;
    history: string;
    settings: string;
    logout: string;
    language: string;
  };
  
  // Auth
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
    loginButton: string;
    registerButton: string;
    haveAccount: string;
    noAccount: string;
    loginHere: string;
    registerHere: string;
    loading: string;
    welcomeTitle: string;
    welcomeDescription: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    usernamePlaceholder: string;
    signingIn: string;
    creatingAccount: string;
  };
  
  // Dashboard
  dashboard: {
    botNotConnected: string;
    botNotConnectedDesc: string;
    setupConnection: string;
    connectBot: string;
    updateConnection: string;
    disconnect: string;
    botDatabaseId: string;
    botDatabaseIdDesc: string;
    noMessages: string;
    loadTestMessages: string;
    selectChat: string;
    sendMessage: string;
    typeMessage: string;
    contacts: string;
    searchContacts: string;
    senderMessage: string;
    botMessage: string;
  };
  
  // History
  history: {
    title: string;
    subtitle: string;
    back: string;
    totalMessages: string;
    currentPage: string;
    filters: string;
    search: string;
    searchPlaceholder: string;
    chat: string;
    allChats: string;
    sender: string;
    allSenders: string;
    direction: string;
    allDirections: string;
    incoming: string;
    outgoing: string;
    dateFrom: string;
    dateTo: string;
    resetFilters: string;
    export: string;
    exportCsv: string;
    exportJson: string;
    chatId: string;
    messageId: string;
    user: string;
    bot: string;
    mediaFile: string;
    noMessages: string;
    pageOf: string;
  };
  
  // Settings
  settings: {
    title: string;
    description: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    yes: string;
    no: string;
    ok: string;
  };
}

export const translations: Record<string, Translations> = {
  en: {
    header: {
      title: "Telegram Messages",
      subtitle: "User Dialogues",
      chats: "chats",
      messages: "messages",
      history: "History",
      settings: "Settings",
      logout: "Logout",
      language: "Language"
    },
    auth: {
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      username: "Username",
      confirmPassword: "Confirm Password",
      loginButton: "Login",
      registerButton: "Register",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      loginHere: "Login here",
      registerHere: "Register here",
      loading: "Loading...",
      welcomeTitle: "Welcome to Telegram Bot Dashboard",
      welcomeDescription: "Sign in to your account or create a new one",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      usernamePlaceholder: "Choose a username",
      signingIn: "Signing in...",
      creatingAccount: "Creating account..."
    },
    dashboard: {
      botNotConnected: "Bot Not Connected",
      botNotConnectedDesc: "Connect Telegram bot database to view message history and statistics.",
      setupConnection: "Setup Connection",
      connectBot: "Connect Bot",
      updateConnection: "Update Connection",
      disconnect: "Disconnect",
      botDatabaseId: "Bot Database ID",
      botDatabaseIdDesc: "Letters, numbers and hyphens only (minimum 3 characters)",
      noMessages: "No messages in this chat",
      loadTestMessages: "Load Test Messages",
      selectChat: "Select Chat",
      sendMessage: "Send Message",
      typeMessage: "Type your message...",
      contacts: "Contacts",
      searchContacts: "Search contacts...",
      senderMessage: "Sender message",
      botMessage: "Bot message"
    },
    history: {
      title: "Message History",
      subtitle: "Total messages: {total} | Page {current} of {total}",
      back: "Back",
      totalMessages: "Total messages: {total}",
      currentPage: "Page {current} of {total}",
      filters: "Filters",
      search: "Search",
      searchPlaceholder: "Text or ID...",
      chat: "Chat",
      allChats: "All Chats",
      sender: "Sender",
      allSenders: "All Senders",
      direction: "Direction",
      allDirections: "All Directions",
      incoming: "Incoming",
      outgoing: "Outgoing",
      dateFrom: "Date From",
      dateTo: "Date To",
      resetFilters: "Reset Filters",
      export: "Export",
      exportCsv: "Export to CSV",
      exportJson: "Export to JSON",
      chatId: "Chat: {id}",
      messageId: "ID: {id}",
      user: "User {id}",
      bot: "Bot",
      mediaFile: "Media file",
      noMessages: "No messages found",
      pageOf: "Page {current} of {total}"
    },
    settings: {
      title: "Bot Settings",
      description: "Connect Telegram bot database to view message history"
    },
    common: {
      loading: "Loading...",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      yes: "Yes",
      no: "No",
      ok: "OK"
    }
  },
  
  ru: {
    header: {
      title: "Сообщения Telegram",
      subtitle: "Диалоги с пользователями",
      chats: "чатов",
      messages: "сообщений",
      history: "История",
      settings: "Настройки",
      logout: "Выйти",
      language: "Язык"
    },
    auth: {
      login: "Вход",
      register: "Регистрация",
      email: "Email",
      password: "Пароль",
      username: "Имя пользователя",
      confirmPassword: "Подтвердите пароль",
      loginButton: "Войти",
      registerButton: "Зарегистрироваться",
      haveAccount: "Уже есть аккаунт?",
      noAccount: "Нет аккаунта?",
      loginHere: "Войти здесь",
      registerHere: "Зарегистрироваться здесь",
      loading: "Загрузка...",
      welcomeTitle: "Добро пожаловать в панель управления Telegram ботом",
      welcomeDescription: "Войдите в свой аккаунт или создайте новый",
      emailPlaceholder: "Введите ваш email",
      passwordPlaceholder: "Введите ваш пароль",
      usernamePlaceholder: "Выберите имя пользователя",
      signingIn: "Вход...",
      creatingAccount: "Создание аккаунта..."
    },
    dashboard: {
      botNotConnected: "Бот не подключен",
      botNotConnectedDesc: "Подключите базу данных Telegram бота для просмотра истории сообщений и статистики.",
      setupConnection: "Настроить подключение",
      connectBot: "Подключить бот",
      updateConnection: "Обновить подключение",
      disconnect: "Отключить",
      botDatabaseId: "ID базы данных бота",
      botDatabaseIdDesc: "Только буквы, цифры и дефисы (минимум 3 символа)",
      noMessages: "Нет сообщений в этом чате",
      loadTestMessages: "Загрузить тестовые сообщения",
      selectChat: "Выберите чат",
      sendMessage: "Отправить сообщение",
      typeMessage: "Введите ваше сообщение...",
      contacts: "Контакты",
      searchContacts: "Поиск контактов...",
      senderMessage: "Sender message",
      botMessage: "Bot message"
    },
    history: {
      title: "История сообщений",
      subtitle: "Всего сообщений: {total} | Страница {current} из {total}",
      back: "Назад",
      totalMessages: "Всего сообщений: {total}",
      currentPage: "Страница {current} из {total}",
      filters: "Фильтры",
      search: "Поиск",
      searchPlaceholder: "Текст или ID...",
      chat: "Чат",
      allChats: "Все чаты",
      sender: "Отправитель",
      allSenders: "Все отправители",
      direction: "Направление",
      allDirections: "Все направления",
      incoming: "Входящее",
      outgoing: "Исходящее",
      dateFrom: "Дата с",
      dateTo: "Дата по",
      resetFilters: "Сбросить фильтры",
      export: "Экспорт",
      exportCsv: "Экспорт в CSV",
      exportJson: "Экспорт в JSON",
      chatId: "Чат: {id}",
      messageId: "ID: {id}",
      user: "Пользователь {id}",
      bot: "Бот",
      mediaFile: "Медиа файл",
      noMessages: "Сообщения не найдены",
      pageOf: "Страница {current} из {total}"
    },
    settings: {
      title: "Настройки бота",
      description: "Подключите базу данных Telegram бота для просмотра истории сообщений"
    },
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Изменить",
      close: "Закрыть",
      yes: "Да",
      no: "Нет",
      ok: "ОК"
    }
  },
  
  hy: {
    header: {
      title: "Telegram Հաղորդագրություններ",
      subtitle: "Օգտատերերի երկխոսություններ",
      chats: "չաթ",
      messages: "հաղորդագրություն",
      history: "Պատմություն",
      settings: "Կարգավորումներ",
      logout: "Դուրս գալ",
      language: "Լեզու"
    },
    auth: {
      login: "Մուտք",
      register: "Գրանցում",
      email: "Էլ․ փոստ",
      password: "Գաղտնաբառ",
      username: "Օգտանուն",
      confirmPassword: "Հաստատել գաղտնաբառը",
      loginButton: "Մուտք",
      registerButton: "Գրանցվել",
      haveAccount: "Արդեն ունեք հաշիվ?",
      noAccount: "Չունե՞ք հաշիվ",
      loginHere: "Մուտք այստեղ",
      registerHere: "Գրանցվել այստեղ",
      loading: "Բեռնում...",
      welcomeTitle: "Բարի գալուստ Telegram բոտի կառավարման վահանակ",
      welcomeDescription: "Մուտք գործեք ձեր հաշիվ կամ ստեղծեք նորը",
      emailPlaceholder: "Մուտքագրեք ձեր էլ․ փոստը",
      passwordPlaceholder: "Մուտքագրեք ձեր գաղտնաբառը",
      usernamePlaceholder: "Ընտրեք օգտանուն",
      signingIn: "Մուտք գործում է...",
      creatingAccount: "Հաշիվ ստեղծվում է..."
    },
    dashboard: {
      botNotConnected: "Բոտը միացված չէ",
      botNotConnectedDesc: "Միացրեք Telegram բոտի տվյալների բազան՝ հաղորդագրությունների պատմության և վիճակագրության դիտման համար։",
      setupConnection: "Կարգավորել միացումը",
      connectBot: "Միացնել բոտը",
      updateConnection: "Թարմացնել միացումը",
      disconnect: "Անջատել",
      botDatabaseId: "Բոտի տվյալների բազայի ID",
      botDatabaseIdDesc: "Միայն տառեր, թվեր և գծիկներ (նվազագույնը 3 նիշ)",
      noMessages: "Այս չաթում հաղորդագրություններ չկան",
      loadTestMessages: "Բեռնել թեստային հաղորդագրություններ",
      selectChat: "Ընտրել չաթ",
      sendMessage: "Ուղարկել հաղորդագրություն",
      typeMessage: "Մուտքագրեք ձեր հաղորդագրությունը...",
      contacts: "Կոնտակտներ",
      searchContacts: "Որոնել կոնտակտներ...",
      senderMessage: "Sender message",
      botMessage: "Bot message"
    },
    history: {
      title: "Հաղորդագրությունների պատմություն",
      subtitle: "Ընդհանուր հաղորդագրություններ՝ {total} | Էջ {current} {total}-ից",
      back: "Հետ",
      totalMessages: "Ընդհանուր հաղորդագրություններ՝ {total}",
      currentPage: "Էջ {current} {total}-ից",
      filters: "Ֆիլտրեր",
      search: "Որոնում",
      searchPlaceholder: "Տեքստ կամ ID...",
      chat: "Չաթ",
      allChats: "Բոլոր չաթերը",
      sender: "Ուղարարիչ",
      allSenders: "Բոլոր ուղարարիչները",
      direction: "Ուղղություն",
      allDirections: "Բոլոր ուղղությունները",
      incoming: "Մուտքային",
      outgoing: "Ելքային",
      dateFrom: "Ամսաթիվից",
      dateTo: "Ամսաթիվ",
      resetFilters: "Վերականգնել ֆիլտրերը",
      export: "Արտահանում",
      exportCsv: "Արտահանել CSV",
      exportJson: "Արտահանել JSON",
      chatId: "Չաթ՝ {id}",
      messageId: "ID՝ {id}",
      user: "Օգտատեր {id}",
      bot: "Բոտ",
      mediaFile: "Մեդիա ֆայլ",
      noMessages: "Հաղորդագրություններ չեն գտնվել",
      pageOf: "Էջ {current} {total}-ից"
    },
    settings: {
      title: "Բոտի կարգավորումներ",
      description: "Միացրեք Telegram բոտի տվյալների բազան՝ հաղորդագրությունների պատմության դիտման համար"
    },
    common: {
      loading: "Բեռնում...",
      error: "Սխալ",
      save: "Պահպանել",
      cancel: "Չեղարկել",
      delete: "Ջնջել",
      edit: "Խմբագրել",
      close: "Փակել",
      yes: "Այո",
      no: "Ոչ",
      ok: "Լավ"
    }
  }
};

export type Language = 'en' | 'ru' | 'hy';

export const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
  { code: 'hy' as Language, name: 'Հայերեն', flag: '🇦🇲' }
];