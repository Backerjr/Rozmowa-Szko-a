async function askGemini(prompt) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Server error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  return data.text || "No response from Gemini.";
}
