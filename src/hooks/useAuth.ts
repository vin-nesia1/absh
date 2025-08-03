'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface AuthUser extends User {
  profile?: {
    id: string
    full_name: string
    avatar_url: string
    email: string
    provider: string
    created_at: string
    is_banned: boolean
    total_subdomains: number
    total_donations_amount: number
  }
}

interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  initialized: boolean
}

interface AuthHook extends AuthState {
  signIn: (provider: 'google' | 'github' | 'discord') => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  isAdmin: boolean
}

export function useAuth(): AuthHook {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false
  })
  
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            setState(prev => ({ ...prev, loading: false, initialized: true }))
          }
          return
        }

        if (session?.user && mounted) {
          await fetchUserProfile(session.user)
        } else if (mounted) {
          setState(prev => ({ 
            ...prev, 
            user: null, 
            session: null, 
            loading: false,
            initialized: true 
          }))
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setState(prev => ({ ...prev, loading: false, initialized: true }))
        }
      }
    }

    initializeAuth()

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.email)

        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user)
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({ 
            ...prev, 
            user: null, 
            session: null, 
            loading: false 
          }))
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          await fetchUserProfile(session.user)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Fetch user profile data
  async function fetchUserProfile(user: User) {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error)
        throw error
      }

      const authUser: AuthUser = {
        ...user,
        profile: profile || undefined
      }

      setState(prev => ({
        ...prev,
        user: authUser,
        session: prev.session,
        loading: false,
        initialized: true
      }))
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setState(prev => ({ 
        ...prev, 
        user: { ...user } as AuthUser, 
        loading: false,
        initialized: true 
      }))
    }
  }

  // Sign in with provider
  async function signIn(provider: 'google' | 'github' | 'discord') {
    try {
      setState(prev => ({ ...prev, loading: true }))

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })

      if (error) {
        throw error
      }

      // Loading state will be handled by auth state change listener
    } catch (error) {
      console.error('Sign in error:', error)
      setState(prev => ({ ...prev, loading: false }))
      
      const authError = error as AuthError
      toast.error('Login Failed', {
        description: authError.message || 'Terjadi kesalahan saat login. Silakan coba lagi.'
      })
    }
  }

  // Sign out
  async function signOut() {
    try {
      setState(prev => ({ ...prev, loading: true }))

      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Clear local state immediately
      setState(prev => ({ 
        ...prev, 
        user: null, 
        session: null, 
        loading: false 
      }))

      toast.success('Logout Successful', {
        description: 'Anda telah berhasil logout.'
      })

      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      setState(prev => ({ ...prev, loading: false }))
      
      const authError = error as AuthError
      toast.error('Logout Failed', {
        description: authError.message || 'Terjadi kesalahan saat logout.'
      })
    }
  }

  // Refresh user data
  async function refreshUser() {
    if (!state.user) return

    try {
      await fetchUserProfile(state.user)
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  // Check if user is admin
  const isAdmin = (): boolean => {
    if (!state.user?.email) return false
    
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || ['admin.vinnesia@gmail.com']
    return adminEmails.includes(state.user.email) && !state.user.profile?.is_banned
  }

  return {
    ...state,
    signIn,
    signOut,
    refreshUser,
    isAdmin: isAdmin()
  }
}
