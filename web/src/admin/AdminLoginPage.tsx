import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import "./AdminLoginPage.css";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@gmail.com")) {
      setError("Access restricted to admin emails");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;

      // Ensure Firestore doc exists with role: "admin"
      const adminDoc = await getDoc(doc(db, "Admin", uid));
      if (!adminDoc.exists()) {
        await setDoc(doc(db, "Admin", uid), {
          email,
          role: "admin",
          bookmarks: [],
        });
      }

      navigate("/admin-dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
  <div className="admin-page">
    <div className="admin-container">
      <form className="admin-card" onSubmit={handleSubmit}>
        {/* Glow layer */}
        <div className="admin-glow" />

        {/* Header */}
        <div className="admin-header">
          <h2>Admin Access</h2>
          <p>Secure administrator portal</p>
        </div>

        {/* Inputs */}
        <div className="admin-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          {error && <p className="admin-error">{error}</p>}
        </div>

        {/* Button */}
        <button type="submit" className="admin-btn">
          Sign In
        </button>

        {/* Footer */}
        <div className="admin-footer">
          <p>Administrator accounts are provisioned manually</p>
        </div>
      </form>
    </div>
  </div>
);
};

export default AdminLoginPage;
