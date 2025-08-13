import { NextResponse } from "next/server";
import { enqueueProcessMilestone } from "@/worker/index";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await enqueueProcessMilestone(id);
  return NextResponse.json({ enqueued: true, id });
} 