"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

export default function EditProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // State for user ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    profile_picture: "",
    description: "",
    work_history: {},
    education_history: {},
    skills: {},
  });
  const [userCreated, setUserCreated] = useState(false); // Flag to prevent duplicate creation
  const [profileImage, setProfileImage] = useState<File | null>(null); // State for profile image
  const router = useRouter();

  const fetchUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user) {
      const { id, email } = user;
      setUserId(id); // Set user ID in state

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
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          username: data.username || "",
          profile_picture: data.profile_picture || "",
          description: data.description || "",
          work_history: data.work_history || {},
          education_history: data.education_history || {},
          skills: data.skills || {},
        });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let profilePictureUrl = formData.profile_picture;

    if (profileImage && userId) {
      const { data, error } = await supabase.storage
        .from("profile_imgs")
        .upload(`${userId}/${profileImage.name}`, profileImage);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        profilePictureUrl = supabase.storage
          .from("profile_imgs")
          .getPublicUrl(data.path).data.publicUrl;
      }
    }

    const { error } = await supabase
      .from("users")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        profile_picture: profilePictureUrl,
        description: formData.description,
        work_history: formData.work_history,
        education_history: formData.education_history,
        skills: formData.skills,
      })
      .eq("id", userId);

    if (error) {
      setError(error.message);
    } else {
      router.push("/profile");
    }

    setLoading(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <Input
            type="text"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
            className="block w-full mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <Input
            type="text"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
            className="block w-full mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleChange}
            className="block w-full mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Profile Picture
          </label>
          <Input
            type="file"
            name="profile_image"
            onChange={handleFileChange}
            className="block w-full mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="block w-full mt-1"
            rows={4}
          />
        </div>
        <Button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <button
          onClick={() => router.push("/home")}
          className="w-full px-4 py-2 text-white bg-red-500 rounded"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
