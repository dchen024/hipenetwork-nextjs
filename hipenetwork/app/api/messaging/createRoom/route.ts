import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createClient();

    // Parse request body
    const body = await request.json();
    const { name, participants } = body;

    if (!participants || !Array.isArray(participants)) {
      return NextResponse.json(
        { error: "Invalid participants data" },
        { status: 400 },
      );
    }

    // Create room
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({ name })
      .select()
      .single();

    if (roomError) {
      console.error("Room creation error:", roomError);
      return NextResponse.json(
        { error: "Failed to create room" },
        { status: 500 },
      );
    }

    // Add participants
    const participantEntries = participants.map((userId) => ({
      room_id: room.id,
      user_id: userId,
    }));

    const { error: participantsError } = await supabase
      .from("room_participants")
      .insert(participantEntries);

    if (participantsError) {
      console.error("Participant addition error:", participantsError);
      return NextResponse.json(
        { error: "Failed to add participants" },
        { status: 500 },
      );
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
