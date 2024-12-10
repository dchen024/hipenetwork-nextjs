import ChatHistory from "./components/ChatHistory";
import NavBar from "@/components/NavBar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <NavBar />
      <div className="flex flex-1">
        <div className="w-80 border-r bg-white">
          <ChatHistory />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
