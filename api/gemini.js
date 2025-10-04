const DEFAULT_MODEL = "gemini-1.5-flash-latest";
const DEFAULT_API_BASE = "https://generativelanguage.googleapis.com";
const DEFAULT_API_VERSION = "v1beta";
const DEFAULT_API_METHOD = "generateContent";

function getTrimmedEnv(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : undefined;
}

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  const apiKey = getTrimmedEnv("GEMINI_API_KEY");

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server misconfiguration: missing GEMINI_API_KEY" });
  }

  const { endpoint, headers } = resolveRequestConfig(apiKey);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.error?.message || data?.message || `Gemini API error ${response.status}`;
      return res.status(response.status).json({ error: errorMessage });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
