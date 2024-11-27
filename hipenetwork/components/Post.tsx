import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/supabaseClient";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import { useRouter } from "next/navigation";

interface PostProps {
  id: string;
  title: string;
  description: string;
  postImage: string | null;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
  authorId: string;
  currentUserId: string;
}

export default function Post({
  id,
  title,
  description,
  postImage,
  authorName,
  authorAvatar,
  createdAt,
  authorId,
  currentUserId,
}: PostProps) {
  const formattedDate = new Date(createdAt).toLocaleString();
  const isAuthor = authorId === currentUserId;
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchLikesAndComments();
  }, [id]);

  const fetchLikesAndComments = async () => {
    const { count: likesCount } = await supabase
      .from("likes")
      .select("id", { count: "exact" })
      .eq("post_id", id);

    const { count: commentsCount } = await supabase
      .from("comments")
      .select("id", { count: "exact" })
      .eq("post_id", id);

    setLikesCount(likesCount || 0);
    setCommentsCount(commentsCount || 0);
  };

  return (
    <Card className="mx-auto mb-6 w-full max-w-2xl bg-white p-4">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar
          className="cursor-pointer"
          onClick={() => router.push(`/profile/${authorId}`)}
        >
          <AvatarImage src={authorAvatar || undefined} alt={authorName} />
          <AvatarFallback>
            {authorName ? authorName.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle>{authorName || "Unknown User"}</CardTitle>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <div className="space-x-2">
          <Link href={`/post/${id}`} passHref>
            <Button variant="outline">View</Button>
          </Link>
          {isAuthor && (
            <Link href={`/post/edit/${id}`} passHref>
              <Button variant="outline">Edit</Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="mb-4 whitespace-pre-wrap">{description}</p>
        {postImage && (
          <div className="relative h-96 w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${postImage}`}
              alt={title}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-md"
            />
          </div>
        )}
        <div className="mt-4 flex items-center space-x-4">
          <LikeButton
            postId={id}
            currentUserId={currentUserId}
            onLikeChange={fetchLikesAndComments}
          />
          <span>{likesCount} likes</span>
          <span>{commentsCount} comments</span>
        </div>
        <CommentSection postId={id} currentUserId={currentUserId} />
      </CardContent>
    </Card>
  );
}
