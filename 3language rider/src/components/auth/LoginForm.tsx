'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { toast } from 'sonner';

export function LoginForm() {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await register(username, email, password);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold min-h-[3rem] flex items-center justify-center">
            {t.auth.welcomeTitle}
          </CardTitle>
          <CardDescription className="min-h-[1.5rem] flex items-center justify-center">
            {t.auth.welcomeDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger 
                value="login" 
                className="min-w-[80px] text-sm font-medium"
              >
                {t.auth.login}
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="min-w-[80px] text-sm font-medium"
              >
                {t.auth.register}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t.auth.email}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t.auth.emailPlaceholder}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t.auth.password}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t.auth.passwordPlaceholder}
                    required
                    className="h-10"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-10 min-w-[100px] font-medium" 
                  disabled={loading}
                >
                  {loading ? t.auth.signingIn : t.auth.loginButton}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    {t.auth.username}
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={t.auth.usernamePlaceholder}
                    required
                    minLength={3}
                    maxLength={20}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm font-medium">
                    {t.auth.email}
                  </Label>
                  <Input
                    id="reg-email"
                    name="email"
                    type="email"
                    placeholder={t.auth.emailPlaceholder}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-sm font-medium">
                    {t.auth.password}
                  </Label>
                  <Input
                    id="reg-password"
                    name="password"
                    type="password"
                    placeholder={t.auth.passwordPlaceholder}
                    required
                    minLength={6}
                    className="h-10"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-10 min-w-[100px] font-medium" 
                  disabled={loading}
                >
                  {loading ? t.auth.creatingAccount : t.auth.registerButton}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}