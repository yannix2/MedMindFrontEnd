"use client"

import React from 'react'
import { 
  Brain, 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Zap, 
  Shield, 
  Award, 
  TrendingUp, 
  Globe,
  Rocket,
  BarChart,
  Stethoscope,
  Cpu,
  Sparkles,
  CheckCircle,
  Calendar,
  Building,
  UserCheck,
  Flag,
  ArrowRight
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'

const aboutInfo = {
  founded: "2025",
  founder: "Yassine Khiari",
  mission: "To revolutionize healthcare through accessible AI-powered diagnostic tools that improve patient outcomes worldwide.",
  vision: "A world where AI-assisted healthcare is available to every medical professional, regardless of location or resources.",
  
  coreValues: [
    { 
      title: "Innovation", 
      description: "Continuously pushing the boundaries of AI in healthcare",
      icon: Zap,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Excellence", 
      description: "Delivering highest quality solutions with precision",
      icon: Award,
      color: "from-purple-500 to-pink-500"
    },
    { 
      title: "Accessibility", 
      description: "Making advanced healthcare tools available to all",
      icon: Globe,
      color: "from-green-500 to-emerald-500"
    },
    { 
      title: "Integrity", 
      description: "Operating with transparency and ethical standards",
      icon: Shield,
      color: "from-orange-500 to-red-500"
    }
  ],
  
  team: {
    ceo: {
      name: "Yassine Khiari",
      role: "Founder & CEO",
      bio: "AI enthusiast with a passion for transforming healthcare through technology. With extensive experience in AI/ML and healthcare systems, Yassine founded MedMind to bridge the gap between advanced technology and accessible healthcare solutions.",
      linkedin: "https://linkedin.com/in/yassine-khiari-111150255/"
    },
    teamSize: "10+",
    expertise: ["AI/ML Engineering", "Healthcare Technology", "Software Development", "Medical Research", "Data Science"]
  },
  
  solutions: [
    { title: "AI-Powered Diagnostic Tools", icon: Stethoscope },
    { title: "Predictive Analytics", icon: TrendingUp },
    { title: "Medical Image Analysis", icon: Eye },
    { title: "Healthcare Data Integration", icon: Cpu },
    { title: "Telemedicine AI Support", icon: Globe }
  ],
  
  achievements: [
    { title: "Healthcare Institutions Served", value: "50+", icon: Building },
    { title: "Diagnostic Accuracy Rate", value: "95%", icon: Target },
    { title: "Team Members", value: "10+", icon: Users },
    { title: "Countries Reached", value: "5", icon: Flag }
  ],
  
  milestones: [
    { year: "2025", event: "MedMind Founded", description: "Company established with vision to transform healthcare through AI" },
    { year: "2025", event: "First Product Launch", description: "Released initial AI diagnostic tool to select healthcare partners" },
    { year: "2025", event: "Healthcare Summit Feature", description: "Featured in Healthcare AI Innovation Summit" },
    { year: "2025", event: "Expansion Phase", description: "Growing team and expanding services to international markets" }
  ],
  
  stats: {
    foundedYear: 2023,
    clients: 50,
    accuracy: "95%",
    teamMembers: 10,
    countries: 5
  }
}

export default function AboutPage() {
  const openLinkedIn = () => {
    window.open(aboutInfo.team.ceo.linkedin, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/10 to-white dark:from-gray-900 dark:via-blue-950/5 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MedMind
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href='/contactus'>
                <Button variant="ghost" className="hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                  Contact
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Our Story</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Transforming Healthcare with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            We're on a mission to make advanced healthcare accessible to everyone through the power of artificial intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={openLinkedIn}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Connect with Founder
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link href="/contactus">
              <Button variant="outline" className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="border-2 border-blue-100 dark:border-blue-900/30 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {aboutInfo.mission}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {aboutInfo.vision}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From a bold idea to transforming healthcare worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Founded in {aboutInfo.founded}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    MedMind was founded by {aboutInfo.founder} with a simple yet powerful vision: to leverage artificial intelligence to solve critical healthcare challenges. What started as an innovative idea has grown into a leading force in healthcare AI.
                  </p>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold">YK</span>
                    </div>
                    <div>
                      <h4 className="font-bold">{aboutInfo.team.ceo.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{aboutInfo.team.ceo.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Key Milestones</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                {aboutInfo.milestones.map((milestone, index) => (
                  <div key={index} className="relative pl-12 pb-8">
                    <div className="absolute left-3 top-1 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 ring-4 ring-blue-50 dark:ring-blue-900/20"></div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-blue-600 dark:text-blue-400">{milestone.year}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">{milestone.event}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do at MedMind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutInfo.coreValues.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="border-2 border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden group">
                  <CardContent className="p-6">
                    <div className={`p-3 bg-gradient-to-br ${value.color} rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* What We Do */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Solutions</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Cutting-edge AI solutions transforming healthcare delivery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutInfo.solutions.map((solution, index) => {
              const Icon = solution.icon
              return (
                <Card key={index} className="border-2 border-gray-100 dark:border-gray-800 shadow-lg rounded-xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit mb-4">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{solution.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {solution.title.includes("Diagnostic") && "Advanced AI algorithms for accurate medical diagnostics"}
                      {solution.title.includes("Predictive") && "Forecasting patient outcomes and treatment effectiveness"}
                      {solution.title.includes("Image Analysis") && "AI-powered analysis of medical imagery with high precision"}
                      {solution.title.includes("Integration") && "Seamless data integration across healthcare systems"}
                      {solution.title.includes("Telemedicine") && "AI support for remote healthcare delivery"}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team & Expertise */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A dedicated team of experts passionate about healthcare innovation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                    YK
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{aboutInfo.team.ceo.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{aboutInfo.team.ceo.role}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={openLinkedIn}
                        className="border-blue-200 dark:border-blue-800"
                      >
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {aboutInfo.team.ceo.bio}
                </p>
              </CardContent>
            </Card>
            
            <div>
              <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Team Expertise</h3>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Team Size</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{aboutInfo.team.teamSize}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                        style={{ width: '80%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-4">Areas of Expertise</h4>
                    <div className="space-y-3">
                      {aboutInfo.team.expertise.map((skill, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Achievements & Impact */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Numbers that showcase our journey and commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aboutInfo.achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <Card key={index} className="border-2 border-gray-100 dark:border-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg w-fit mx-auto mb-4">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {achievement.value}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{achievement.title}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Join Our Mission */}
        <div className="text-center">
          <Card className="border-2 border-blue-100 dark:border-blue-900/30 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardContent className="p-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Be part of the healthcare revolution. Whether you're a healthcare professional, researcher, or technology enthusiast, there's a place for you in our journey.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contactus">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Partner With Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <span className="text-2xl font-bold">MedMind</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Transforming Healthcare with AI</p>
              </div>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              
              <Link href="/contactus" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} MedMind. All rights reserved. | Founded in {aboutInfo.founded}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}