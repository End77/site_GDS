'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'next/link';
import { ArrowLeft, Bot, Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const [botDatabaseId, setBotDatabaseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'checking'>('idle');

  useEffect(() => {
    if (user?.botDatabaseId) {
      setBotDatabaseId(user.botDatabaseId);
      setValidationStatus('valid');
    }
  }, [user]);

  const validateBotDatabase = async (botId: string) => {
    if (!botId.trim()) {
      setValidationStatus('idle');
      return;
    }

    setValidating(true);
    setValidationStatus('checking');

    try {
      // Simple validation: check if the format is correct
      const isValidFormat = /^[a-zA-Z0-9-]+$/.test(botId);
      
      if (!isValidFormat) {
        setValidationStatus('invalid');
        return;
      }

      // Check if database exists by trying to connect
      const response = await fetch('/api/settings/bot-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botDatabaseId: botId }),
      });

      if (response.ok) {
        setValidationStatus('valid');
      } else {
        const error = await response.json();
        if (error.error?.includes('not found')) {
          setValidationStatus('invalid');
        }
      }
    } catch (error) {
      setValidationStatus('invalid');
    } finally {
      setValidating(false);
    }
  };

  const handleBotIdChange = (value: string) => {
    setBotDatabaseId(value);
    if (validationStatus !== 'checking') {
      validateBotDatabase(value);
    }
  };

  const handleConnectBot = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/settings/bot-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botDatabaseId: botDatabaseId.trim() || null }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Reload the page to update user context
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to connect bot database');
      }
    } catch (error) {
      toast.error('Failed to connect bot database');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/settings/bot-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botDatabaseId: null }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setBotDatabaseId('');
        setValidationStatus('idle');
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to disconnect bot database');
      }
    } catch (error) {
      toast.error('Failed to disconnect bot database');
    } finally {
      setLoading(false);
    }
  };

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    switch (validationStatus) {
      case 'valid':
        return 'Bot database found and accessible';
      case 'invalid':
        return 'Bot database not found or invalid format';
      case 'checking':
        return 'Checking bot database...';
      default:
        return 'Enter a bot database ID to validate';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Username</Label>
                  <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Account Created</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bot Database Status</Label>
                  <div className="mt-1">
                    {user.botDatabaseId ? (
                      <Badge variant="secondary" className="text-xs">
                        <Bot className="h-3 w-3 mr-1" />
                        Connected: {user.botDatabaseId}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <Database className="h-3 w-3 mr-1" />
                        Not Connected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bot Database Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Bot Database Configuration</CardTitle>
              <CardDescription>
                Connect your Telegram bot database to view message history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="botDatabaseId">Bot Database ID</Label>
                <div className="relative">
                  <Input
                    id="botDatabaseId"
                    placeholder="e.g., my-bot-123"
                    value={botDatabaseId}
                    onChange={(e) => handleBotIdChange(e.target.value)}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon()}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Only letters, numbers, and hyphens are allowed
                </p>
              </div>

              {validationStatus !== 'idle' && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  validationStatus === 'valid' ? 'bg-green-50 text-green-800' :
                  validationStatus === 'invalid' ? 'bg-red-50 text-red-800' :
                  'bg-blue-50 text-blue-800'
                }`}>
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{getValidationMessage()}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={handleConnectBot}
                  disabled={loading || validating || validationStatus === 'invalid' || !botDatabaseId.trim()}
                >
                  {loading ? 'Connecting...' : 'Connect Bot'}
                </Button>

                {user.botDatabaseId && (
                  <Button
                    variant="outline"
                    onClick={handleDisconnect}
                    disabled={loading}
                  >
                    Disconnect
                  </Button>
                )}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">How it works:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Enter your bot database ID (e.g., "my-bot-123")</li>
                  <li>• The system will look for: ./bot_databases/tg_bot_{id}/telegram_bot.db</li>
                  <li>• Once connected, you can view message history in the dashboard</li>
                  <li>• Messages are filtered by user_id = 1 (for demo purposes)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Database Structure</CardTitle>
              <CardDescription>
                Expected structure for your Telegram bot database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs">
{`CREATE TABLE message_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message_text TEXT,
    message_type TEXT NOT NULL,
    media_file_id TEXT,
    is_media BOOLEAN DEFAULT FALSE,
    is_bot BOOLEAN DEFAULT FALSE,
    direction TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium mb-2">Field Descriptions:</p>
                <ul className="space-y-1 text-xs">
                  <li><strong>user_id:</strong> Your user ID (use 1 for demo)</li>
                  <li><strong>message_id:</strong> Telegram message ID</li>
                  <li><strong>sender_id:</strong> Telegram sender ID</li>
                  <li><strong>message_text:</strong> Text content of the message</li>
                  <li><strong>message_type:</strong> Type (text, photo, video, etc.)</li>
                  <li><strong>media_file_id:</strong> File ID for media messages</li>
                  <li><strong>is_media:</strong> Boolean flag for media messages</li>
                  <li><strong>is_bot:</strong> Boolean flag for bot messages</li>
                  <li><strong>direction:</strong> "incoming" or "outgoing"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}