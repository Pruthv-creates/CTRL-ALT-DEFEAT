import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { auth, db } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
            navigate("/user-dashboard");
        } catch (err) {
            setError("Authentication failed. Please try again.");
            console.error(err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1466781783364-36c955e42a7f?q=80&w=1920&auto=format&fit=crop")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div className="absolute inset-0 bg-black/45" />

            {/* Auth Card */}
            <div
  className="
    relative z-10 w-full max-w-lg mx-4
    px-12 py-14
    rounded-3xl
    bg-[#d6d2c7]/95 backdrop-blur-md
    border border-[#bdb8ac]
    shadow-[0_24px_60px_rgba(0,0,0,0.35)]
  "
>
  <h2 className="text-center text-4xl font-semibold text-[#3f5d35] mb-3">
    {isSignup ? "Create Account" : "Welcome Back"}
  </h2>

  <p className="text-center text-base text-[#5f6b5b] mb-10">
    {isSignup
      ? "Start your herbal journey with us"
      : "Sign in to continue your herbal journey"}
  </p>

                <div className="space-y-40">
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
                        icon={null}
                        placeholder="Email address"
                        value={email}
                        onChange={setEmail}
                        onKeyDown={handleKeyDown}
                        type="email"
                    />

                    <GlassInput
                        icon={null}
                        placeholder="Password"
                        value={password}
                        onChange={setPassword}
                        onKeyDown={handleKeyDown}
                        type="password"
                    />

                    {error && (
                        <p className="text-sm text-red-700 bg-red-100 rounded-lg px-4 py-3 text-center">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-center mt-24">
                        <button
                            onClick={handleSubmit}
                            className="w-24 h-14 rounded-md
                            bg-[#4a6b3a] hover:bg-[#3d5a30]
                            text-white font-bold text-base tracking-wide
                            shadow-md hover:shadow-lg
                            transition-all duration-300
                            active:scale-95 active:shadow-inner
                            uppercase flex items-center justify-center"
                        >
                            {isSignup ? "Sign Up" : "Sign In"}
                        </button>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center space-y-3">
                    {!isSignup && (
                        <button
                            type="button"
                            className="text-sm text-[#5f6b5b] hover:text-[#4a6b3a] transition"
                        >
                            Forgot password?
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setError(null);
                        }}
                        className="block w-full text-sm text-[#4a6b3a] font-medium hover:underline"
                    >
                        {isSignup
                            ? "Already have an account? Log in"
                            : "New here? Create an account"}
                    </button>
                </div>

                {/* Divider */}
                <div className="mt-8 flex items-center gap-4">
                    <div className="flex-1 h-px bg-[#bdb8ac]" />
                    <span className="text-xs text-[#6b6b6b]">
                        or continue with
                    </span>
                    <div className="flex-1 h-px bg-[#bdb8ac]" />
                </div>

                {/* Social Auth */}
                <div className="mt-6 flex justify-center gap-4">
                    <SocialButton aria-label="Google login">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" />
                    </SocialButton>

                    <SocialButton aria-label="Apple login">
                        <img src="https://www.svgrepo.com/show/303128/apple-logo.svg" className="w-6 h-6" />
                    </SocialButton>

                    <SocialButton aria-label="Facebook login">
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-6 h-6" />
                    </SocialButton>
                </div>
            </div>
        </div>
    );
};

export default UserLoginPage;

/* ---------- Sub Components ---------- */

interface GlassInputProps {
    icon: React.ReactNode;
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
    <div className="relative">
        {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6b5b] ">
                {icon}
            </span>
        )}
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={`
w-full rounded-xl
bg-white/95 hover:bg-white
border-2 border-[#bdb8ac]
${icon ? 'pl-16' : 'pl-6'} pr-6 py-4
text-base font-medium text-[#2d3748]
placeholder:text-[#9b9b9b] placeholder:font-normal placeholder:text-sm
focus:outline-none
focus:border-[#4a6b3a] focus:bg-white
focus:ring-2 focus:ring-[#4a6b3a]/20
transition-all duration-200 shadow-sm
`}

            required
        />
    </div>
);

interface SocialButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const SocialButton = ({ children, ...props }: SocialButtonProps) => (
    <button
        type="button"
        className="w-14 h-14 rounded-full bg-white
        border border-gray-200
        shadow-md hover:shadow-lg
        flex items-center justify-center
        transition-all duration-300
        hover:-translate-y-[1px]
        active:scale-95"
        {...props}
    >
        {children}
    </button>
);
