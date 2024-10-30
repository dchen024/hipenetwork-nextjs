"use client";

import { supabase } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import NavBar from "@/components/NavBar";
import Feed from "@/components/Feed";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, [router]);

  const handleResultClick = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">Feed</h1>
        <div className="relative mb-8 flex justify-center">
          <SearchBar onResultClick={handleResultClick} />
        </div>
        <Feed />
      </main>
    </div>
  );
}
