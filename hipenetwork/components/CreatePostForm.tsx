"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let post_img = "";

      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        post_img = fileName;
      }

      const { error } = await supabase.from("posts").insert({
        title,
        description,
        creator_id: user.id,
        post_img,
      });

      if (error) throw error;

      router.push("/home"); // Redirect to home page or post list
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-2xl bg-white px-4 sm:px-6 lg:px-8">
      <CardHeader>
        <CardTitle>New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-[300px]"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <Button className="text-white" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
