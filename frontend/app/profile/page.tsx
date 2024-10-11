"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import Image from "next/image";

export default function ViewProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCreated, setUserCreated] = useState(false); // Flag to prevent duplicate creation
  const router = useRouter();

  const fetchUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user) {
      const { id, email } = user;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error && !userCreated) {
        // If user does not exist in the users table, create a new user
        await createUser(id, email || "");
        router.refresh();
      } else if (data) {
        setUser(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const createUser = async (id: string, email: string) => {
    const { error } = await supabase.from("users").insert([
      {
        id,
        email,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setUserCreated(true); // Set the flag to true after user is created
      // Fetch the user again to update the state
      fetchUser();
    }
  };

  const handleEdit = () => {
    router.push("/profile/edit");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container p-4 mx-auto ">
      <h1 className="mb-4 text-2xl font-bold">Profile</h1>
      {user ? (
        <div className="space-y-4">
          {user.profile_picture && (
            <div className="flex mb-4">
              <Image
                src={user.profile_picture}
                alt="Profile Picture"
                width={128}
                height={128}
                className="rounded-full"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <p className="block w-full mt-1">{user.first_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <p className="block w-full mt-1">{user.last_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="block w-full mt-1">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <p className="block w-full mt-1">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <p className="block w-full mt-1">{user.description}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-black bg-blue-500 rounded"
            >
              Edit Profile
            </button>
            <button
              onClick={() => router.push("/home")}
              className="w-full px-4 py-2 text-black border-2 border-black rounded"
            >
              Home
            </button>
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}
