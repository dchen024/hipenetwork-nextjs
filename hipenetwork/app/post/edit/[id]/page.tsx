"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/supabaseClient";
import EditPostForm from "@/components/EditPostForm";
import NavBar from "@/components/NavBar";

interface PostData {
  id: string;
  title: string;
  description: string;
  post_img: string | null;
  created_at: string;
  creator_id: string;
  users: {
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
}

export default function EditPostPage() {
  const [post, setPost] = useState<PostData | null>(null);
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          users (first_name, last_name, profile_picture)
        `,
        )
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        router.push("/"); // Redirect to home if post not found
      } else {
        setPost(data);
      }
    }

    fetchPost();
  }, [params.id]);

  const handleEditComplete = () => {
    router.push(`/post/${params.id}`);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <>
      <NavBar />
      <EditPostForm
        id={post.id}
        initialTitle={post.title}
        initialDescription={post.description}
        initialPostImage={post.post_img}
        authorName={`${post.users.first_name} ${post.users.last_name}`}
        authorAvatar={post.users.profile_picture}
        createdAt={post.created_at}
        onEditComplete={handleEditComplete}
      />
    </>
  );
}
