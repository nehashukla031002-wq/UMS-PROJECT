import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

//  VERIFY ADMIN
async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Unauthorized", status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      return { error: "Access Denied", status: 403 };
    }

    return { decoded };

  } catch (error) {
    return { error: "Invalid Token", status: 401 };
  }
}

//  DELETE USER
export async function DELETE(req, context) {
    try {
      const params = await context.params;   
      const id = Number(params.id);
  
      const auth = await verifyAdmin();
      if (auth.error) {
        return NextResponse.json(
          { message: auth.error },
          { status: auth.status }
        );
      }
  
      if (!id || isNaN(id)) {
        return NextResponse.json(
          { message: "Invalid ID" },
          { status: 400 }
        );
      }
  
      const user = await prisma.user.findUnique({
        where: { id },
      });
  
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      await prisma.user.delete({
        where: { id },
      });
  
      return NextResponse.json({
        message: "User deleted successfully",
      });
  
    } catch (error) {
      console.log("DELETE ERROR:", error);
  
      return NextResponse.json(
        { message: "Delete failed" },
        { status: 500 }
      );
    }
  }


//UPDATE USER
    export async function PUT(req, context) {
        try {
          const params = await context.params;   
          const id = Number(params.id);
      
          const auth = await verifyAdmin();
          if (auth.error) {
            return NextResponse.json(
              { message: auth.error },
              { status: auth.status }
            );
          }
      
          if (!id || isNaN(id)) {
            return NextResponse.json(
              { message: "Invalid ID" },
              { status: 400 }
            );
          }
      
          const { name, email, role, status } = await req.json();
      
          if (!name || !email) {
            return NextResponse.json(
              { message: "Name & Email are required" },
              { status: 400 }
            );
          }
      
          const existingUser = await prisma.user.findUnique({
            where: { id },
          });
      
          if (!existingUser) {
            return NextResponse.json(
              { message: "User not found" },
              { status: 404 }
            );
          }
      
          const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, email, role, status },
          });
      
          return NextResponse.json({
            message: "User updated successfully",
            user: updatedUser,
          });
      
        } catch (error) {
          console.log("UPDATE ERROR:", error);
      
          return NextResponse.json(
            { message: "Update failed" },
            { status: 500 }
          );
        }
      }