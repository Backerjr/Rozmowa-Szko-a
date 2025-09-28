document.getElementById("ask").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const resultBox = document.getElementById("result");

  resultBox.textContent = "🌙 Thinking...";

  try {
    const response = await fetch("/api/gemini", {
      method: "POST",   // 👈 MUST be POST
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })  // 👈 Send prompt in body
    });

    if (!response.ok) {
      throw new Error("Server error " + response.status);
    }

    const data = await response.json();
    resultBox.textContent = data.text || "Gemini returned no text.";
  } catch (err) {
    resultBox.textContent = "⚠️ Error: " + err.message;
  }
});
