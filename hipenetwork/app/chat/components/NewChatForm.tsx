"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function NewChatForm() {
  const [roomName, setRoomName] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [participants, setParticipants] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/login");
      } else {
        setCurrentUser(user);
      }
    };

    fetchUser();
  }, [router]);

  const handleAddParticipant = () => {
    setParticipants((prev) => [...prev, ""]);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleParticipantChange = (index: number, value: string) => {
    setParticipants((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!currentUser) {
      setError("You must be logged in to create a chat.");
      return;
    }

    const validParticipants = participants.filter((id) => id.trim() !== "");
    if (validParticipants.length < 1) {
      setError("You need at least one other participant.");
      return;
    }

    try {
      const response = await fetch("/api/messaging/createRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roomName || null,
          participants: [currentUser.id, ...validParticipants],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Failed to parse error response",
        }));
        throw new Error(errorData.error || "Failed to create chat room");
      }

      const data = await response.json();
      router.push(`/chat/${data.room.id}`);
    } catch (err) {
      console.error("Error creating chat:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create chat room",
      );
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">Create New Chat</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Room Name (Optional)
        </label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Participants</label>
        {participants.map((participant, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={participant}
              onChange={(e) => handleParticipantChange(index, e.target.value)}
              placeholder="Enter user ID"
              className="flex-grow px-4 py-2 border rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveParticipant(index)}
              className="ml-2 text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddParticipant}
          className="mt-2 text-blue-500"
        >
          + Add Participant
        </button>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded"
      >
        Create Chat
      </button>
    </div>
  );
}
