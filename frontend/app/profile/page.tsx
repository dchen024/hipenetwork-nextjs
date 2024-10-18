"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "@/types/user";
import { BasicInformation } from "./BasicInformation";
import { WorkHistory } from "./WorkHistory";
import { useRouter } from "next/navigation";
import { EducationHistory } from "./EducationHistory";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setError("Failed to authenticate user");
        setLoading(false);
        return;
      }

      if (authUser) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
          setError("Failed to fetch user data. Please try again.");
        } else if (data) {
          setUser(data);
        }
      } else {
        setError("No authenticated user found");
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Profile</h1>
      {user ? (
        <>
          <BasicInformation user={user} />
          <WorkHistory workHistory={user.work_history || []} />
          <EducationHistory educationHistory={user.education_history || []} />
        </>
      ) : (
        <p>No user data available.</p>
      )}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          onClick={() => router.push("/profile/edit")}
          className="w-40 rounded bg-blue-500 px-4 py-2 text-black"
        >
          Edit Profile
        </button>
        <button
          onClick={() => router.push("/home")}
          className="w-40 rounded border-2 border-black px-4 py-2 text-black"
        >
          Home
        </button>
      </div>
    </div>
  );
}
