module.exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await resp.json();

    let text = "";
    if (
      data?.candidates &&
      data.candidates[0]?.content?.parts?.length > 0
    ) {
      text = data.candidates[0].content.parts
        .map((p) => p.text || "")
        .join("");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        text: text || "(Gemini returned no text)",
        raw: data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
