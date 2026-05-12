import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    //  Basic validation
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // No OTP stored
    if (!user.otp || !user.otpExp) {
      return NextResponse.json(
        { message: "OTP not requested" },
        { status: 400 }
      );
    }

    // OTP mismatch
    if (user.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP expired
    if (new Date() > user.otpExp) {
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    //  Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password + clear OTP
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExp: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );

  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}