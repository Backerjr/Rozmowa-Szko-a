export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // Extract the text safely
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(Gemini returned no text)";

    res.status(200).json({ text, raw: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
