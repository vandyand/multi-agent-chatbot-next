export type CharacterId = "coach" | "chef" | "sage" | "doc";

export interface CharacterInfo {
  id: CharacterId;
  emoji: string;
  name: string;
  domain: string;
  color: string;
}

export interface RoutingDecision {
  target_agent: CharacterId;
  confidence: number;
  reasoning: string;
}

export interface ChatResponse {
  message: string;
  character_note: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  character?: CharacterId | "router";
  routingData?: RoutingDecision;
  responseData?: ChatResponse;
  characterNote?: string;
}

export interface ApiRequest {
  message: string;
  history: { role: string; content: string }[];
}

export interface ApiResponse {
  routing: RoutingDecision;
  response: ChatResponse;
  character: CharacterId;
  error?: string;
}

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  coach: {
    id: "coach",
    emoji: "\u{1F3CB}\uFE0F",
    name: "Coach",
    domain: "Fitness & Exercise",
    color: "var(--color-coach)",
  },
  chef: {
    id: "chef",
    emoji: "\u{1F373}",
    name: "Chef",
    domain: "Nutrition & Diet",
    color: "var(--color-chef)",
  },
  sage: {
    id: "sage",
    emoji: "\u{1F9D8}",
    name: "Sage",
    domain: "Mindfulness & Stress",
    color: "var(--color-sage)",
  },
  doc: {
    id: "doc",
    emoji: "\u{1FA7A}",
    name: "Doc",
    domain: "General Health",
    color: "var(--color-doc)",
  },
};
