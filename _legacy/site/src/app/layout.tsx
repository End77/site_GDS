import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/auth-provider";

// Simplify font configuration
const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // Add this for better performance
  // Remove the variable property if not specifically needed
});

export const metadata: Metadata = {
  title: "Gentle Droid Solutions - AI Chatbot Solutions",
  description: "Your partner for smart IT support and chatbot solutions. Transform your customer experience with cutting-edge AI technology and seamless automation.",
  keywords: ["chatbot", "AI", "automation", "customer support", "IT solutions", "Gentle Droid"],
  authors: [{ name: "Gentle Droid Solutions" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Gentle Droid Solutions",
    description: "AI-powered chatbot solutions for modern businesses",
    url: "https://gentle-droid.com",
    siteName: "Gentle Droid Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gentle Droid Solutions",
    description: "AI-powered chatbot solutions for modern businesses",
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
        className={`${inter.className} antialiased bg-background text-foreground`}
        // Use className directly instead of variable
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
