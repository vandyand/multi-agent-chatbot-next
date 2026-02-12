"use client";

import type { RoutingDecision } from "@/lib/types";
import { CHARACTERS } from "@/lib/types";

interface SidebarProps {
  lastRouting: RoutingDecision | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ lastRouting, isOpen, onClose }: SidebarProps) {
  const characterList = Object.values(CHARACTERS);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 shrink-0 flex flex-col
          overflow-y-auto transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Wellness Crew</h1>
            <button
              onClick={onClose}
              className="lg:hidden text-xl"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {"\u2715"}
            </button>
          </div>

          {/* Characters */}
          <div className="space-y-2">
            {characterList.map((char) => (
              <div
                key={char.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm"
                style={{ backgroundColor: "var(--color-bg-card)" }}
              >
                <span className="text-lg">{char.emoji}</span>
                <div>
                  <span className="font-semibold" style={{ color: char.color }}>
                    {char.name}
                  </span>
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    {" "}&mdash; {char.domain}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <hr style={{ borderColor: "var(--color-border)" }} />

          {/* Last Routing */}
          {lastRouting && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                  Last Routing
                </h3>
                <div className="text-sm">
                  <p>
                    <span style={{ color: "var(--color-router)" }}>{"-->"} </span>
                    <span style={{ color: CHARACTERS[lastRouting.target_agent]?.color }}>
                      {CHARACTERS[lastRouting.target_agent]?.emoji}{" "}
                      {CHARACTERS[lastRouting.target_agent]?.name}
                    </span>
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      {" "}({Math.round(lastRouting.confidence * 100)}%)
                    </span>
                  </p>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {lastRouting.reasoning}
                  </p>
                </div>
              </div>
              <hr style={{ borderColor: "var(--color-border)" }} />
            </>
          )}

          {/* Architecture */}
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
              Architecture
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              A <strong className="text-text-primary">router agent</strong> analyzes each message and
              picks the best character to respond. All characters share conversation context &mdash;
              they can reference what other characters have said.
            </p>
            <p className="text-xs leading-relaxed mt-2" style={{ color: "var(--color-text-secondary)" }}>
              Each agent uses <strong className="text-text-primary">schema-driven structured output</strong>{" "}
              via the OpenAI Responses API for reliable, typed responses.
            </p>
          </div>

          <hr style={{ borderColor: "var(--color-border)" }} />

          {/* Links */}
          <div className="space-y-2">
            <a
              href="https://github.com/vandyand/multi-agent-chatbot-next"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm hover:underline"
              style={{ color: "var(--color-accent)" }}
            >
              View Source on GitHub
            </a>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Built with OpenAI Responses API + Next.js
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
