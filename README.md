# WHERE TO GO?

여행지를 고르고, 상세 일정을 만들고, 수정한 뒤 PDF/DOCX로 내려받는 웹앱입니다.

## 실행 방식

이 앱은 기본적으로 브라우저에서 직접 Gemini/Groq를 호출하지 않습니다.
`app.js`가 사용자에게 입력받은 `provider`, `model`, `apiKey`를 서버로 함께 보내고, `server.js`가 실제 AI 호출을 담당합니다.

핵심 흐름은 다음과 같습니다.

1. `index.html`이 `export.js`와 `app.js`를 로드합니다.
2. `app.js`에서 AI 설정을 `sessionStorage`에 저장합니다.
3. 여행 옵션, 상세 일정, 수정 요청은 `http://localhost:3000`의 서버로 전송됩니다.
4. `server.js`가 요청에 포함된 AI 설정을 우선 사용하고, 없으면 `.env`를 참고합니다.

## 파일 역할

- `index.html`: 앱 진입점
- `app.js`: UI, 상태 관리, AI 요청, fallback 처리
- `server.js`: Gemini/Groq 프록시 API
- `export.js`: DOCX/PDF 다운로드 생성
- `style.css`: 화면 스타일

## 설치

```bash
npm install
```

## 서버 실행

```bash
npm start
```

기본 포트는 `3000`입니다.

## AI 설정

앱 상단의 `AI 설정`에서 아래 항목을 입력합니다.

- Provider: `Gemini` 또는 `Groq`
- Model: 필요 시 직접 입력
- API Key: 현재 세션에서만 저장

설정은 `sessionStorage`에 보관됩니다.
브라우저를 완전히 닫으면 사라질 수 있습니다.

## 기본 모델

- Gemini: `gemini-2.5-flash`
- Groq: `llama-3.3-70b-versatile`

## 환경 변수

`.env` 파일을 사용할 수 있습니다.

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
PORT=3000
```

중요한 점은, UI에서 저장한 AI 설정이 있으면 그 값이 요청에 우선 반영된다는 것입니다.
즉, 서버 `.env`만 믿는 구조가 아니라, 화면에서 입력한 설정도 실제 호출에 연결됩니다.

## 동작 기준

- 여행 옵션은 항상 3개를 목표로 생성합니다.
- 3개 미만이거나 응답이 불완전하면 앱이 fallback으로 보정합니다.
- 상세 일정과 일정 수정도 같은 기준으로 처리합니다.
- JSON 응답이 코드블록으로 오거나 약간 깨져도 복구를 시도합니다.
- 인증 실패, 모델 오류, JSON 파싱 실패는 가능한 한 구분해서 보여줍니다.

## 문제 확인 순서

1. API Key가 비어 있지 않은지 확인합니다.
2. Provider와 Model이 서로 맞는지 확인합니다.
3. 서버가 `localhost:3000`에서 실행 중인지 확인합니다.
4. 브라우저 개발자 도구에서 네트워크 요청이 `/api/travel-options`, `/api/travel-details`, `/api/travel-revise`로 나가는지 확인합니다.
5. `sessionStorage`에 저장된 AI 설정이 유지되는지 확인합니다.

## 참고

- `mock` 모드는 유지되지만 기본 운영 경로는 서버 프록시입니다.
- `DIRECT_AI_MODE`는 꺼져 있습니다.
- `server.js`는 요청에 포함된 `aiSettings`를 우선 사용합니다.
