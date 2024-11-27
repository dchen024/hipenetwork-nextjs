"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import BasicInformationEdit from "./BasicInformationEdit";
import { User } from "@/types/user";
import WorkHistoryEdit from "./WorkHistoryEdit";
import EducationHistoryEdit from "./EducationHistoryEdit";
import SkillSectionEdit from "./SkillSectionEdit";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setError("Error fetching session. Please try again.");
        setLoading(false);
        return;
      }

      if (!session) {
        setError("Please log in to edit your profile.");
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userError) {
        setError("Error fetching user data. Please try again.");
      } else if (userData) {
        setUser(userData);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">User not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl space-y-8 px-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Edit Profile
          </h1>

          {user.profile_picture && (
            <div className="mb-8 flex items-center">
              <div className="relative h-32 w-32">
                <Image
                  src={user.profile_picture}
                  alt="Profile Picture"
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 100vw, 128px"
                  priority
                />
              </div>
            </div>
          )}

          <div className="space-y-8">
            <BasicInformationEdit user={user} />
            <WorkHistoryEdit user={user} />
            <EducationHistoryEdit user={user} />
            <SkillSectionEdit user={user} />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => router.push("/home")}
              className="rounded-md bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
