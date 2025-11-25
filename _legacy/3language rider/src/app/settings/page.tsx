'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SettingsPage } from '@/components/settings/SettingsPage';

function SettingsContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <SettingsPage />;
}

export default function Settings() {
  return (
    <AuthProvider>
      <SettingsContent />
    </AuthProvider>
  );
}