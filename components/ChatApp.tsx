"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage, RoutingDecision, ApiResponse } from "@/lib/types";
import { CHARACTERS } from "@/lib/types";
import Sidebar from "./Sidebar";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Convert chat messages to LLM conversation format.
 * Includes character labels so agents know who said what.
 * Ported from app.py format_history_for_agents().
 */
function formatHistoryForAgents(
  messages: ChatMessage[]
): { role: string; content: string }[] {
  const history: { role: string; content: string }[] = [];
  for (const msg of messages) {
    if (msg.role === "user") {
      history.push({ role: "user", content: msg.content });
    } else if (msg.character === "router") {
      continue; // Router decisions are UI-only
    } else {
      const charId = msg.character as string | undefined;
      const charInfo =
        charId && charId in CHARACTERS
          ? CHARACTERS[charId as keyof typeof CHARACTERS]
          : null;
      const label = charInfo ? charInfo.name : "unknown";
      history.push({
        role: "assistant",
        content: `[${label}]: ${msg.content}`,
      });
    }
  }
  return history;
}

export default function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastRouting, setLastRouting] = useState<RoutingDecision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (userMessage: string) => {
    setError(null);

    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: userMessage,
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Build history (exclude the message we just added)
    const history = formatHistoryForAgents(messages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      // Add router message
      const routerMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        character: "router",
        content: "",
        routingData: data.routing,
      };

      // Add character response
      const charMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.response.message,
        character: data.character,
        characterNote: data.response.character_note,
        responseData: data.response,
      };

      setMessages([...updatedMessages, routerMsg, charMsg]);
      setLastRouting(data.routing);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
      // Remove the user message since response failed
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      <Sidebar
        lastRouting={lastRouting}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <header
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {"\u2630"}
          </button>
          <h1 className="text-lg font-bold">{"\u{1F3E5}"} Wellness Crew Chat</h1>
          <p className="text-sm hidden sm:block" style={{ color: "var(--color-text-secondary)" }}>
            Chat with your wellness team &mdash; Coach, Chef, Sage, and Doc
          </p>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 chat-messages">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-5xl">{"\u{1F3E5}"}</div>
              <h2 className="text-xl font-semibold">Welcome to Wellness Crew</h2>
              <p
                className="max-w-md text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Ask anything about fitness, nutrition, mindfulness, or health.
                Our AI router will automatically pick the best character to help you.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {Object.values(CHARACTERS).map((char) => (
                  <span
                    key={char.id}
                    className="px-3 py-1.5 rounded-full text-xs"
                    style={{
                      backgroundColor: "var(--color-bg-card)",
                      border: `1px solid var(--color-border)`,
                      color: char.color,
                    }}
                  >
                    {char.emoji} {char.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4 gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  border: "2px solid var(--color-border)",
                }}
              >
                {"\u{1F914}"}
              </div>
              <div
                className="rounded-2xl rounded-tl-sm px-4 py-3"
                style={{ backgroundColor: "var(--color-bg-card)" }}
              >
                <div className="flex gap-1.5 items-center">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: "var(--color-text-secondary)", animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: "var(--color-text-secondary)", animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: "var(--color-text-secondary)", animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              className="mx-auto max-w-lg rounded-lg px-4 py-3 text-sm mb-4"
              style={{
                backgroundColor: "rgba(255, 107, 107, 0.1)",
                border: "1px solid var(--color-doc)",
                color: "var(--color-doc)",
              }}
            >
              <p className="font-semibold mb-1">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
