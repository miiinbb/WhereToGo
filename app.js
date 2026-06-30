const STORAGE_KEY = "where-to-go-app-state";
const AI_SETTINGS_STORAGE_KEY = "where-to-go-ai-settings";
const APP_VERSION = "v1.33";

const CONFIG = {
  USE_MOCK: false,
  DIRECT_AI_MODE: true,
  API_BASE_URL: "http://localhost:3000",
  DEBUG_MODE: true,
  AI_PROVIDERS: {
    gemini: {
      label: "Gemini",
      defaultModel: "gemini-2.5-flash"
    },
    groq: {
      label: "Groq",
      defaultModel: "llama-3.3-70b-versatile"
    }
  }
};

const COMPARISON_FIELDS = [
  { key: "movement", label: "이동량" },
  { key: "cost", label: "비용" },
  { key: "rest", label: "휴식" },
  { key: "shopping", label: "쇼핑" },
  { key: "activity", label: "액티비티" },
  { key: "familyFriendly", label: "가족 친화" },
  { key: "weatherFit", label: "계절 적합" }
];

const THEME_OPTIONS = [
  "휴양",
  "자연",
  "도시",
  "맛집",
  "온천",
  "쇼핑",
  "역사/문화",
  "액티비티",
  "가족여행"
];

const MOCK_OPTIONS = [
  {
    id: "option-a",
    label: "A",
    country: "일본",
    city: "후쿠오카",
    theme: "가벼운 미식 산책",
    pros: ["비행 시간이 짧아 부담이 적음", "맛집과 쇼핑 동선이 단순함", "짧은 일정에도 만족도가 높음"],
    cons: ["도시 밀도가 높아 한적함은 적음", "주말 인기 지역은 붐빌 수 있음", "자연 중심 여행에는 다소 약함"],
    comparison: {
      movement: "낮음",
      cost: "중간",
      rest: "중간",
      shopping: "높음",
      activity: "낮음",
      familyFriendly: "중간",
      weatherFit: "높음"
    }
  },
  {
    id: "option-b",
    label: "B",
    country: "대만",
    city: "타이베이",
    theme: "야시장 중심 도시 여행",
    pros: ["먹거리 선택지가 매우 다양함", "대중교통이 편해 이동이 쉬움", "도시와 근교를 함께 보기 좋음"],
    cons: ["습도가 높게 느껴질 수 있음", "인기 야시장은 붐비는 편임", "리조트형 휴양과는 거리가 있음"],
    comparison: {
      movement: "중간",
      cost: "중간",
      rest: "중간",
      shopping: "높음",
      activity: "중간",
      familyFriendly: "높음",
      weatherFit: "중간"
    }
  },
  {
    id: "option-c",
    label: "C",
    country: "베트남",
    city: "다낭",
    theme: "리조트 위주 휴식 여행",
    pros: ["쉬는 비중이 높아 회복감이 큼", "해변과 스파를 함께 즐기기 좋음", "가성비가 좋은 편임"],
    cons: ["도시형 쇼핑 다양성은 적은 편", "우천 시 야외 일정 영향이 큼", "관광 포인트 밀도는 낮을 수 있음"],
    comparison: {
      movement: "낮음",
      cost: "낮음",
      rest: "높음",
      shopping: "낮음",
      activity: "중간",
      familyFriendly: "높음",
      weatherFit: "중간"
    }
  }
];

const REGION_COUNTRY_MAP = {
  아시아: ["한국", "일본", "중국", "대만", "홍콩", "태국", "베트남", "싱가포르", "말레이시아", "인도네시아", "필리핀"],
  동아시아: ["한국", "일본", "중국", "대만", "홍콩"],
  동남아: ["태국", "베트남", "싱가포르", "말레이시아", "인도네시아", "필리핀"],
  유럽: ["프랑스", "영국", "독일", "네덜란드", "벨기에", "스위스", "오스트리아", "이탈리아", "스페인", "포르투갈", "체코", "헝가리", "그리스", "크로아티아", "덴마크", "스웨덴", "노르웨이", "핀란드"],
  서유럽: ["프랑스", "영국", "독일", "네덜란드", "벨기에", "스위스", "오스트리아"],
  남유럽: ["이탈리아", "스페인", "포르투갈", "그리스", "크로아티아"],
  북유럽: ["덴마크", "스웨덴", "노르웨이", "핀란드", "아이슬란드"],
  동유럽: ["체코", "헝가리", "폴란드", "루마니아"],
  미주: ["미국", "캐나다", "멕시코", "브라질", "아르헨티나", "페루", "칠레"],
  북미: ["미국", "캐나다", "멕시코"],
  남미: ["브라질", "아르헨티나", "페루", "칠레"],
  오세아니아: ["호주", "뉴질랜드"],
  중동: ["터키", "아랍에미리트", "카타르", "요르단"],
  아프리카: ["모로코", "이집트", "남아프리카공화국"]
};

const DESTINATION_LIBRARY = [
  { country: "일본", city: "후쿠오카", theme: "가벼운 미식 산책", pros: ["비행 시간이 짧음", "맛집 밀도가 높음", "짧은 일정에 적합"], cons: ["한적함은 적음", "주말 붐빔 가능", "자연 비중은 낮음"], comparison: { movement: "낮음", cost: "중간", rest: "중간", shopping: "높음", activity: "낮음", familyFriendly: "중간", weatherFit: "높음" } },
  { country: "대만", city: "타이베이", theme: "야시장 중심 도시 여행", pros: ["먹거리 선택지 다양", "대중교통 편리", "근교 이동 쉬움"], cons: ["습도가 높을 수 있음", "야시장 붐빔", "리조트형 휴양과 거리 있음"], comparison: { movement: "중간", cost: "중간", rest: "중간", shopping: "높음", activity: "중간", familyFriendly: "높음", weatherFit: "중간" } },
  { country: "베트남", city: "다낭", theme: "리조트 위주 휴식", pros: ["휴식 비중이 높음", "해변과 스파 조합 좋음", "가성비가 좋음"], cons: ["쇼핑 다양성은 낮음", "우천 시 야외 영향", "도시 밀도는 낮음"], comparison: { movement: "낮음", cost: "낮음", rest: "높음", shopping: "낮음", activity: "중간", familyFriendly: "높음", weatherFit: "중간" } },
  { country: "프랑스", city: "파리", theme: "미술관과 거리 산책", pros: ["명소 밀도가 높음", "도시 감도가 뚜렷함", "카페 문화가 풍부함"], cons: ["숙박비가 높은 편", "인기 구역 대기 발생", "도보 이동량이 늘 수 있음"], comparison: { movement: "중간", cost: "높음", rest: "중간", shopping: "높음", activity: "중간", familyFriendly: "중간", weatherFit: "높음" } },
  { country: "스페인", city: "바르셀로나", theme: "건축 감상과 해변 여유", pros: ["도시와 바다를 함께 즐김", "산책 만족도가 높음", "식사 시간이 여유로움"], cons: ["성수기 혼잡", "소매치기 주의 필요", "낮 시간 햇빛이 강함"], comparison: { movement: "중간", cost: "중간", rest: "중간", shopping: "중간", activity: "중간", familyFriendly: "중간", weatherFit: "높음" } },
  { country: "네덜란드", city: "암스테르담", theme: "운하 산책과 감성 일정", pros: ["도시 규모가 적당함", "동선이 단순함", "미술관 선택지가 좋음"], cons: ["숙박비가 오를 수 있음", "비 오는 날 변동성", "주말 인기 구역 붐빔"], comparison: { movement: "낮음", cost: "높음", rest: "중간", shopping: "중간", activity: "중간", familyFriendly: "중간", weatherFit: "중간" } },
  { country: "이탈리아", city: "로마", theme: "유적과 골목 중심 일정", pros: ["역사 포인트가 많음", "식사 만족도가 높음", "걷는 재미가 큼"], cons: ["도보량이 많아질 수 있음", "성수기 혼잡", "숙소 위치 선택 중요"], comparison: { movement: "높음", cost: "중간", rest: "낮음", shopping: "중간", activity: "중간", familyFriendly: "중간", weatherFit: "높음" } },
  { country: "영국", city: "런던", theme: "박물관과 쇼핑 균형", pros: ["실내 명소가 많음", "쇼핑 선택지 풍부", "지역별 개성이 뚜렷함"], cons: ["물가가 높음", "거리 이동이 길어질 수 있음", "날씨 변동이 잦음"], comparison: { movement: "중간", cost: "높음", rest: "중간", shopping: "높음", activity: "중간", familyFriendly: "높음", weatherFit: "중간" } }
];

const defaultAiSettings = {
  provider: "gemini",
  apiKey: "",
  model: "gemini-2.5-flash"
};

