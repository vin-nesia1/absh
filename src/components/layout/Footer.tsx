'use client'

import React from 'react'
import Link from 'next/link'
import { Globe, Mail, Github, ExternalLink, Heart, Shield, Zap } from 'lucide-react'

interface FooterSection {
  title: string
  links: {
    name: string
    href: string
    external?: boolean
  }[]
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections: FooterSection[] = [
    {
      title: 'Platform',
      links: [
        { name: 'Beranda', href: '/' },
        { name: 'Fitur', href: '/#features' },
        { name: 'Cara Kerja', href: '/#how-it-works' },
        { name: 'FAQ', href: '/#faq' },
        { name: 'Dashboard', href: '/dashboard' },
      ]
    },
    {
      title: 'Layanan',
      links: [
        { name: 'Subdomain Gratis', href: '/dashboard/create' },
        { name: 'DNS Management', href: '/dashboard/subdomains' },
        { name: 'Donasi', href: '/dashboard/donations' },
        { name: 'Statistik', href: '/stats' },
        { name: 'Status Server', href: '/status' },
      ]
    },
    {
      title: 'Dukungan',
      links: [
        { name: 'Dokumentasi', href: '/docs' },
        { name: 'Tutorial', href: '/tutorials' },
        { name: 'Community Discord', href: 'https://discord.gg/vinnesia', external: true },
        { name: 'GitHub Issues', href: 'https://github.com/vinnesia/subdomain-gratis/issues', external: true },
        { name: 'Kontak Support', href: 'mailto:support@vinnesia.my.id', external: true },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Disclaimer', href: '/disclaimer' },
        { name: 'DMCA', href: '/dmca' },
      ]
    }
  ]

  const socialLinks = [
    {
      name: 'Email Admin',
      href: 'mailto:admin@vinnesia.my.id',
      icon: Mail,
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      href: 'https://github.com/vinnesia',
      icon: Github,
      color: 'hover:text-gray-400'
    },
    {
      name: 'Website',
      href: 'https://vinnesia.my.id',
      icon: ExternalLink,
      color: 'hover:text-green-400'
    }
  ]

  const stats = [
    { label: 'Pengguna Aktif', value: '1000+', icon: Globe },
    { label: 'Subdomain Aktif', value: '800+', icon: Zap },
    { label: 'Uptime', value: '99.9%', icon: Shield },
  ]

  return (
    <footer className="bg-slate-950 border-t border-purple-500/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-8 h-8 text-purple-400" />
              <div>
                <span className="text-xl font-bold gradient-text">
                  SUBDOMAIN GRATIS VIN NESIA
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              Platform subdomain gratis untuk semua. Khusus untuk yang tidak mampu membeli domain. 
              Misi kami adalah <span className="text-purple-400 font-semibold">democratizing internet access for everyone</span>.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-colors">
                    <Icon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <Link
                    key={index}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? '_self' : '_blank'}
                    rel={social.href.startsWith('mailto:') ? '' : 'noopener noreferrer'}
                    className={`text-slate-400 ${social.color} transition-colors p-2 rounded-lg hover:bg-slate-800/50`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        target={link.external ? '_blank' : ''}
                        rel={link.external ? 'noopener noreferrer' : ''}
                        className="text-slate-400 hover:text-purple-400 transition-colors text-sm flex items-center group"
                      >
                        {link.name}
                        {link.external && (
                          <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2">
                Tetap update dengan VIN NESIA
              </h3>
              <p className="text-slate-400 text-sm">
                Dapatkan informasi terbaru tentang fitur baru, tips & tricks, dan pengumuman penting.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-slate-400 text-sm">
              <p className="mb-2 md:mb-0">
                © {currentYear} SUBDOMAIN GRATIS VIN NESIA. Made with{' '}
                <Heart className="w-4 h-4 inline text-red-500 animate-pulse" /> for the community.
              </p>
              <p className="text-xs text-slate-500">
                Gratis selamanya untuk tujuan nirlaba • Powered by Next.js, Supabase, Vercel & Cloudflare
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  All systems operational
                </span>
                <span>Response time: &lt;100ms</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/status" className="hover:text-slate-400 transition-colors">
                  Status
                </Link>
                <Link href="/api/health" className="hover:text-slate-400 transition-colors">
                  API Health
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50"
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}
