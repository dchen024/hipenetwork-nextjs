"use client";

import { supabase } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

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
    <div>
      <h1>Home Page</h1>
      <p>Welcome, {user.email}!</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-700"
      >
        Logout
      </button>
      <div className="flex">
        <button
          onClick={() => router.push("/profile")}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
