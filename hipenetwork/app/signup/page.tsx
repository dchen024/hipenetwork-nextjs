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
} from "@/components/ui/card"; // Import Card components
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [showValidation, setShowValidation] = useState(false);
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
    setShowValidation(true);

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
      setError(error.message || "An unknown error occurred");
    } else {
      router.push("/home");
    }

    setLoading(false);
  };

  // Function to handle OAuth sign-up (GitHub, Google, LinkedIn)
  const handleOAuthSignUp = async (
    provider: "github" | "google" | "linkedin_oidc",
  ) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // skipBrowserRedirect: true,
        redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL,
      },
    });

    if (error) {
      console.error(
        `Error signing up with ${provider}:`,
        error.message || "An unknown error occurred",
      );
    } else {
      // const {
      //   data: { user },
      //   error,
      // } = await supabase.auth.getUser();
      // if (error) {
      //   console.error("Error getting user:", error.message);
      // }
      // if (user) {
      //   const { id } = user;
      //   const { data, error } = await supabase
      //     .from("users")
      //     .insert([{ id: id, email: email }]);
      //   router.push("/home");
      // }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Card component wrapping the sign-up form */}
      <Card className="w-full max-w-md bg-white dark:bg-blacksection">
        <CardHeader>
          <CardTitle className="mb-4 text-center text-2xl font-semibold text-black dark:text-white">
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
            className={showValidation && !firstName ? "border-red-500" : ""}
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={showValidation && !lastName ? "border-red-500" : ""}
          />
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
            className={
              showValidation && (!password || !isPasswordValid(password))
                ? "border-red-500"
                : ""
            }
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={
              showValidation &&
              (!confirmPassword || password !== confirmPassword)
                ? "border-red-500"
                : ""
            }
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            variant="default"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-primary text-white dark:bg-btndark dark:text-white"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* OAuth Buttons for GitHub, Google, and LinkedIn */}
          <p className="dark:text-white">or</p>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignUp("linkedin_oidc")}
            className="w-full border border-gray-300 text-black dark:border-strokedark dark:text-white"
          >
            Sign up with LinkedIn
          </Button>
          {/* <Button
            variant="outline"
            onClick={() => handleOAuthSignUp("github")}
            className="w-full text-black border border-gray-300 dark:border-strokedark dark:text-white"
          >
            Sign up with GitHub
          </Button> */}

          <Button
            variant="outline"
            onClick={() => handleOAuthSignUp("google")}
            className="w-full border border-gray-300 text-black dark:border-strokedark dark:text-white"
          >
            Sign up with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
