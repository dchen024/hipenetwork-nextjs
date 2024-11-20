"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChatRoom {
  id: string;
  name: string;
  updated_at: string;
  participants: {
    user_id: string;
    user: {
      first_name: string;
      last_name: string;
      profile_picture: string;
    };
  }[];
  messages: {
    content: string;
    created_at: string;
    sender: {
      first_name: string;
      last_name: string;
    };
  }[];
  latest_message_time: string;
}

export default function ChatHistory() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserAndRooms = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // First, get the latest message timestamp for each room
      const { data: latestMessages, error: latestMessagesError } =
        await supabase
          .from("messages")
          .select(
            `
          room_id,
          created_at
        `,
          )
          .in(
            "room_id",
            (
              await supabase
                .from("room_participants")
                .select("room_id")
                .eq("user_id", user.id)
            ).data?.map((rp) => rp.room_id) || [],
          )
          .order("created_at", { ascending: false });

      if (latestMessagesError) {
        console.error("Error fetching latest messages:", latestMessagesError);
        return;
      }

      // Create a map of room_id to latest message time
      const latestMessageTimes = new Map(
        latestMessages?.map((msg) => [msg.room_id, msg.created_at]),
      );

      // Fetch rooms with messages
      const { data: roomsData, error } = await supabase
        .from("rooms")
        .select(
          `
          id,
          name,
          updated_at,
          participants:room_participants(
            user_id,
            user:users(
              first_name,
              last_name,
              profile_picture
            )
          ),
          messages:messages(
            content,
            created_at,
            sender:users!messages_sender_id_fkey(
              first_name,
              last_name
            )
          )
        `,
        )
        .eq("room_participants.user_id", user.id);

      if (error) {
        console.error("Error fetching rooms:", error);
        return;
      }

      // Process and sort rooms by latest message time
      const processedRooms = roomsData
        .map((room) => ({
          ...room,
          latest_message_time:
            latestMessageTimes.get(room.id) || room.updated_at,
        }))
        .sort(
          (a, b) =>
            new Date(b.latest_message_time).getTime() -
            new Date(a.latest_message_time).getTime(),
        );

      setRooms(processedRooms);
    };

    fetchUserAndRooms();

    // Subscribe to both room and message updates
    const roomSubscription = supabase
      .channel("room-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        () => fetchUserAndRooms(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => fetchUserAndRooms(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomSubscription);
    };
  }, []);

  const getRoomDisplayName = (room: ChatRoom) => {
    if (room.name) return room.name;

    const otherParticipants = room.participants
      .filter((p) => p.user_id !== currentUserId)
      .map((p) => `${p.user.first_name} ${p.user.last_name}`);

    return otherParticipants.join(", ") || "Unnamed Chat";
  };

  const formatTimestamp = (timestamp: string) => {
    // Ensure we're parsing the UTC timestamp correctly by appending 'Z' if it's not already there
    const utcTimestamp = timestamp.endsWith("Z") ? timestamp : timestamp + "Z";
    const date = new Date(utcTimestamp);
    const now = new Date();

    const isToday = date.toLocaleDateString() === now.toLocaleDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.toLocaleDateString() === yesterday.toLocaleDateString();

    // Format time in local timezone
    const timeString = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return timeString;
    }

    if (isYesterday) {
      return `Yesterday ${timeString}`;
    }

    if (date.getFullYear() === now.getFullYear()) {
      // If same year, show "Mon 3:30 PM"
      return (
        date.toLocaleDateString([], {
          weekday: "short",
        }) +
        " " +
        timeString
      );
    }

    // If different year, show "Mar 15 3:30 PM"
    return (
      date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }) +
      " " +
      timeString
    );
  };

  return (
    <div className="h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="h-[calc(100%-4rem)] overflow-y-auto">
        {rooms.map((room) => {
          const lastMessage = room.messages?.[0];

          return (
            <Link key={room.id} href={`/chat/${room.id}`}>
              <div
                className={`cursor-pointer border-b p-4 hover:bg-gray-50 ${
                  pathname === `/chat/${room.id}` ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-medium">{getRoomDisplayName(room)}</div>
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(room.latest_message_time)}
                  </div>
                </div>
                {lastMessage && (
                  <div className="mt-1 text-sm text-gray-500 truncate">
                    <span className="font-medium">
                      {lastMessage.sender.first_name}:
                    </span>{" "}
                    {lastMessage.content}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
