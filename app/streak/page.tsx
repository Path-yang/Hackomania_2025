"use client";
import { useEffect, useState } from "react";

export default function StreakPage() {
	const [streak, setStreak] = useState<number>(0);
	const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function load() {
		const res = await fetch("/api/streak/me");
		const data = await res.json();
		if (res.ok) {
			setStreak(data.streak || 0);
			setLastCheckIn(data.lastCheckIn || null);
		}
	}

	useEffect(() => { load(); }, []);

	async function checkIn() {
		setLoading(true);
		const res = await fetch("/api/streak/check-in", { method: "POST" });
		setLoading(false);
		if (!res.ok) {
			const e = await res.json();
			alert(e.error || "Failed to check in");
			return;
		}
		await load();
	}

	return (
		<div className="max-w-xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Your Porn-free Streak</h1>
			<p className="mb-2">Current streak: <span className="font-semibold">{streak} day{streak === 1 ? "" : "s"}</span></p>
			<p className="mb-6">Last check-in: {lastCheckIn ? new Date(lastCheckIn).toLocaleDateString() : "—"}</p>
			<button disabled={loading} onClick={checkIn} className="bg-green-600 text-white px-4 py-2 rounded">
				{loading ? "Checking in..." : "Check in for today"}
			</button>
		</div>
	);
} 