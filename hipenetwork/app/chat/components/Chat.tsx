"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import Message from "./Message";
import { User } from "@supabase/supabase-js";

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  user?: {
    user_metadata?: {
      avatar_url?: string;
    };
  };
}

interface ChatProps {
  roomId: string;
}

export default function Chat({ roomId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          user:sender_id (
            id,
            user_metadata
          )
        `,
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data ?? []);

        // Create a map of user IDs to avatar URLs
        const avatars: Record<string, string> = {};
        data?.forEach((message) => {
          if (message.user?.user_metadata?.avatar_url) {
            avatars[message.sender_id] = message.user.user_metadata.avatar_url;
          }
        });
        setUserAvatars(avatars);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [roomId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          room_id: roomId,
          sender_id: currentUser.id,
          content: newMessage.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="mx-auto flex h-[80vh] max-w-2xl flex-col rounded-lg bg-white shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chat Room</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            content={msg.content}
            sender_id={msg.sender_id}
            created_at={msg.created_at}
            isCurrentUser={currentUser?.id === msg.sender_id}
            avatarUrl={
              userAvatars[msg.sender_id] ||
              currentUser?.user_metadata?.avatar_url
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
