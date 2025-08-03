'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Globe, Github, Mail, Sparkles, ArrowRight, Shield, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/common/LoadingSpinner'

// Social provider configuration
const socialProviders = [
  {
    name: 'Google',
    provider: 'google' as const,
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    description: 'Continue with Google account',
    bgColor: 'hover:bg-blue-500/10',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
    textColor: 'text-blue-400'
  },
  {
    name: 'GitHub',
    provider: 'github' as const,
    icon: Github,
    description: 'Continue with GitHub account',
    bgColor: 'hover:bg-gray-500/10',
    borderColor: 'border-gray-500/20 hover:border-gray-500/40',
    textColor: 'text-gray-400'
  },
  {
    name: 'Discord',
    provider: 'discord' as const,
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
      </svg>
    ),
    description: 'Continue with Discord account',
    bgColor: 'hover:bg-indigo-500/10',
    borderColor: 'border-indigo-500/20 hover:border-indigo-500/40',
    textColor: 'text-indigo-400'
  }
]

const features = [
  { icon: Zap, text: 'Setup subdomain dalam hitungan menit' },
  { icon: Shield, text: 'SSL certificate gratis dengan Cloudflare' },
  { icon: Users, text: 'Bergabung dengan 1000+ developer' }
]

export default function LoginForm() {
  const { signIn, loading, user } = useAuth()
  const [signingIn, setSigningIn] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const errorParam = searchParams.get('error')

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectTo)
    }
  }, [user, router, redirectTo])

  // Handle error from URL params
  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_error':
          setError('Authentication failed. Please try again.')
          break
        case 'access_denied':
          setError('Access denied. Please try again or contact support.')
          break
        default:
          setError('An error occurred during authentication.')
      }
    }
  }, [errorParam])

  const handleSocialLogin = async (provider: 'google' | 'github' | 'discord') => {
    try {
      setError('')
      setSigningIn(provider)
      await signIn(provider)
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to sign in. Please try again.')
    } finally {
      setSigningIn(null)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="Checking authentication..." fullScreen />
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="relative">
              <Globe className="w-12 h-12 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 w-12 h-12 rounded-full bg-purple-400/20 animate-ping"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">VIN NESIA</h1>
              <p className="text-sm text-slate-400">Subdomain Gratis</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Mulai Journey
              <br />
              <span className="gradient-text">Developer</span> Anda
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Bergabunglah dengan ribuan developer yang sudah mempercayai platform subdomain gratis terbaik di Indonesia.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center space-x-3 text-slate-300">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>{feature.text}</span>
                </div>
              )
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-sm text-slate-400">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">800+</div>
              <div className="text-sm text-slate-400">Subdomains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-slate-400">Uptime</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
          <Card className="glass-dark border-purple-500/20 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-slate-400">
                Pilih metode login untuk melanjutkan ke dashboard Anda
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Social Login Buttons */}
              <div className="space-y-3">
                {socialProviders.map((provider) => {
                  const Icon = provider.icon
                  const isLoading = signingIn === provider.provider
                  
                  return (
                    <Button
                      key={provider.provider}
                      onClick={() => handleSocialLogin(provider.provider)}
                      disabled={signingIn !== null}
                      className={`w-full h-12 border ${provider.borderColor} ${provider.bgColor} bg-slate-800/50 text-white hover:text-white transition-all duration-200 group`}
                      variant="outline"
                    >
                      {isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Icon className={`w-5 h-5 mr-3 ${provider.textColor} group-hover:scale-110 transition-transform`} />
                          <span className="font-medium">{provider.description}</span>
                          <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      )}
                    </Button>
                  )
                })}
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-slate-900 px-3 text-slate-400">atau</span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-white font-medium mb-1">Butuh bantuan?</p>
                    <p className="text-slate-400">
                      Hubungi{' '}
                      <a 
                        href="mailto:support@vinnesia.my.id" 
                        className="text-cyan-400 hover:text-cyan-300 underline"
                      >
                        support@vinnesia.my.id
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-slate-500 text-center leading-relaxed">
                Dengan melanjutkan, Anda menyetujui{' '}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                  Terms of Service
                </Link>{' '}
                dan{' '}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </Link>{' '}
                kami.
              </p>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="text-slate-400 hover:text-white transition-colors text-sm flex items-center justify-center space-x-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Kembali ke beranda</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
