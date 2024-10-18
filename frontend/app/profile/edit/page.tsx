"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import BasicInformationEdit from "./BasicInformationEdit";
import { User } from "@/types/user";
import WorkHistoryEdit from "./WorkHistoryEdit";
import EducationHistoryEdit from "./EducationHistoryEdit";

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>
      <BasicInformationEdit user={user} />
      <WorkHistoryEdit user={user} />
      <EducationHistoryEdit user={user} />
    </div>
  );
}
