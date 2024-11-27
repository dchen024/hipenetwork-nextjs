"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "@/types/user";
import { BasicInformation } from "./BasicInformation";
import { WorkHistory } from "./WorkHistory";
import { EducationHistory } from "./EducationHistory";
import { SkillSection } from "./SkillSection";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

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
        <div className="relative mb-6 rounded-lg bg-white p-6 shadow-md">
          <Button
            variant="ghost"
            className="absolute right-4 top-4 flex items-center"
            onClick={() => router.push("/profile/edit")}
          >
            Edit Profile
            <span className="ml-2">
              <Pencil className="h-4 w-4" />
            </span>
          </Button>
          <BasicInformation user={user!} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-2">
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Work History</h2>
              <WorkHistory workHistory={user?.work_history || []} />
            </div>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Education</h2>
              <EducationHistory
                educationHistory={user?.education_history || []}
              />
            </div>
          </div>
          <div>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Skills</h2>
              <SkillSection skills={user?.skills || []} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
