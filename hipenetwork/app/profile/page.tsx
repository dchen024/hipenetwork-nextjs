"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "@/types/user";
import { BasicInformation } from "./BasicInformation";
import { WorkHistory } from "./WorkHistory";
import { useRouter } from "next/navigation";
import { EducationHistory } from "./EducationHistory";
import { SkillSection } from "./SkillSection";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";

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
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Profile</h1>
        {user ? (
          <>
            <BasicInformation user={user} />
            <WorkHistory workHistory={user.work_history || []} />
            <EducationHistory educationHistory={user.education_history || []} />
            <SkillSection skills={user.skills || []} />
          </>
        ) : (
          <p>No user data available.</p>
        )}
        <div className="mt-8 flex flex-col space-y-4">
          <Button
            onClick={() => router.push("/profile/edit")}
            className="w-full bg-blue-500 text-white sm:w-auto"
          >
            Edit Profile
          </Button>
          <Button
            onClick={() => router.push("/home")}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Home
          </Button>
        </div>
      </div>
    </>
  );
}
