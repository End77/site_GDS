'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, MessageSquare, Users, TrendingUp, Settings, LogOut, ArrowLeft, Plus, BarChart3, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/user-menu'
import { AnimatedCounter } from '@/components/ui/animated-counter'

export default function Dashboard() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to access dashboard</h1>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const stats = [
    { title: "Active Chatbots", value: 12, change: "+2", icon: <Bot className="w-5 h-5" />, color: "blue" },
    { title: "Total Conversations", value: 45890, change: "+12%", icon: <MessageSquare className="w-5 h-5" />, color: "green" },
    { title: "Active Users", value: 1234, change: "+5%", icon: <Users className="w-5 h-5" />, color: "purple" },
    { title: "Satisfaction Rate", value: 94, suffix: "%", change: "+3%", icon: <TrendingUp className="w-5 h-5" />, color: "orange" }
  ]

  const recentActivity = [
    { id: 1, action: "New chatbot deployed", entity: "E-Commerce Assistant", time: "2 hours ago", status: "success" },
    { id: 2, action: "Configuration updated", entity: "Support Bot", time: "4 hours ago", status: "success" },
    { id: 3, action: "Analytics report generated", entity: "Monthly Report", time: "1 day ago", status: "success" },
    { id: 4, action: "Integration completed", entity: "Slack Integration", time: "2 days ago", status: "success" }
  ]

  const chatbots = [
    { id: 1, name: "E-Commerce Assistant", status: "active", conversations: 15420, satisfaction: 96 },
    { id: 2, name: "Support Bot", status: "active", conversations: 12340, satisfaction: 94 },
    { id: 3, name: "Lead Qualifier", status: "active", conversations: 8920, satisfaction: 92 },
    { id: 4, name: "FAQ Bot", status: "inactive", conversations: 5210, satisfaction: 89 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your chatbots and monitor performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center text-${stat.color}-600`}>
                    {stat.icon}
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter 
                      end={stat.value} 
                      suffix={stat.suffix || ''}
                      className="text-2xl font-bold"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="font-medium text-sm">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.entity}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Chatbot
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Test Chatbot
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chatbots" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Chatbots</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Chatbot
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {chatbots.map((chatbot) => (
                <Card key={chatbot.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                        <CardDescription>
                          <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                            {chatbot.status}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Conversations</p>
                        <p className="font-semibold">{chatbot.conversations.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Satisfaction</p>
                        <p className="font-semibold">{chatbot.satisfaction}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed insights about your chatbot performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Analytics dashboard coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">Detailed charts and metrics will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Settings panel coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">Account and billing settings will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}