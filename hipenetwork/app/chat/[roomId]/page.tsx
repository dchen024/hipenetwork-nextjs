import Chat from "../components/Chat";

export default function ChatPage({ params }: { params: { roomId: string } }) {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <Chat roomId={params.roomId} />
    </div>
  );
}
