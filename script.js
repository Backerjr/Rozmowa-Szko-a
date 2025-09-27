async function askGemini(prompt) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  return data.text;
}

document.querySelector("#ask").addEventListener("click", async () => {
  const prompt = document.querySelector("#prompt").value.trim();
  document.querySelector("#result").textContent = "Loading...";

  try {
    const answer = await askGemini(prompt);
    document.querySelector("#result").textContent = answer;
  } catch (e) {
    document.querySelector("#result").textContent = "Error: " + e.message;
  }
});
