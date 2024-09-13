"use client";
import { useState } from "react";
import { openai } from "@/lib/openai/openai";
import { signOut } from "next-auth/react";
import { useSignOut } from "@/lib/hooks/useSignOut";

const App = () => {
  const [name, setName] = useState("");
  const [response, setResponse] = useState<string | null>("");
  const signOut = useSignOut(
    typeof window != "undefined" ? window.location.origin : ""
  );
  const handleSignOut = async () => {
    await signOut();
  };

  const handleName = (e: any) => {
    setName(e.target.value);
  };

  const handleGenerate = async () => {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `${name}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    setResponse(response?.choices[0]?.message?.content);
  };

  return (
    <div>
      <h1>OpenAI GPT-3</h1>
      <input type="text" value={name} onChange={handleName} />
      <button onClick={handleGenerate}>Generate</button>
      <p>{response ? response : "Press the button to generate text."}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};
export default App;
