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
    profile_picture?: string;
  };
}

interface ChatProps {
  roomId: string;
}

interface RoomParticipant {
  user_id: string;
  room_id: string;
}

interface UserProfile {
  id: string;
  profile_picture: string;
}

const MESSAGES_PER_PAGE = 20;

export default function Chat({ roomId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [participantProfiles, setParticipantProfiles] = useState<
    Record<string, string>
  >({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingHistory = useRef(false);

  const scrollToBottom = () => {
    if (!isLoadingHistory.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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
    const fetchInitialMessages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select(
            `
            *,
            user:users!messages_sender_id_fkey (
              id,
              profile_picture
            )
          `,
          )
          .eq("room_id", roomId)
          .order("created_at", { ascending: true })
          .limit(MESSAGES_PER_PAGE);

        if (error) throw error;

        if (data) {
          setMessages(data);
          setHasMore(data.length === MESSAGES_PER_PAGE);
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMessages();

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
            setTimeout(() => {
              scrollToBottom();
            }, 100);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [roomId]);

  useEffect(() => {
    const fetchParticipantProfiles = async () => {
      try {
        const { data: participants, error: participantsError } = await supabase
          .from("room_participants")
          .select("user_id")
          .eq("room_id", roomId);

        if (participantsError) throw participantsError;

        if (participants) {
          const userIds = participants.map((p) => p.user_id);

          const { data: profiles, error: profilesError } = await supabase
            .from("users")
            .select("id, profile_picture")
            .in("id", userIds);

          if (profilesError) throw profilesError;

          if (profiles) {
            const profileMap = profiles.reduce(
              (acc, profile) => ({
                ...acc,
                [profile.id]: profile.profile_picture,
              }),
              {},
            );

            setParticipantProfiles(profileMap);
          }
        }
      } catch (error) {
        console.error("Error fetching participant profiles:", error);
      }
    };

    fetchParticipantProfiles();
  }, [roomId]);

  const loadMoreMessages = async () => {
    if (!hasMore || isLoading || messages.length === 0) return;

    setIsLoading(true);
    isLoadingHistory.current = true;

    try {
      const container = messagesContainerRef.current;
      const oldScrollHeight = container?.scrollHeight || 0;
      const oldScrollTop = container?.scrollTop || 0;

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          user:users!messages_sender_id_fkey (
            id,
            profile_picture
          )
        `,
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .lt("created_at", messages[0].created_at)
        .limit(MESSAGES_PER_PAGE);

      if (error) throw error;

      if (data) {
        setMessages((prevMessages) => [...data.reverse(), ...prevMessages]);
        setHasMore(data.length === MESSAGES_PER_PAGE);

        requestAnimationFrame(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            const newScrollTop =
              newScrollHeight - oldScrollHeight + oldScrollTop;
            container.scrollTop = newScrollTop;
          }
        });
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        isLoadingHistory.current = false;
      }, 100);
    }
  };

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
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto"
      >
        {hasMore && (
          <button
            onClick={loadMoreMessages}
            className="w-full py-2 text-blue-500 hover:text-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        )}
        {messages.map((msg) => (
          <Message
            key={msg.id}
            content={msg.content}
            sender_id={msg.sender_id}
            created_at={msg.created_at}
            isCurrentUser={currentUser?.id === msg.sender_id}
            avatarUrl={participantProfiles[msg.sender_id]}
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
