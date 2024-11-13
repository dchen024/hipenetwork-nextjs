"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/supabaseClient";
import Post from "@/components/Post";
import { User } from "@supabase/supabase-js";
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

export default function PostPage() {
  const [post, setPost] = useState<PostData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    async function fetchPostAndUser() {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);

      const { data: postData, error } = await supabase
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
      } else {
        setPost(postData);
      }
    }

    fetchPostAndUser();
  }, [params.id]);

  if (!post) return <div>Loading...</div>;

  return (
    <>
      <NavBar />
      <Post
        id={post.id}
        title={post.title}
        description={post.description}
        postImage={post.post_img}
        authorName={`${post.users.first_name} ${post.users.last_name}`}
        authorAvatar={post.users.profile_picture}
        createdAt={post.created_at}
        authorId={post.creator_id}
        currentUserId={user?.id || ""}
      />
    </>
  );
}
