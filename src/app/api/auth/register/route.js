import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    // body se data lena
    const { name, email, password } = await req.json();

    // Empty field validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    // Name validation
    if (name.length < 3) {
      return NextResponse.json(
        {
          message: "Name must be at least 3 characters",
        },
        {
          status: 400,
        }
      );
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "Invalid email format",
        },
        {
          status: 400,
        }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 6 characters",
        },
        {
          status: 400,
        }
      );
    }

    // Existing user check
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        {
          status: 409,
        }
      );
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: newUser,
      },
      {
        status: 201,
      }
    );
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