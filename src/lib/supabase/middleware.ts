import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect /dashboard routes
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
    if (!user && isDashboardRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/signin'
        return NextResponse.redirect(url)
    }

    // Redirect to dashboard if logged in and trying to access auth pages (but not callback)
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
    const isCallbackRoute = request.nextUrl.pathname.startsWith('/auth/callback')
    if (user && isAuthRoute && !isCallbackRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
