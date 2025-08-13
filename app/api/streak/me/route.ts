import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const userId = (session.user as any).id as string;

	try {
		const goal = await prisma.goal.findFirst({ where: { recipientId: userId, isActive: true } });
		if (!goal) return NextResponse.json({ streak: 0, lastCheckIn: null });

		const milestones = await prisma.milestone.findMany({ where: { goalId: goal.id, kind: "DAILY" }, orderBy: { targetDate: "desc" }, take: 60 });
		let streak = 0;
		let cursor = new Date();
		cursor.setUTCHours(0, 0, 0, 0);
		for (const m of milestones) {
			const d = new Date(m.targetDate);
			d.setUTCHours(0, 0, 0, 0);
			if (streak === 0) {
				// allow last check-in to be today or yesterday
				const today = new Date(); today.setUTCHours(0,0,0,0);
				const yesterday = new Date(today); yesterday.setUTCDate(today.getUTCDate() - 1);
				if (d.getTime() !== today.getTime() && d.getTime() !== yesterday.getTime()) break;
				cursor = d;
				streak = 1;
				continue;
			}
			const prev = new Date(cursor); prev.setUTCDate(cursor.getUTCDate() - 1);
			if (d.getTime() === prev.getTime()) {
				streak += 1;
				cursor = d;
			} else {
				break;
			}
		}

		const lastCheckIn = milestones[0]?.targetDate ?? null;
		return NextResponse.json({ streak, lastCheckIn });
	} catch (err: any) {
		return NextResponse.json({ error: err.message || "Failed to load streak" }, { status: 400 });
	}
} 