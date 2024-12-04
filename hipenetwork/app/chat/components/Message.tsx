import React, { useState } from "react";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageProps {
  content: string;
  sender_id: string;
  created_at: string;
  isCurrentUser: boolean;
  avatarUrl?: string | null;
  onEdit: (newContent: string) => void;
  onDelete: () => void;
}

export default function Message({
  content,
  sender_id,
  created_at,
  isCurrentUser,
  avatarUrl,
  onEdit,
  onDelete,
}: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    if (editedContent.trim() !== content) {
      onEdit(editedContent);
    }
    setIsEditing(false);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(
      timestamp.endsWith("Z") ? timestamp : timestamp + "Z",
    );
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this message?")) {
      onDelete();
    }
  };

  return (
    <div
      className={`flex items-end gap-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {!isCurrentUser && (
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="object-cover w-8 h-8 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
              <span className="text-sm text-gray-600">
                {sender_id.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      <div
        className={`relative max-w-[70%] rounded-lg px-4 py-2 ${
          isCurrentUser
            ? "rounded-br-none bg-blue-500 text-white"
            : "rounded-bl-none bg-gray-200 text-gray-800"
        }`}
      >
        <div className="pr-8">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 text-sm text-gray-800 border border-gray-200 rounded-md"
                rows={4}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEdit}
                  className="text-xs text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm">{content}</p>
              <span className="block mt-1 text-xs opacity-70">
                {formatMessageTime(created_at)}
              </span>
            </>
          )}
        </div>

        {isCurrentUser && (
          <div className="absolute right-1 top-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-8 h-8 p-0 text-white hover:bg-blue-600"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-gray-200 shadow-lg"
              >
                <DropdownMenuItem
                  onClick={() => {
                    setIsEditing(true);
                    setEditedContent(content);
                  }}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600 cursor-pointer hover:bg-gray-100"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {isCurrentUser && (
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="object-cover w-8 h-8 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
              <span className="text-sm text-gray-600">
                {sender_id.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
