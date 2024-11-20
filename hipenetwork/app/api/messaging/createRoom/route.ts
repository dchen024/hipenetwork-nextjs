import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { participants } = await request.json();

    // console.log("Received participants:", participants);

    if (!participants || !Array.isArray(participants)) {
      return NextResponse.json(
        { error: "Invalid participants data" },
        { status: 400 },
      );
    }

    // Fetch user names
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, first_name, last_name")
      .in("id", participants);

    // console.log("Fetched users:", users);

    if (usersError) {
      console.error("Users fetch error:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch user names" },
        { status: 500 },
      );
    }

    // Verify we fetched all users
    if (!users || users.length !== participants.length) {
      console.error("Not all users were fetched", {
        fetchedCount: users?.length,
        expectedCount: participants.length,
        fetchedIds: users?.map((u) => u.id),
        expectedIds: participants,
      });
      return NextResponse.json(
        { error: "Some users could not be found" },
        { status: 400 },
      );
    }

    // Create room name from participant names
    const roomName = users
      .map((user) => `${user.first_name} ${user.last_name}`.trim())
      .sort()
      .join(", ");

    // console.log("Generated room name:", roomName);

    // Create room with generated name
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({ name: roomName })
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

    // console.log("Adding participants:", participantEntries);

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
