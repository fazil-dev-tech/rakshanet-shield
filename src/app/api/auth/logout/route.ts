import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  
  // Clear the premium session cookie
  res.cookies.set({
    name: 'sb-auth-token',
    value: '',
    maxAge: 0,
    path: '/'
  });
  
  return res;
}
