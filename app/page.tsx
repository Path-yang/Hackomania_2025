"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("nofap_user");
    setIsLoggedIn(!!userData);
  }, []);

  return (
    <main className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-sm">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Take Control of Your <span className="text-purple-600">Life</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Track your progress, earn rewards, and join a community of people committed to breaking free from porn addiction.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {isLoggedIn ? (
            <Link href="/streak" className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
              View Your Streak
            </Link>
          ) : (
            <Link href="/profile" className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
              Get Started
            </Link>
          )}
          <Link href="/community" className="px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border border-purple-600 hover:bg-purple-50 transition">
            Join Community
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="📊"
            title="Track Your Progress"
            description="Monitor your streak, view statistics, and see your improvement over time."
          />
          <FeatureCard 
            icon="🏆"
            title="Earn Rewards"
            description="Unlock achievements and rewards as you reach milestones in your journey."
          />
          <FeatureCard 
            icon="👥"
            title="Community Support"
            description="Connect with others on the same journey and share experiences."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white rounded-xl shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto">
          <ol className="relative border-l border-gray-200 ml-6">
            <StepItem 
              number="1"
              title="Create Your Profile"
              description="Set up your account with your goals and preferences."
            />
            <StepItem 
              number="2"
              title="Check In Daily"
              description="Mark each day you successfully abstain to build your streak."
            />
            <StepItem 
              number="3"
              title="Earn Achievements"
              description="Unlock rewards and track your progress over time."
            />
            <StepItem 
              number="4"
              title="Join the Community"
              description="Connect with others for support and accountability."
            />
          </ol>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of others who are breaking free from addiction and reclaiming their lives.
        </p>
        <Link href="/profile" className="px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition text-lg">
          Start Now
        </Link>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <li className="mb-10 ml-6">
      <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full -left-4 ring-4 ring-white">
        {number}
      </span>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </li>
  );
}
