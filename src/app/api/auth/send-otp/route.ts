import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { otpStore } from '@/lib/otp-store';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'rakshanetnoreply@gmail.com',
    pass: 'mtyj naaq chaj fqon',
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store it (expires in 10 minutes)
    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    const mailOptions = {
      from: '"RakshaNet Shield" <rakshanetnoreply@gmail.com>',
      to: email,
      subject: 'Your Premium Login Code',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #090306; color: #fff; padding: 40px; border-radius: 12px; border: 1px solid #ec4899;">
          <h1 style="color: #ec4899; text-align: center; margin-bottom: 30px;">🛡️ RakshaNet Shield</h1>
          <p style="font-size: 16px; color: #ccc; text-align: center;">Welcome back,</p>
          <p style="font-size: 16px; color: #ccc; text-align: center;">Use the following premium verification code to access your dashboard:</p>
          <div style="background: rgba(236, 72, 153, 0.1); border: 1px solid #ec4899; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #fff;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #888; text-align: center;">This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    try {
      // LIVE EMAIL SEND
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (mailError: any) {
      console.error('Nodemailer Error:', mailError);
      return NextResponse.json({ 
        error: 'Failed to send OTP via email. Please ensure nodemailer credentials are correct and Gmail is not blocking the attempt.' 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('OTP Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
