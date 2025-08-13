import { NextResponse } from "next/server";
import { getPublicJwks } from "@/lib/openpayments/client";

export async function GET() {
  const jwks = await getPublicJwks();
  return NextResponse.json(jwks);
} 