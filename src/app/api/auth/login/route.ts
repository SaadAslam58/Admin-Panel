import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY) 
const emailKey = process.env.EMAIL_KEY || "";
const passKey = process.env.PASSWORD_KEY || "";
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
     
    try {
        const { email, password } = await request.json();

        if (email === emailKey && password === passKey) {
          const token = await new SignJWT({ email })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('1h')
          .sign(secretKey);
      cookieStore.set("AuthToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
      });
            return NextResponse.json("Login successful");
        } else {
            return NextResponse.json("Invalid Email or Password !", { status: 401 });
        }
    } catch (error) {
        return NextResponse.json(error);
    }
}
