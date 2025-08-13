"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Placeholder for backend API call
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, dateOfBirth: `${year}-${month}-${day}`, gender, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Create an Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="flex space-x-2">
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="p-2 border border-gray-400 rounded w-1/2 text-gray-900 placeholder-gray-700" />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="p-2 border border-gray-400 rounded w-1/2 text-gray-900 placeholder-gray-700" />
          </div>
          <div className="flex space-x-2">
            <select value={day} onChange={(e) => setDay(e.target.value)} required className="p-2 border border-gray-400 rounded w-1/3 text-gray-900">
              <option value="">Day</option>
              {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
            <select value={month} onChange={(e) => setMonth(e.target.value)} required className="p-2 border border-gray-400 rounded w-1/3 text-gray-900">
              <option value="">Month</option>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} required className="p-2 border border-gray-400 rounded w-1/3 text-gray-900">
              <option value="">Year</option>
              {[...Array(100)].map((_, i) => <option key={i} value={2024 - i}>{2024 - i}</option>)}
            </select>
          </div>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required className="p-2 border border-gray-400 rounded w-1/3 text-gray-900">
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-2 border rounded w-full" />
          <input type="email" placeholder="Confirm Email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} required className="p-2 border rounded w-full" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-2 border rounded w-full" />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="p-2 border rounded w-full" />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Register</button>
        </form>
      </div>
    </div>
  );
}
