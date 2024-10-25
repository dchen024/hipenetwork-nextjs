import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditPostForm from "@/components/EditPostForm";

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
  const [isEditing, setIsEditing] = useState(false);
  const formattedDate = new Date(createdAt).toLocaleString();
  const isAuthor = authorId === currentUserId;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    // You might want to refresh the post data here
  };

  if (isEditing) {
    return (
      <EditPostForm
        id={id}
        initialTitle={title}
        initialDescription={description}
        initialPostImage={postImage}
        authorName={authorName}
        authorAvatar={authorAvatar}
        createdAt={createdAt}
        onEditComplete={handleEditComplete}
      />
    );
  }

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
        {isAuthor && (
          <Button variant="outline" onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="mb-4">{description}</p>
        {postImage && (
          <div className="relative h-64 w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${postImage}`}
              alt={title}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-md"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
