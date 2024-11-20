"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabaseClient";
import { User } from "@supabase/supabase-js";

interface Participant {
  id: string;
  email: string;
  searchInput: string;
}

interface SearchResult {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export default function NewChatForm() {
  const [roomName, setRoomName] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "", email: "", searchInput: "" },
  ]);
  const [searchResults, setSearchResults] = useState<{
    [key: number]: SearchResult[];
  }>({});
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
    setParticipants((prev) => [
      ...prev,
      { id: "", email: "", searchInput: "" },
    ]);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
    setSearchResults((prev) => {
      const newResults = { ...prev };
      delete newResults[index];
      return newResults;
    });
  };

  const debouncedSearch = useCallback(
    async (index: number, searchValue: string) => {
      if (searchValue.trim().length < 3 || !currentUser) {
        setSearchResults((prev) => ({ ...prev, [index]: [] }));
        return;
      }

      try {
        const response = await fetch(
          `/api/users/search?search=${encodeURIComponent(searchValue)}&userId=${currentUser.id}`,
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        setSearchResults((prev) => ({ ...prev, [index]: data }));
      } catch (err) {
        console.error("Error searching users:", err);
      }
    },
    [currentUser],
  );

  const handleParticipantSearch = (index: number, searchValue: string) => {
    setParticipants((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, searchInput: searchValue } : p,
      ),
    );
  };

  useEffect(() => {
    const timeouts: { [key: number]: NodeJS.Timeout } = {};

    participants.forEach((participant, index) => {
      if (participant.searchInput.trim().length >= 3) {
        timeouts[index] = setTimeout(() => {
          debouncedSearch(index, participant.searchInput);
        }, 500);
      } else {
        setSearchResults((prev) => ({ ...prev, [index]: [] }));
      }
    });

    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout));
    };
  }, [participants, debouncedSearch]);

  const handleSelectUser = (index: number, user: SearchResult) => {
    setParticipants((prev) =>
      prev.map((p, i) =>
        i === index
          ? { id: user.id, email: user.email, searchInput: user.email }
          : p,
      ),
    );
    setSearchResults((prev) => ({ ...prev, [index]: [] }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!currentUser) {
      setError("You must be logged in to create a chat.");
      return;
    }

    const validParticipants = participants
      .filter((p) => p.id.trim() !== "")
      .map((p) => p.id);

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
          <div key={index} className="relative mb-2">
            <div className="flex items-center">
              <input
                type="text"
                value={participant.searchInput}
                onChange={(e) => handleParticipantSearch(index, e.target.value)}
                placeholder="Search by email"
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

            {/* Search Results Dropdown */}
            {searchResults[index]?.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {searchResults[index].map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectUser(index, result)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {result.email}
                    {result.first_name && result.last_name && (
                      <span className="text-gray-500">
                        {" "}
                        ({result.first_name} {result.last_name})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
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
