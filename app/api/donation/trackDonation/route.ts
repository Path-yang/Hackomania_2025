import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const donationId = searchParams.get("id");

  if (!donationId) {
    return NextResponse.json({ error: "Donation ID is required" }, { status: 400 });
  }

  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
  });

  if (!donation) {
    return NextResponse.json({ error: "Donation not found" }, { status: 404 });
  }

  return NextResponse.json({ donation });
}
