"use client";

import { useState } from "react";
import type { RoutingDecision } from "@/lib/types";
import { CHARACTERS } from "@/lib/types";

interface RoutingInfoProps {
  routing: RoutingDecision;
}

export default function RoutingInfo({ routing }: RoutingInfoProps) {
  const [expanded, setExpanded] = useState(false);
  const target = CHARACTERS[routing.target_agent];
  const confidencePct = Math.round(routing.confidence * 100);

  return (
    <div
      className="rounded-lg px-3 py-2 text-sm cursor-pointer select-none"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: "var(--color-router)" }} className="font-medium">
          Router
        </span>
        <span style={{ color: "var(--color-text-secondary)" }}>{"-->"}</span>
        <span style={{ color: target?.color }}>
          {target?.emoji} {target?.name}
        </span>
        <span
          className="ml-1 px-1.5 py-0.5 rounded text-xs"
          style={{
            backgroundColor: "var(--color-bg-card)",
            color: "var(--color-text-secondary)",
          }}
        >
          {confidencePct}%
        </span>
        <span className="ml-auto text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {expanded ? "\u25B2" : "\u25BC"}
        </span>
      </div>

      {expanded && (
        <div className="mt-2 space-y-2">
          <p style={{ color: "var(--color-text-secondary)" }}>{routing.reasoning}</p>
          <pre
            className="p-2 rounded text-xs overflow-x-auto"
            style={{
              backgroundColor: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            {JSON.stringify(routing, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
