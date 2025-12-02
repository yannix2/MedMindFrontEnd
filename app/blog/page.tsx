"use client"

import React, { useState } from 'react'
import { 
  Brain, 
  Globe, 
  TrendingUp, 
  Shield, 
  Users, 
  Zap, 
  Clock,
  FileText,
  Stethoscope,
  Building,
  Sparkles,
  ArrowRight,
  Play,
  ExternalLink,
  MapPin,
  Award
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'

export default function BlogPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const playVideo = (videoId: string) => {
    setActiveVideo(videoId)
  }

const videoData = [
  {
    id: 'global-ai-health',
    title: 'AI in Global Healthcare',
    description: 'World Economic Forum overview of AI transforming healthcare worldwide',
    youtubeId: 'FqsvgFTQv8w',
    thumbnail: 'https://img.youtube.com/vi/FqsvgFTQv8w/maxresdefault.jpg'
  },
  {
    id: 'ai-diagnostics',
    title: 'AI-Powered Medical Diagnostics',
    description: 'How AI is improving accuracy in medical imaging and diagnosis',
    youtubeId: 'P5jTcEWhJMc',
    thumbnail: 'https://img.youtube.com/vi/P5jTcEWhJMc/maxresdefault.jpg'
  },
  {
    id: 'precision-medicine',
    title: 'Precision Medicine Revolution',
    description: 'Personalized treatment through AI and genomics',
    youtubeId: 'yAGNgKIZWNE',
    thumbnail: 'https://img.youtube.com/vi/yAGNgKIZWNE/maxresdefault.jpg'
  }
];

  const tunisiaCaseStudies = [
    {
      company: 'Neapolis Pharma',
      impact: 'Order processing time reduced from 1 hour to 30 seconds',
      context: 'Showcased at the 26th International Forum of L\'Économiste Maghrébin as a prime example of AI-driven efficiency[citation:1][citation:9]'
    },
    {
      company: 'Tunis Clinic',
      impact: '65% reduction in patient waiting times',
      context: 'Achieved through implementation of AI-powered scheduling tools[citation:1]'
    },
    {
      company: 'Institut Pasteur de Tunis',
      impact: 'AI models predicting antibiotic-resistant bacteria spread',
      context: 'Part of Tunisia\'s precision medicine initiatives to tackle regional health challenges[citation:10]'
    }
  ]

  const globalAiApplications = [
    {
      area: 'Medical Imaging',
      impact: 'AI can reduce reading time of chest X-rays by 33% and improve breast cancer diagnostic accuracy by 9.4%[citation:2]',
      icon: FileText
    },
    {
      area: 'Stroke Diagnosis',
      impact: 'AI software twice as accurate as professionals in examining brain scans of stroke patients[citation:6]',
      icon: Brain
    },
    {
      area: 'Early Disease Detection',
      impact: 'AI models can detect signs of diseases like Alzheimer\'s years before clinical symptoms appear[citation:6]',
      icon: Shield
    },
    {
      area: 'Administrative Efficiency',
      impact: 'AI-powered automation can reduce healthcare administrative workloads by up to 70%[citation:10]',
      icon: TrendingUp
    }
  ]

  const tunisiaStrategicInitiatives = [
    {
      initiative: 'National AI Strategy 2025',
      description: 'Comprehensive roadmap integrating AI into priority sectors including healthcare, with focus on skills development and infrastructure[citation:1][citation:8]',
      status: 'Active Implementation'
    },
    {
      initiative: 'Novation City & GAICA',
      description: 'Positioning Tunisia as Africa\'s AI innovation hub, with NVIDIA partnership and focus on healthcare applications[citation:4]',
      status: 'Regional Leadership'
    },
    {
      initiative: 'Genome Tunisia Project',
      description: 'Two-phase initiative creating Tunisian reference genome for precision medicine advancement[citation:1]',
      status: 'Ongoing Research'
    },
    {
      initiative: 'AI-Forward Summit 2025',
      description: 'Major regional summit in Tunis focusing on "From Information Society Towards Intelligence Society"[citation:3]',
      status: 'Upcoming Event'
    }
  ]

  const challengesSolutions = [
    {
      challenge: 'Limited AI Knowledge Among Staff',
      data: 'Only 5% of Tunisian nurses fully understand AI, though 65% see it as useful for clinical decision-making[citation:5]',
      solution: 'Targeted training programs and hybrid courses at institutions like MUST University[citation:1]'
    },
    {
      challenge: 'Infrastructure Gaps',
      data: 'Limited computing access and funding gaps across Africa[citation:4]',
      solution: 'Cloud/HPC infrastructure development and international partnerships[citation:1][citation:8]'
    },
    {
      challenge: 'Ethical & Regulatory Concerns',
      data: '70% of Tunisian nurses believe specific AI guidelines are necessary[citation:5]',
      solution: 'Development of Arab AI Ethical Charter and national governance frameworks[citation:3][citation:7]'
    },
    {
      challenge: 'Urban-Rural Divide',
      data: 'Resource disparities between urban hospitals and rural clinics[citation:1]',
      solution: 'Telemedicine and mobile AI diagnostics for remote areas[citation:2][citation:6]'
    }
  ]

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
              <Link href='/'>
                <Button variant="ghost" className="hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                  Home
                </Button>
              </Link>
              <Link href="/contactus">
                <Button className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Featured Article • Healthcare Innovation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              How AI is Transforming Healthcare: Tunisia's Journey and the Global Revolution
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>December 2025 • 12 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Local Impact & Global Perspective</span>
              </div>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 z-20">
                <h2 className="text-2xl font-bold text-white mb-2">Healthcare at the Crossroads of Innovation</h2>
                <p className="text-blue-100">Tunisia emerges as a regional AI hub while global healthcare undergoes unprecedented transformation</p>
              </div>
              {/* Placeholder for featured image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="h-32 w-32 text-white/20" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 mb-8">
              <div className="flex items-start gap-4">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Key Takeaways</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2"></div>
                      <span>Tunisia's AI strategy aims to make it a regional healthcare innovation hub by 2025[citation:1][citation:9]</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-2"></div>
                      <span>Global precision medicine market projected to grow from $5.24B (2025) to $24.11B (2034)[citation:1]</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2"></div>
                      <span>AI could add $200B to Arab countries' GDP by 2030 through healthcare innovations[citation:10]</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              In a world where 4.5 billion people lack access to essential healthcare services[citation:6], artificial intelligence emerges not just as a technological marvel, but as a potential equalizer in global health equity. While developed nations race to implement AI in their advanced medical systems, Tunisia presents a compelling case study of how emerging economies can leapfrog traditional development pathways through strategic AI adoption.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              This article explores the dual narrative of AI in healthcare: Tunisia's ambitious journey to become a regional AI powerhouse, and the broader global transformation where AI is revolutionizing everything from stroke diagnosis to personalized medicine. Through concrete case studies, strategic analysis, and future projections, we examine how intelligent systems are reshaping the very fabric of healthcare delivery.
            </p>
          </section>

          {/* Tunisia's AI Healthcare Landscape */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Tunisia's Strategic Position in Africa's AI Revolution</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="border-2 border-blue-100 dark:border-blue-900/30 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    National AI Framework
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Tunisia's 2025 AI strategy represents a comprehensive shift from planning to implementation. The national roadmap focuses on practical priorities: skills development, cloud infrastructure, open data policies, and sector-specific pilot projects[citation:1][citation:8].
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="font-medium">Infrastructure Investment</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">$14M+</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <span className="font-medium">Research Output (2025)</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">88 Publications</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Innovation Ecosystem
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Novation City's GAICA initiative positions Tunisia as continental AI coordinator, supported by partnerships with NVIDIA, GIZ, and academic institutions[citation:4]. This ecosystem approach bridges research, industry, and policy.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">100+ AI startups supported</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">NVIDIA AI Innovation Hub established</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm">Pan-African collaboration platform</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">Real-World Impact: Tunisian Case Studies</h3>
              <div className="space-y-6">
                {tunisiaCaseStudies.map((caseStudy, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{caseStudy.company}</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-semibold text-green-600 dark:text-green-400">Impact:</span> {caseStudy.impact}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {caseStudy.context}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">The Economic Imperative</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    The Arab Artificial Intelligence Council estimates AI could add $200 billion to Arab countries' combined GDP by 2030, with healthcare being a primary beneficiary[citation:10]. For Tunisia, this represents both an economic opportunity and a pathway to improved population health outcomes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Global AI Transformation */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Global Healthcare Revolution: AI's Transformative Power</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {globalAiApplications.map((app, index) => {
                const Icon = app.icon
                return (
                  <Card key={index} className="border-2 border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-bold text-lg">{app.area}</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{app.impact}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Video Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">AI in Action: Video Insights</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {videoData.map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div 
                      className="relative rounded-xl overflow-hidden shadow-lg mb-3"
                      onClick={() => playVideo(video.youtubeId)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                        <div className="relative z-10">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-bold mb-1">{video.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{video.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {activeVideo && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
                <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="absolute -top-12 right-0 text-white hover:text-gray-300"
                    onClick={() => setActiveVideo(null)}
                  >
                    Close
                  </button>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="border-0"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}

            <Card className="border-2 border-green-100 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Administrative Transformation</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Beyond clinical applications, AI is revolutionizing healthcare administration. Studies show AI-powered automation can reduce administrative workloads by up to 70%, allowing professionals to focus on patient care[citation:10]. In Germany, platforms like Elea have cut testing and diagnosis times from weeks to hours[citation:6].
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      The World Health Organization's Global Initiative on AI for Health, in partnership with ITU and WIPO, is establishing governance structures and technical guidance to ensure ethical AI adoption worldwide[citation:7].
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Challenges and Human Factor */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Bridging the Human-Technology Gap</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Tunisian Healthcare Professionals' Perspective</h3>
                <Card className="border-2 border-orange-100 dark:border-orange-900/30">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold mb-2">Knowledge Levels</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Fully understand AI</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">5%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">See AI as useful for clinical decisions</span>
                            <span className="font-bold text-green-600 dark:text-green-400">65%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Believe AI improves care quality</span>
                            <span className="font-bold text-purple-600 dark:text-purple-400">61.7%</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold mb-2">Critical Needs Identified</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>82% express need for further training[citation:5]</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>70% believe specific guidelines are necessary[citation:5]</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span>92% concerned about decline in empathy[citation:5]</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Systemic Challenges & Solutions</h3>
                <div className="space-y-4">
                  {challengesSolutions.map((item, index) => (
                    <Card key={index} className="border-2 border-gray-100 dark:border-gray-800">
                      <CardContent className="p-4">
                        <h4 className="font-bold mb-2 text-red-600 dark:text-red-400">{item.challenge}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.data}</p>
                        <div className="flex items-start gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <Zap className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">{item.solution}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-4">
                <Stethoscope className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">The Path Forward: Augmentation, Not Replacement</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    The consensus emerging from both Tunisian and global experiences is clear: AI's greatest potential lies in augmenting human expertise, not replacing it. As noted in developing country contexts, "adequate knowledge and expertise of healthcare professionals for the use of AI technology in healthcare is imperative"[citation:2]. 
                    The future belongs to healthcare systems that successfully integrate AI's analytical power with human empathy, clinical judgment, and ethical oversight.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion and Future Outlook */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">The Road Ahead: 2025 and Beyond</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                As Tunisia hosts the AI-Forward Summit 2025 and implements its national strategy, the country stands at a crossroads between regional leadership and global integration[citation:3].
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {tunisiaStrategicInitiatives.map((initiative, index) => (
                <Card key={index} className="border-2 border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-bold">{initiative.initiative}</h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                          {initiative.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{initiative.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">A Call to Action</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                The transformation of healthcare through AI represents one of the most significant opportunities of our generation. For Tunisia, success depends on strategic partnerships, continuous learning, and maintaining focus on human-centered design. For the global community, it requires ethical frameworks, equitable access, and collaborative innovation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => window.open('https://www.who.int/initiatives/global-initiative-on-ai-for-health', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  WHO AI Initiative
                </Button>
                <Link href="/contactus">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    Join the Conversation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* References */}
          <section className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">References & Further Reading</h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>1. Nucamp Coding Bootcamp. "The Complete Guide to Using AI in the Healthcare Industry in Tunisia in 2025." [citation:1]</p>
              <p>2. National Center for Biotechnology Information. "Exploring the Impact of Artificial Intelligence on Global Healthcare." [citation:2]</p>
              <p>3. The Tripoli Post. "Libya: Head of GACI to Attend 'AI-Forward Summit 2025' in Tunisia." [citation:3]</p>
              <p>4. African Business. "Novation City: Powering Tunisia's role as Africa's AI innovation hub." [citation:4]</p>
              <p>5. Journal of Nursing Research and Clinical Practice. "Knowledge and attitudes of Tunisian nurses towards AI integration." [citation:5]</p>
              <p>6. World Economic Forum. "7 ways AI is transforming healthcare." [citation:6]</p>
              <p>7. World Health Organization. "Global Initiative on AI for Health." [citation:7]</p>
              <p>8. Nucamp Coding Bootcamp. "The Complete Guide to Using AI in the Government Industry in Tunisia in 2025." [citation:8]</p>
              <p>9. Friedrich Naumann Foundation. "AI and Tunisia: A Strategic Shift International Forum." [citation:9]</p>
              <p>10. Eurisko. "AI Integration Into Arab Healthcare Systems." [citation:10]</p>
            </div>
          </section>
        </article>

        {/* Newsletter Signup */}
        <div className="max-w-2xl mx-auto mt-16">
          <Card className="border-2 border-blue-100 dark:border-blue-900/30 shadow-xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Informed on Healthcare AI</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Subscribe to MedMind's newsletter for the latest insights on AI in healthcare, exclusive case studies, and innovation updates.
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Subscribe
                </Button>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Healthcare Innovation</p>
              </div>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Blog
              </Link>
              <Link href="/contactus" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} MedMind Blog. All rights reserved. | Citations from peer-reviewed and authoritative sources
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}