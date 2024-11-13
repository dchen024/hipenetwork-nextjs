"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/supabaseClient";
import Post from "@/components/Post";
import { User } from "@supabase/supabase-js";

interface PostData {
  id: string;
  created_at: string;
  title: string;
  description: string;
  post_img: string | null;
  creator_id: string;
  users: {
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
}

export default function Feed() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserAndPosts() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          created_at,
          title,
          description,
          post_img,
          creator_id,
          users (first_name, last_name, profile_picture)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(
          data.map((post: any) => ({
            ...post,
            users: {
              ...post.users,
              first_name: post.users.first_name as string,
              last_name: post.users.last_name as string,
              profile_picture: post.users.profile_picture as string | null,
            },
          })),
        );
      }
    }

    fetchUserAndPosts();
  }, []);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          title={post.title}
          description={post.description}
          postImage={post.post_img}
          authorName={`${post.users.first_name} ${post.users.last_name}`}
          authorAvatar={post.users.profile_picture}
          createdAt={post.created_at}
          authorId={post.creator_id}
          currentUserId={user?.id ?? ""}
        />
      ))}
    </div>
  );
}
