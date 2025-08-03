import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SUBDOMAIN GRATIS VIN NESIA - Platform Subdomain Gratis Untuk Semua',
    template: '%s | VIN NESIA'
  },
  description: 'Platform subdomain gratis terpercaya untuk developer Indonesia dan global. Dapatkan subdomain *.vinnesia.my.id secara gratis untuk project nirlaba, portfolio, dan pembelajaran. Dengan dukungan DNS lengkap dan CDN Cloudflare.',
  keywords: [
    'subdomain gratis',
    'free subdomain',
    'subdomain indonesia',
    'vinnesia',
    'domain gratis',
    'hosting gratis',
    'dns gratis',
    'developer indonesia',
    'portfolio website',
    'github pages',
    'vercel',
    'netlify'
  ],
  authors: [
    {
      name: 'VIN NESIA',
      url: 'https://subdomain.vinnesia.my.id',
    }
  ],
  creator: 'VIN NESIA',
  publisher: 'VIN NESIA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://subdomain.vinnesia.my.id'),
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/id',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://subdomain.vinnesia.my.id',
    title: 'SUBDOMAIN GRATIS VIN NESIA - Platform Subdomain Gratis Untuk Semua',
    description: 'Platform subdomain gratis terpercaya untuk developer Indonesia dan global. Dapatkan subdomain *.vinnesia.my.id secara gratis untuk project nirlaba.',
    siteName: 'VIN NESIA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SUBDOMAIN GRATIS VIN NESIA',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUBDOMAIN GRATIS VIN NESIA',
    description: 'Platform subdomain gratis terpercaya untuk developer Indonesia dan global.',
    images: ['/og-image.png'],
    creator: '@vinnesia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#a855f7',
      },
    ],
  },
  manifest: '/site.webmanifest',
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
  ],
  colorScheme: 'dark light',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.supabase.co" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//api.supabase.co" />
        <link rel="dns-prefetch" href="//vercel.live" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Microsoft tile config */}
        <meta name="msapplication-TileColor" content="#a855f7" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Apple specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VIN NESIA" />
        
        {/* Android specific */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="VIN NESIA" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'SUBDOMAIN GRATIS VIN NESIA',
              description: 'Platform subdomain gratis terpercaya untuk developer Indonesia dan global',
              url: 'https://subdomain.vinnesia.my.id',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://subdomain.vinnesia.my.id/search?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              },
              publisher: {
                '@type': 'Organization',
                name: 'VIN NESIA',
                url: 'https://subdomain.vinnesia.my.id',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://subdomain.vinnesia.my.id/logo.png'
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer service',
                  email: 'support@vinnesia.my.id'
                }
              }
            })
          }}
        />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    anonymize_ip: true,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Skip to main content for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50"
          >
            Skip to main content
          </a>
          
          {/* Loading overlay */}
          <div 
            id="loading-overlay" 
            className="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center transition-opacity duration-500"
            style={{ display: 'none' }}
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading VIN NESIA...</p>
            </div>
          </div>
          
          {/* Main content */}
          <main id="main-content" className="relative">
            {children}
          </main>
          
          {/* Toast notifications */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(15, 15, 35, 0.95)',
                color: 'white',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                backdropFilter: 'blur(10px)',
              },
              className: 'font-sans',
              duration: 4000,
            }}
            closeButton
            richColors
          />
          
          {/* Analytics */}
          <Analytics />
          <SpeedInsights />
          
          {/* Service Worker Registration */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      console.log('SW registered: ', registration);
                    }).catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                  });
                }
              `,
            }}
          />
          
          {/* Performance monitoring */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Monitor Core Web Vitals
                function getCLS(onPerfEntry) {
                  if ('web-vital' in window) {
                    import('web-vitals').then(({ getCLS }) => {
                      getCLS(onPerfEntry);
                    });
                  }
                }
                
                function getFID(onPerfEntry) {
                  if ('web-vital' in window) {
                    import('web-vitals').then(({ getFID }) => {
                      getFID(onPerfEntry);
                    });
                  }
                }
                
                function getFCP(onPerfEntry) {
                  if ('web-vital' in window) {
                    import('web-vitals').then(({ getFCP }) => {
                      getFCP(onPerfEntry);
                    });
                  }
                }
                
                function getLCP(onPerfEntry) {
                  if ('web-vital' in window) {
                    import('web-vitals').then(({ getLCP }) => {
                      getLCP(onPerfEntry);
                    });
                  }
                }
                
                function getTTFB(onPerfEntry) {
                  if ('web-vital' in window) {
                    import('web-vitals').then(({ getTTFB }) => {
                      getTTFB(onPerfEntry);
                    });
                  }
                }
                
                function sendToAnalytics(metric) {
                  if (typeof gtag !== 'undefined') {
                    gtag('event', metric.name, {
                      event_category: 'Web Vitals',
                      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                      event_label: metric.id,
                      non_interaction: true,
                    });
                  }
                }
                
                getCLS(sendToAnalytics);
                getFID(sendToAnalytics);
                getFCP(sendToAnalytics);
                getLCP(sendToAnalytics);
                getTTFB(sendToAnalytics);
              `,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
