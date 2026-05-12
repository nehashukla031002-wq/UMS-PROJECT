import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;

    // token check
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No Token" },
        { status: 401 }
      );
    }

    // token verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // body data
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and Email are required" },
        { status: 400 }
      );
    }

    // update user
    const updatedUser = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      {
        status: 200,
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