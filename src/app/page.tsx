import { Suspense } from 'react'
import { Metadata } from 'next'
import LandingPage from '@/components/landing/LandingPage'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export const metadata: Metadata = {
  title: 'SUBDOMAIN GRATIS VIN NESIA - Platform Subdomain Gratis Untuk Semua',
  description: 'Dapatkan subdomain *.vinnesia.my.id secara gratis untuk project nirlaba, portfolio, dan pembelajaran. Dengan dukungan DNS lengkap dan CDN Cloudflare.',
  openGraph: {
    title: 'SUBDOMAIN GRATIS VIN NESIA',
    description: 'Platform subdomain gratis terpercaya untuk developer Indonesia dan global',
    images: ['/og-image-home.png'],
  },
  twitter: {
    title: 'SUBDOMAIN GRATIS VIN NESIA',
    description: 'Platform subdomain gratis terpercaya untuk developer Indonesia dan global',
  },
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LandingPage />
    </Suspense>
  )
}
