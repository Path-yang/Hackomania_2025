import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const milestone = await prisma.milestone.update({ where: { id }, data: { status: "VERIFIED", verifiedAt: new Date() } });
  await prisma.auditLog.create({ data: { action: "MILESTONE_VERIFIED", entityType: "Milestone", entityId: id, metadataJson: JSON.stringify({}) } });
  return NextResponse.json({ milestone });
} 