import { NextResponse } from "next/server";
import { z } from "zod";
import { continueGrant } from "@/lib/openpayments/client";

const schema = z.object({
  continueUri: z.string().url(),
  interactRef: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { continueUri, interactRef } = schema.parse(body);

    const result = await continueGrant(continueUri, { interact_ref: interactRef });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to continue grant" }, { status: 400 });
  }
} 