export default async function handler(req, res) {
  // CORS (so Netlify frontend can call this)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt, model } = req.body || {};
    const modelName = model || "gemini-2.5-flash";

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt || "" }] }],
        }),
      }
    );

    const data = await resp.json();

    let text = "";
    if (data?.candidates?.[0]?.content?.parts?.length) {
      text = data.candidates[0].content.parts.map(p => p.text || "").join("");
    }

    return res.status(resp.ok ? 200 : resp.status).json({
      text: text || "(no text)",
      raw: data
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
