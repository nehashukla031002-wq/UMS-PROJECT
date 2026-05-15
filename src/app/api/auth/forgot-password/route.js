import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";
import logger from "@/lib/logger";

export async function POST(req) {
  try {
    const { email } = await req.json();
    logger.info(`Password reset requested for email: ${email}`);

    if (!email) {
      logger.warn("Password reset attempt with missing email");
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn(`password reset attempt for non-existent email: ${email}`);
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
      logger: logger,
      info: `OTP sent to email: ${email}`,
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