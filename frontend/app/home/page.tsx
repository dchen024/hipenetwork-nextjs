"use client";

import { supabase } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login"); // Redirect to login if not authenticated
      } else {
        setUser(data.user);
        // console.log(data.user);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      setTimeout(() => {
        router.push("/"); // Redirect to login after logout
      }, 500);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto flex h-screen w-full flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">Feed</h1>
      <p>Welcome, {user.user_metadata.name}!</p>
      <div className="mt-8 flex flex-col items-start gap-2">
        <Button
          onClick={() => router.push("/profile")}
          className="bg-blue-500 text-white "
        >
          View Profile
        </Button>
        <Button
          onClick={handleLogout}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
