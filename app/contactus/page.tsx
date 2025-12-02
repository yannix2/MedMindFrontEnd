"use client"

import React, { useState } from 'react'
import { 
  Send, 
  Mail, 
  Phone, 
  Globe, 
  MessageSquare, 
  CheckCircle, 
  User, 
  Briefcase, 
  Building, 
  Brain,
  Linkedin,
  Twitter,
  Facebook,
  ExternalLink,
  Clock,
  ShieldCheck,
  HelpCircle,
  Zap,
  ChevronRight
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const openGoogleForm = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdbu4VTPIhlRxgI1R8W81NRO8U43PjESeq3NlWXPBmTy4smvw/viewform?usp=dialog', '_blank', 'noopener,noreferrer')
  }

  const openEmail = () => {
    window.location.href = 'mailto:tasssannas@gmail.com?subject=MedMind Inquiry&body=Hello MedMind Team,'
  }

  const openLinkedIn = () => {
    window.open('https://www.linkedin.com/in/yassine-khiari-111150255/', '_blank', 'noopener,noreferrer')
  }

  const openTwitter = () => {
    window.open('https://x.com/Y4nnix22', '_blank', 'noopener,noreferrer')
  }

  const openFacebook = () => {
    window.open('https://www.facebook.com/y4nnix', '_blank', 'noopener,noreferrer')
  }

  const faqItems = [
    {
      question: "What is MedMind?",
      answer: "MedMind is an advanced AI-powered platform revolutionizing healthcare through predictive analytics, automated diagnostics, and intelligent patient management systems. We leverage cutting-edge machine learning to improve healthcare outcomes."
    },
    {
      question: "How quickly will you respond to my inquiry?",
      answer: "We typically respond within 24 hours during business days. For urgent matters requiring immediate attention, we recommend calling our dedicated support line at +216 42 606 825."
    },
    {
      question: "Do you offer custom AI solutions for healthcare institutions?",
      answer: "Absolutely. We specialize in creating tailored AI solutions for healthcare institutions of all sizes. Our team works closely with you to understand your specific needs and develop customized implementations."
    },
    {
      question: "Is my data secure with MedMind?",
      answer: "Yes, we prioritize data security and compliance. All data is encrypted, stored securely, and processed in compliance with healthcare regulations including HIPAA and GDPR standards."
    },
    {
      question: "What industries do you serve?",
      answer: "While healthcare is our primary focus, we also serve technology companies, research institutions, pharmaceutical companies, and healthcare startups looking to integrate AI into their operations."
    },
    {
      question: "Do you provide ongoing support and maintenance?",
      answer: "Yes, we offer comprehensive support packages including 24/7 monitoring, regular updates, and dedicated account management to ensure your AI solutions continue to perform optimally."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-gray-900 dark:via-blue-950/10 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
           <Link href="/">
            <div  className="flex items-center gap-3 hover:cursor-pointer ">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-900 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                MedMind
              </span>
            </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href='/dashboard'>
                <Button variant="ghost" className="hidden md:flex hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                  Dashboard
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800 mb-6">
            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Get in Touch</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
            Contact MedMind
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
            Connecting Innovation with Healthcare Excellence
          </p>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Ready to transform your healthcare practice with AI? Complete our contact form below and let's start the conversation about how we can help you achieve your goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form Section */}
          <div>
            <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Contact Form</h2>
                    <p className="text-blue-100 mt-1">We'd love to hear from you</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <Alert className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertDescription className="ml-2">
                      <span className="font-semibold">Form submitted successfully!</span> We'll contact you within 24 hours.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-100 dark:border-blue-800">
                      <ExternalLink className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Complete Our Contact Form</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        To ensure we capture all necessary information for a comprehensive response, please use our detailed Google Form.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        The form includes all required fields to help us understand your specific needs and provide the best possible assistance.
                      </p>
                      <Button
                        onClick={openGoogleForm}
                        className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                      >
                        <span className="flex items-center justify-center gap-3">
                          <span>Open Contact Form</span>
                          <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        You'll be redirected to our secure Google Form in a new tab
                      </p>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Need Immediate Assistance?
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="font-medium">Call Us Directly</p>
                            <a href="tel:+21642606825" className="text-blue-600 dark:text-blue-400 hover:underline">
                              +216 42 606 825
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="font-medium">Send Direct Email</p>
                            <a href="mailto:contact@medmind.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                              contact@medmind.com
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & Additional Sections */}
          <div className="space-y-8">
            {/* Contact Info Card */}
            <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl">
                      <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">Primary Email</h4>
                      <a href="mailto:contact@medmind.com" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                        contact@medmind.com
                      </a>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">General inquiries and support</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-900/30 dark:to-pink-800/20 rounded-xl">
                      <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">Phone Support</h4>
                      <a href="tel:+21642606825" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                        +216 42 606 825
                      </a>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Mon-Fri, 9AM-6PM (Tunisia Time)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-800/20 rounded-xl">
                      <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">Data Security</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        All communications are encrypted and secure. We comply with healthcare data protection standards.
                      </p>
                    </div>
                  </div>

                  {/* Social Media Section */}
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
                    <div className="grid grid-cols-3  gap-3">
                      <Button 
                        onClick={openLinkedIn}
                        className="h-14 bg-gradient-to-br hover:cursor-pointer from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <Linkedin className="h-14 w-14 text-[#0A66C2] dark:text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
                        </div>
                      </Button>
                      
                      <Button 
                        onClick={openTwitter}
                        className="h-14 bg-gradient-to-br hover:cursor-pointer from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <Twitter className="h-14 w-14 text-black dark:text-white group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Twitter / X</span>
                        </div>
                      </Button>
                      
                      <Button 
                        onClick={openFacebook}
                        className="h-14 bg-gradient-to-br hover:cursor-pointer from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <Facebook className="h-14 w-14 text-[#1877F2] dark:text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Facebook</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
                
          </div>

        </div>
          <div className='my-8 w-full'>     <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                    <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
                </div>
                
                <div className="space-y-6">
                  {faqItems.map((item, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-300 cursor-pointer">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-600 transition-colors">
                            {item.question}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
                      </div>
                      {index < faqItems.length - 1 && (
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mx-4"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card></div>
        {/* Quick Contact Button */}
        <div className="fixed bottom-8 right-8 z-50 animate-bounce-slow">
          <Button 
            onClick={openEmail}
            className="rounded-full h-16 w-16 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110 group"
          >
            <Mail className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-2xl font-bold">MedMind</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Revolutionizing healthcare with artificial intelligence and innovative solutions for better patient outcomes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support Center</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for the latest updates and insights.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} MedMind. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}