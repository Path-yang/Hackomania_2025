"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/components/LocalStorageProvider";

interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  daysRequired: number;
  isUnlocked: boolean;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { getItem, isReady } = useLocalStorage();

  useEffect(() => {
    if (!isReady) return;
    
    // Check if user has profile
    const userData = getItem("nofap_user");
    if (!userData && typeof window !== 'undefined') {
      console.log("No user data found, redirecting to profile");
      router.push("/profile");
      return;
    }
    
    try {
      const user = JSON.parse(userData || "{}");
      setUsername(user.username || "");
    } catch (e) {
      console.error("Failed to parse user data", e);
    }
    
    // Calculate current streak
    const streakDays = JSON.parse(getItem("nofap_streak_days") || "[]");
    if (streakDays.length > 0) {
      const set = new Set(streakDays);
      let streak = 0;
      const today = new Date(); today.setHours(0,0,0,0);
      let cursor = new Date(today);
      
      // Simple streak calculation for rewards page
      for (;;) {
        const key = cursor.toISOString().slice(0,10);
        if (set.has(key)) {
          streak += 1;
          cursor.setDate(cursor.getDate() - 1);
          continue;
        }
        // allow one-day gap only if first iteration
        if (streak === 0) {
          const y = new Date(today); y.setDate(today.getDate() - 1);
          const yKey = y.toISOString().slice(0,10);
          if (set.has(yKey)) {
            streak = 1;
          }
        }
        break;
      }
      
      setCurrentStreak(streak);
    }
    
    // Load rewards
    loadRewards();
  }, [isReady, getItem, router]);
  
  function loadRewards() {
    const rewardsData = [
      {
        id: "reward-1",
        title: "Increased Energy",
        description: "After just 7 days, many report higher energy levels and improved focus.",
        icon: "⚡",
        daysRequired: 7
      },
      {
        id: "reward-2",
        title: "Mental Clarity",
        description: "At 14 days, brain fog begins to lift and concentration improves.",
        icon: "🧠",
        daysRequired: 14
      },
      {
        id: "reward-3",
        title: "Confidence Boost",
        description: "By 30 days, social confidence and self-esteem often see significant improvements.",
        icon: "💪",
        daysRequired: 30
      },
      {
        id: "reward-4",
        title: "Emotional Balance",
        description: "After 60 days, many experience more stable moods and emotional regulation.",
        icon: "🧘",
        daysRequired: 60
      },
      {
        id: "reward-5",
        title: "Rewired Brain",
        description: "90 days is considered a full reboot, with significant neurological changes.",
        icon: "🌟",
        daysRequired: 90
      },
      {
        id: "reward-6",
        title: "New Identity",
        description: "At 180 days, the habit is fully broken and a new self-identity is formed.",
        icon: "🦋",
        daysRequired: 180
      },
      {
        id: "reward-7",
        title: "Lifestyle Transformation",
        description: "One year marks complete lifestyle transformation and freedom from addiction.",
        icon: "🏆",
        daysRequired: 365
      }
    ];
    
    // Mark rewards as unlocked based on streak
    const updatedRewards = rewardsData.map(reward => ({
      ...reward,
      isUnlocked: currentStreak >= reward.daysRequired
    }));
    
    setRewards(updatedRewards);
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
      <h1 className="text-3xl font-bold mb-2 text-center">Rewards & Benefits</h1>
      <p className="text-center text-gray-600 mb-8">Track your progress and see what benefits await you</p>
      
      {/* Current Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-600">Your Current Streak</h2>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-purple-600">{currentStreak}</span>
              <span className="ml-2 text-gray-500">days</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="bg-gray-100 h-4 w-64 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full" 
                style={{ width: `${Math.min(currentStreak / 90 * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>30</span>
              <span>60</span>
              <span>90 days</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rewards List */}
      <div className="space-y-6">
        {rewards.map((reward) => (
          <div 
            key={reward.id}
            className={`bg-white rounded-xl shadow-sm p-6 transition ${
              reward.isUnlocked 
                ? 'border-l-4 border-green-500' 
                : 'opacity-70'
            }`}
          >
            <div className="flex items-center">
              <div className={`text-4xl mr-4 ${reward.isUnlocked ? '' : 'grayscale'}`}>
                {reward.icon}
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold">{reward.title}</h3>
                  {reward.isUnlocked && (
                    <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Unlocked!</span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{reward.description}</p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-lg font-bold">{reward.daysRequired}</span>
                <span className="text-gray-500 text-sm"> days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Motivational Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-md p-8 mt-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Keep Going, {username}!</h2>
        <p className="mb-4">
          Every day you stay committed is another victory. The benefits of abstaining extend far beyond what's listed here - 
          improved relationships, better sleep, increased productivity, and a healthier relationship with yourself.
        </p>
        <p>
          Remember why you started this journey and stay focused on your goals. You've got this!
        </p>
      </div>
    </div>
  );
} 