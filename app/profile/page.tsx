"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/components/LocalStorageProvider";

interface UserProfile {
  username: string;
  goal: string;
  motivation: string;
  startDate: string;
  targetDays: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    goal: "",
    motivation: "",
    startDate: new Date().toISOString().split('T')[0],
    targetDays: 90
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { getItem, setItem, isReady } = useLocalStorage();

  useEffect(() => {
    if (!isReady) return;
    
    // Load user profile
    const userData = getItem("nofap_user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setProfile(parsed);
        setIsNewUser(false);
        setIsEditing(false);
      } catch (e) {
        console.error("Failed to parse user data", e);
        // If parsing fails, treat as new user
        setIsEditing(true);
        setIsNewUser(true);
      }
    } else {
      setIsEditing(true);
      setIsNewUser(true);
    }

    // Load achievements
    loadAchievements();
  }, [isReady, getItem]);

  function loadAchievements() {
    if (!isReady) return;
    
    const achievementsData = [
      { id: "streak-1", title: "First Day", description: "Complete your first day", icon: "🌱" },
      { id: "streak-3", title: "Three Day Streak", description: "Maintain a 3-day streak", icon: "🌿" },
      { id: "streak-7", title: "One Week Strong", description: "Maintain a 7-day streak", icon: "🌳" },
      { id: "streak-14", title: "Two Week Warrior", description: "Maintain a 14-day streak", icon: "🌲" },
      { id: "streak-30", title: "Monthly Master", description: "Maintain a 30-day streak", icon: "🏆" },
      { id: "streak-60", title: "60 Day Champion", description: "Maintain a 60-day streak", icon: "🥇" },
      { id: "streak-90", title: "90 Day Reboot", description: "Complete the 90-day challenge", icon: "🌟" },
      { id: "streak-180", title: "Half Year Hero", description: "Maintain a 180-day streak", icon: "🏅" },
      { id: "streak-365", title: "One Year Legend", description: "Maintain a 365-day streak", icon: "👑" },
    ];

    try {
      const earnedAchievements = JSON.parse(getItem("nofap_achievements") || "[]");
      const achievementsWithStatus = achievementsData.map(achievement => ({
        ...achievement,
        earned: earnedAchievements.includes(achievement.id)
      }));
      setAchievements(achievementsWithStatus);
    } catch (e) {
      console.error("Failed to load achievements", e);
      setAchievements(achievementsData.map(a => ({ ...a, earned: false })));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === "targetDays" ? parseInt(value) : value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!profile.username) {
        alert("Username is required");
        setIsSubmitting(false);
        return;
      }
      
      // Save user profile to localStorage
      setItem("nofap_user", JSON.stringify(profile));
      
      // Initialize streak data if new user
      if (isNewUser) {
        setItem("nofap_streak_days", JSON.stringify([]));
        setItem("nofap_achievements", JSON.stringify([]));
      }
      
      setIsEditing(false);
      setIsNewUser(false);
      
      // Redirect to streak page after a short delay to ensure data is saved
      if (isNewUser) {
        setTimeout(() => {
          router.push("/streak");
        }, 100);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show loading state or form based on localStorage readiness
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
      <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
      
      {isEditing ? (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{isNewUser ? "Create Your Profile" : "Edit Profile"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  placeholder="Choose a username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Goal</label>
                <input
                  type="text"
                  name="goal"
                  value={profile.goal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="What do you want to achieve?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivation</label>
                <textarea
                  name="motivation"
                  value={profile.motivation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Why are you starting this journey?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={profile.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target (days)</label>
                <select
                  name="targetDays"
                  value={profile.targetDays}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days (recommended)</option>
                  <option value={180}>180 days</option>
                  <option value={365}>365 days</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                {!isNewUser && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : (isNewUser ? "Create Profile" : "Save Changes")}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Profile Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold mb-1">{profile.username}</h2>
                <p className="text-gray-500">Started on {new Date(profile.startDate).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Edit
              </button>
            </div>
            
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Goal</h3>
                <p className="mt-1">{profile.goal || "No goal set"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Target</h3>
                <p className="mt-1">{profile.targetDays} days</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Motivation</h3>
                <p className="mt-1">{profile.motivation || "No motivation set"}</p>
              </div>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border ${
                    achievement.earned ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{achievement.icon}</span>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.earned && (
                    <div className="mt-2 text-xs text-green-600 font-medium">✓ Unlocked</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 