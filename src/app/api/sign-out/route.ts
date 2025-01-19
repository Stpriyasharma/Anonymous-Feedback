import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        
        const cookieStore = await cookies()
           
        cookieStore.set('auth-token', '', {
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 0, // Set to 0 to expire the cookie immediately
            path: '/',
        })

        return NextResponse.json({
            success: true,
            message: "User logged out successfully"
        }, {
            status: 200
        })
    } catch (error) {
        console.error('Sign out error:', error)
        return NextResponse.json({
            success: false,
            message: "Sign out failed"
        }, {
            status: 500
        })
    }
}
