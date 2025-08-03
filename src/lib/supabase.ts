import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Client-side Supabase client
export const supabase = createClientComponentClient<Database>()

// Service role client for admin operations (server-side only)
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database table types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type User = Tables<'users'>
export type Subdomain = Tables<'subdomains'>
export type Donation = Tables<'donations'>
export type Notification = Tables<'notifications'>
export type AdminLog = Tables<'admin_logs'>
export type SiteSetting = Tables<'site_settings'>

// Enums
export type SubdomainStatus = Database['public']['Enums']['subdomain_status']
export type TargetType = Database['public']['Enums']['target_type']
export type DonationStatus = Database['public']['Enums']['donation_status']
export type NotificationType = Database['public']['Enums']['notification_type']

// Utility functions
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean; contentType?: string }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: options?.upsert || false,
      contentType: options?.contentType || file.type
    })

  if (error) throw error
  return data
}

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) throw error
}

// Real-time subscriptions
export const subscribeToTable = <T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: any) => void,
  filter?: string
) => {
  const channel = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter
      },
      callback
    )
    .subscribe()

  return channel
}

// Error handling utility
export const handleSupabaseError = (error: any): string => {
  if (!error) return 'Unknown error occurred'
  
  // Auth errors
  if (error.message?.includes('Invalid login credentials')) {
    return 'Email atau password salah'
  }
  
  if (error.message?.includes('Email not confirmed')) {
    return 'Email belum dikonfirmasi. Silakan cek inbox Anda.'
  }
  
  if (error.message?.includes('User already registered')) {
    return 'Email sudah terdaftar. Silakan login.'
  }
  
  // Database errors
  if (error.code === '23505') {
    return 'Data sudah ada. Silakan gunakan data yang berbeda.'
  }
  
  if (error.code === '23503') {
    return 'Data yang direferensikan tidak ditemukan.'
  }
  
  if (error.code === 'PGRST116') {
    return 'Data tidak ditemukan.'
  }
  
  // Storage errors
  if (error.message?.includes('The resource was not found')) {
    return 'File tidak ditemukan.'
  }
  
  if (error.message?.includes('File size too large')) {
    return 'Ukuran file terlalu besar.'
  }
  
  // Generic errors
  if (error.message?.includes('JWT expired')) {
    return 'Sesi telah berakhir. Silakan login kembali.'
  }
  
  if (error.message?.includes('Network request failed')) {
    return 'Koneksi internet bermasalah. Silakan coba lagi.'
  }
  
  // Return original message if no specific handling
  return error.message || 'Terjadi kesalahan yang tidak diketahui'
}

// Database query helpers
export const getUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const getUserSubdomains = async (userId: string) => {
  const { data, error } = await supabase
    .from('subdomains')
    .select(`
      *,
      category:subdomain_categories(name, color)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getUserDonations = async (userId: string) => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getUserNotifications = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export const getUnreadNotificationCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw error
  return count || 0
}

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ 
      is_read: true, 
      read_at: new Date().toISOString() 
    })
    .eq('id', notificationId)

  if (error) throw error
}

export const markAllNotificationsAsRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ 
      is_read: true, 
      read_at: new Date().toISOString() 
    })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw error
}

// Admin helpers
export const getPendingSubdomains = async () => {
  const { data, error } = await supabase
    .from('subdomains')
    .select(`
      *,
      user:users(full_name, email, avatar_url),
      category:subdomain_categories(name, color)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export const getPendingDonations = async () => {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      user:users(full_name, email, avatar_url)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export const getSystemStats = async () => {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')

  if (error) throw error
  
  // Convert to object for easier use
  const stats: Record<string, string> = {}
  data?.forEach(stat => {
    stats[stat.stat_name] = stat.stat_value
  })
  
  return stats
}

// Rate limiting helper
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

export const checkRateLimit = (
  key: string, 
  limit: number = 10, 
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } => {
  const now = Date.now()
  const record = rateLimitCache.get(key)

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs
    rateLimitCache.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: limit - 1, resetTime }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  rateLimitCache.set(key, record)
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime }
}

// Validation helpers
export const validateSubdomainName = (name: string): { valid: boolean; error?: string } => {
  if (!name) {
    return { valid: false, error: 'Nama subdomain tidak boleh kosong' }
  }

  if (name.length < 2) {
    return { valid: false, error: 'Nama subdomain minimal 2 karakter' }
  }

  if (name.length > 63) {
    return { valid: false, error: 'Nama subdomain maksimal 63 karakter' }
  }

  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(name)) {
    return { valid: false, error: 'Hanya boleh huruf kecil, angka, dan tanda hubung' }
  }

  if (name.startsWith('-') || name.endsWith('-')) {
    return { valid: false, error: 'Tidak boleh dimulai atau diakhiri dengan tanda hubung' }
  }

  // Reserved subdomains
  const reserved = [
    'www', 'api', 'admin', 'mail', 'ftp', 'smtp', 'pop', 'imap',
    'ns', 'dns', 'mx', 'cname', 'txt', 'srv', 'ptr',
    'test', 'staging', 'dev', 'development', 'prod', 'production',
    'blog', 'forum', 'shop', 'store', 'app', 'mobile',
    'support', 'help', 'docs', 'documentation', 'wiki',
    'cdn', 'static', 'assets', 'media', 'images', 'img',
    'js', 'css', 'fonts', 'files', 'downloads',
    'auth', 'login', 'register', 'signup', 'signin',
    'dashboard', 'panel', 'control', 'cpanel',
    'secure', 'ssl', 'tls', 'https',
    'status', 'health', 'ping', 'monitor',
    'webhook', 'callback', 'oauth', 'sso'
  ]

  if (reserved.includes(name.toLowerCase())) {
    return { valid: false, error: 'Nama subdomain ini sudah direservasi sistem' }
  }

  return { valid: true }
}

export const validateUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url) {
    return { valid: false, error: 'URL tidak boleh kosong' }
  }

  try {
    const parsedUrl = new URL(url)
    
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { valid: false, error: 'URL harus dimulai dengan http:// atau https://' }
    }

    if (!parsedUrl.hostname) {
      return { valid: false, error: 'URL tidak valid, hostname tidak ditemukan' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Format URL tidak valid' }
  }
}

// Export default client
export default supabase
