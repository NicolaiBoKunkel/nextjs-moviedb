'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, getCurrentUser } from "@/lib/apis/authApi";

/**
 * LoginClient component that handles user login and registration.
 * It checks for an existing token in localStorage to redirect logged-in users.
 * Users can switch between login and registration forms.
 */

export default function LoginClient() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getCurrentUser(token)
      .then((userInfo) => {
        router.push(`/user/${userInfo.username}`);
      })
      .catch(() => {
        // Invalid token
      });
  }, [router]);

  const handleSubmit = async () => {
    try {
      setError("");

      if (isRegistering) {
        await registerUser(username, email, password);
        alert("Registration successful!");
      }

      const { token } = await loginUser(email, password);
      localStorage.setItem("token", token);

      const userInfo = await getCurrentUser(token);
      router.push(`/user/${userInfo.username}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isRegistering ? "Register" : "Login"}
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
          {isRegistering
            ? "Already have an account? Login"
            : "New here? Register"}
        </button>
      </form>
    </div>
  );
}
