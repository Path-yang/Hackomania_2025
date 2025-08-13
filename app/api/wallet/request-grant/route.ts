import { NextResponse } from "next/server";
import { z } from "zod";
import { requestGrant } from "@/lib/openpayments/client";

const schema = z.object({
  walletAddress: z.string().url(),
  resource: z.enum(["incoming-payment", "quote", "outgoing-payment"]),
  actions: z.array(z.enum(["create", "read", "read-all", "list", "list-all", "complete"])).min(1),
  limits: z.any().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress, resource, actions, limits } = schema.parse(body);

    const grant = await requestGrant({
      client: { key: { proof: "httpsig" } } as any,
      access_token: { access: [{ type: resource as any, actions: actions as any, identifier: walletAddress, limits }] },
      interact: { start: ["redirect"], finish: { method: "redirect", uri: `${process.env.NEXT_PUBLIC_APP_URL}/donor/connect`, nonce: crypto.randomUUID() } },
    } as any);

    return NextResponse.json(grant);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to request grant" }, { status: 400 });
  }
} 