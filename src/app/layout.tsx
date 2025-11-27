import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 1. Основное название сайта (отображается во вкладке браузера)
  title: "Gentle Droid Solutions | AI Chatbots & Automation for Business",

  // 2. Описание для поисковых систем
  description: "We develop custom AI chatbots and automation solutions to streamline your business processes. Increase efficiency and enhance customer experience.",

  // 3. Ключевые слова для SEO
  keywords: [
    "AI chatbots",
    "automation",
    "business solutions",
    "custom chatbots",
    "customer experience",
    "process automation",
    "Gentle Droid Solutions",
  ],

  // 4. Автор контента
  authors: [{ name: "Gentle Droid Solutions" }],

  // 5. Настройка иконок (favicon)
  // Next.js автоматически найдет файлы favicon.ico, apple-touch-icon.png и т.д. в папке /app
  // Убедитесь, что вы добавили свои иконки в папку /app
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // 6. Метаданные для социальных сетей (Open Graph)
  // Используется при поделении ссылкой в Facebook, LinkedIn, Telegram и др.
  openGraph: {
    title: "Gentle Droid Solutions | AI Chatbots & Automation for Business",
    description: "We develop custom AI chatbots and automation solutions to streamline your business processes. Increase efficiency and enhance customer experience.",
    url: "https://gentle-droid.com", // <-- ЗАМЕНИТЕ НА ВАШ URL
    siteName: "Gentle Droid Solutions",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // <-- ЗАМЕНИТЕ НА ПУТЬ К ВАШЕМУ ИЗОБРАЖЕНИЮ
        width: 1200,
        height: 630,
        alt: "Gentle Droid Solutions - AI Chatbots",
      },
    ],
  },

  // 7. Метаданные для Twitter (Cards)
  // Используется при поделении ссылкой в Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "Gentle Droid Solutions | AI Chatbots & Automation for Business",
    description: "We develop custom AI chatbots and automation solutions to streamline your business processes.",
    images: ["/images/og-image.jpg"], // <-- ЗАМЕНИТЕ НА ПУТЬ К ВАШЕМУ ИЗОБРАЖЕНИЮ
  },

  // 8. Другие полезные метаданные
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
