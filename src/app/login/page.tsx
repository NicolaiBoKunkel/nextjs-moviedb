'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, getCurrentUser } from "@/lib/apis/authApi";

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getCurrentUser(token)
      .then((userInfo) => {
        router.push(`/user/${userInfo.username}`);
      })
      .catch(() => {
        // Invalid token, stay on page
      });
  }, []);

  const handleSubmit = async () => {
    try {
      setError("");

      if (isRegistering) {
        await registerUser(username, email, password);
        alert("Registration successful!");
      }

      const { token, username: uname } = await loginUser(email, password);
      localStorage.setItem("token", token);

      const userInfo = await getCurrentUser(token);

      // Redirect to profile page
      router.push(`/user/${userInfo.username}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isRegistering ? "Register" : "Login"}</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {isRegistering && (
          <input
            className="w-full border p-2 mb-2 rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          className="w-full border p-2 mb-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 mb-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded"
        >
          {isRegistering ? "Register" : "Login"}
        </button>

        <button
          type="button"
          className="text-sm text-blue-600 mt-2 underline"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Already have an account? Login" : "New here? Register"}
        </button>
      </form>
    </div>
  );
}
