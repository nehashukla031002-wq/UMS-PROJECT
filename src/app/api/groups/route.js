import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function getUserId(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch { 
    return null; 
  }
}

export async function GET(req) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const groups = await prisma.group.findMany({
      where: {
        members: { some: { userId } }
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { user: { select: { name: true } } }
        }
      }
    });
    
    return NextResponse.json({ success: true, groups });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { name, memberIds } = await req.json();
    
    const group = await prisma.group.create({
      data: {
        name,
        createdBy: userId,
        members: {
          create: [
            { userId, role: "ADMIN" },
            ...(memberIds || []).map(id => ({ userId: parseInt(id), role: "MEMBER" }))
          ]
        }
      },
      include: {
        members: { include: { user: { select: { id: true, name: true } } } }
      }
    });
    
    return NextResponse.json({ success: true, group });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}