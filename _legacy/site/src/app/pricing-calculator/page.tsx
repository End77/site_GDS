'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bot, Users, MessageSquare, Zap, BarChart3, CheckCircle, ArrowLeft, Calculator } from 'lucide-react'
import Link from 'next/link'

interface PricingOptions {
  chatbotType: string
  conversations: number
  features: {
    customBranding: boolean
    advancedAI: boolean
    multiLanguage: boolean
    analytics: boolean
    prioritySupport: boolean
    integration: boolean
  }
  platforms: string[]
}

export default function PricingCalculator() {
  const [options, setOptions] = useState<PricingOptions>({
    chatbotType: 'basic',
    conversations: 1000,
    features: {
      customBranding: false,
      advancedAI: false,
      multiLanguage: false,
      analytics: false,
      prioritySupport: false,
      integration: false
    },
    platforms: []
  })

  const chatbotTypes = [
    { id: 'basic', name: 'Basic Chatbot', basePrice: 29, description: 'Simple Q&A and basic interactions' },
    { id: 'advanced', name: 'Advanced Chatbot', basePrice: 59, description: 'AI-powered with natural language processing' },
    { id: 'enterprise', name: 'Enterprise Chatbot', basePrice: 99, description: 'Custom AI with advanced features' }
  ]

  const platformOptions = [
    { id: 'website', name: 'Website', price: 0 },
    { id: 'facebook', name: 'Facebook Messenger', price: 10 },
    { id: 'whatsapp', name: 'WhatsApp', price: 15 },
    { id: 'slack', name: 'Slack', price: 10 },
    { id: 'telegram', name: 'Telegram', price: 5 },
    { id: 'instagram', name: 'Instagram DM', price: 10 }
  ]

  const featurePrices = {
    customBranding: 15,
    advancedAI: 25,
    multiLanguage: 20,
    analytics: 10,
    prioritySupport: 15,
    integration: 20
  }

  const calculatePrice = () => {
    const selectedType = chatbotTypes.find(type => type.id === options.chatbotType)
    let basePrice = selectedType?.basePrice || 29

    // Add conversation overage
    const conversationBlocks = Math.ceil((options.conversations - 1000) / 1000)
    if (conversationBlocks > 0) {
      basePrice += conversationBlocks * 10
    }

    // Add platform costs
    const platformCost = options.platforms.reduce((total, platformId) => {
      const platform = platformOptions.find(p => p.id === platformId)
      return total + (platform?.price || 0)
    }, 0)

    // Add feature costs
    const featureCost = Object.entries(options.features).reduce((total, [feature, enabled]) => {
      return total + (enabled ? featurePrices[feature as keyof typeof featurePrices] : 0)
    }, 0)

    return {
      base: selectedType?.basePrice || 29,
      conversations: conversationBlocks > 0 ? conversationBlocks * 10 : 0,
      platforms: platformCost,
      features: featureCost,
      total: basePrice + platformCost + featureCost
    }
  }

  const price = calculatePrice()

  const updateOption = <K extends keyof PricingOptions>(
    key: K,
    value: PricingOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  const updateFeature = (feature: keyof typeof options.features, enabled: boolean) => {
    setOptions(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: enabled }
    }))
  }

  const togglePlatform = (platformId: string) => {
    setOptions(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">Pricing Calculator</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calculate Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Customize your chatbot solution and get an instant price quote tailored to your business needs
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chatbot Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  Chatbot Type
                </CardTitle>
                <CardDescription>
                  Choose the level of sophistication for your chatbot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {chatbotTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        options.chatbotType === type.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateOption('chatbotType', type.id)}
                    >
                      <h3 className="font-semibold mb-1">{type.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <p className="text-lg font-bold text-blue-600">${type.basePrice}/month</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Monthly Conversations
                </CardTitle>
                <CardDescription>
                  Estimated number of conversations per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{options.conversations.toLocaleString()}</span>
                    <Badge variant="outline">
                      {options.conversations > 1000 ? `+$10 per 1,000 extra` : 'Included in base price'}
                    </Badge>
                  </div>
                  <Slider
                    value={[options.conversations]}
                    onValueChange={([value]) => updateOption('conversations', value)}
                    max={10000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1,000</span>
                    <span>10,000+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Platforms
                </CardTitle>
                <CardDescription>
                  Select where you want to deploy your chatbot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {platformOptions.map((platform) => (
                    <div
                      key={platform.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${
                        options.platforms.includes(platform.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <span className="font-medium">{platform.name}</span>
                      <span className="text-sm text-gray-600">
                        {platform.price === 0 ? 'Free' : `+$${platform.price}/month`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Additional Features
                </CardTitle>
                <CardDescription>
                  Enhance your chatbot with advanced features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(options.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor={feature} className="font-medium cursor-pointer">
                          {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <p className="text-sm text-gray-500">
                          +${featurePrices[feature as keyof typeof featurePrices]}/month
                        </p>
                      </div>
                      <Switch
                        id={feature}
                        checked={enabled}
                        onCheckedChange={(checked) => updateFeature(feature as keyof typeof options.features, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="text-2xl">Price Summary</CardTitle>
                  <CardDescription className="text-blue-100">
                    Your customized monthly investment
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 mb-2">Total Monthly Cost</p>
                      <p className="text-4xl font-bold text-blue-600">${price.total}</p>
                      <p className="text-sm text-gray-500">Billed monthly</p>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <h3 className="font-semibold mb-3">Price Breakdown:</h3>
                      
                      <div className="flex justify-between text-sm">
                        <span>Base Plan</span>
                        <span>${price.base}</span>
                      </div>
                      
                      {price.conversations > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Extra Conversations</span>
                          <span>${price.conversations}</span>
                        </div>
                      )}
                      
                      {price.platforms > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Platforms</span>
                          <span>${price.platforms}</span>
                        </div>
                      )}
                      
                      {price.features > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Additional Features</span>
                          <span>${price.features}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${price.total}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full" size="lg">
                        Get Started Now
                      </Button>
                      <Button variant="outline" className="w-full">
                        Save Quote
                      </Button>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                      <p>✓ 14-day free trial</p>
                      <p>✓ No credit card required</p>
                      <p>✓ Cancel anytime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Need help?</p>
                      <p className="text-xs text-gray-600">Our experts are here to assist you</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}