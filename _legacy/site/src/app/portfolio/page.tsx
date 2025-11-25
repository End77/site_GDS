'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, MessageSquare, Users, TrendingUp, ArrowLeft, ExternalLink, Calendar, Target } from 'lucide-react'
import Link from 'next/link'

const caseStudies = [
  {
    id: 1,
    title: "E-Commerce Customer Support Automation",
    company: "ShopMart Plus",
    category: "e-commerce",
    image: "/api/placeholder/600/400",
    description: "Implemented a comprehensive chatbot solution that handles customer inquiries, order tracking, and product recommendations for a major online retailer.",
    challenge: "High volume of repetitive customer queries affecting response times and customer satisfaction.",
    solution: "Custom AI-powered chatbot with natural language processing and integration with existing CRM and inventory systems.",
    results: [
      "80% reduction in response time",
      "65% decrease in support tickets",
      "40% increase in customer satisfaction",
      "24/7 availability achieved"
    ],
    technologies: ["Custom AI", "CRM Integration", "Multi-language", "Analytics Dashboard"],
    duration: "3 months",
    teamSize: "5 specialists"
  },
  {
    id: 2,
    title: "Healthcare Appointment Scheduling System",
    company: "MediCare Solutions",
    category: "healthcare",
    image: "/api/placeholder/600/400",
    description: "Developed an intelligent appointment scheduling chatbot that integrates with electronic health records and provides preliminary symptom assessment.",
    challenge: "Manual appointment booking process was inefficient and prone to errors, leading to patient dissatisfaction.",
    solution: "HIPAA-compliant chatbot with automated scheduling, reminder system, and basic symptom triage capabilities.",
    results: [
      "70% reduction in no-show appointments",
      "50% decrease in administrative workload",
      "Improved patient experience scores by 45%",
      "Streamlined booking process"
    ],
    technologies: ["HIPAA Compliant", "EHR Integration", "Secure Messaging", "Automated Reminders"],
    duration: "4 months",
    teamSize: "6 specialists"
  },
  {
    id: 3,
    title: "Financial Services Customer Onboarding",
    company: "FinanceHub Bank",
    category: "finance",
    image: "/api/placeholder/600/400",
    description: "Created a sophisticated onboarding chatbot that guides new customers through account setup, document submission, and product education.",
    challenge: "Complex onboarding process with high drop-off rates and compliance requirements.",
    solution: "Multi-step conversational AI with document verification, compliance checks, and personalized product recommendations.",
    results: [
      "60% increase in completed applications",
      "75% reduction in onboarding time",
      "90% compliance rate maintained",
      "Enhanced customer experience"
    ],
    technologies: ["AI Compliance", "Document Processing", "Secure Authentication", "Personalization"],
    duration: "5 months",
    teamSize: "8 specialists"
  },
  {
    id: 4,
    title: "Travel Booking Assistant",
    company: "Wanderlust Travel",
    category: "travel",
    image: "/api/placeholder/600/400",
    description: "Built a comprehensive travel booking chatbot that handles flight searches, hotel recommendations, and itinerary planning.",
    challenge: "Customers struggled with complex travel planning across multiple platforms and services.",
    solution: "Integrated chatbot with real-time booking systems, personalized recommendations, and automated itinerary generation.",
    results: [
      "45% increase in booking conversions",
      "30% reduction in planning time",
      "85% customer satisfaction rate",
      "Cross-platform integration achieved"
    ],
    technologies: ["Real-time Booking", "Personalization Engine", "Multi-platform Integration", "Itinerary Planning"],
    duration: "3 months",
    teamSize: "4 specialists"
  },
  {
    id: 5,
    title: "Educational Support Chatbot",
    company: "EduTech Academy",
    category: "education",
    image: "/api/placeholder/600/400",
    description: "Developed an educational assistant that provides homework help, study resources, and progress tracking for students.",
    challenge: "Students needed immediate academic support outside of classroom hours with personalized learning paths.",
    solution: "AI-powered educational assistant with subject-specific knowledge, progress tracking, and adaptive learning recommendations.",
    results: [
      "55% improvement in student engagement",
      "40% better homework completion rates",
      "Personalized learning paths for 10,000+ students",
      "24/7 academic support provided"
    ],
    technologies: ["Adaptive Learning", "Progress Analytics", "Multi-subject Support", "Parent Dashboard"],
    duration: "4 months",
    teamSize: "5 specialists"
  },
  {
    id: 6,
    title: "Real Estate Property Assistant",
    company: "HomeSpace Realty",
    category: "real-estate",
    image: "/api/placeholder/600/400",
    description: "Created a property recommendation and scheduling chatbot that helps buyers find suitable properties and schedule viewings.",
    challenge: "Inefficient property matching process and difficulty in coordinating viewing schedules.",
    solution: "AI-powered property matching with virtual tours, automated scheduling, and neighborhood information integration.",
    results: [
      "50% faster property matching",
      "35% increase in scheduled viewings",
      "28% reduction in time-to-close",
      "Enhanced buyer satisfaction"
    ],
    technologies: ["Property Matching AI", "Virtual Tours", "Calendar Integration", "Market Analytics"],
    duration: "3 months",
    teamSize: "4 specialists"
  }
]

const categories = [
  { id: 'all', name: 'All Projects', icon: <Bot className="w-4 h-4" /> },
  { id: 'e-commerce', name: 'E-Commerce', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'healthcare', name: 'Healthcare', icon: <Users className="w-4 h-4" /> },
  { id: 'finance', name: 'Finance', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'travel', name: 'Travel', icon: <Target className="w-4 h-4" /> },
  { id: 'education', name: 'Education', icon: <Users className="w-4 h-4" /> },
  { id: 'real-estate', name: 'Real Estate', icon: <Target className="w-4 h-4" /> }
]

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCase, setSelectedCase] = useState<typeof caseStudies[0] | null>(null)

  const filteredCases = selectedCategory === 'all' 
    ? caseStudies 
    : caseStudies.filter(case_ => case_.category === selectedCategory)

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
              <Bot className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">Portfolio</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories & Case Studies
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how we've helped businesses across various industries transform their customer experience with AI-powered chatbot solutions
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCases.map((caseStudy) => (
            <Card key={caseStudy.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                <Bot className="w-16 h-16 text-blue-600" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {caseStudy.category.replace('-', ' ')}
                  </Badge>
                  <span className="text-sm text-gray-500">{caseStudy.duration}</span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{caseStudy.title}</CardTitle>
                <CardDescription className="text-blue-600 font-medium">
                  {caseStudy.company}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {caseStudy.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {caseStudy.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {caseStudy.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{caseStudy.technologies.length - 3} more
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedCase(caseStudy)}
                >
                  View Case Study
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Case Study Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCase.title}</h2>
                  <p className="text-lg text-blue-600 font-medium">{selectedCase.company}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedCase(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Project Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Project Overview</h3>
                  <p className="text-gray-600">{selectedCase.description}</p>
                </div>

                {/* Challenge */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">The Challenge</h3>
                  <p className="text-gray-600">{selectedCase.challenge}</p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Our Solution</h3>
                  <p className="text-gray-600">{selectedCase.solution}</p>
                </div>

                {/* Results */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Results Achieved</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedCase.results.map((result, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Duration: {selectedCase.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Team: {selectedCase.teamSize}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* CTA */}
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Ready to Transform Your Business?</h3>
                  <p className="text-gray-600 mb-4">
                    Let's discuss how we can create similar results for your organization
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button>Get Started</Button>
                    <Button variant="outline">Schedule Consultation</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Our Impact by the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50M+</div>
              <div className="text-blue-100">Conversations Handled</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}