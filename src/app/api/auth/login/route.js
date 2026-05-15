import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";


export async function POST(req) {
  try {
    const { email, password } = await req.json();

    logger.info(`Login attempt for email: ${email}`);

    // Empty fields validation
    if (!email || !password) {
      logger.warn(`Login failed - Missing fields for email: ${email}`);
      logger.error(`Login failed - Missing fields for email: ${email}`);


      return NextResponse.json(
        { message: "Email and Password are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password length check
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

  // User check
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn(`Login failed - User not found for emails: ${email}`);
      logger.error(`Login failed - User not found for email: ${email}`);
      
      return NextResponse.json(

        { message: "User not found" },
        { status: 404 }
      );
    }

    //5. Status check 
    if (user.status === "BLOCKED") {
      logger.warn(`Login failed - Account blocked for emails: ${email}`);
      logger.error(`Login failed - Account blocked for emails: ${email}`);
      return NextResponse.json(
        { message: "Account is blocked by admin" },
        { status: 403 }
      );
    }

    if (user.status === "SUSPENDED") {
      logger.warn(`Login failed - Account suspended for emails: ${email}`);
      logger.error(`Login failed - Account suspended for emails: ${email}`);
      return NextResponse.json(
        { message: "Account is suspended" },
        { status: 403 }
      );
    }

    // 6. Password compare
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      logger.warn(`Login failed - Incorrect password for email: ${email}`);
      logger.error(`Login failed - Incorrect password for email: ${email}`);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    //Response + Cookie
    const response = NextResponse.json(

      {

        message: "Login successful",
        user,
      },
      {
        status: 200,
      }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}