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

document.querySelector("#ask").addEventListener("click", async () => {
  const prompt = document.querySelector("#prompt").value.trim();
  const resultBox = document.querySelector("#result");

  resultBox.textContent = "Loading...";

  try {
    const answer = await askGemini(prompt);
    resultBox.textContent = answer;
  } catch (err) {
    resultBox.textContent = "Error: " + err.message;
  }
});