const defaultState = {
  currentScreen: "home",
  history: ["home"],
  hasCountry: null,
  country: "",
  city: "",
  preferredCountries: "",
  excludedCountries: "",
  themes: [],
  travelDate: "",
  duration: "",
  companions: "",
  budget: "",
  notes: "",
  optionSource: "",
  optionSourceLabel: "",
  generatedOptions: [],
  selectedOptions: [],
  detailedPlans: [],
  revisions: [],
  revisionRequest: "",
  revisionSummary: "",
  isLoading: false,
  loadingStep: "",
  errorMessage: ""
};

let aiSettings = loadAiSettings();
let appState = loadState();

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeString(value) {
  return String(value ?? "").trim();
}

function maskSensitiveValue(value) {
  return value ? "***" : "";
}

function maskSensitiveData(value, parentKey = "") {
  if (Array.isArray(value)) {
    return value.map((item) => maskSensitiveData(item, parentKey));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, itemValue]) => {
        const normalizedKey = key.toLowerCase();
        if (normalizedKey.includes("apikey") || normalizedKey === "authorization") {
          return [key, "***"];
        }

        return [key, maskSensitiveData(itemValue, key)];
      })
    );
  }

  if (typeof value === "string" && parentKey.toLowerCase().includes("apikey")) {
    return maskSensitiveValue(value);
  }

  return value;
}

function debugLog(label, payload = {}) {
  if (!CONFIG.DEBUG_MODE) return;

  try {
    console.info(`[WHERE TO GO] ${label}`, maskSensitiveData(payload));
  } catch {
    console.info(`[WHERE TO GO] ${label}`);
  }
}

function parseJsonSafely(text) {
  const sourceText = normalizeString(text);

  if (!sourceText) {
    throw new Error("AI 응답이 비어 있습니다.");
  }

  const codeBlockMatch = sourceText.match(/```json\s*([\s\S]*?)```|```\s*([\s\S]*?)```/i);
  const candidateText = normalizeString(codeBlockMatch?.[1] || codeBlockMatch?.[2] || sourceText);

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
            return JSON.parse(candidateText.slice(startIndex, index + 1));
          }
        }
      }
    }
  }

  throw new Error("AI 응답을 JSON으로 해석하지 못했습니다.");
}

function safeJsonParse(text) {
  try {
    return parseJsonSafely(text);
  } catch (error) {
    debugLog("Safe JSON parse fallback", {
      message: error?.message || "unknown error"
    });
    return null;
  }
}

function normalizeProviderName(providerName = "gemini") {
  return normalizeString(providerName).toLowerCase() === "groq" ? "groq" : "gemini";
}

function getDefaultModelForProvider(providerName = "gemini") {
  return CONFIG.AI_PROVIDERS[normalizeProviderName(providerName)]?.defaultModel || CONFIG.AI_PROVIDERS.gemini.defaultModel;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeThemes(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeString).filter(Boolean);
  }

  return normalizeString(value)
    .split(",")
    .map(normalizeString)
    .filter(Boolean);
}

function normalizeLookupKey(value) {
  return normalizeString(value).replaceAll(" ", "").toLowerCase();
}

function parseCountryPreferenceTokens(value) {
  return normalizeString(value)
    .split(",")
    .map(normalizeString)
    .filter(Boolean);
}

function expandRegionToken(token) {
  const normalizedToken = normalizeLookupKey(token);
  const match = Object.entries(REGION_COUNTRY_MAP).find(([regionName]) => normalizeLookupKey(regionName) === normalizedToken);
  return match ? match[1] : null;
}

function countryMatchesToken(country, token) {
  const normalizedCountry = normalizeLookupKey(country);
  const normalizedToken = normalizeLookupKey(token);

  if (!normalizedCountry || !normalizedToken) {
    return false;
  }

  if (normalizedCountry.includes(normalizedToken) || normalizedToken.includes(normalizedCountry)) {
    return true;
  }

  const expandedRegion = expandRegionToken(token);
  if (expandedRegion) {
    return expandedRegion.some((countryName) => normalizeLookupKey(countryName) === normalizedCountry);
  }

  return false;
}

function normalizeComparison(value = {}) {
  const levels = ["낮음", "중간", "높음"];

  return Object.fromEntries(
    COMPARISON_FIELDS.map(({ key }) => {
      const rawValue = normalizeString(value?.[key]);
      return [key, levels.includes(rawValue) ? rawValue : "중간"];
    })
  );
}

function normalizeOption(option, index) {
  return {
    id: normalizeString(option?.id) || `option-${String.fromCharCode(97 + index)}`,
    label: normalizeString(option?.label) || String.fromCharCode(65 + index),
    country: normalizeString(option?.country),
    city: normalizeString(option?.city),
    theme: normalizeString(option?.theme),
    pros: normalizeArray(option?.pros).map(normalizeString).filter(Boolean).slice(0, 3),
    cons: normalizeArray(option?.cons).map(normalizeString).filter(Boolean).slice(0, 3),
    comparison: normalizeComparison(option?.comparison)
  };
}

function normalizeWeather(weather = {}) {
  return {
    summary: normalizeString(weather.summary),
    temperature: normalizeString(weather.temperature),
    rainLevel: normalizeString(weather.rainLevel),
    outfitNote: normalizeString(weather.outfitNote)
  };
}

function normalizeScheduleItem(item = {}) {
  return {
    time: normalizeString(item.time),
    place: normalizeString(item.place),
    activity: normalizeString(item.activity),
    move: normalizeString(item.move)
  };
}

function normalizePlan(plan, index) {
  const itinerary = normalizeArray(plan?.itinerary).map((day, dayIndex) => ({
    day: Number(day?.day) || dayIndex + 1,
    title: normalizeString(day?.title) || `Day ${dayIndex + 1}`,
    schedule: normalizeArray(day?.schedule).map(normalizeScheduleItem).filter((item) => item.time || item.place || item.activity || item.move)
  }));

  return {
    optionId: normalizeString(plan?.optionId) || `option-${String.fromCharCode(97 + index)}`,
    label: normalizeString(plan?.label) || String.fromCharCode(65 + index),
    country: normalizeString(plan?.country),
    city: normalizeString(plan?.city),
    duration: normalizeString(plan?.duration),
    travelDate: normalizeString(plan?.travelDate),
    weather: normalizeWeather(plan?.weather),
    itinerary
  };
}

function normalizeAiSettings(source = {}) {
  const provider = normalizeProviderName(source.provider || defaultAiSettings.provider);

  return {
    provider,
    apiKey: typeof source.apiKey === "string" ? source.apiKey : "",
    model: normalizeString(source.model) || getDefaultModelForProvider(provider)
  };
}

function normalizeAppState(source = {}) {
  const {
    aiProvider: _legacyAiProvider,
    aiModel: _legacyAiModel,
    aiApiKey: _legacyAiApiKey,
    ...restSource
  } = source || {};

  return {
    ...defaultState,
    ...restSource,
    history: Array.isArray(restSource.history) && restSource.history.length ? restSource.history : ["home"],
    themes: normalizeThemes(restSource.themes),
    generatedOptions: normalizeArray(restSource.generatedOptions).map(normalizeOption),
    selectedOptions: normalizeArray(restSource.selectedOptions).map(normalizeString).filter(Boolean),
    detailedPlans: normalizeArray(restSource.detailedPlans).map(normalizePlan),
    revisions: normalizeArray(restSource.revisions).map(normalizeString).filter(Boolean),
    optionSource: normalizeString(restSource.optionSource),
    optionSourceLabel: normalizeString(restSource.optionSourceLabel),
    revisionRequest: normalizeString(restSource.revisionRequest),
    revisionSummary: normalizeString(restSource.revisionSummary),
    errorMessage: normalizeString(restSource.errorMessage)
  };
}

function loadAiSettings() {
  try {
    return normalizeAiSettings(JSON.parse(sessionStorage.getItem(AI_SETTINGS_STORAGE_KEY) || "{}"));
  } catch {
    return normalizeAiSettings(defaultAiSettings);
  }
}

function saveAiSettings(nextAiSettings) {
  aiSettings = normalizeAiSettings(nextAiSettings);
  sessionStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(aiSettings));
  return aiSettings;
}

function clearAiSettings() {
  aiSettings = normalizeAiSettings(defaultAiSettings);
  sessionStorage.removeItem(AI_SETTINGS_STORAGE_KEY);
  return aiSettings;
}

function getActiveAiSettings() {
  if (!aiSettings) {
    aiSettings = loadAiSettings();
  }

  return normalizeAiSettings(aiSettings);
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return normalizeAppState(parsed);
  } catch {
    return normalizeAppState(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...appState }));
}

function updateState(patch) {
  appState = normalizeAppState({ ...appState, ...patch });
  saveState();
}

function setLoading(isLoading, errorMessage = "") {
  updateState({ isLoading, errorMessage, loadingStep: isLoading ? appState.loadingStep : "" });
}

