import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPNEAI_API,
  dangerouslyAllowBrowser: true,
});
