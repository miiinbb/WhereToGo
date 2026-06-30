# WHERE TO GO?

브라우저에서 `npm install` 없이 Gemini / Groq API를 직접 호출하는 여행 추천 웹앱입니다.

## 실행 방법

1. `index.html`을 브라우저에서 엽니다.
2. 화면의 `AI 설정`을 엽니다.
3. Provider를 `Gemini` 또는 `Groq`로 선택합니다.
4. API Key를 입력합니다.
5. 필요하면 Model을 확인하거나 수정합니다.
6. 홈 화면에서 조건을 입력한 뒤 `옵션 보기`를 실행합니다.

## Gemini API Key 준비

1. Google AI Studio에서 Gemini API Key를 발급합니다.
2. 발급한 키를 `AI 설정`의 API Key 칸에 입력합니다.
3. Provider는 `Gemini`로 선택합니다.
4. Model은 기본값 `gemini-2.5-flash`를 사용해도 됩니다.

## Groq API Key 준비

1. Groq Console에서 API Key를 발급합니다.
2. 발급한 키를 `AI 설정`의 API Key 칸에 입력합니다.
3. Provider는 `Groq`로 선택합니다.
4. Model은 기본값 `llama-3.3-70b-versatile`를 사용해도 됩니다.

## API Key 저장 방식

- API Key는 `sessionStorage`만 사용합니다.
- 브라우저를 닫으면 API Key가 사라집니다.
- `localStorage`에는 저장하지 않습니다.

## 주의사항

- 이 방식은 개인 테스트용입니다.
- 배포용으로는 서버 프록시를 사용하세요.
- API Key가 브라우저 네트워크 요청에 노출될 수 있습니다.

## 문제가 생겼을 때

1. API Key가 제대로 입력되어 있는지 확인합니다.
2. Provider가 `Gemini` 또는 `Groq`로 맞는지 확인합니다.
3. Model 이름이 올바른지 확인합니다.
4. CORS 또는 브라우저 차단 여부를 확인합니다.
5. 화면만 먼저 확인하고 싶으면 `CONFIG.USE_MOCK = true`로 mock 모드를 사용합니다.

## 참고

- `mock` 모드는 실제 AI 호출 없이 화면 흐름만 테스트할 때 사용합니다.
- Direct AI 모드에서는 브라우저가 Gemini / Groq API에 직접 요청합니다.
- `server.js`는 남겨둘 수 있지만, 이 README 기준의 기본 실행 방식에서는 사용하지 않습니다.
