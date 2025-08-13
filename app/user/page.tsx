"use client";

import React from "react";
import { useState } from "react";

interface Milestone {
  id: number;
  title: string;
  completed: boolean;
}

const initialMilestones: Milestone[] = [
  { id: 1, title: "Stop xxx", completed: false },
  { id: 2, title: "Stop xxx", completed: false },
  { id: 3, title: "Stop xxx", completed: false },
  { id: 4, title: "Stop xxx", completed: false },
];

export default function MilestoneTracker() {
  const [milestones, setMilestones] = useState(initialMilestones);

  const toggleMilestone = (id: number) => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone) =>
        milestone.id === id
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center drop-shadow-lg">🎯 Milestone Tracker</h1>
      <p className="text-lg mb-4 text-center max-w-2xl">
        Keep track of your progress by checking off milestones as you complete them!
      </p>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-gray-900">
        <ul className="space-y-4">
          {milestones.map((milestone) => (
            <li key={milestone.id} className="flex items-center justify-between p-2 border-b border-gray-300 last:border-none">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={milestone.completed}
                  onChange={() => toggleMilestone(milestone.id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className={milestone.completed ? "line-through text-gray-500" : "text-gray-900 font-medium"}>
                  {milestone.title}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
