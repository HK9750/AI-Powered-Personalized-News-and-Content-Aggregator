import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENI_API,
  dangerouslyAllowBrowser: true,
});
