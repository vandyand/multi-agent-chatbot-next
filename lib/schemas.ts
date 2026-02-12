/**
 * JSON schemas for OpenAI structured output.
 * Ported from the Python schemas/ directory.
 */

export const routingDecisionSchema = {
  title: "RoutingDecision",
  type: "object" as const,
  properties: {
    target_agent: {
      type: "string" as const,
      enum: ["coach", "chef", "sage", "doc"],
    },
    confidence: {
      type: "number" as const,
      minimum: 0,
      maximum: 1,
    },
    reasoning: {
      type: "string" as const,
    },
  },
  required: ["target_agent", "confidence", "reasoning"],
  additionalProperties: false,
};

export const chatResponseSchema = {
  title: "ChatResponse",
  type: "object" as const,
  properties: {
    message: {
      type: "string" as const,
    },
    character_note: {
      type: "string" as const,
    },
  },
  required: ["message", "character_note"],
  additionalProperties: false,
};
