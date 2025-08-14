"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/components/LocalStorageProvider";

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

interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastCheckIn: string | null;
  checkedInToday: boolean;
}

export default function StreakPage() {
	const [stats, setStats] = useState<StreakStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    lastCheckIn: null,
    checkedInToday: false
  });
	const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState("");
  const router = useRouter();
  const { getItem, setItem, isReady } = useLocalStorage();
  
  const motivationalQuotes = [
    "Every day clean is a victory.",
    "Your future self will thank you for the choices you make today.",
    "Progress is progress, no matter how small.",
    "The pain of discipline is nothing compared to the pain of disappointment.",
    "You are stronger than your urges.",
    "One day at a time.",
    "The journey of a thousand miles begins with a single step.",
    "Your streak is proof of your commitment.",
    "Fall down seven times, stand up eight.",
    "The best time to plant a tree was 20 years ago. The second best time is now."
  ];

	function load() {
		try {
			const raw = getItem("nofap_streak_days") || "[]";
			const arr: string[] = JSON.parse(raw);
			const set = new Set(arr);
      const today = getTodayKey();
      const currentStreak = computeStreak(set);
      
      // Calculate longest streak
      let longestStreak = 0;
      if (arr.length > 0) {
        arr.sort();
        let tempStreak = 1;
        for (let i = 1; i < arr.length; i++) {
          const prevDate = new Date(arr[i-1]);
          const currDate = new Date(arr[i]);
          const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }
      
      setStats({
        currentStreak,
        longestStreak,
        totalDays: arr.length,
        lastCheckIn: arr.length ? arr[arr.length - 1] : null,
        checkedInToday: set.has(today)
      });
      
      // Set random motivational quote
      setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
		} catch (e) {
      console.error("Error loading streak data", e);
    }
	}

	useEffect(() => { 
  if (!isReady) return;
  
  // Check if user has profile
  const userData = getItem("nofap_user");
  if (!userData && typeof window !== 'undefined') {
    console.log("No user data found, redirecting to profile");
    router.push("/profile");
    return;
  }
  
  load(); 
}, [isReady, getItem, router]);

	function checkIn() {
		setLoading(true);
		try {
			const today = getTodayKey();
			const raw = getItem("nofap_streak_days") || "[]";
			const arr: string[] = JSON.parse(raw);
			if (!arr.includes(today)) {
				arr.push(today);
				arr.sort();
				setItem("nofap_streak_days", JSON.stringify(arr));
        
        // Update achievements
        updateAchievements(arr.length);
			}
			setLoading(false);
			load();
		} catch (e: any) {
			setLoading(false);
			alert(e?.message || "Failed to check in");
		}
	}
  
  function updateAchievements(days: number) {
    try {
      const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
      const achievementsRaw = getItem("nofap_achievements") || "[]";
      const achievements = JSON.parse(achievementsRaw);
      
      let updated = false;
      for (const milestone of milestones) {
        if (days >= milestone) {
          const achievementId = `streak-${milestone}`;
          if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            updated = true;
          }
        }
      }
      
      if (updated) {
        setItem("nofap_achievements", JSON.stringify(achievements));
      }
    } catch (e) {
      console.error("Error updating achievements", e);
    }
  }

	function reset() {
		if (confirm("Are you sure you want to reset your streak? This cannot be undone.")) {
      setItem("nofap_streak_days", JSON.stringify([]));
      load();
    }
	}

  // Show loading state when localStorage isn't ready
  if (!isReady) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

	return (
		<div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your NoFap Journey</h1>
        <p className="text-gray-600 italic">"{quote}"</p>
      </div>
      
      {/* Streak Card */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-lg text-gray-600 font-medium">Current Streak</h2>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-purple-600">{stats.currentStreak}</span>
              <span className="ml-2 text-gray-500">day{stats.currentStreak === 1 ? "" : "s"}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Last check-in: {stats.lastCheckIn ? new Date(stats.lastCheckIn).toLocaleDateString() : "—"}
            </p>
          </div>
          
          <div>
            {stats.checkedInToday ? (
              <button disabled className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-medium">
                ✓ Checked in today
              </button>
            ) : (
              <button 
                disabled={loading} 
                onClick={checkIn} 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
              >
                {loading ? "Checking in..." : "Check in for today"}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Longest Streak" 
          value={stats.longestStreak} 
          unit="days" 
          icon="🏆"
        />
        <StatCard 
          title="Total Clean Days" 
          value={stats.totalDays} 
          unit="days" 
          icon="📆"
        />
        <StatCard 
          title="Success Rate" 
          value={Math.round((stats.totalDays / (stats.totalDays + 1)) * 100)} 
          unit="%" 
          icon="📈"
        />
      </div>
      
      {/* Calendar View (simplified) */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 29 + i);
            const dateKey = date.toISOString().slice(0, 10);
            const isCheckedIn = stats.lastCheckIn && stats.lastCheckIn >= dateKey;
            
            return (
              <div 
                key={dateKey} 
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs ${
                  isCheckedIn ? 'bg-purple-600 text-white' : 'bg-gray-100'
                }`}
                title={date.toLocaleDateString()}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-center">
        <button onClick={reset} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
          Reset Streak
        </button>
      </div>
		</div>
	);
}

function StatCard({ title, value, unit, icon }: { title: string; value: number; unit: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{icon}</span>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold">{value}</span>
        <span className="ml-1 text-gray-500">{unit}</span>
      </div>
    </div>
  );
} 