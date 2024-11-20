import ChatHistory from "./components/ChatHistory";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 border-r bg-white">
        <ChatHistory />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
