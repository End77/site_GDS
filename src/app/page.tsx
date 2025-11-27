// ============================================
// app/page.tsx - Главная страница (Лендинг)
// ============================================
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Cpu, MessageSquare, Zap, Users, BarChart3, ArrowRight, CheckCircle, Star, Menu, X, Shield } from 'lucide-react'
import Link from 'next/link'
import { UserMenu } from '@/components/auth/user-menu' // UserMenu остается для навигации
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { AuthProvider } from '@/components/auth/auth-provider' // Возвращаем AuthProvider
import { LanguageProvider, useTranslation } from '@/lib/i18n/language-context'

function HomeContent() {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Убираем дублирующиеся сервисы для чистоты кода
  const services = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: t('services.customDevelopment.title'),
      description: t('services.customDevelopment.description'),
      features: t('services.customDevelopment.features') || []
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: t('services.readyMade.title'),
      description: t('services.readyMade.description'),
      features: t('services.readyMade.features') || []
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: t('services.integration.title'),
      description: t('services.integration.description'),
      features: t('services.integration.features') || []
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('services.aiTraining.title'),
      description: t('services.aiTraining.description'),
      features: t('services.aiTraining.features') || []
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('services.support.title'),
      description: t('services.support.description'),
      features: t('services.support.features') || []
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('services.analytics.title'),
      description: t('services.analytics.description'),
      features: t('services.analytics.features') || []
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('services.aiTraining.title'),
      description: t('services.aiTraining.description'),
      features: t('services.aiTraining.features') || []
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('services.support.title'),
      description: t('services.support.description'),
      features: t('services.support.features') || []
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('services.analytics.title'),
      description: t('services.analytics.description'),
      features: t('services.analytics.features') || []
    }
  ]

  const pricingPlans = [
    {
      name: t('pricing.basic.name'),
      price: t('pricing.basic.price'),
      description: t('pricing.basic.description'),
      features: t('pricing.basic.features') || [],
      highlighted: false
    },
    {
      name: t('pricing.pro.name'),
      price: t('pricing.pro.price'),
      description: t('pricing.pro.description'),
      features: t('pricing.pro.features') || [],
      highlighted: true
    },
    {
      name: t('pricing.premium.name'),
      price: t('pricing.premium.price'),
      description: t('pricing.premium.description'),
      features: t('pricing.premium.features') || [],
      highlighted: false
    }
  ]

  const testimonials = t('testimonials.items') || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Gentle Droid Solutions</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.services')}</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.pricing')}</Link>
              <Link href="/portfolio" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.portfolio')}</Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.testimonials')}</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.contact')}</Link>
              <LanguageSwitcher />
              <UserMenu />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-4">
                <Link href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.services')}</Link>
                <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.pricing')}</Link>
                <Link href="/portfolio" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.portfolio')}</Link>
                <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.testimonials')}</Link>
                <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">{t('navigation.contact')}</Link>
                <div className="flex items-center space-x-2 pt-2">
                  <LanguageSwitcher />
                  <UserMenu />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <ScrollReveal delay={100}>
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              {t('hero.badge')}
            </Badge>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  {t('hero.getStartedFree')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                {t('hero.viewDemo')}
              </Button>
              <Link href="/pricing-calculator">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  {t('hero.calculatePrice')}
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('services.title')}</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('services.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('pricing.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              {t('pricing.subtitle')}
            </p>
            <Link href="/pricing-calculator">
              <Button variant="outline">
                {t('pricing.calculateCustom')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.highlighted ? 'border-blue-600 shadow-xl scale-105' : 'border-gray-200'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">{t('pricing.mostPopular')}</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.highlighted ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                    {t('pricing.choosePlan')} {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('testimonials.title')}</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('testimonials.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('stats.title')}</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('stats.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <ScrollReveal delay={100}>
              <div className="bg-blue-50 rounded-lg p-6">
                <AnimatedCounter
                  end={500}
                  suffix="+"
                  className="text-4xl font-bold text-blue-600 mb-2"
                />
                <div className="text-gray-600">{t('stats.projectsCompleted')}</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="bg-green-50 rounded-lg p-6">
                <AnimatedCounter
                  end={95}
                  suffix="%"
                  className="text-4xl font-bold text-green-600 mb-2"
                />
                <div className="text-gray-600">{t('stats.clientSatisfaction')}</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="bg-purple-50 rounded-lg p-6">
                <AnimatedCounter
                  end={50}
                  suffix="M+"
                  className="text-4xl font-bold text-purple-600 mb-2"
                />
                <div className="text-gray-600">{t('stats.conversationsHandled')}</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">{t('stats.supportAvailable')}</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  {t('cta.startFreeTrial')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-black border-white hover:bg-white hover:text-blue-600">
                {t('cta.scheduleDemo')}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">{t('footer.company')}</span>
              </div>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>{t('services.customDevelopment.title')}</li>
                <li>{t('services.readyMade.title')}</li>
                <li>{t('services.integration.title')}</li>
                <li>{t('services.aiTraining.title')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.companyInfo')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>{t('navigation.home')}</li>
                <li>{t('navigation.about')}</li>
                <li>{t('navigation.contact')}</li>
                <li>{t('navigation.login')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.contactInfo')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@gentledroid.com</li>
                <li>+7 (999) 123-45-67</li>
                <li>Москва, Россия</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Возвращаем AuthProvider, так как UserMenu использует useAuth
export default function Home() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <HomeContent />
      </LanguageProvider>
    </AuthProvider>
  )
}