const DEFAULT_MODEL = "gemini-1.5-flash-latest";
 codex/fix-deployment-not-found-error-kr0jn4
const DEFAULT_API_BASE = "https://generativelanguage.googleapis.com";
const DEFAULT_API_VERSION = "v1beta";
const DEFAULT_API_METHOD = "generateContent";

function getTrimmedEnv(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : undefined;
}



 codex/fix-deployment-not-found-error-hgq19b
 main
function normalizeModel(model) {
  if (!model) {
    return DEFAULT_MODEL;
  }

  const sanitized = model.trim();

  if (!sanitized) {
    return DEFAULT_MODEL;
  }

  const withoutPrefix = sanitized.replace(/^models\//i, "");
  const withoutSuffix = withoutPrefix.replace(/:generateContent$/i, "");

  return withoutSuffix || DEFAULT_MODEL;
}

<<<<<< codex/fix-deployment-not-found-error-kr0jn4
function stripTrailingSlashes(value) {
  return value.replace(/\/+$/g, "");
}

function stripWrappingSlashes(value) {
  return value.replace(/^\/+|\/+$/g, "");
}

function resolveModelPath(model) {
  const normalized = normalizeModel(model);

  if (
    /^projects\//i.test(normalized) ||
    /^locations\//i.test(normalized) ||
    /^publishers\//i.test(normalized)
  ) {
    return normalized;
  }

  if (normalized.includes("/")) {
    return normalized.replace(/^\/+/, "");
  }

  return `models/${normalized}`;
}

function getHost(value) {
  try {
    return new URL(value).hostname;
  } catch (error) {
    return value.replace(/^https?:\/\//i, "").split("/")[0];
  }
}

function isGoogleGenerativeHost(host) {
  return /(?:^|\.)generativelanguage\.googleapis\.com$/i.test(host);
}

function buildHeaders(apiKey, { usesQueryKey }) {
  const headers = { "Content-Type": "application/json" };

  if (!apiKey) {
    return headers;
  }

  const keyHeader = getTrimmedEnv("GEMINI_API_KEY_HEADER") || "x-goog-api-key";

  if (!usesQueryKey || keyHeader !== "query") {
    headers[keyHeader] = apiKey;
  }

  return headers;
}

function resolveRequestConfig(apiKey) {
  const explicitEndpoint = getTrimmedEnv("GEMINI_API_ENDPOINT");

  if (explicitEndpoint) {
    const headers = buildHeaders(apiKey, { usesQueryKey: false });

    return { endpoint: explicitEndpoint, headers };
  }

  const apiBase = stripTrailingSlashes(getTrimmedEnv("GEMINI_API_BASE") || DEFAULT_API_BASE);
  const apiVersion = stripWrappingSlashes(
    getTrimmedEnv("GEMINI_API_VERSION") || DEFAULT_API_VERSION
  );
  const apiMethod = getTrimmedEnv("GEMINI_API_METHOD") || DEFAULT_API_METHOD;
  const modelPath = resolveModelPath(getTrimmedEnv("GEMINI_MODEL"));

  const segments = [apiBase];

  if (apiVersion) {
    segments.push(apiVersion);
  }

  segments.push(modelPath);

  let endpoint = segments.join("/");

  if (apiMethod) {
    endpoint += `:${apiMethod.replace(/^:+/, "")}`;
  }

  const host = getHost(apiBase);
  const usesQueryKey = isGoogleGenerativeHost(host);

  if (usesQueryKey) {
    const separator = endpoint.includes("?") ? "&" : "?";
    endpoint += `${separator}key=${encodeURIComponent(apiKey)}`;
  }

  const headers = buildHeaders(apiKey, { usesQueryKey });

  return { endpoint, headers };
}



 main
 main
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

 codex/fix-deployment-not-found-error-kr0jn4
  const apiKey = getTrimmedEnv("GEMINI_API_KEY");

  if (!apiKey) {

  if (!process.env.GEMINI_API_KEY) {
 main
    return res
      .status(500)
      .json({ error: "Server misconfiguration: missing GEMINI_API_KEY" });
  }

 codex/fix-deployment-not-found-error-kr0jn4
  const { endpoint, headers } = resolveRequestConfig(apiKey);

 codex/fix-deployment-not-found-error-hgq19b
  const model = normalizeModel(process.env.GEMINI_MODEL);

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
 main
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
 main

  try {
    const response = await fetch(endpoint, {
      method: "POST",
 codex/fix-deployment-not-found-error-kr0jn4
      headers,

      headers: { "Content-Type": "application/json" },
 main
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
 codex/fix-deployment-not-found-error-kr0jn4
      const errorMessage =
        data?.error?.message || data?.message || `Gemini API error ${response.status}`;

      const errorMessage = data?.error?.message || `Gemini API error ${response.status}`;
 main
      return res.status(response.status).json({ error: errorMessage });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
