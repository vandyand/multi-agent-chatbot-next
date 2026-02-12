import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ROUTER_SYSTEM_PROMPT, CHARACTER_PROMPTS } from "@/lib/agents";
import { routingDecisionSchema, chatResponseSchema } from "@/lib/schemas";
import type { RoutingDecision, ChatResponse, CharacterId } from "@/lib/types";

const MODEL = process.env.PIPELINE_LLM_MODEL || "gpt-4.1-nano";

/**
 * Recursively ensure strict mode on a JSON schema for OpenAI structured output.
 * Ported from llm.py _ensure_strict().
 */
function ensureStrict(schema: Record<string, unknown>): Record<string, unknown> {
  if (typeof schema !== "object" || schema === null) return schema;
  const result = { ...schema };

  if (
    result.properties &&
    typeof result.properties === "object" &&
    !Array.isArray(result.properties)
  ) {
    if (!("additionalProperties" in result)) {
      result.additionalProperties = false;
    }
    const props = result.properties as Record<string, unknown>;
    const existingRequired = (result.required as string[]) || [];
    const allKeys = Object.keys(props);
    result.required = [...new Set([...existingRequired, ...allKeys])].sort();
    const strictProps: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) {
      strictProps[k] = ensureStrict(v as Record<string, unknown>);
    }
    result.properties = strictProps;
  }

  if (result.items && typeof result.items === "object" && !Array.isArray(result.items)) {
    result.items = ensureStrict(result.items as Record<string, unknown>);
  }

  return result;
}

/**
 * Call OpenAI Responses API with structured JSON output.
 * Ported from llm.py OpenAIStructuredClient.complete().
 */
async function callOpenAI<T>(
  client: OpenAI,
  schema: Record<string, unknown>,
  prompt: string,
  systemPrompt: string,
  history?: { role: string; content: string }[]
): Promise<T> {
  const strictSchema = ensureStrict(schema);
  const schemaName = (strictSchema.title as string) || "structured_output";

  const messages: { role: string; content: string }[] = [];
  messages.push({ role: "system", content: systemPrompt });
  if (history) {
    messages.push(...history);
  }
  messages.push({ role: "user", content: prompt });

  const response = await client.responses.create({
    model: MODEL,
    input: messages as OpenAI.Responses.ResponseInputItem[],
    text: {
      format: {
        type: "json_schema",
        name: schemaName,
        strict: true,
        schema: strictSchema,
      },
    },
  });

  // Find the message output (skip reasoning items which have no content)
  for (const item of response.output) {
    if ("content" in item && item.content) {
      const contentItems = item.content as { text?: string }[];
      if (contentItems.length > 0 && contentItems[0].text) {
        return JSON.parse(contentItems[0].text) as T;
      }
    }
  }

  throw new Error("No message content in API response");
}

export async function POST(request: NextRequest) {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not configured. Add it in the Vercel dashboard under Settings > Environment Variables, then redeploy.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { message, history } = body as {
      message: string;
      history: { role: string; content: string }[];
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const client = new OpenAI();

    // Step 1: Route the message
    const routing = await callOpenAI<RoutingDecision>(
      client,
      routingDecisionSchema as Record<string, unknown>,
      message,
      ROUTER_SYSTEM_PROMPT,
      history
    );

    // Validate the target agent
    const validAgents: CharacterId[] = ["coach", "chef", "sage", "doc"];
    if (!validAgents.includes(routing.target_agent)) {
      routing.target_agent = "doc"; // Fallback to doc
    }

    // Step 2: Get the character response
    const characterPrompt = CHARACTER_PROMPTS[routing.target_agent];
    const response = await callOpenAI<ChatResponse>(
      client,
      chatResponseSchema as Record<string, unknown>,
      message,
      characterPrompt,
      history
    );

    return NextResponse.json({
      routing,
      response,
      character: routing.target_agent,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
