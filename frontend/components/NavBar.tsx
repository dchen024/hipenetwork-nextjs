"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/supabaseClient";

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    }

    fetchUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      setUser(null);
      router.push("/login");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <Link href="/" className="text-xl font-bold">
          HIPE Network
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <p className="text-sm">
                Welcome, {user.user_metadata?.name || user.email || "User"}!
              </p>
              <Button
                onClick={() => router.push("/home")}
                variant="default"
                className="text-white"
              >
                Home
              </Button>

              <Button
                onClick={() => router.push("/create-post")}
                variant="default"
                className="text-white bg-green-500 hover:bg-green-600"
              >
                Create Post
              </Button>
              <Button
                onClick={() => router.push("/chat")}
                variant="default"
                className="text-white bg-purple-500 hover:bg-purple-600"
              >
                Chat
              </Button>
              <Button onClick={() => router.push("/profile")} variant="outline">
                View Profile
              </Button>

              <Button onClick={handleLogout} variant="outline">
                Log Out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              variant="default"
              className="text-white bg-blue-500 hover:bg-blue-600"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
