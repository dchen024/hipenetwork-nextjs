"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  } | null;
}

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
  postAuthorId: string;
}

export default function CommentSection({
  postId,
  currentUserId,
  postAuthorId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        user:user_id (id, first_name, last_name, profile_picture)
      `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(
        data.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user: {
            id: comment.user.id,
            first_name: comment.user.first_name,
            last_name: comment.user.last_name,
            profile_picture: comment.user.profile_picture,
          },
        })) || [],
      );
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: currentUserId, content: newComment });

    if (error) {
      console.error("Error submitting comment:", error);
    } else {
      setNewComment("");
      fetchComments();
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("Error deleting comment:", error);
    } else {
      fetchComments();
    }
  };

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-semibold">Comments</h3>
      <form onSubmit={handleSubmitComment} className="flex mb-4 space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button variant="default" type="submit" className="text-white">
          Comment
        </Button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-2 group">
            <Avatar>
              <AvatarImage
                src={comment.user?.profile_picture || undefined}
                alt={
                  comment.user
                    ? `${comment.user.first_name} ${comment.user.last_name}`
                    : "User"
                }
              />
              <AvatarFallback>
                {comment.user
                  ? `${comment.user.first_name[0]}${comment.user.last_name[0]}`
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="font-semibold">
                {comment.user
                  ? `${comment.user.first_name} ${comment.user.last_name}`
                  : "Unknown User"}
              </p>
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
            {(currentUserId === comment.user?.id ||
              currentUserId === postAuthorId) && (
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-white bg-red-500 hover:bg-red-400"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
