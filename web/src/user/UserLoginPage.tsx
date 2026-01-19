import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // 👈 new state for username
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await setDoc(doc(db, "Users", userCredential.user.uid), {
          email,
          username,
          role: "user",
          bookmarks: [],
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/user-dashboard");
    } catch (err) {
      setError("Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-indigo-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-md p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isSignup ? "Sign Up" : "Log In"}
        </h2>

        {isSignup && (
          <input
            id="userName"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full mb-5 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        )}

        <input
          id="userEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-5 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />

        <input
          id="userPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full my-5 bg-indigo-600 text-white py-2 rounded-md hover:opacity-90 transition"
        >
          {isSignup ? "Sign Up" : "Log In"}
        </button>

        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
        >
          {isSignup ? "Already have an account? Log In" : "New user? Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default UserLoginPage;
