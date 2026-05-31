import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '@/lib/otp-store';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, profile } = await req.json();
    
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase();
    const stored = otpStore.get(lowerEmail);

    if (!stored) {
      return NextResponse.json({ error: 'No OTP requested for this email' }, { status: 400 });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(lowerEmail);
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    if (stored.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Success! Clear OTP
    otpStore.delete(lowerEmail);

    // If a profile was provided (Create Account flow), save it to Supabase
    if (profile && profile.firstName) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', lowerEmail)
        .single();

      if (!existingUser) {
        // Insert new user into Supabase profiles table
        const { error: insertError } = await supabase.from('profiles').insert([{
          id: crypto.randomUUID(),
          email: lowerEmail,
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          role: profile.role || 'Citizen',
          reputation_score: 100,
          country: 'India',
          reports_submitted: 0,
          scams_verified: 0,
          is_premium: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
        if (insertError) {
          console.error("Supabase Profile Creation Error:", insertError);
        }
      }
    }

    // Create response and set the auth cookie (to satisfy our middleware)
    const res = NextResponse.json({ success: true });
    
    res.cookies.set({
      name: 'sb-auth-token', // Matches middleware prefix/suffix check
      value: 'premium-session-' + Date.now(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return res;
  } catch (error: any) {
    console.error('OTP Verify Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
