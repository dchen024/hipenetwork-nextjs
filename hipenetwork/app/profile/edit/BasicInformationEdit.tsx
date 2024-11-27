import React, { useState } from "react";
import { User } from "@/types/user";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BasicInformationEditProps {
  user: User;
}

export default function BasicInformationEdit({
  user,
}: BasicInformationEditProps) {
  const [formData, setFormData] = useState<User>(user);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

    if (profileImage) {
      const { data, error } = await supabase.storage
        .from("profile_imgs")
        .upload(`${user.id}/${profileImage.name}`, profileImage);

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
      })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
    } else {
      router.push("/profile");
    }

    setLoading(false);
  };

  return (
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
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          name="email"
          value={formData.email || ""}
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
          className="block w-full p-2 mt-1 border rounded-md"
          rows={4}
        />
      </div>
      <div className="flex flex-col items-start gap-2">
        <Button
          type="submit"
          className="text-white"
        >
          {loading ? "Saving..." : "Update Basic Information"}
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
