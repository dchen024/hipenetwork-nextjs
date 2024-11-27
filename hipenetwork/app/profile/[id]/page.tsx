"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user";
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
        console.log("User Data:", data);
        setUser(data);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Error fetching user:", err);
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
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <img
            src={user.profile_picture || ""}
            alt={`${user.first_name} ${user.last_name}`}
            className="mb-4 h-32 w-32 rounded-full"
          />
          <h1 className="mb-2 text-3xl font-bold">{`${user.first_name} ${user.last_name}`}</h1>
          <p className="text-gray-600">{user.description}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-2">
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Work History</h2>
              <WorkHistory workHistory={user.work_history || []} />
            </div>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Education</h2>
              <EducationHistory
                educationHistory={user.education_history || []}
              />
            </div>
          </div>
          <div>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Skills</h2>
              <SkillSection skills={user.skills || []} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
