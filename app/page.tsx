"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">QuitTogether</h1>
        <p className="text-lg mb-6">Micro-donations tied to recovery milestones using Interledger Open Payments.</p>
        <div className="flex gap-4 justify-center">
          <a className="bg-blue-600 text-white px-4 py-2 rounded" href="/recipient/connect">Recipient: Connect Wallet</a>
          <a className="bg-green-600 text-white px-4 py-2 rounded" href="/donor/connect">Donor: Connect Wallet</a>
        </div>
      </div>
    </main>
  );
}
