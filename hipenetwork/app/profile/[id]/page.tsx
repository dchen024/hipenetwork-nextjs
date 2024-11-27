"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { BasicInformation } from "../BasicInformation";
import { WorkHistory } from "../WorkHistory";
import { EducationHistory } from "../EducationHistory";
import { SkillSection } from "../SkillSection";
import NavBar from "@/components/NavBar";

export default function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Profile</h1>
        <BasicInformation user={user} />
        <WorkHistory workHistory={user.work_history || []} />
        <EducationHistory educationHistory={user.education_history || []} />
        <SkillSection skills={user.skills || []} />
      </div>
    </>
  );
}
