import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimit(ip: string, limit: number = 100, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now()
  const key = `rate_limit:${ip}`
  
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }
  
  record.count++
  rateLimitStore.set(key, record)
  
  return { allowed: true, remaining: limit - record.count }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Get client IP
  const ip = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous'
  
  // Rate limiting for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const rateLimit = getRateLimit(ip, 100, 15 * 60 * 1000) // 100 requests per 15 minutes
    
    if (!rateLimit.allowed) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '900', // 15 minutes
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + 900000).toISOString(),
        },
      })
    }
    
    // Add rate limit headers
    res.headers.set('X-RateLimit-Limit', '100')
    res.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
  }
  
  // Supabase auth
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  // Security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Maintenance mode check
  if (process.env.MAINTENANCE_MODE === 'true' && !req.nextUrl.pathname.startsWith('/maintenance')) {
    // Allow admin to bypass maintenance
    if (session) {
      const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', session.user.id)
        .single()
      
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
      if (!adminEmails.includes(user?.email || '')) {
        return NextResponse.redirect(new URL('/maintenance', req.url))
      }
    } else {
      return NextResponse.redirect(new URL('/maintenance', req.url))
    }
  }
  
  // Check if user is banned
  if (session) {
    const { data: user } = await supabase
      .from('users')
      .select('is_banned, ban_reason')
      .eq('id', session.user.id)
      .single()
    
    if (user?.is_banned) {
      // Clear session and redirect to banned page
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/banned', req.url))
    }
  }
  
  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Update last login time
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', session.user.id)
  }
  
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Check if user is admin
    const { data: user } = await supabase
      .from('users')
      .select('email, is_banned')
      .eq('id', session.user.id)
      .single()
    
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin.vinnesia@gmail.com']
    
    if (!user || user.is_banned || !adminEmails.includes(user.email)) {
      // Log unauthorized admin access attempt
      if (user) {
        await supabase
          .from('admin_logs')
          .insert({
            admin_id: session.user.id,
            action: 'unauthorized_admin_access_attempt',
            target_type: 'system',
            details: {
              ip: ip,
              user_agent: req.headers.get('user-agent'),
              attempted_path: req.nextUrl.pathname,
            },
            ip_address: ip,
            user_agent: req.headers.get('user-agent'),
          })
      }
      
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    // Log admin access
    if (!req.nextUrl.pathname.includes('/api/')) {
      await supabase
        .from('admin_logs')
        .insert({
          admin_id: session.user.id,
          action: 'admin_page_access',
          target_type: 'system',
          details: {
            page: req.nextUrl.pathname,
            ip: ip,
            user_agent: req.headers.get('user-agent'),
          },
          ip_address: ip,
          user_agent: req.headers.get('user-agent'),
        })
    }
  }
  
  // Redirect auth routes if already logged in
  if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
  
  // Handle auth callback
  if (req.nextUrl.pathname === '/auth/callback') {
    const code = req.nextUrl.searchParams.get('code')
    
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.session) {
        // Create or update user profile
        const { user } = data.session
        
        await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata.full_name || user.user_metadata.name || '',
            avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture || '',
            provider: user.app_metadata.provider || 'email',
            last_login: new Date().toISOString(),
          })
        
        // Create welcome notification
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Selamat datang di VIN NESIA! 🎉',
            message: 'Terima kasih telah bergabung dengan platform subdomain gratis terbaik. Silakan ajukan subdomain pertama Anda!',
            type: 'success',
            action_url: '/dashboard/create',
            action_label: 'Buat Subdomain',
          })
        
        // Redirect to dashboard or intended page
        const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard'
        return NextResponse.redirect(new URL(redirectTo, req.url))
      }
    }
    
    // If error, redirect to login with error
    return NextResponse.redirect(new URL('/login?error=auth_callback_error', req.url))
  }
  
  // Handle logout
  if (req.nextUrl.pathname === '/logout') {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // Add security headers to API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    res.headers.set('X-API-Version', '1.0')
    res.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/api/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/login',
    '/logout'
  ]
}
