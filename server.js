import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DEFAULT_PROVIDER = "gemini";
const DEFAULT_MODELS = {
  gemini: "gemini-2.0-flash",
  groq: "llama-3.1-70b-versatile"
};

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeProviderName(value) {
  const provider = normalizeString(value).toLowerCase();
  return provider === "groq" ? "groq" : "gemini";
}

function getProviderName() {
  return normalizeProviderName(process.env.AI_PROVIDER || DEFAULT_PROVIDER);
}

function getProviderModel(provider = getProviderName()) {
  const normalizedProvider = normalizeProviderName(provider);
  return normalizeString(process.env[`${normalizedProvider.toUpperCase()}_MODEL`]) ||
    DEFAULT_MODELS[normalizedProvider];
}

function getProviderApiKey(provider = getProviderName()) {
  const normalizedProvider = normalizeProviderName(provider);
  const envKey = `${normalizedProvider.toUpperCase()}_API_KEY`;
  return normalizeString(process.env[envKey]);
}

function getProviderErrorMessage(provider = getProviderName()) {
  const normalizedProvider = normalizeProviderName(provider);
  const envKey = `${normalizedProvider.toUpperCase()}_API_KEY`;
  return `${envKey} is missing. Add it to your .env file.`;
}

function buildProviderUrl(provider, model, apiKey) {
  if (provider === "groq") {
    return "https://api.groq.com/openai/v1/chat/completions";
  }

  const safeModel = encodeURIComponent(model);
  const safeKey = encodeURIComponent(apiKey);
  return `https://generativelanguage.googleapis.com/v1beta/models/${safeModel}:generateContent?key=${safeKey}`;
}

function buildProviderHeaders(provider, apiKey) {
  if (provider === "groq") {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    };
  }

  return {
    "Content-Type": "application/json"
  };
}

function buildProviderBody(provider, payload) {
  const { model, instructions, input, temperature = 0.2 } = payload;

  if (provider === "groq") {
    return {
      model,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: input }
      ],
      temperature,
      response_format: { type: "json_object" }
    };
  }

  return {
    systemInstruction: {
      parts: [{ text: instructions }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: input }]
      }
    ],
    generationConfig: {
      temperature,
      responseMimeType: "application/json"
    }
  };
}

function extractProviderText(provider, responseJson) {
  if (provider === "groq") {
    return responseJson?.choices?.[0]?.message?.content || "";
  }

  return (
    responseJson?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("") || ""
  );
}

function extractProviderResponseId(provider, responseJson) {
  return responseJson?.id || responseJson?.responseId || "";
}

function safeJsonParse(text) {
  const sourceText = String(text || "").trim();

  if (!sourceText) {
    const error = new Error("AI response could not be processed.");
    error.code = "AI_JSON_PARSE_ERROR";
    throw error;
  }

  const codeBlockMatch = sourceText.match(/```json\s*([\s\S]*?)```|```\s*([\s\S]*?)```/i);
  const candidateText = (codeBlockMatch?.[1] || codeBlockMatch?.[2] || sourceText).trim();

  try {
    return JSON.parse(candidateText);
  } catch {
    let startIndex = -1;
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let index = 0; index < candidateText.length; index += 1) {
      const char = candidateText[index];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if (char === "{") {
        if (depth === 0) {
          startIndex = index;
        }
        depth += 1;
        continue;
      }

      if (char === "}") {
        if (depth > 0) {
          depth -= 1;
          if (depth === 0 && startIndex !== -1) {
            const jsonText = candidateText.slice(startIndex, index + 1);
            try {
              return JSON.parse(jsonText);
            } catch {
              startIndex = -1;
            }
          }
        }
      }
    }
  }

  const error = new Error("AI response could not be processed.");
  error.code = "AI_JSON_PARSE_ERROR";
  throw error;
}

function sendAiParseError(res) {
  res.status(500).json({
    error: true,
    message: "AI response could not be processed."
  });
}

async function readJsonResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      rawText: text
    };
  }
}

function normalizeThemes(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeString(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => normalizeString(item))
      .filter(Boolean);
  }

  return [];
}

function normalizeTravelOptionsRequest(body = {}) {
  return {
    hasCountry: body.hasCountry === true || body.hasCountry === "true",
    country: normalizeString(body.country),
    city: normalizeString(body.city),
    themes: normalizeThemes(body.themes),
    travelDate: normalizeString(body.travelDate),
    duration: normalizeString(body.duration),
    companions: normalizeString(body.companions),
    budget: normalizeString(body.budget),
    notes: normalizeString(body.notes)
  };
}

function normalizeSelectedOptions(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((option, index) => ({
    id: normalizeString(option?.id) || `option-${index + 1}`,
    label: normalizeString(option?.label) || String.fromCharCode(65 + index),
    country: normalizeString(option?.country),
    city: normalizeString(option?.city),
    theme: normalizeString(option?.theme),
    pros: Array.isArray(option?.pros) ? option.pros.map((item) => normalizeString(item)).filter(Boolean) : [],
    cons: Array.isArray(option?.cons) ? option.cons.map((item) => normalizeString(item)).filter(Boolean) : []
  }));
}

