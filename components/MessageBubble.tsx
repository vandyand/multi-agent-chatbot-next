"use client";

import { useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { CHARACTERS } from "@/lib/types";
import RoutingInfo from "./RoutingInfo";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [showJson, setShowJson] = useState(false);

  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 bg-accent text-white">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // Router message
  if (message.character === "router" && message.routingData) {
    return (
      <div className="flex justify-start mb-2">
        <div className="max-w-[85%]">
          <RoutingInfo routing={message.routingData} />
        </div>
      </div>
    );
  }

  // Character message
  const charId = message.character;
  const charInfo = charId && charId !== "router" ? CHARACTERS[charId] : null;
  const borderColor = charInfo ? charInfo.color : "var(--color-border)";

  return (
    <div className="flex justify-start mb-4 gap-3">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
        style={{ backgroundColor: "var(--color-bg-card)", border: `2px solid ${borderColor}` }}
      >
        {charInfo?.emoji || "\u{1F916}"}
      </div>

      {/* Message bubble */}
      <div className="max-w-[75%]">
        {charInfo && (
          <p className="text-sm font-semibold mb-1" style={{ color: borderColor }}>
            {charInfo.name}
          </p>
        )}
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3"
          style={{
            backgroundColor: "var(--color-bg-card)",
            borderLeft: `3px solid ${borderColor}`,
          }}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Raw JSON toggle */}
        {message.responseData && (
          <div className="mt-1">
            <button
              onClick={() => setShowJson(!showJson)}
              className="text-xs hover:underline"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {showJson ? "Hide" : "Show"} raw JSON
            </button>
            {showJson && (
              <pre
                className="mt-1 p-3 rounded-lg text-xs overflow-x-auto"
                style={{
                  backgroundColor: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {JSON.stringify(message.responseData, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
