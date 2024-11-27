"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [showValidation, setShowValidation] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async () => {
    setShowValidation(true);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
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
      setError(error.message || "An unknown error occurred");
    } else {
      router.push("/home");
    }

    setLoading(false);
  };

  // Function to handle OAuth login
  const handleOAuthLogin = async (
    provider: "github" | "google" | "linkedin_oidc",
  ) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL,
      },
    });

    if (error) {
      console.error(
        `Error logging in with ${provider}:`,
        error.message || "An unknown error occurred",
      );
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md bg-white dark:bg-blacksection">
        <CardHeader>
          <CardTitle className="mb-4 text-center text-2xl font-semibold text-black dark:text-white">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={
              showValidation && (!email || !email.includes("@"))
                ? "border-red-500"
                : ""
            }
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={showValidation && !password ? "border-red-500" : ""}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            variant="default"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-primary text-white dark:bg-btndark dark:text-white"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <p className="dark:text-white">or</p>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("linkedin_oidc")}
            className="w-full border border-gray-300 text-black dark:border-strokedark dark:text-white"
          >
            Login with LinkedIn
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("google")}
            className="w-full border border-gray-300 text-black dark:border-strokedark dark:text-white"
          >
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
