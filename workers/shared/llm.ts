import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  return _client;
}

/** Cheap bulk filtering with Haiku. Returns raw text. */
export async function filterBulk(
  items: string[],
  systemPrompt: string,
  model: string = "claude-haiku-4-5-20251001",
): Promise<string> {
  const msg = await getClient().messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: items.join("\n") }],
  });
  return (msg.content[0] as Anthropic.TextBlock).text;
}

/** Richer summarization with Sonnet. */
export async function summarize(
  text: string,
  instruction: string,
  model: string = "claude-sonnet-4-6",
): Promise<string> {
  const msg = await getClient().messages.create({
    model,
    max_tokens: 2048,
    messages: [{ role: "user", content: `${instruction}\n\n---\n\n${text}` }],
  });
  return (msg.content[0] as Anthropic.TextBlock).text;
}

/** Parse a JSON array out of an LLM response (handles surrounding prose). */
export function parseJsonArray<T = Record<string, unknown>>(raw: string): T[] {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  if (start === -1 || end === 0) return [];
  return JSON.parse(raw.slice(start, end)) as T[];
}
