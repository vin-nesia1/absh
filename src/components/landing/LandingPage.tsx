'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Star, Globe, Users, Zap, Shield, Gift, ChevronDown, Menu, X, 
  Github, Mail, ExternalLink, CheckCircle, ArrowRight, TrendingUp,
  Sparkles, Heart, Code, Database, Server, Rocket
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import StatsCounter from '@/components/common/StatsCounter'

interface Stat {
  totalUsers: number
  activeSubdomains: number
  totalDonations: number
  serverUptime: number
}

interface FAQ {
  question: string
  answer: string
}

interface Step {
  number: string
  title: string
  description: string
  icon: React.ComponentType<any>
}

interface Testimonial {
  name: string
  role: string
  content: string
  avatar: string
  rating: number
}

interface Feature {
  icon: React.ComponentType<any>
  title: string
  description: string
  color: string
}

export default function LandingPage() {
  const [stats, setStats] = useState<Stat>({
    totalUsers: 1247,
    activeSubdomains: 892,
    totalDonations: 156,
    serverUptime: 99.97
  })

  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading and fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In production, fetch from API
        // const response = await fetch('/api/stats')
        // const data = await response.json()
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Simulate real-time updates
        const interval = setInterval(() => {
          setStats(prev => ({
            totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
            activeSubdomains: prev.activeSubdomains + Math.floor(Math.random() * 2),
            totalDonations: prev.totalDonations + (Math.random() > 0.8 ? 1 : 0),
            serverUptime: 99.97 + (Math.random() * 0.02)
          }))
        }, 5000)

        setIsLoading(false)
        
        return () => clearInterval(interval)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const features: Feature[] = [
    {
      icon: Zap,
      title: 'Setup Instan',
      description: 'DNS records langsung aktif setelah approval. Tidak perlu menunggu propagasi lama.',
      color: 'text-yellow-400'
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Dilindungi Cloudflare CDN dengan SSL certificate otomatis dan DDoS protection.',
      color: 'text-cyan-400'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Bergabung dengan ribuan developer yang saling membantu dan berbagi pengalaman.',
      color: 'text-green-400'
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Server tersebar di seluruh dunia untuk loading time yang super cepat.',
      color: 'text-purple-400'
    },
    {
      icon: Database,
      title: '99.9% Uptime',
      description: 'Monitoring 24/7 dengan backup server otomatis untuk memastikan website selalu online.',
      color: 'text-red-400'
    },
    {
      icon: Heart,
      title: 'Selamanya Gratis',
      description: 'Untuk nirlaba selamanya gratis. Donasi sukarela untuk membantu operasional server.',
      color: 'text-pink-400'
    }
  ]

  const steps: Step[] = [
    {
      number: '01',
      title: 'Daftar Akun',
      description: 'Login dengan Google, GitHub, atau Discord. Gratis dan aman.',
      icon: Users
    },
    {
      number: '02',
      title: 'Request Subdomain',
      description: 'Isi form dengan nama subdomain yang diinginkan dan detail project Anda.',
      icon: Code
    },
    {
      number: '03',
      title: 'Tunggu Approval',
      description: 'Admin akan review request Anda dalam 1-3 hari kerja.',
      icon: CheckCircle
    },
    {
      number: '04',
      title: 'Setup DNS',
      description: 'Setelah approved, setup DNS records sesuai kebutuhan hosting Anda.',
      icon: Server
    }
  ]

  const testimonials: Testimonial[] = [
    {
      name: 'Ahmad Rizki',
      role: 'Mahasiswa IT',
      content: 'Sebagai mahasiswa, subdomain gratis ini sangat membantu untuk showcase portfolio saya. Terima kasih VIN NESIA!',
      avatar: 'AR',
      rating: 5
    },
    {
      name: 'Sarah Dev',
      role: 'Frontend Developer',
      content: 'Proses approval cepat, DNS pointing mudah. Perfect untuk hosting project React saya di GitHub Pages.',
      avatar: 'SD',
      rating: 5
    },
    {
      name: 'Budi Startup',
      role: 'Tech Founder',
      content: 'Awalnya pakai untuk MVP, sekarang udah diskusi bagi hasil untuk produksi. Recommended!',
      avatar: 'BS',
      rating: 5
    },
    {
      name: 'Maya Student',
      role: 'Desainer UI/UX',
      content: 'Interface admin panel nya bagus, notifikasi real-time, dan support yang responsive. Top!',
      avatar: 'MS',
      rating: 5
    }
  ]

  const faqs: FAQ[] = [
    {
      question: 'Apa itu SUBDOMAIN GRATIS VIN NESIA?',
      answer: 'Kami menyediakan subdomain gratis untuk semua orang yang membutuhkan, terutama mereka yang tidak mampu membeli domain. Layanan ini gratis 100% untuk tujuan nirlaba/non-komersial.'
    },
    {
      question: 'Bagaimana cara mendapatkan subdomain?',
      answer: 'Daftar dengan akun sosial media (Google/GitHub/Discord), isi form request dengan detail project Anda, tunggu approval dari admin. Prosesnya biasanya 1-3 hari kerja.'
    },
    {
      question: 'Apakah benar-benar gratis?',
      answer: 'Ya, 100% gratis untuk tujuan nirlaba. Donasi bersifat sukarela untuk membantu operasional server. Untuk komersial, hubungi admin untuk bagi hasil.'
    },
    {
      question: 'DNS records apa saja yang didukung?',
      answer: 'Kami mendukung semua record kecuali NS (Name Server): A, AAAA, CNAME, MX, TXT. Anda bisa pointing ke GitHub Pages, Vercel, Netlify, atau server hosting lainnya.'
    },
    {
      question: 'Bagaimana dengan keamanan dan uptime?',
      answer: 'Kami menggunakan Cloudflare CDN untuk keamanan dan performa. Uptime dijamin 99.9% dengan monitoring 24/7.'
    },
    {
      question: 'Boleh untuk komersial?',
      answer: 'Untuk penggunaan komersial, wajib hubungi admin@vinnesia.my.id terlebih dahulu untuk diskusi bagi hasil. Tanpa approval, subdomain bisa di-suspend.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              Platform subdomain gratis terpercaya di Indonesia
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text animate-fade-in">
              SUBDOMAIN GRATIS
              <br />
              VIN NESIA
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Subdomain gratis untuk semua! Khusus untuk yang tidak mampu membeli domain.{' '}
              <span className="text-purple-400 font-semibold">100% Gratis untuk nirlaba</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <StatsCounter
              value={stats.totalUsers}
              label="Total Users"
              icon={Users}
              color="text-purple-400"
              loading={isLoading}
            />
            <StatsCounter
              value={stats.activeSubdomains}
              label="Subdomain Aktif"
              icon={Globe}
              color="text-cyan-400"
              loading={isLoading}
            />
            <StatsCounter
              value={stats.totalDonations}
              label="Donatur Baik"
              icon={Heart}
              color="text-green-400"
              loading={isLoading}
            />
            <StatsCounter
              value={stats.serverUptime}
              label="Server Uptime"
              icon={Server}
              color="text-yellow-400"
              suffix="%"
              decimals={2}
              loading={isLoading}
            />
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/login">
              <Button size="lg" className="btn-primary group">
                <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Dapatkan Subdomain Gratis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                Lihat Cara Kerja
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kenapa Pilih VIN NESIA?</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Platform subdomain terpercaya dengan fitur lengkap dan dukungan 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="glass-dark card-hover group">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-slate-800/50 ${feature.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Kerja</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Proses mudah dalam 4 langkah sederhana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-r from-purple-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold group-hover:scale-110 transition-transform">
                      {step.number}
                    </div>
                    <div className="absolute -top-2 -right-2 p-2 bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/login">
              <Button size="lg" className="btn-primary">
                Mulai Sekarang - Gratis!
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kata Mereka</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Ribuan developer sudah merasakan manfaatnya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-dark card-hover">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm">{testimonial.name}</CardTitle>
                      <CardDescription className="text-xs">{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm italic mb-3">"{testimonial.content}"</p>
                  <div className="flex space-x-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-400">
              Jawaban untuk pertanyaan yang sering ditanyakan
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="glass-dark rounded-xl overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer hover:bg-purple-500/5 flex justify-between items-center list-none">
                  <span className="font-semibold text-white">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-purple-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-4 text-slate-300 border-t border-purple-500/10">
                  <p className="pt-4">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-dark border-purple-500/30">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Gift className="w-16 h-16 text-yellow-400 animate-bounce-slow" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold gradient-text">
                Dukung VIN NESIA
              </CardTitle>
              <CardDescription className="text-xl text-slate-300 max-w-2xl mx-auto">
                Layanan 100% gratis untuk nirlaba. Donasi sukarela membantu kami menjaga server tetap online dan berkembang.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <div className="w-48 h-48 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">QRIS Image Placeholder</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400">
                  Scan QRIS untuk donasi melalui aplikasi banking atau e-wallet favorit Anda
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">Rp 10.000</div>
                    <div className="text-sm text-slate-400">Donasi Ringan</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-2 border-purple-500 hover:border-purple-400 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">Rp 50.000</div>
                    <div className="text-sm text-slate-400">Paling Populer</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">Rp 100.000</div>
                    <div className="text-sm text-slate-400">Donasi Besar</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <p className="text-slate-400">
                  Atau nominal berapa saja sesuai kemampuan. Setiap rupiah sangat berarti! 💜
                </p>

                <Link href="/dashboard/donations">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Heart className="w-5 h-5 mr-2" />
                    Upload Bukti Donasi
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
