interface MessageProps {
  content: string;
  sender_id: string;
  created_at: string;
  isCurrentUser: boolean;
}

interface MessageProps {
  content: string;
  sender_id: string;
  created_at: string;
  isCurrentUser: boolean;
  avatarUrl?: string | null;
}

export default function Message({
  content,
  sender_id,
  created_at,
  isCurrentUser,
  avatarUrl,
}: MessageProps) {
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(
      timestamp.endsWith("Z") ? timestamp : timestamp + "Z",
    );
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex items-end gap-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {!isCurrentUser && (
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="object-cover w-8 h-8 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
              <span className="text-sm text-gray-600">
                {sender_id.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isCurrentUser
            ? "rounded-br-none bg-blue-500 text-white"
            : "rounded-bl-none bg-gray-200 text-gray-800"
        }`}
      >
        <p className="text-sm">{content}</p>
        <span className="block mt-1 text-xs opacity-70">
          {formatMessageTime(created_at)}
        </span>
      </div>

      {isCurrentUser && (
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="object-cover w-8 h-8 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
              <span className="text-sm text-gray-600">
                {sender_id.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