function startLoading(step, errorMessage = "") {
  updateState({
    isLoading: true,
    loadingStep: step,
    errorMessage
  });
}

function stopLoading(errorMessage = "") {
  updateState({
    isLoading: false,
    loadingStep: "",
    errorMessage
  });
}

function syncVersionBadge() {
  const versionBadge = document.getElementById("versionBadge");
  if (versionBadge) {
    versionBadge.textContent = APP_VERSION;
  }
}

function getAiStatusBadgeData() {
  if (CONFIG.USE_MOCK) {
    return {
      status: "Mock",
      meta: "Mock mode",
      tone: "mock"
    };
  }

  const activeAiSettings = getActiveAiSettings();
  const provider = normalizeProviderName(activeAiSettings.provider);
  const providerLabel = CONFIG.AI_PROVIDERS[provider]?.label || "Gemini";
  const model = normalizeString(activeAiSettings.model) || getDefaultModelForProvider(provider);

  if (!normalizeString(activeAiSettings.apiKey)) {
    return {
      status: "API Key 필요",
      meta: `${providerLabel} · ${model}`,
      tone: "warning"
    };
  }

  return {
    status: `${providerLabel} 설정됨`,
    meta: `${providerLabel} · ${model}`,
    tone: provider
  };
}

function syncAiStatusBadge() {
  const aiStatusBadge = document.getElementById("aiStatusBadge");
  if (!aiStatusBadge) return;

  const badgeData = getAiStatusBadgeData();
  aiStatusBadge.className = `ai-status-badge is-${badgeData.tone}`;
  aiStatusBadge.innerHTML = `
    <span class="ai-status-label">${escapeHtml(badgeData.status)}</span>
    <span class="ai-status-meta">${escapeHtml(badgeData.meta)}</span>
  `;
}

function renderScreen(screenName, options = {}) {
  const { pushHistory = true } = options;
  const history = pushHistory ? [...appState.history, screenName] : [...appState.history];

  if (!pushHistory) {
    history[history.length - 1] = screenName;
  }

  updateState({
    currentScreen: screenName,
    history
  });

  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = getScreenMarkup(screenName);
  bindScreenEvents(screenName);
  syncVersionBadge();
  syncAiStatusBadge();
}

function goHome() {
  updateState({
    ...defaultState,
    currentScreen: "home",
    history: ["home"]
  });
  renderScreen("home", { pushHistory: false });
}

function goBack() {
  if (appState.history.length <= 1) {
    renderScreen("home", { pushHistory: false });
    return;
  }

  const history = [...appState.history];
  history.pop();
  const previousScreen = history[history.length - 1] || "home";

  updateState({
    currentScreen: previousScreen,
    history
  });

  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = getScreenMarkup(previousScreen);
  bindScreenEvents(previousScreen);
  syncVersionBadge();
  syncAiStatusBadge();
}

function getScreenMarkup(screenName) {
  switch (screenName) {
    case "ai-settings":
      return renderAiSettingsMarkup();
    case "undecided-form":
      return renderTravelFormMarkup(false);
    case "decided-form":
      return renderTravelFormMarkup(true);
    case "options":
      return renderOptionsMarkup();
    case "details":
      return renderDetailsMarkup();
    default:
      return renderHomeMarkup();
  }
}

function renderHomeMarkup() {
  return `
    <section class="panel screen-home">
      <div class="content">
        <h1>WHERE TO GO?</h1>
        <p class="question">여행 기준을 골라주세요</p>
        <div class="actions">
          <button class="secondary-button" type="button" data-action="open-ai-settings">AI 설정</button>
          <button class="choice-button" type="button" data-action="choose-country" data-value="false">아직 정하지 않음</button>
          <button class="choice-button" type="button" data-action="choose-country" data-value="true">국가 지정</button>
        </div>
      </div>
    </section>
  `;
}

function getAiModeLabel() {
  if (CONFIG.USE_MOCK) return "Mock";
  const activeAiSettings = getActiveAiSettings();
  return activeAiSettings.apiKey ? CONFIG.AI_PROVIDERS[activeAiSettings.provider].label : "API 키 필요";
}

function getOptionSourceLabel() {
  if (appState.optionSourceLabel) {
    return appState.optionSourceLabel;
  }

  if (CONFIG.USE_MOCK) {
    return "Mock";
  }

  const activeAiSettings = getActiveAiSettings();
  if (activeAiSettings.apiKey) {
    return `${CONFIG.AI_PROVIDERS[activeAiSettings.provider].label} AI`;
  }

  return "";
}

function renderAiSettingsMarkup() {
  const activeAiSettings = getActiveAiSettings();
  const provider = normalizeProviderName(activeAiSettings.provider);
  const model = activeAiSettings.model || getDefaultModelForProvider(provider);

  return `
    <section class="panel screen-flow">
      <div class="screen-header">
        <div>
          <p class="kicker">AI</p>
          <h2>AI 설정</h2>
        </div>
        <div class="header-actions">
          <button class="ghost-button" type="button" data-action="back">뒤로</button>
          <button class="secondary-button" type="button" data-action="home">홈</button>
        </div>
      </div>

      <section class="status-card">
        <p>${getAiModeLabel()}</p>
      </section>

      <form class="stack" id="ai-settings-form">
        <label class="field">
          <span class="label">제공자</span>
          <select class="input" name="aiProvider">
            <option value="gemini" ${provider === "gemini" ? "selected" : ""}>Gemini</option>
            <option value="groq" ${provider === "groq" ? "selected" : ""}>Groq</option>
          </select>
        </label>

        <label class="field">
          <span class="label">모델</span>
          <input class="input" type="text" name="aiModel" value="${escapeHtml(model)}" placeholder="${escapeHtml(getDefaultModelForProvider(provider))}" />
        </label>

        <label class="field">
          <span class="label">API 키</span>
          <input class="input" type="password" name="aiApiKey" value="" placeholder="새 키 입력" autocomplete="off" />
        </label>

        <p class="screen-label">개인 테스트용입니다. 배포용 서비스에서는 서버 연동을 사용하세요.</p>
        <p class="screen-label">API Key는 sessionStorage에만 저장되고 localStorage에는 저장하지 않습니다.</p>

        <section class="status-card">
          <p>테스트용입니다. 운영 서비스 키는 넣지 마세요.</p>
        </section>

        <div class="button-row">
          <button class="secondary-button" type="button" data-action="reset-ai-settings">초기화</button>
          <button class="primary-button" type="button" data-action="save-ai-settings">저장</button>
        </div>
      </form>
    </section>
  `;
}

