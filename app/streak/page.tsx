"use client";
import { useEffect, useState } from "react";

function getTodayKey(): string {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d.toISOString().slice(0, 10);
}

function computeStreak(daysSet: Set<string>): number {
	// Count back from today including yesterday gap tolerance
	let streak = 0;
	const today = new Date(); today.setHours(0,0,0,0);
	let cursor = new Date(today);
	for (;;) {
		const key = cursor.toISOString().slice(0,10);
		if (daysSet.has(key)) {
			streak += 1;
			cursor.setDate(cursor.getDate() - 1);
			continue;
		}
		// allow one-day gap only if first iteration and yesterday was the last check-in
		if (streak === 0) {
			const y = new Date(today); y.setDate(today.getDate() - 1);
			const yKey = y.toISOString().slice(0,10);
			if (daysSet.has(yKey)) {
				streak = 1; // yesterday only
			}
		}
		break;
	}
	return streak;
}

export default function StreakPage() {
	const [streak, setStreak] = useState<number>(0);
	const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	function load() {
		try {
			const raw = localStorage.getItem("qt_streak_days") || "[]";
			const arr: string[] = JSON.parse(raw);
			const set = new Set(arr);
			setStreak(computeStreak(set));
			setLastCheckIn(arr.length ? arr[arr.length - 1] : null);
		} catch {}
	}

	useEffect(() => { load(); }, []);

	function checkIn() {
		setLoading(true);
		try {
			const today = getTodayKey();
			const raw = localStorage.getItem("qt_streak_days") || "[]";
			const arr: string[] = JSON.parse(raw);
			if (!arr.includes(today)) {
				arr.push(today);
				arr.sort();
				localStorage.setItem("qt_streak_days", JSON.stringify(arr));
			}
			setLoading(false);
			load();
		} catch (e: any) {
			setLoading(false);
			alert(e?.message || "Failed to check in");
		}
	}

	function reset() {
		localStorage.removeItem("qt_streak_days");
		load();
	}

	return (
		<div className="max-w-xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-2">Your Porn-free Streak</h1>
			<p className="mb-4 text-gray-600">Track your abstinence daily. Check in once per day.</p>
			<p className="mb-2">Current streak: <span className="font-semibold">{streak} day{streak === 1 ? "" : "s"}</span></p>
			<p className="mb-6">Last check-in: {lastCheckIn ?? "—"}</p>
			<div className="flex gap-3">
				<button disabled={loading} onClick={checkIn} className="bg-green-600 text-white px-4 py-2 rounded">
					{loading ? "Checking in..." : "Check in for today"}
				</button>
				<button onClick={reset} className="bg-gray-200 text-black px-4 py-2 rounded">Reset</button>
			</div>
		</div>
	);
} 