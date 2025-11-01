import { streamText } from "ai";
import { charLimit } from "../../../constants";

const {
  note: {
    description: { maxAI: maxDescription },
  },
} = charLimit;

export async function POST(request) {
  const { prompt } = await request.json();

  const result = streamText({
    model: "openai/gpt-oss-20b",
    providerOptions: { gateway: { order: ["groq"] } },
    system: `
      You are an AI text refinement model.

      Your task is to analyze and improve the given text input.
      Follow these strict rules:

      1. Preserve all meaning and critical information from the input.
      2. Do not exceed ${maxDescription} characters.
      3. Beautify, improve readability, and enhance flow only if it does not increase the length unnecessarily or distort meaning.
      4. Aggressively remove redundancy, filler words, repeated phrases, and unnecessary words.
      5. Summarize intelligently by merging related ideas into concise, clear sentences without losing semantic detail.
      6. Use precise language and maintain a professional, logical tone.
      7. If the input is already concise, only make light readability improvements.

      Output only the improved text, no explanations or commentary.
    `,
    prompt,
  });

  return result.toUIMessageStreamResponse();
}
