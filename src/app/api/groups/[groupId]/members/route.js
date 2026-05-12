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

// POST - Add member to group
export async function POST(req, { params }) {
  try {
    const { groupId } = await params;  // 🔥 FIX: await params
    const { userId } = await req.json();
    const currentUserId = getUserId(req);
    
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if current user is admin
    const isAdmin = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: currentUserId,
        role: "ADMIN"
      }
    });
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Only admins can add members" }, { status: 403 });
    }
    
    // Check if already member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: parseInt(userId),
          groupId
        }
      }
    });
    
    if (existingMember) {
      return NextResponse.json({ error: "User is already a member" }, { status: 400 });
    }
    
    // Add member
    const member = await prisma.groupMember.create({
      data: {
        groupId,
        userId: parseInt(userId),
        role: "MEMBER"
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
    
    return NextResponse.json({ success: true, member });
    
  } catch (error) {
    console.error("Error adding member:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove member from group (EXIT GROUP)
export async function DELETE(req, { params }) {
  try {
    const { groupId } = await params;  // 🔥 FIX: await params
    const { userId } = await req.json();
    const currentUserId = getUserId(req);
    
    console.log("DELETE request:", { groupId, userId, currentUserId });
    
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if member exists
    const member = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: parseInt(userId),
          groupId
        }
      }
    });
    
    if (!member) {
      return NextResponse.json({ error: "User is not a member of this group" }, { status: 404 });
    }
    
    // Check if trying to remove creator (only if someone else is trying)
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });
    
    if (group && group.createdBy === parseInt(userId) && currentUserId !== parseInt(userId)) {
      return NextResponse.json({ error: "Cannot remove group creator" }, { status: 400 });
    }
    
    // Remove member
    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId: parseInt(userId),
          groupId
        }
      }
    });
    
    console.log(`✅ User ${userId} removed from group ${groupId}`);
    
    return NextResponse.json({ success: true, message: "Member removed" });
    
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}