function renderTravelFormMarkup(isDecided) {
  return `
    <section class="panel screen-flow">
      <div class="screen-header">
        <div>
          <p class="kicker">${isDecided ? "FLOW B" : "FLOW A"}</p>
          <h2>${isDecided ? "국가와 도시 입력" : "여행 조건 입력"}</h2>
        </div>
        <div class="header-actions">
          <button class="secondary-button" type="button" data-action="open-ai-settings">AI 설정</button>
          <button class="ghost-button" type="button" data-action="back">뒤로가기</button>
          <button class="secondary-button" type="button" data-action="home">처음으로</button>
        </div>
      </div>

      ${renderStatusMarkup()}

      <form class="stack" id="travel-form">
        <div class="form-grid">
          ${isDecided ? `
            <label class="field">
              <span class="label">국가</span>
              <input class="input" type="text" name="country" value="${escapeHtml(appState.country)}" placeholder="예: 일본" />
            </label>
            <label class="field">
              <span class="label">도시</span>
              <input class="input" type="text" name="city" value="${escapeHtml(appState.city)}" placeholder="예: 후쿠오카" />
            </label>
          ` : `
            <label class="field">
              <span class="label">선호 국가</span>
              <input class="input" type="text" name="preferredCountries" value="${escapeHtml(appState.preferredCountries)}" placeholder="예: 일본, 대만" />
            </label>
            <label class="field">
              <span class="label">제외 국가</span>
              <input class="input" type="text" name="excludedCountries" value="${escapeHtml(appState.excludedCountries)}" placeholder="예: 미국" />
            </label>
          `}

          <label class="field">
            <span class="label">테마</span>
            <input class="input" type="text" name="themeSummary" value="${escapeHtml(appState.themes.join(", "))}" placeholder="아래 버튼으로 선택" disabled />
          </label>

          <label class="field">
            <span class="label">여행 시기</span>
            <input class="input" type="text" name="travelDate" value="${escapeHtml(appState.travelDate)}" placeholder="예: 10월" />
          </label>

          <label class="field">
            <span class="label">여행 기간</span>
            <input class="input" type="text" name="duration" value="${escapeHtml(appState.duration)}" placeholder="예: 3박 4일" />
          </label>

          <label class="field">
            <span class="label">동행</span>
            <input class="input" type="text" name="companions" value="${escapeHtml(appState.companions)}" placeholder="예: 친구 2명" />
          </label>

          <label class="field">
            <span class="label">예산</span>
            <input class="input" type="text" name="budget" value="${escapeHtml(appState.budget)}" placeholder="예: 150만원" />
          </label>

          <label class="field-wide">
            <span class="label">추가 요청</span>
            <textarea class="textarea" name="notes" placeholder="원하는 분위기나 조건을 적어주세요">${escapeHtml(appState.notes)}</textarea>
          </label>

          <div class="field-wide">
            <span class="label">테마 선택</span>
            <div class="chip-row">
              ${THEME_OPTIONS.map((theme) => `
                <button class="chip-button${appState.themes.includes(theme) ? " is-active" : ""}" type="button" data-action="toggle-theme" data-theme="${escapeHtml(theme)}">${escapeHtml(theme)}</button>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="screen-footer button-row">
          ${CONFIG.DEBUG_MODE ? `<button class="secondary-button" type="button" data-action="sample-input">샘플 입력</button>` : ""}
          <button class="primary-button" type="submit">옵션 보기</button>
        </div>
      </form>
    </section>
  `;
}

function renderLegacyStatusMarkup() {
  if (appState.isLoading) {
    return `<section class="status-card"><p>AI 생성 중</p></section>`;
  }

  if (appState.errorMessage) {
    return `<section class="status-card"><p>${escapeHtml(appState.errorMessage)}</p></section>`;
  }

  return "";
}

function buildSummaryItems() {
  const items = [];

  if (appState.country) items.push({ label: "국가", value: appState.country });
  if (appState.city) items.push({ label: "도시", value: appState.city });
  if (appState.preferredCountries) items.push({ label: "선호 국가", value: appState.preferredCountries });
  if (appState.excludedCountries) items.push({ label: "제외 국가", value: appState.excludedCountries });
  if (appState.themes.length) items.push({ label: "테마", value: appState.themes.join(", ") });
  if (appState.travelDate) items.push({ label: "여행 시기", value: appState.travelDate });
  if (appState.duration) items.push({ label: "기간", value: appState.duration });
  if (appState.companions) items.push({ label: "동행", value: appState.companions });
  if (appState.budget) items.push({ label: "예산", value: appState.budget });
  if (appState.notes) items.push({ label: "추가 요청", value: appState.notes });

  return items;
}

function renderOptionsMarkup() {
  const options = appState.generatedOptions;

  return `
    <section class="panel screen-flow">
      <div class="screen-header">
        <div>
          <p class="kicker">OPTIONS</p>
          <h2>여행 옵션 A~C</h2>
        </div>
        <div class="header-actions">
          <button class="secondary-button" type="button" data-action="open-ai-settings">AI 설정</button>
          <button class="ghost-button" type="button" data-action="back">뒤로가기</button>
          <button class="secondary-button" type="button" data-action="home">처음으로</button>
        </div>
      </div>

      ${renderStatusMarkup()}

      <section class="summary-card">
        <div class="summary-card-head">
          <h3>입력 조건</h3>
          <button class="ghost-button summary-edit-button" type="button" data-action="edit-conditions">수정</button>
        </div>
        <div class="summary-grid">
          ${buildSummaryItems().map((item) => `
            <div class="summary-item">
              <p class="summary-label">${escapeHtml(item.label)}</p>
              <p class="summary-value">${escapeHtml(item.value)}</p>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="option-grid">
        ${options.map((option) => renderOptionCard(option)).join("")}
      </section>

      <section class="comparison-card">
        <div class="section-title">
          <h3>비교표</h3>
          <p class="screen-label">추천이나 순위 없이 비교만 보여줍니다</p>
        </div>
        <div class="comparison-table-wrap">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>항목</th>
                ${options.map((option) => `<th>${escapeHtml(option.label)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${COMPARISON_FIELDS.map((field) => `
                <tr>
                  <th>${escapeHtml(field.label)}</th>
                  ${options.map((option) => `<td>${escapeHtml(option.comparison[field.key])}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <div class="button-row">
        <button class="secondary-button" type="button" data-action="refresh-options">다시 보기</button>
        <button class="primary-button" type="button" data-action="build-details">상세 일정</button>
      </div>
    </section>
  `;
}

function renderOptionCard(option) {
  const isSelected = appState.selectedOptions.includes(option.id);

  return `
    <article class="option-card${isSelected ? " is-selected" : ""}">
      <div class="option-topline">
        <div>
          <p class="option-label">Option ${escapeHtml(option.label)}</p>
          <h3>${escapeHtml(option.country)} · ${escapeHtml(option.city)}</h3>
        </div>
        <button class="${isSelected ? "secondary-button is-active" : "secondary-button"}" type="button" data-action="toggle-option" data-id="${escapeHtml(option.id)}">
          ${isSelected ? "선택됨" : "선택"}
        </button>
      </div>

      <div class="option-meta">
        <span class="meta-pill">${escapeHtml(option.theme)}</span>
      </div>

      <div class="option-section">
        <p class="option-section-title">장점</p>
        <ul class="option-list">
          ${option.pros.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>

      <div class="option-section">
        <p class="option-section-title">주의점</p>
        <ul class="option-list">
          ${option.cons.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </article>
  `;
}

function renderDetailsMarkup() {
  return `
    <section class="panel screen-flow">
      <div class="screen-header">
        <div>
          <p class="kicker">DETAILS</p>
          <h2>상세 일정</h2>
        </div>
        <div class="header-actions">
          <button class="ghost-button" type="button" data-action="back">뒤로가기</button>
          <button class="secondary-button" type="button" data-action="home">처음으로</button>
        </div>
      </div>

      ${renderStatusMarkup()}

      ${appState.revisionSummary ? `
        <section class="status-card">
          <p>${escapeHtml(appState.revisionSummary)}</p>
        </section>
      ` : ""}

      <section class="detail-grid">
        ${appState.detailedPlans.map((plan) => renderPlanCard(plan)).join("")}
      </section>

      <section class="revision-card">
        <div class="section-title">
          <h3>일정 수정</h3>
          <p class="screen-label">짧게 요청해 주세요</p>
        </div>
        <form class="stack" id="revision-form">
          <textarea class="textarea" name="revisionText" placeholder="예: 이동을 줄이고 맛집을 더 넣어줘">${escapeHtml(appState.revisionRequest)}</textarea>
          <div class="button-row">
            <button class="secondary-button" type="button" data-action="clear-revision">초기화</button>
            <button class="primary-button" type="submit">수정 반영</button>
          </div>
        </form>
      </section>
    </section>
  `;
}

function renderPlanCard(plan) {
  return `
    <article class="detail-card">
      <div class="detail-card-head">
        <div>
          <p class="option-label">Option ${escapeHtml(plan.label)}</p>
          <h3>${escapeHtml(plan.country)} · ${escapeHtml(plan.city)}</h3>
        </div>
        <div class="option-badges">
          <span class="validation-badge validation-valid">${escapeHtml(plan.duration || "일정")}</span>
        </div>
      </div>

      <div class="detail-meta">
        <span class="meta-pill">${escapeHtml(plan.travelDate || "시기 미입력")}</span>
      </div>

      <div class="weather-info">
        <div class="weather-item">
          <span class="weather-label">날씨 요약</span>
          <span class="weather-value">${escapeHtml(plan.weather.summary || "-")}</span>
        </div>
        <div class="weather-item">
          <span class="weather-label">기온</span>
          <span class="weather-value">${escapeHtml(plan.weather.temperature || "-")}</span>
        </div>
        <div class="weather-item">
          <span class="weather-label">비 확률</span>
          <span class="weather-value">${escapeHtml(plan.weather.rainLevel || "-")}</span>
        </div>
        <div class="weather-item">
          <span class="weather-label">옷차림</span>
          <span class="weather-value">${escapeHtml(plan.weather.outfitNote || "-")}</span>
        </div>
      </div>

      ${plan.itinerary.map((day) => `
        <section class="detail-day">
          <h3 class="detail-day-title">${escapeHtml(day.title)}</h3>
          <ul class="schedule-timeline">
            ${day.schedule.map((item) => `
              <li>
                <strong>${escapeHtml(item.time || "-")}</strong>
                ${item.place ? ` · ${escapeHtml(item.place)}` : ""}
                ${item.activity ? ` · ${escapeHtml(item.activity)}` : ""}
                ${item.move ? ` · 이동: ${escapeHtml(item.move)}` : ""}
              </li>
            `).join("")}
          </ul>
        </section>
      `).join("")}
    </article>
  `;
}

function buildOptionsRequest() {
  return {
    hasCountry: Boolean(appState.hasCountry),
    country: appState.country,
    city: appState.city,
    preferredCountries: appState.preferredCountries,
    excludedCountries: appState.excludedCountries,
    themes: appState.themes,
    travelDate: appState.travelDate,
    duration: appState.duration,
    companions: appState.companions,
    budget: appState.budget,
    notes: appState.notes
  };
}

function getSelectedOptionObjects() {
  if (appState.selectedOptions.length) {
    return appState.generatedOptions.filter((option) => appState.selectedOptions.includes(option.id));
  }

  return appState.generatedOptions;
}

function buildDetailsRequest() {
  const selectedOptions = getSelectedOptionObjects();

  return {
    selectedOptions,
    travelDate: appState.travelDate,
    duration: appState.duration,
    companions: appState.companions,
    budget: appState.budget,
    themes: appState.themes,
    notes: appState.notes
  };
}

function buildRevisionRequest(revisionText) {
  return {
    detailedPlans: appState.detailedPlans,
    revisionText,
    appState: {
      hasCountry: appState.hasCountry,
      country: appState.country,
      city: appState.city,
      themes: appState.themes,
      travelDate: appState.travelDate,
      duration: appState.duration,
      companions: appState.companions,
      budget: appState.budget,
      notes: appState.notes
    }
  };
}

function convertFrontendPlansToApiPlans(plans = []) {
  return normalizeArray(plans).map((plan, index) => {
    const normalizedPlan = normalizePlan(plan, index);

    return {
      optionId: normalizedPlan.optionId,
      label: normalizedPlan.label,
      country: normalizedPlan.country,
      city: normalizedPlan.city,
      duration: normalizedPlan.duration,
      travelDate: normalizedPlan.travelDate,
      weather: { ...normalizedPlan.weather },
      itinerary: normalizeArray(normalizedPlan.itinerary).map((day, dayIndex) => ({
        day: Number(day?.day) || dayIndex + 1,
        title: normalizeString(day?.title) || `Day ${dayIndex + 1}`,
        schedule: normalizeArray(day?.schedule).map((item) => ({
          time: normalizeString(item?.time),
          place: normalizeString(item?.place),
          activity: normalizeString(item?.activity),
          move: normalizeString(item?.move)
        }))
      }))
    };
  });
}

function buildTravelOptionsInstructions(extraInstruction = "") {
  return [
    "You create travel options for the WHERE TO GO app.",
    "Return JSON only.",
    "Do not return markdown.",
    "Do not return code fences.",
    "Do not return any explanation outside the JSON object.",
    "Do not use the Korean words 추천, 최적, 베스트, 1순위.",
    "Do not use recommendation language, ranking language, best, top, or winner.",
    "Generate exactly 3 options.",
    "The options array length must be exactly 3.",
    "Use ids option-a, option-b, option-c.",
    "Use labels A, B, C.",
    "All visible text must be concise Korean.",
    "If hasCountry is false, propose 3 different country and city combinations.",
    "If hasCountry is true, keep all options inside the user's country.",
    "If city exists, keep all options centered on that city but make their concepts clearly different.",
    "preferredCountries and excludedCountries may include region names such as 서유럽, 남유럽, 북유럽, 동유럽, 유럽, 아시아, 동남아, 북미.",
    "Treat those region names as country groups and respect them strictly.",
    "Do not return a country that belongs to excludedCountries.",
    "If preferredCountries is provided, prioritize countries that belong to preferredCountries.",
    "Reflect themes, travelDate, duration, companions, budget, and notes.",
    "Avoid generic filler like 최신 트렌드, 다양한 쇼핑몰, 인파, 비싼 가격 unless it is truly specific and useful.",
    "Make each pros and cons item concrete and city-specific when possible.",
    "Do not reuse the same vague pros and cons across multiple options.",
    "Each option must include pros and cons as concise Korean arrays.",
    "comparison must include movement, cost, rest, shopping, activity, familyFriendly, weatherFit.",
    "Each comparison value must be one of 낮음, 중간, 높음.",
    extraInstruction,
    "Output shape:",
    '{"options":[{"id":"option-a","label":"A","country":"","city":"","theme":"","pros":[],"cons":[],"comparison":{"movement":"낮음","cost":"중간","rest":"높음","shopping":"중간","activity":"낮음","familyFriendly":"중간","weatherFit":"높음"}}]}'
  ].filter(Boolean).join("\n");
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
    "Do not use the Korean words 추천, 최적, 베스트, 1순위.",
    "All visible text must be concise Korean except Day titles.",
    "Generate one plan per selected option.",
    "plans length must exactly match selectedOptions length.",
    "Estimate itinerary day count from duration. For example, 3박 4일 means 4 days, 4박 5일 means 5 days.",
    "Generate itinerary day count to match the duration value.",
    "Each itinerary day must include 4 to 7 schedule items when possible.",
    "Each schedule item must include time, place, activity, and move.",
    "The first day should start with arrival or check-in if natural.",
    "The final day should include checkout or return movement if natural.",
    "Avoid unrealistic long-distance movement in a short time.",
    "Reflect companions, budget, themes, and notes.",
    "Output shape:",
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
    "Do not use the Korean words 추천, 최적, 베스트, 1순위.",
    "Keep the original structure.",
    "Preserve unrelated information as much as possible.",
    "Apply the user's revision text only where needed.",
    "All visible text must stay concise Korean except Day titles.",
    "Output shape:",
    '{"plans":[{"optionId":"","label":"","country":"","city":"","duration":"","travelDate":"","weather":{"summary":"","temperature":"","rainLevel":"","outfitNote":""},"itinerary":[]}],"revisionSummary":""}'
  ].join("\n");
}

function buildTravelReviseInput(requestData) {
  return [
    "User input for travel plan revision:",
    JSON.stringify(requestData, null, 2)
  ].join("\n");
}

function buildTravelRevisionInstructions() {
  return buildTravelReviseInstructions();
}

function buildProviderUrl(provider, model, apiKey) {
  if (provider === "groq") {
    return "https://api.groq.com/openai/v1/chat/completions";
  }

  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
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

function buildProviderBody(provider, { model, instructions, input }) {
  if (provider === "groq") {
    return {
      model,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: input }
      ],
      temperature: 0.2,
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
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };
}

function extractProviderText(provider, responseJson) {
  if (provider === "groq") {
    return responseJson?.choices?.[0]?.message?.content || "";
  }

  return responseJson?.candidates?.[0]?.content?.parts?.map((part) => part?.text || "").join("") || "";
}

async function readJsonResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { rawText: text };
  }
}

async function callGeminiDirect({ apiKey, model, instructions, input }) {
  const safeApiKey = normalizeString(apiKey);
  const safeModel = normalizeString(model);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(safeModel)}:generateContent?key=${encodeURIComponent(safeApiKey)}`;
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${instructions}\n\n${input}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  };

  debugLog("Gemini direct request", {
    provider: "gemini",
    model: safeModel,
    url: endpoint.replace(encodeURIComponent(safeApiKey), "***"),
    apiKey: safeApiKey,
    body: requestBody
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  const responseJson = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error("다시 시도해 주세요");
  }

  return {
    provider: "gemini",
    model: safeModel,
    outputText: responseJson?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  };
}

async function callGroqDirect({ apiKey, model, instructions, input }) {
  const safeApiKey = normalizeString(apiKey);
  const safeModel = normalizeString(model);
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${safeApiKey}`
  };
  const requestBody = {
    model: safeModel,
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: input }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  };

  debugLog("Groq direct request", {
    provider: "groq",
    model: safeModel,
    url: endpoint,
    apiKey: safeApiKey,
    headers: requestHeaders,
    body: requestBody
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(requestBody)
  });

  const responseJson = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error("다시 시도해 주세요");
  }

  return {
    provider: "groq",
    model: safeModel,
    outputText: responseJson?.choices?.[0]?.message?.content || ""
  };
}

async function callDirectProvider(provider, requestType, requestPayload, requestMeta = {}) {
  const activeAiSettings = getActiveAiSettings();
  const apiKey = normalizeString(activeAiSettings.apiKey);
  const model = normalizeString(activeAiSettings.model) || getDefaultModelForProvider(provider);

  if (!apiKey) {
    throw new Error("API 키 확인이 필요합니다.");
  }

  let instructions = "";
  let inputTitle = "";

  if (requestType === "options") {
    instructions = buildTravelOptionsInstructions(requestMeta.instructionSuffix || "");
    inputTitle = "User input:";
  } else if (requestType === "details") {
    instructions = buildTravelDetailsInstructions();
    inputTitle = "User input for detailed travel plan generation:";
  } else {
    instructions = buildTravelRevisionInstructions();
    inputTitle = "User input for travel plan revision:";
  }

  const fullInput = `${inputTitle}\n${JSON.stringify(requestPayload, null, 2)}${requestMeta.inputSuffix ? `\n${requestMeta.inputSuffix}` : ""}`;

  if (provider === "gemini") {
    const geminiResult = await callGeminiDirect({
      apiKey,
      model,
      instructions,
      input: fullInput
    });

    return {
      parsed: parseJsonSafely(geminiResult.outputText),
      provider: geminiResult.provider,
      model: geminiResult.model
    };
  }

  if (provider === "groq") {
    const groqResult = await callGroqDirect({
      apiKey,
      model,
      instructions,
      input: fullInput
    });

    return {
      parsed: parseJsonSafely(groqResult.outputText),
      provider: groqResult.provider,
      model: groqResult.model
    };
  }

  const requestUrl = buildProviderUrl(provider, model, apiKey);
  const requestHeaders = buildProviderHeaders(provider, apiKey);
  const requestBody = buildProviderBody(provider, {
    model,
    instructions,
    input: fullInput
  });

  debugLog("Direct AI request", {
    provider,
    model,
    url: requestUrl.replace(encodeURIComponent(apiKey), "***"),
    apiKey,
    headers: requestHeaders,
    body: requestBody
  });

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(requestBody)
  });

  const responseJson = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      responseJson?.error?.message ||
      responseJson?.message ||
      responseJson?.rawText ||
      "AI 요청에 실패했습니다."
    );
  }

  return {
    parsed: parseJsonSafely(extractProviderText(provider, responseJson)),
    provider,
    model
  };
}

async function callServerApi(path, payload) {
  debugLog("Server AI request", {
    path,
    headers: {
      "Content-Type": "application/json"
    },
    body: payload
  });

  const response = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const responseJson = await readJsonResponse(response);

  if (!response.ok || responseJson?.success === false) {
    throw new Error(responseJson?.error || responseJson?.message || "서버 요청에 실패했습니다.");
  }

  return responseJson.data || responseJson;
}

function createMockDetailsFromOptions(options) {
  return options.map((option) => ({
    optionId: option.id,
    label: option.label,
    country: option.country,
    city: option.city,
    duration: appState.duration || "3박 4일",
    travelDate: appState.travelDate || "가을 추천",
    weather: {
      summary: "이동하기 무난한 시즌",
      temperature: "18~25도",
      rainLevel: "보통",
      outfitNote: "가벼운 겉옷 추천"
    },
    itinerary: [
      {
        day: 1,
        title: "Day 1",
        schedule: [
          { time: "10:00", place: `${option.city} 공항`, activity: "도착 후 이동", move: "공항철도 또는 택시" },
          { time: "12:30", place: "숙소 주변", activity: "점심과 체크인", move: "도보" },
          { time: "15:00", place: "핵심 지역", activity: "첫 산책", move: "도보 또는 지하철" },
          { time: "19:00", place: "대표 맛집 거리", activity: "저녁 식사", move: "대중교통" }
        ]
      },
      {
        day: 2,
        title: "Day 2",
        schedule: [
          { time: "09:00", place: "브런치 카페", activity: "여유 있는 시작", move: "도보" },
          { time: "11:00", place: "대표 명소", activity: `${option.theme} 중심 코스`, move: "대중교통" },
          { time: "15:00", place: "로컬 스팟", activity: "취향 맞춤 일정", move: "도보" },
          { time: "18:30", place: "저녁 거리", activity: "야간 분위기 즐기기", move: "도보" }
        ]
      }
    ]
  }));
}

function optionMatchesPreferences(option, payload) {
  const preferredTokens = parseCountryPreferenceTokens(payload.preferredCountries);
  const excludedTokens = parseCountryPreferenceTokens(payload.excludedCountries);

  if (payload.hasCountry && payload.country && !countryMatchesToken(option.country, payload.country)) {
    return false;
  }

  if (payload.city && normalizeLookupKey(option.city) !== normalizeLookupKey(payload.city)) {
    return false;
  }

  if (excludedTokens.some((token) => countryMatchesToken(option.country, token))) {
    return false;
  }

  if (preferredTokens.length) {
    return preferredTokens.some((token) => countryMatchesToken(option.country, token));
  }

  return true;
}

function buildFallbackOptionsFromLibrary(payload, { respectPreferred = true } = {}) {
  const preferredTokens = parseCountryPreferenceTokens(payload.preferredCountries);
  const excludedTokens = parseCountryPreferenceTokens(payload.excludedCountries);
  const selectedThemes = normalizeThemes(payload.themes);

  let pool = DESTINATION_LIBRARY.filter((option) => {
    if (payload.hasCountry && payload.country && !countryMatchesToken(option.country, payload.country)) {
      return false;
    }

    if (payload.city && normalizeLookupKey(option.city) !== normalizeLookupKey(payload.city)) {
      return false;
    }

    if (excludedTokens.some((token) => countryMatchesToken(option.country, token))) {
      return false;
    }

    if (respectPreferred && preferredTokens.length) {
      return preferredTokens.some((token) => countryMatchesToken(option.country, token));
    }

    return true;
  });

  if (selectedThemes.length) {
    const themed = pool.filter((option) =>
      selectedThemes.some((theme) => normalizeLookupKey(option.theme).includes(normalizeLookupKey(theme)))
    );
    if (themed.length) {
      pool = themed.concat(pool.filter((option) => !themed.includes(option)));
    }
  }

  return pool.map((option, index) => normalizeOption({
    ...option,
    id: `option-${String.fromCharCode(97 + index)}`,
    label: String.fromCharCode(65 + index)
  }, index));
}

function finalizeTravelOptions(rawOptions, payload, { allowFallback = true } = {}) {
  const normalizedOptions = normalizeArray(rawOptions).map(normalizeOption);
  const filteredOptions = normalizedOptions.filter((option) => optionMatchesPreferences(option, payload));

  let merged = [...filteredOptions];

  if (allowFallback && merged.length < 3) {
    const strictFallback = buildFallbackOptionsFromLibrary(payload, { respectPreferred: true });
    merged = merged.concat(strictFallback);
  }

  if (allowFallback && merged.length < 3) {
    const relaxedFallback = buildFallbackOptionsFromLibrary(payload, { respectPreferred: false });
    merged = merged.concat(relaxedFallback);
  }

  const deduped = [];
  const seen = new Set();

  for (const option of merged) {
    const key = `${normalizeLookupKey(option.country)}::${normalizeLookupKey(option.city)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(option);
  }

  return deduped.slice(0, 3).map((option, index) => ({
    ...option,
    id: `option-${String.fromCharCode(97 + index)}`,
    label: String.fromCharCode(65 + index)
  }));
}

function buildOptionRetryInstruction(payload) {
  const preferred = normalizeString(payload.preferredCountries);
  const excluded = normalizeString(payload.excludedCountries);

  return [
    "The previous output did not fully satisfy the country constraints.",
    preferred ? `Preferred country groups or countries: ${preferred}` : "",
    excluded ? `Excluded country groups or countries: ${excluded}` : "",
    "Regenerate all 3 options so every option strictly follows those constraints.",
    "If the constraints are narrow, still return 3 distinct options by varying city, pace, or concept without breaking the country rule."
  ].filter(Boolean).join("\n");
}

function normalizeOptionsResult(result, payload) {
  if (normalizeString(result?.source) === "mock") {
    return {
      ...result,
      options: finalizeTravelOptions(result.options, payload)
    };
  }

  return {
    ...result,
    options: finalizeTravelOptions(result?.options, payload, { allowFallback: false })
  };
}

function normalizePlanFromApi(plan, index) {
  return normalizePlan(plan, index);
}

function normalizePlansResult(result) {
  return {
    ...result,
    plans: normalizeArray(result?.plans).map(normalizePlanFromApi)
  };
}

async function callDirectAI({ instructions, input }) {
  const activeAiSettings = getActiveAiSettings();
  const provider = normalizeProviderName(activeAiSettings.provider);
  const apiKey = normalizeString(activeAiSettings.apiKey);
  const model = normalizeString(activeAiSettings.model) || getDefaultModelForProvider(provider);

  if (!apiKey) {
    throw new Error("API Key 확인 필요");
  }

  let result;

  if (provider === "gemini") {
    result = await callGeminiDirect({
      apiKey,
      model,
      instructions,
      input
    });
  } else if (provider === "groq") {
    result = await callGroqDirect({
      apiKey,
      model,
      instructions,
      input
    });
  } else {
    throw new Error("AI provider 설정 확인 필요");
  }

  return {
    success: true,
    provider: result.provider,
    model: result.model,
    data: safeJsonParse(result.outputText) || {}
  };
}

const mockTravelService = {
  async getOptions() {
    const payload = buildOptionsRequest();
    return normalizeOptionsResult({
      options: MOCK_OPTIONS,
      source: "mock",
      sourceLabel: "Mock"
    }, payload);
  },
  async getDetails() {
    const payload = buildDetailsRequest();
    return normalizePlansResult({
      plans: createMockDetailsFromOptions(payload.selectedOptions)
    });
  },
  async revisePlans() {
    return normalizePlansResult({
      plans: appState.detailedPlans,
      revisionSummary: "Mock 모드에서는 원본 일정을 유지합니다."
    });
  }
};

const directAiTravelService = {
  async getOptions(optionSetIndex = 0) {
    const requestData = {
      hasCountry: Boolean(appState.hasCountry),
      country: appState.country,
      city: appState.city,
      preferredCountries: appState.preferredCountries,
      excludedCountries: appState.excludedCountries,
      themes: appState.themes,
      travelDate: appState.travelDate,
      duration: appState.duration,
      companions: appState.companions,
      budget: appState.budget,
      notes: appState.notes
    };

    try {
      const directResult = await callDirectAI({
        instructions: buildTravelOptionsInstructions(optionSetIndex > 0 ? buildOptionRetryInstruction(requestData) : ""),
        input: buildTravelOptionsInput(requestData)
      });

      const normalizedResult = normalizeOptionsResult({
        options: normalizeArray(directResult.data?.options),
        source: "ai-direct",
        sourceLabel: `${CONFIG.AI_PROVIDERS[directResult.provider].label} AI 쨌 ${directResult.model}`
      }, requestData);

      if (normalizedResult.options.length >= 3 || optionSetIndex > 0) {
        return {
          ...normalizedResult,
          options: normalizedResult.options.length
            ? normalizedResult.options
            : finalizeTravelOptions([], requestData)
        };
      }

      return this.getOptions(1);
    } catch (error) {
      debugLog("Direct AI options fallback", {
        optionSetIndex,
        message: error?.message || "unknown error",
        requestData
      });

      const fallbackOptions = finalizeTravelOptions([], requestData);

      return {
        options: fallbackOptions,
        source: "fallback",
        sourceLabel: "Fallback"
      };
    }
  },
  async getDetails() {
    const requestData = {
      selectedOptions: getSelectedOptionObjects(),
      travelDate: appState.travelDate,
      duration: appState.duration,
      companions: appState.companions,
      budget: appState.budget,
      themes: appState.themes,
      notes: appState.notes
    };

    try {
      const result = await callDirectAI({
        instructions: buildTravelDetailsInstructions(),
        input: buildTravelDetailsInput(requestData)
      });

      const normalizedResult = normalizePlansResult({
        plans: normalizeArray(result.data?.plans)
      });

      if (normalizedResult.plans.length !== requestData.selectedOptions.length) {
        throw new Error("다시 시도해 주세요");
      }

      return normalizedResult;
    } catch (error) {
      debugLog("Direct AI details error", {
        message: error?.message || "unknown error",
        selectedOptionCount: requestData.selectedOptions.length,
        requestData
      });
      throw new Error("다시 시도해 주세요");
    }
  },
  async revisePlans() {
    const revisionText = normalizeString(appState.revisionRequest);
    const requestData = {
      detailedPlans: convertFrontendPlansToApiPlans(appState.detailedPlans),
      revisionText,
      appState: {
        hasCountry: appState.hasCountry,
        country: appState.country,
        city: appState.city,
        themes: appState.themes,
        travelDate: appState.travelDate,
        duration: appState.duration,
        companions: appState.companions,
        budget: appState.budget,
        notes: appState.notes
      }
    };

    try {
      const result = await callDirectAI({
        instructions: buildTravelReviseInstructions(),
        input: buildTravelReviseInput(requestData)
      });

      const normalizedResult = normalizePlansResult({
        plans: normalizeArray(result.data?.plans)
      });
      const revisionSummary = normalizeString(result.data?.revisionSummary);
      const revisions = revisionSummary
        ? [...normalizeArray(appState.revisions).map(normalizeString).filter(Boolean), revisionSummary]
        : normalizeArray(appState.revisions).map(normalizeString).filter(Boolean);

      if (!normalizedResult.plans.length) {
        throw new Error("다시 시도해 주세요");
      }

      if (revisionSummary) {
        updateState({
          revisions,
          revisionSummary
        });
      }

      return {
        plans: normalizedResult.plans,
        revisions,
        revisionText,
        revisionSummary
      };
    } catch (error) {
      debugLog("Direct AI revise error", {
        message: error?.message || "unknown error",
        requestData
      });
      throw new Error("다시 시도해 주세요");
    }
  }
};

const apiTravelService = {
  async getOptions() {
    const payload = buildOptionsRequest();
    const result = await callServerApi("/api/travel-options", payload);
    const normalizedResult = normalizeOptionsResult({
      ...result,
      source: "server-ai",
      sourceLabel: "Server AI"
    }, payload);

    if (normalizedResult.options.length !== 3) {
      throw new Error("議곌굔??留욌뒗 ?듭뀡??異⑸텇??留뚮뱾吏 紐삵뻽?듬땲?? ?ㅼ떆 ?쒕룄??二쇱꽭??");
    }

    return normalizedResult;
  },
  async getDetails() {
    const payload = buildDetailsRequest();
    const result = await callServerApi("/api/travel-details", payload);
    return normalizePlansResult(result);
  },
  async revisePlans() {
    const payload = buildRevisionRequest(normalizeString(appState.revisionRequest));
    const result = await callServerApi("/api/travel-revise", payload);
    return normalizePlansResult(result);
  }
};

function getTravelService() {
  if (CONFIG.USE_MOCK) {
    return mockTravelService;
  }

  if (CONFIG.DIRECT_AI_MODE) {
    return directAiTravelService;
  }

  return apiTravelService;
}

async function generateTravelOptions() {
  return getTravelService().getOptions(0);
  const payload = buildOptionsRequest();

  if (CONFIG.USE_MOCK) {
    return {
      options: finalizeTravelOptions(MOCK_OPTIONS, payload),
      source: "mock",
      sourceLabel: "Mock"
    };
  }

  if (CONFIG.DIRECT_AI_MODE) {
    const firstResult = await callDirectProvider(getActiveAiSettings().provider, "options", payload);
    const firstPassOptions = finalizeTravelOptions(firstResult.parsed.options, payload, { allowFallback: false });

    if (firstPassOptions.length === 3) {
      return {
        options: firstPassOptions,
        source: "ai-direct",
        sourceLabel: `${CONFIG.AI_PROVIDERS[firstResult.provider].label} AI · ${firstResult.model}`
      };
    }

    const retryResult = await callDirectProvider(
      getActiveAiSettings().provider,
      "options",
      payload,
      {
        instructionSuffix: buildOptionRetryInstruction(payload)
      }
    );
    const retryOptions = finalizeTravelOptions(retryResult.parsed.options, payload, { allowFallback: false });

    if (retryOptions.length === 3) {
      return {
        options: retryOptions,
        source: "ai-direct",
        sourceLabel: `${CONFIG.AI_PROVIDERS[retryResult.provider].label} AI · ${retryResult.model}`
      };
    }

    throw new Error("조건에 맞는 AI 옵션 3개를 만들지 못했습니다. 입력 조건을 조금 넓혀 다시 시도해 주세요.");
  }

  const result = await callServerApi("/api/travel-options", payload);
  const validatedOptions = finalizeTravelOptions(result.options, payload, { allowFallback: false });

  if (validatedOptions.length !== 3) {
    throw new Error("조건에 맞는 옵션을 충분히 만들지 못했습니다. 다시 시도해 주세요.");
  }

  return {
    ...result,
    options: validatedOptions,
    source: "server-ai",
    sourceLabel: "Server AI"
  };
}

async function generateTravelDetails() {
  return getTravelService().getDetails();
  const payload = buildDetailsRequest();

  if (CONFIG.USE_MOCK) {
    return { plans: createMockDetailsFromOptions(payload.selectedOptions) };
  }

  if (CONFIG.DIRECT_AI_MODE) {
    const result = await callDirectProvider(getActiveAiSettings().provider, "details", payload);
    return result.parsed;
  }

  return callServerApi("/api/travel-details", payload);
}

async function reviseTravelDetails(revisionText) {
  updateState({ revisionRequest: revisionText });
  return getTravelService().revisePlans();
  const payload = buildRevisionRequest(revisionText);

  if (CONFIG.USE_MOCK) {
    return {
      plans: appState.detailedPlans,
      revisionSummary: "Mock 모드에서는 원본 일정을 유지합니다."
    };
  }

  if (CONFIG.DIRECT_AI_MODE) {
    const result = await callDirectProvider(getActiveAiSettings().provider, "revise", payload);
    return result.parsed;
  }

  return callServerApi("/api/travel-revise", payload);
}

function applySampleInput() {
  updateState(appState.hasCountry ? {
    country: "일본",
    city: "후쿠오카",
    preferredCountries: "",
    excludedCountries: "",
    travelDate: "10월",
    duration: "3박 4일",
    companions: "친구 2명",
    budget: "150만원",
    notes: "맛집과 산책 위주, 무리한 이동은 적게",
    themes: ["도시", "맛집"]
  } : {
    country: "",
    city: "",
    preferredCountries: "일본, 대만",
    excludedCountries: "미국",
    travelDate: "10월",
    duration: "3박 4일",
    companions: "친구 2명",
    budget: "150만원",
    notes: "맛집과 산책 위주, 숙소 이동은 단순하게",
    themes: ["도시", "맛집"]
  });
}

async function handleTravelFormSubmit(form) {
  const formData = new FormData(form);

  updateState({
    country: normalizeString(formData.get("country")),
    city: normalizeString(formData.get("city")),
    preferredCountries: normalizeString(formData.get("preferredCountries")),
    excludedCountries: normalizeString(formData.get("excludedCountries")),
    travelDate: normalizeString(formData.get("travelDate")),
    duration: normalizeString(formData.get("duration")),
    companions: normalizeString(formData.get("companions")),
    budget: normalizeString(formData.get("budget")),
    notes: normalizeString(formData.get("notes")),
    errorMessage: "",
    revisionSummary: ""
  });

  try {
    startLoading("options");
    renderScreen(appState.hasCountry ? "decided-form" : "undecided-form", { pushHistory: false });
    const result = await generateTravelOptions();
    updateState({
      isLoading: false,
      loadingStep: "",
      generatedOptions: normalizeArray(result.options).map(normalizeOption).slice(0, 3),
      optionSource: normalizeString(result.source),
      optionSourceLabel: normalizeString(result.sourceLabel),
      selectedOptions: [],
      detailedPlans: [],
      errorMessage: ""
    });
    renderScreen("options");
  } catch (error) {
    updateState({
      isLoading: false,
      errorMessage: error.message || "옵션 생성에 실패했습니다."
    });
    renderScreen(appState.hasCountry ? "decided-form" : "undecided-form", { pushHistory: false });
  }
}

async function handleBuildDetails() {
  try {
    startLoading("details");
    renderScreen("options", { pushHistory: false });
    const result = await generateTravelDetails();
    updateState({
      isLoading: false,
      loadingStep: "",
      detailedPlans: normalizeArray(result.plans).map(normalizePlan),
      revisionSummary: ""
    });
    renderScreen("details");
  } catch (error) {
    updateState({
      isLoading: false,
      errorMessage: error.message || "상세 일정 생성에 실패했습니다."
    });
    renderScreen("options", { pushHistory: false });
  }
}

async function handleRevisionSubmit(form) {
  const formData = new FormData(form);
  const revisionText = normalizeString(formData.get("revisionText"));

  if (!revisionText) {
    updateState({ errorMessage: "수정 요청을 입력해 주세요." });
    renderScreen("details", { pushHistory: false });
    return;
  }

  updateState({
    revisionRequest: revisionText,
    errorMessage: ""
  });

  try {
    setLoading(true);
    const result = await reviseTravelDetails(revisionText);
    updateState({
      isLoading: false,
      detailedPlans: normalizeArray(result.plans).map(normalizePlan),
      revisionSummary: normalizeString(result.revisionSummary) || "일정 수정이 반영되었습니다."
    });
    renderScreen("details", { pushHistory: false });
  } catch (error) {
    updateState({
      isLoading: false,
      errorMessage: error.message || "일정 수정에 실패했습니다."
    });
    renderScreen("details", { pushHistory: false });
  }
}

function bindScreenEvents(screenName) {
  const app = document.getElementById("app");
  if (!app) return;

  app.onclick = async (event) => {
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;

    const action = actionElement.dataset.action;

    if (action === "open-ai-settings") {
      renderScreen("ai-settings");
      return;
    }

    if (action === "choose-country") {
      const hasCountry = actionElement.dataset.value === "true";
      updateState({ hasCountry, errorMessage: "", revisionSummary: "" });
      renderScreen(hasCountry ? "decided-form" : "undecided-form");
      return;
    }

    if (action === "toggle-theme") {
      const theme = actionElement.dataset.theme;
      const themes = appState.themes.includes(theme)
        ? appState.themes.filter((item) => item !== theme)
        : [...appState.themes, theme];
      updateState({ themes });
      renderScreen(screenName, { pushHistory: false });
      return;
    }

    if (action === "sample-input") {
      applySampleInput();
      renderScreen(screenName, { pushHistory: false });
      return;
    }

    if (action === "save-ai-settings") {
      const providerInput = app.querySelector('[name="aiProvider"]');
      const modelInput = app.querySelector('[name="aiModel"]');
      const keyInput = app.querySelector('[name="aiApiKey"]');
      const provider = normalizeProviderName(providerInput?.value || "gemini");
      const model = normalizeString(modelInput?.value) || getDefaultModelForProvider(provider);
      const enteredKey = normalizeString(keyInput?.value);

      const currentAiSettings = getActiveAiSettings();
      saveAiSettings({
        provider,
        model,
        apiKey: enteredKey || currentAiSettings.apiKey
      });
      updateState({
        errorMessage: ""
      });
      renderScreen("home");
      return;
    }

    if (action === "reset-ai-settings") {
      clearAiSettings();
      updateState({
        errorMessage: ""
      });
      renderScreen("ai-settings", { pushHistory: false });
      return;
    }

    if (action === "edit-conditions") {
      renderScreen(appState.hasCountry ? "decided-form" : "undecided-form");
      return;
    }

    if (action === "refresh-options") {
      try {
        setLoading(true);
        const result = await generateTravelOptions();
        updateState({
          isLoading: false,
          generatedOptions: normalizeArray(result.options).map(normalizeOption).slice(0, 3),
          optionSource: normalizeString(result.source),
          optionSourceLabel: normalizeString(result.sourceLabel),
          selectedOptions: [],
          detailedPlans: [],
          errorMessage: ""
        });
        renderScreen("options", { pushHistory: false });
      } catch (error) {
        updateState({
          isLoading: false,
          errorMessage: error.message || "옵션 재생성에 실패했습니다."
        });
        renderScreen("options", { pushHistory: false });
      }
      return;
    }

    if (action === "toggle-option") {
      const optionId = actionElement.dataset.id;
      const selectedOptions = appState.selectedOptions.includes(optionId)
        ? appState.selectedOptions.filter((id) => id !== optionId)
        : [...appState.selectedOptions, optionId];
      updateState({ selectedOptions });
      renderScreen("options", { pushHistory: false });
      return;
    }

    if (action === "build-details") {
      await handleBuildDetails();
      return;
    }

    if (action === "clear-revision") {
      updateState({
        revisionRequest: "",
        revisionSummary: "",
        errorMessage: ""
      });
      renderScreen("details", { pushHistory: false });
      return;
    }

    if (action === "back") {
      goBack();
      return;
    }

    if (action === "home") {
      goHome();
    }
  };

  app.onchange = (event) => {
    if (screenName !== "ai-settings") return;

    const target = event.target;
    if (target && target.name === "aiProvider") {
      const provider = normalizeProviderName(target.value);
      const modelInput = app.querySelector('[name="aiModel"]');
      if (modelInput) {
        modelInput.value = getDefaultModelForProvider(provider);
      }
    }
  };

  app.onsubmit = async (event) => {
    if (!(event.target instanceof HTMLFormElement)) return;

    if (event.target.id === "travel-form") {
      event.preventDefault();
      await handleTravelFormSubmit(event.target);
      return;
    }

    if (event.target.id === "revision-form") {
      event.preventDefault();
      await handleRevisionSubmit(event.target);
    }
  };
}

function renderStatusMarkup() {
  if (appState.isLoading) {
    const title = appState.loadingStep === "details" ? "상세 일정 생성 중" : "옵션 생성 중";
    const copy = appState.loadingStep === "details"
      ? "동선을 맞추고 일정을 정리하고 있어요"
      : "조건을 비교해서 A부터 C까지 준비하고 있어요";

    return `
      <section class="status-card status-card-loading" aria-live="polite">
        <div class="loading-status">
          <div class="loading-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="loading-copy">
            <p class="loading-title">${escapeHtml(title)}</p>
            <p class="loading-text">${escapeHtml(copy)}</p>
          </div>
        </div>
      </section>
    `;
  }

  if (appState.errorMessage) {
    return `<section class="status-card"><p>${escapeHtml(appState.errorMessage)}</p></section>`;
  }

  return "";
}

window.addEventListener("hashchange", () => {
  renderScreen(appState.currentScreen || "home", { pushHistory: false });
});

const aiStatusBadgeElement = document.getElementById("aiStatusBadge");
if (aiStatusBadgeElement) {
  aiStatusBadgeElement.addEventListener("click", () => {
    renderScreen("ai-settings");
  });
}

syncVersionBadge();
syncAiStatusBadge();
renderScreen(appState.currentScreen || "home", { pushHistory: false });
