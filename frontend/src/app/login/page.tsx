"use client";

import { supabase } from "../../../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import router from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string) => {
    const minLength = 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasLowercase &&
      hasUppercase &&
      hasDigit &&
      hasSymbol
    );
  };

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      setError("Invalid email format");
      return;
    }

    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters long and include lowercase, uppercase letters, digits, and symbols",
      );
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/home");
    }

    setLoading(false);
  };

  // Function to handle OAuth login (GitHub, Google, LinkedIn)
  const handleOAuthLogin = async (
    provider: "github" | "google" | "linkedin_oidc",
  ) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) {
      console.error(`Error logging in with ${provider}:`, error.message);
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Card component wrapping the login form */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="mb-4 text-2xl font-semibold text-center text-black dark:text-white">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Form for Email/Password Login */}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={!email ? "border-red-500" : ""}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={!password ? "border-red-500" : ""}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            variant="default"
            onClick={handleLogin}
            disabled={loading}
            className="w-full text-black dark:text-white"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* OAuth Buttons for GitHub, Google, and LinkedIn */}

          <p className="dark:text-white">or</p>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("linkedin_oidc")}
            className="w-full text-black dark:text-white"
          >
            Sign in with LinkedIn
          </Button>
          {/* <Button
            variant="outline"
            onClick={() => handleOAuthLogin("github")}
            className="w-full text-black dark:text-white"
          >
            Sign in with GitHub
          </Button> */}

          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("google")}
            className="w-full text-black dark:text-white"
          >
            Sign in with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
