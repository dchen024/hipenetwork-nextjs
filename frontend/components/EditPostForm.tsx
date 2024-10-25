"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { createClient } from "@/utils/supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { User } from "@supabase/supabase-js";

interface EditPostFormProps {
  id: string;
  initialTitle: string;
  initialDescription: string;
  initialPostImage: string | null;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
  onEditComplete: () => void;
}

export default function EditPostForm({
  id,
  initialTitle,
  initialDescription,
  initialPostImage,
  authorName,
  authorAvatar,
  createdAt,
  onEditComplete,
}: EditPostFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [postImage, setPostImage] = useState(initialPostImage);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formattedDate = new Date(createdAt).toLocaleString();

  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, [supabase.auth]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
      setPostImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!id) {
      console.error("Post ID is missing");
      alert("Error updating post: Post ID is missing");
      return;
    }

    setLoading(true);

    try {
      console.log("Updating post with ID:", id); // Add this line for debugging

      let updatedImagePath = postImage;

      if (newImage) {
        // If there's an existing image, delete it first
        if (initialPostImage) {
          const { error: deleteError } = await supabase.storage
            .from("posts")
            .remove([initialPostImage]);

          if (deleteError) throw deleteError;
        }

        const fileExt = newImage.name.split(".").pop();
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`; // Store under user's UUID

        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(fileName, newImage);

        if (uploadError) throw uploadError;

        // If upload successful, update the image path
        updatedImagePath = fileName;
      }

      // Update the post in your database
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title,
          description,
          post_img: updatedImagePath,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      onEditComplete();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto mb-6 w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={authorAvatar || undefined} alt={authorName} />
          <AvatarFallback>
            {authorName ? authorName.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle>{authorName || "Unknown User"}</CardTitle>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="text-xl font-semibold"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="min-h-[100px]"
          />
          {postImage && (
            <div className="relative h-64 w-full">
              <Image
                src={
                  newImage
                    ? postImage
                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${postImage}`
                }
                alt={title}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-md"
              />
            </div>
          )}
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              {postImage ? "Replace Image" : "Add Image"}
            </Button>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onEditComplete}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
