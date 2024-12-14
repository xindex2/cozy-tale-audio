interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
}

export function MessageBubble({ role, content, audioUrl }: MessageBubbleProps) {
  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-lg shadow-md ${
          role === "user"
            ? "bg-story-purple text-white"
            : "bg-white border border-gray-200"
        }`}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap mb-2">{content}</p>
        {audioUrl && (
          <div className="mt-2">
            <audio
              controls
              autoPlay
              className="w-full rounded-md"
              key={audioUrl}
            >
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}