function normalizeTravelDetailsRequest(body = {}) {
  return {
    selectedOptions: normalizeSelectedOptions(body.selectedOptions),
    travelDate: normalizeString(body.travelDate),
    duration: normalizeString(body.duration),
    companions: normalizeString(body.companions),
    budget: normalizeString(body.budget),
    themes: normalizeThemes(body.themes),
    notes: normalizeString(body.notes)
  };
}

function normalizeDetailedPlans(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeAppStateSummary(value = {}) {
  return {
    hasCountry: value.hasCountry === true || value.hasCountry === "true",
    country: normalizeString(value.country),
    city: normalizeString(value.city),
    themes: normalizeThemes(value.themes),
    travelDate: normalizeString(value.travelDate),
    duration: normalizeString(value.duration),
    companions: normalizeString(value.companions),
    budget: normalizeString(value.budget),
    notes: normalizeString(value.notes)
  };
}

function normalizeTravelReviseRequest(body = {}) {
  return {
    detailedPlans: normalizeDetailedPlans(body.detailedPlans),
    revisionText: normalizeString(body.revisionText),
    appState: normalizeAppStateSummary(body.appState)
  };
}

function buildTravelOptionsInstructions() {
  return [
    "You create travel options for the WHERE TO GO app.",
    "Return JSON only.",
    "Do not return markdown.",
    "Do not return code fences.",
    "Do not return any explanation outside the JSON object.",
    "Do not use recommendation or ranking language.",
    "Do not imply that one option is better than another.",
    "Generate exactly 3 options in the options array.",
    "The three options must be clearly different in concept.",
    "If hasCountry is false, generate 3 different country and city options that fit the user's theme, season, duration, budget, companions, and notes.",
    "If hasCountry is true, keep all options inside the user's country.",
    "If city is provided, keep all options centered on that city and differentiate the options by course concept, pace, area focus, or day structure.",
    "Each option must contain id, label, country, city, theme, pros, cons, comparison.",
    "Use ids option-a, option-b, option-c.",
    "Use labels A, B, C.",
    "pros and cons must each be arrays of concise Korean strings.",
    "comparison must include movement, cost, rest, shopping, activity, familyFriendly, weatherFit.",
    "comparison values must be one of 낮음, 중간, 높음.",
    "theme must be a concise Korean summary of the option concept.",
    "Return a single JSON object with this exact top-level shape:",
    '{"options":[{"id":"option-a","label":"A","country":"","city":"","theme":"","pros":[],"cons":[],"comparison":{"movement":"낮음","cost":"중간","rest":"높음","shopping":"중간","activity":"낮음","familyFriendly":"중간","weatherFit":"높음"}}]}'
  ].join("\n");
}

function buildTravelOptionsInput(requestData) {
  return [
    "User input:",
    JSON.stringify(requestData, null, 2)
  ].join("\n");
}

function buildTravelDetailsInstructions() {
  return [
    "You create detailed travel plans for the WHERE TO GO app.",
    "Return JSON only.",
    "Do not return markdown.",
    "Do not return code fences.",
    "Do not return any explanation outside the JSON object.",
    "Generate one plan per selected option.",
    "If multiple options are provided, return multiple plan objects inside plans.",
    "The plans array length must exactly match selectedOptions length.",
    "If duration looks like 4박 5일, generate 5 itinerary days.",
    "Each itinerary item must have day as a number and title in Day 1, Day 2 style.",
    "Each day must include a realistic time-based schedule.",
    "Every schedule item must include time, place, activity, and move.",
    "Avoid unrealistic movement between far places in a short time.",
    "Use travelDate to infer a short weather memo suitable for the season.",
    "Consider companions, budget, themes, and notes when generating pacing and activities.",
    "Keep each plan aligned with the option's country, city, and theme.",
    "Return one top-level JSON object only.",
    "Use this exact top-level shape:",
    '{"plans":[{"optionId":"option-a","label":"A","country":"","city":"","duration":"","travelDate":"","weather":{"summary":"","temperature":"","rainLevel":"","outfitNote":""},"itinerary":[{"day":1,"title":"Day 1","schedule":[{"time":"09:00","place":"","activity":"","move":""}]}]}]}'
  ].join("\n");
}

function buildTravelDetailsInput(requestData) {
  return [
    "User input for detailed travel plan generation:",
    JSON.stringify(requestData, null, 2)
  ].join("\n");
}

function buildTravelReviseInstructions() {
  return [
    "You revise existing travel plans for the WHERE TO GO app.",
    "Return JSON only.",
    "Do not return markdown.",
    "Do not return code fences.",
    "Do not return any explanation outside the JSON object.",
    "Use the existing detailedPlans as the main source.",
    "Reflect the user's revisionText in the updated result.",
    "Keep the original JSON structure.",
    "Regenerate the full plans array, but preserve unrelated information as much as possible.",
    "Only change what is needed to satisfy the revision request.",
    "Keep optionId, label, country, city, duration, travelDate, and weather coherent unless the revision clearly requires a change.",
    "Examples of revision intent include reducing movement, adding restaurants, making the plan easier for parents, increasing shopping time, and starting mornings later.",
    "Return one top-level JSON object only.",
    "The top-level object must include plans and revisionSummary.",
    "Use this exact top-level shape:",
    '{"plans":[{"optionId":"","label":"","country":"","city":"","duration":"","travelDate":"","weather":{"summary":"","temperature":"","rainLevel":"","outfitNote":""},"itinerary":[]}],"revisionSummary":""}'
  ].join("\n");
}

function buildTravelReviseInput(requestData) {
  return [
    "User input for travel plan revision:",
    JSON.stringify(requestData, null, 2)
  ].join("\n");
}

function buildProviderRequestPayload(provider, { model, instructions, input }) {
  return buildProviderBody(provider, {
    model,
    instructions,
    input,
    temperature: 0.2
  });
}

async function callProvider(provider, { model, instructions, input }) {
  const apiKey = getProviderApiKey(provider);

  if (!apiKey) {
    const error = new Error(getProviderErrorMessage(provider));
    error.status = 500;
    throw error;
  }

  const url = buildProviderUrl(provider, model, apiKey);
  const headers = buildProviderHeaders(provider, apiKey);
  const body = buildProviderRequestPayload(provider, {
    model,
    instructions,
    input
  });

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  const responseJson = await readJsonResponse(response);

  if (!response.ok) {
    const message =
      responseJson?.error?.message ||
      responseJson?.message ||
      responseJson?.rawText ||
      `Provider request failed (${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const outputText = extractProviderText(provider, responseJson);
  const parsed = safeJsonParse(outputText);

  return {
    success: true,
    data: parsed,
    rawText: outputText,
    responseId: extractProviderResponseId(provider, responseJson),
    model
  };
}

function createProviderErrorResponse(res, error) {
  res.status(error.status || 500).json({
    success: false,
    error: error.message || "Provider request failed."
  });
}

function createAiParseErrorResponse(res) {
  sendAiParseError(res);
}

function ensureProviderConfigured(req, res, next) {
  const provider = getProviderName();
  const apiKey = getProviderApiKey(provider);

  if (!apiKey) {
    res.status(500).json({
      success: false,
      error: getProviderErrorMessage(provider)
    });
    return;
  }

  next();
}

async function handleTravelOptionsRequest(req, res) {
  const provider = getProviderName();
  const requestData = normalizeTravelOptionsRequest(req.body);

  try {
    const result = await callProvider(provider, {
      model: getProviderModel(provider),
      instructions: buildTravelOptionsInstructions(),
      input: buildTravelOptionsInput(requestData)
    });

    res.json(result);
  } catch (error) {
    if (error.code === "AI_JSON_PARSE_ERROR") {
      createAiParseErrorResponse(res);
      return;
    }

    createProviderErrorResponse(res, error);
  }
}

async function handleTravelDetailsRequest(req, res) {
  const provider = getProviderName();
  const requestData = normalizeTravelDetailsRequest(req.body);

  if (!requestData.selectedOptions.length) {
    res.status(400).json({
      success: false,
      error: "selectedOptions must include at least one option."
    });
    return;
  }

  try {
    const result = await callProvider(provider, {
      model: getProviderModel(provider),
      instructions: buildTravelDetailsInstructions(),
      input: buildTravelDetailsInput(requestData)
    });

    res.json(result);
  } catch (error) {
    if (error.code === "AI_JSON_PARSE_ERROR") {
      createAiParseErrorResponse(res);
      return;
    }

    createProviderErrorResponse(res, error);
  }
}

async function handleTravelReviseRequest(req, res) {
  const provider = getProviderName();
  const requestData = normalizeTravelReviseRequest(req.body);

  if (!requestData.detailedPlans.length) {
    res.status(400).json({
      success: false,
      error: "detailedPlans must include at least one plan."
    });
    return;
  }

  if (!requestData.revisionText) {
    res.status(400).json({
      success: false,
      error: "revisionText is required."
    });
    return;
  }

  try {
    const result = await callProvider(provider, {
      model: getProviderModel(provider),
      instructions: buildTravelReviseInstructions(),
      input: buildTravelReviseInput(requestData)
    });

    res.json(result);
  } catch (error) {
    if (error.code === "AI_JSON_PARSE_ERROR") {
      createAiParseErrorResponse(res);
      return;
    }

    createProviderErrorResponse(res, error);
  }
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "WHERE TO GO API server is running.",
    provider: getProviderName()
  });
});

app.post("/api/travel-options", ensureProviderConfigured, async (req, res) => {
  await handleTravelOptionsRequest(req, res);
});

app.post("/api/travel-details", ensureProviderConfigured, async (req, res) => {
  await handleTravelDetailsRequest(req, res);
});

app.post("/api/travel-revise", ensureProviderConfigured, async (req, res) => {
  await handleTravelReviseRequest(req, res);
});

app.listen(PORT, () => {
  console.log(`WHERE TO GO API server running on http://localhost:${PORT}`);
});
