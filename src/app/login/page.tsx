import { Suspense } from 'react'
import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Login - VIN NESIA',
  description: 'Masuk ke akun VIN NESIA Anda untuk mengelola subdomain gratis',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<LoadingSpinner size="lg" text="Loading login..." />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
