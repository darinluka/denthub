import { NextResponse } from 'next/server';
import { TOTP } from 'totp-generator';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    console.log("Verifying token:", token);
    
    // Generate the current TOTP for our secret
    const { otp } = await TOTP.generate('JBSWY3DPEHPK3PXP');
    console.log("Expected OTP:", otp);
    
    // Check if the user's token matches or if it's the master bypass code
    const isValid = token === otp || token === '000000';
    
    return NextResponse.json({ success: isValid });
  } catch (error) {
    console.error("TOTP verification error:", error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
