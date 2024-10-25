"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/supabaseClient";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  currentUserId: string;
  onLikeChange: () => void;
}

export default function LikeButton({
  postId,
  currentUserId,
  onLikeChange,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkLikeStatus();
  }, [postId, currentUserId]);

  const checkLikeStatus = async () => {
    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", currentUserId)
      .single();

    setIsLiked(!!data);
  };

  const handleLike = async () => {
    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId);
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: currentUserId });
    }

    setIsLiked(!isLiked);
    onLikeChange();
  };

  return (
    <Button
      onClick={handleLike}
      variant="ghost"
      size="sm"
      className={`p-0 ${isLiked ? "text-red-500" : "text-gray-500"}`}
    >
      <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
    </Button>
  );
}
