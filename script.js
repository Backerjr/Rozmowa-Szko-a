document.getElementById("ask").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const resultBox = document.getElementById("result");

  resultBox.textContent = "✨ Thinking...";

  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) throw new Error("Server error " + response.status);

    const data = await response.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.text ||
      "(Gemini returned no text)";

    resultBox.textContent = answer;
  } catch (err) {
    resultBox.textContent = "⚠️ Error: " + err.message;
  }
});
