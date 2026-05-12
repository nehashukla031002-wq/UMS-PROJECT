import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { groupId } = await params;
    
    const messages = await prisma.groupMessage.findMany({
      where: { groupId },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      },
      orderBy: { createdAt: "asc" }
    });
    
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}