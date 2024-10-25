"use client";

import { supabase } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import CreatePostForm from "@/components/CreatePostForm";
import NavBar from "@/components/NavBar";

export default function CreatePost() {
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

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <NavBar user={user} />
      <CreatePostForm />
    </div>
  );
}
