import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(req) {
  logger.info("Password change attempt");
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      logger.warn("Unauthorized password change attempt - no token");
      return NextResponse.json(
        { message: "Unauthorized - No Token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const { oldPassword, newPassword } =
      await req.json();

    if (!oldPassword || !newPassword) {
      logger.warn("Password change attempt with missing fields");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      logger.warn(`password change attempt with incorrect old password for user ID: ${decoded.id}`);  
      return NextResponse.json(
        { message: "Old password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(

      {
        message: "Password changed successfully",
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