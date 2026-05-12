import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    //OTP generate (6 digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Save OTP
    await prisma.user.update({
      where: { email },
      data: {
        otp: otp,
        otpExp: expiry,
      },
    });

    // Send Email
    await sendEmail(
      email,
      "Your OTP Code",
      `
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `
    );

    return NextResponse.json({
      message: "OTP sent to your email",
    });

  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}