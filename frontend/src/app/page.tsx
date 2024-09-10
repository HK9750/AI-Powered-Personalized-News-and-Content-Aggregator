"use client";
import { useState } from "react";
import { openai } from "@/lib/openai";

const App = () => {
  const [name, setName] = useState("");
  const [response, setResponse] = useState<string | null>("");

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
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleGenerate}>Generate</button>
      <p>{response ? response : "Press the button to generate text."}</p>
    </div>
  );
};
export default App;
