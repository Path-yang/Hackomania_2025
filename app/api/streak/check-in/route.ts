import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const userId = (session.user as any).id as string;

	try {
		let goal = await prisma.goal.findFirst({ where: { recipientId: userId, isActive: true } });
		if (!goal) {
			goal = await prisma.goal.create({ data: { recipientId: userId, title: "Porn-free streak", description: "Daily abstinence check-ins", isActive: true } });
		}

		const todayStart = new Date();
		todayStart.setUTCHours(0, 0, 0, 0);
		const todayEnd = new Date();
		todayEnd.setUTCHours(23, 59, 59, 999);

		const existing = await prisma.milestone.findFirst({ where: { goalId: goal.id, kind: "DAILY", targetDate: { gte: todayStart, lte: todayEnd } } });
		if (existing) {
			return NextResponse.json({ ok: true, message: "Already checked in today" });
		}

		await prisma.milestone.create({ data: { goalId: goal.id, kind: "DAILY", targetDate: new Date(), amountMinor: 0, currency: "USD", status: "VERIFIED" } });
		return NextResponse.json({ ok: true });
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Failed to check in" }, { status: 400 });
	}
} 