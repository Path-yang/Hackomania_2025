"use client";
import { useState } from "react";

export default function DonorConnect() {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const startGrants = async () => {
    setLoading(true);
    // Request non-interactive quote token (may be interactive depending on wallet)
    const res1 = await fetch("/api/wallet/request-grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, resource: "quote", actions: ["create", "read"] }),
    });
    const d1 = await res1.json();
    if (!res1.ok) { alert(d1.error); setLoading(false); return; }

    // Request outgoing-payment grant (interactive)
    const res2 = await fetch("/api/wallet/request-grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, resource: "outgoing-payment", actions: ["create", "read"], limits: { amount: { value: "100", assetCode: "USD", assetScale: 2 } } }),
    });
    const d2 = await res2.json();
    setLoading(false);
    if (!res2.ok) { alert(d2.error); return; }
    if (d2?.interact?.redirect) {
      window.location.href = d2.interact.redirect;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Donor: Connect Wallet</h1>
      <input className="w-full border p-2 mb-2 text-black" placeholder="Wallet Address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
      <button disabled={loading} onClick={startGrants} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Requesting..." : "Request Grants"}
      </button>
    </div>
  );
} 