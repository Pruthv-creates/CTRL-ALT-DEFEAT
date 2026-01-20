import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone } from "lucide-react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./UserLoginPage.css";

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    try {
      if (!email || !password || (isSignup && !username)) {
        setError("Please fill in all fields");
        return;
      }

      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
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
      navigate("/");
    } catch {
      setError("Authentication failed. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-overlay" />

      <div className="login-card">
        <h2 className="login-title">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="login-subtitle">
          {isSignup
            ? "Start your herbal journey with us"
            : "Sign in to continue your herbal journey"}
        </p>

        <div className="login-form">
          {isSignup && (
            <GlassInput
              icon={<User size={20} />}
              placeholder="Username"
              value={username}
              onChange={setUsername}
              onKeyDown={handleKeyDown}
              type="text"
            />
          )}

          <GlassInput
            placeholder="Email address"
            value={email}
            onChange={setEmail}
            onKeyDown={handleKeyDown}
            type="email"
          />

          <GlassInput
            placeholder="Password"
            value={password}
            onChange={setPassword}
            onKeyDown={handleKeyDown}
            type="password"
          />

          {error && <p className="login-error">{error}</p>}

          <div className="login-btn-wrapper">
            <button onClick={handleSubmit} className="login-btn">
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>

        <div className="login-footer">
          <div>
            {!isSignup && (
              <button className="login-link">Forgot password?</button>
            )}
          </div>

          <button
            className="login-toggle"
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
            }}
          >
            {isSignup
              ? "Already have an account? Log in"
              : "New here? Create an account"}
          </button>
        </div>

        <div className="login-divider">
          <span>or continue with</span>
        </div>

        <div className="login-social">
          <SocialButton>
            <Phone size={24} color="#4CAF50" />
          </SocialButton>
          <SocialButton>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
          </SocialButton>
          <SocialButton>
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" />
          </SocialButton>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;

/* ---------- Sub Components ---------- */

interface GlassInputProps {
  icon?: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  type: string;
}

const GlassInput = ({
  icon,
  placeholder,
  value,
  onChange,
  onKeyDown,
  type,
}: GlassInputProps) => (
  <div className="glass-input">
    {icon && <span className="glass-icon">{icon}</span>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`glass-field ${icon ? "with-icon" : ""}`}
      required
    />
  </div>
);

const SocialButton = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className="social-btn" {...props}>
    {children}
  </button>
);
