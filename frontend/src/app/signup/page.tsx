"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Import Card components

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Function to handle email/password sign-up
  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  // Function to handle OAuth sign-up (GitHub, Google)
  const handleOAuthSignUp = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) {
      console.error(`Error signing up with ${provider}:`, error.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Card component wrapping the sign-up form */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="mb-4 text-center text-2xl font-semibold">
            Sign Up
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Form for Email/Password Sign-Up */}
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={!firstName ? "border-red-500" : ""}
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={!lastName ? "border-red-500" : ""}
          />
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
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={!confirmPassword ? "border-red-500" : ""}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            variant="default"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* OAuth Buttons for GitHub and Google */}
          <Button
            variant="outline"
            onClick={() => handleOAuthSignUp("github")}
            className="w-full"
          >
            Sign up with GitHub
          </Button>

          <Button
            variant="outline"
            onClick={() => handleOAuthSignUp("google")}
            className="w-full"
          >
            Sign up with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
