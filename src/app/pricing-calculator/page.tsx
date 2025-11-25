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
import { useTranslation } from '@/lib/i18n/language-context'
import { LanguageProvider } from '@/lib/i18n/language-context'

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

function PricingCalculatorContent() {
  const { t } = useTranslation()
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
    { id: 'basic', name: 'Basic Chatbot', basePrice: 2900, description: 'Simple Q&A and basic interactions' },
    { id: 'advanced', name: 'Advanced Chatbot', basePrice: 5900, description: 'AI-powered with natural language processing' },
    { id: 'enterprise', name: 'Enterprise Chatbot', basePrice: 9900, description: 'Custom AI with advanced features' }
  ]

  const platformOptions = [
    { id: 'website', name: 'Website', price: 0 },
    { id: 'facebook', name: 'Facebook Messenger', price: 1000 },
    { id: 'whatsapp', name: 'WhatsApp', price: 1500 },
    { id: 'slack', name: 'Slack', price: 1000 },
    { id: 'telegram', name: 'Telegram', price: 500 },
    { id: 'instagram', name: 'Instagram DM', price: 1000 }
  ]

  const featurePrices = {
    customBranding: 1500,
    advancedAI: 2500,
    multiLanguage: 2000,
    analytics: 1000,
    prioritySupport: 1500,
    integration: 2000
  }

  const calculatePrice = () => {
    const selectedType = chatbotTypes.find(type => type.id === options.chatbotType)
    let basePrice = selectedType?.basePrice || 2900

    // Add conversation overage
    const conversationBlocks = Math.ceil((options.conversations - 1000) / 1000)
    if (conversationBlocks > 0) {
      basePrice += conversationBlocks * 1000
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
      base: selectedType?.basePrice || 2900,
      conversations: conversationBlocks > 0 ? conversationBlocks * 1000 : 0,
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
              <span className="text-gray-600">{t('navigation.backToHome')}</span>
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
            {t('calculator.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('calculator.subtitle')}
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
                  {t('calculator.chatbotType')}
                </CardTitle>
                <CardDescription>
                  {t('calculator.chatbotTypeDesc')}
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
                      <p className="text-lg font-bold text-blue-600">₽{type.basePrice.toLocaleString()}/month</p>
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
                  {t('calculator.monthlyConversations')}
                </CardTitle>
                <CardDescription>
                  {t('calculator.monthlyConversationsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{options.conversations.toLocaleString()}</span>
                    <Badge variant="outline">
                      {options.conversations > 1000 ? `+₽1,000 per 1,000 extra` : t('calculator.free')}
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
                  {t('calculator.platforms')}
                </CardTitle>
                <CardDescription>
                  {t('calculator.platformsDesc')}
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
                        {platform.price === 0 ? t('calculator.free') : `+₽${platform.price.toLocaleString()}/month`}
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
                  {t('calculator.additionalFeatures')}
                </CardTitle>
                <CardDescription>
                  {t('calculator.additionalFeaturesDesc')}
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
                          +₽{featurePrices[feature as keyof typeof featurePrices].toLocaleString()}/month
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
                  <CardTitle className="text-2xl">{t('calculator.priceSummary')}</CardTitle>
                  <CardDescription className="text-blue-100">
                    {t('calculator.yourInvestment')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 mb-2">{t('calculator.totalMonthlyCost')}</p>
                      <p className="text-4xl font-bold text-blue-600">₽{price.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{t('calculator.billedMonthly')}</p>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <h3 className="font-semibold mb-3">{t('calculator.priceBreakdown')}</h3>
                      
                      <div className="flex justify-between text-sm">
                        <span>{t('calculator.basePlan')}</span>
                        <span>₽{price.base.toLocaleString()}</span>
                      </div>
                      
                      {price.conversations > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{t('calculator.extraConversations')}</span>
                          <span>₽{price.conversations.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {price.platforms > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{t('calculator.platformCosts')}</span>
                          <span>₽{price.platforms.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {price.features > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{t('calculator.additionalFeaturesCost')}</span>
                          <span>₽{price.features.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>{t('calculator.total')}</span>
                        <span>₽{price.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full" size="lg">
                        {t('calculator.getStartedNow')}
                      </Button>
                      <Button variant="outline" className="w-full">
                        {t('calculator.saveQuote')}
                      </Button>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                      <p>✓ {t('calculator.freeTrial')}</p>
                      <p>✓ {t('calculator.noCreditCard')}</p>
                      <p>✓ {t('calculator.cancelAnytime')}</p>
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
                      <p className="font-medium text-sm">{t('calculator.needHelp')}</p>
                      <p className="text-xs text-gray-600">{t('calculator.expertsAssist')}</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      {t('calculator.contact')}
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

export default function PricingCalculator() {
  return (
    <LanguageProvider>
      <PricingCalculatorContent />
    </LanguageProvider>
  )
}