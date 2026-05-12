import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // cookie se token lena
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized - No Token",
        },
        {
          status: 401,
        }
      );
    }

    // token verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // user database se nikaalo
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // status: true,
        // isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Profile fetched successfully",
        user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Invalid Token or Server Error",
      },
      {
        status: 500,
      }
    );
  }
}