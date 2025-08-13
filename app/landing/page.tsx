"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gradient-to-b from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to ZenMode</h1>
      <p className="text-lg max-w-2xl">
        Take control of your digital habits. Protect yourself from distractions,
        reduce screen time, and live a focused life.
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-white text-blue-600 py-2 px-6 rounded-lg shadow-md hover:bg-gray-200"
      >
        Get Started
      </button>
    </div>
  );
}
