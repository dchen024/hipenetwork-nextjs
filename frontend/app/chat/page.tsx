"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TypingText from "@/components/TypingText";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/supabaseClient";
import { User } from "@supabase/supabase-js";
import NavBar from "@/components/NavBar";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const selectedSchool = searchParams.get("school") || "CCNY";
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Set up realtime subscription for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    setMessages([
      {
        text: `Welcome to the ${selectedSchool} guide! How can I assist you today?`,
        sender: "bot",
      },
    ]);
  }, [selectedSchool]);

  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true);
      const userMessage = { text: input, sender: "user" as const };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            school: selectedSchool,
          }),
        });

        if (!response.ok) throw new Error("Failed to send message");
        const data = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data || "No response", sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, I encountered an error. Please try again.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        text: `Welcome to the ${selectedSchool} guide! How can I assist you today?`,
        sender: "bot",
      },
    ]);
  };

  return (
    <>
      <NavBar />
      <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-800">
        {/* Sidebar */}
        <div className="hidden w-[260px] flex-col bg-gray-100 dark:bg-gray-900 md:flex">
          <div className="flex flex-col h-full min-h-0">
            <div className="flex h-[60px] items-center justify-start border-b border-gray-200 px-4 dark:border-gray-700/50">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {user ? (
                  <>Hello {user.user_metadata.full_name || user.email} 👋</>
                ) : (
                  "Welcome 👋"
                )}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <Button
                onClick={startNewChat}
                variant="outline"
                className="justify-start w-full gap-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New chat
              </Button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1">
          <div className="flex h-[60px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700/50">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {selectedSchool
                ? `${selectedSchool.toUpperCase()} Guide`
                : "Select a School"}
            </h2>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-6 mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`group mb-6 flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex items-center justify-center text-sm text-white bg-teal-500 rounded-full h-7 w-7">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] flex-1 overflow-x-auto ${
                      message.sender === "user" ? "text-right" : ""
                    }`}
                  >
                    {message.sender === "bot" ? (
                      <TypingText
                        text={message.text}
                        className="prose text-gray-800 dark:prose-invert max-w-none dark:text-gray-100"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-gray-100">
                        {message.text}
                      </p>
                    )}
                  </div>
                  {message.sender === "user" && (
                    <div className="flex items-center justify-center text-sm text-white bg-gray-500 rounded-full h-7 w-7">
                      U
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700/50">
            <div className="p-4 mx-auto">
              <div className="relative flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message the AI..."
                  className="pr-24 bg-white border border-gray-200 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute text-white bg-gray-800 right-2 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                  size="sm"
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 rotate-90"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                AI may produce inaccurate information. Consider checking
                important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
