# AI QA Scenarios

## 공통 확인 기준

- 옵션이 정확히 3개 생성되는가
- 금지어 `추천`, `최적`, `베스트`, `1순위`가 없는가
- API Key 원문이 화면에 보이지 않는가
- API Key가 `sessionStorage`에만 저장되는가
- `localStorage`에는 저장되지 않는가
- 오류 발생 시 `다시 시도해 주세요` 또는 `API Key 확인 필요`가 표시되는가

## 무설치 브라우저 직접 호출 테스트

### 1. Gemini API Key 입력 후 옵션 생성

- `index.html`을 브라우저에서 연다
- `AI 설정`에서 Provider를 `Gemini`로 선택한다
- Gemini API Key를 입력한다
- 모델이 올바른지 확인한다
- 홈 화면에서 조건을 입력하고 `옵션 보기`를 실행한다

확인 항목

- API Key 원문이 화면에 보이지 않는가
- `sessionStorage`에만 저장되는가
- 옵션이 3개 생성되는가
- 오류 없이 다음 화면으로 넘어가는가

### 2. Groq API Key 입력 후 옵션 생성

- `AI 설정`에서 Provider를 `Groq`로 선택한다
- Groq API Key를 입력한다
- 모델이 올바른지 확인한다
- `옵션 보기`를 실행한다

확인 항목

- API Key 원문이 화면에 보이지 않는가
- `sessionStorage`에만 저장되는가
- 옵션이 3개 생성되는가
- 오류 없이 다음 화면으로 넘어가는가

### 3. Gemini 상세 일정 생성

- Gemini API Key와 Provider를 설정한다
- 옵션을 3개 생성한다
- 옵션을 선택한 뒤 상세 일정 생성을 실행한다

확인 항목

- API Key 원문이 화면에 보이지 않는가
- `sessionStorage`에만 저장되는가
- 상세 일정 day 수가 `duration`과 맞는가
- 여러 옵션을 선택하면 선택한 수만큼 plan이 생성되는가

### 4. Groq 상세 일정 생성

- Groq API Key와 Provider를 설정한다
- 옵션을 3개 생성한다
- 옵션을 선택한 뒤 상세 일정 생성을 실행한다

확인 항목

- API Key 원문이 화면에 보이지 않는가
- `sessionStorage`에만 저장되는가
- 상세 일정 day 수가 `duration`과 맞는가
- 여러 옵션을 선택하면 선택한 수만큼 plan이 생성되는가

### 5. Gemini 일정 수정

- Gemini API Key와 Provider를 설정한다
- 상세 일정 화면에서 수정 요청을 입력한다
- 수정 반영을 실행한다

확인 항목

- API Key 원문이 화면에 보이지 않는가
- `sessionStorage`에만 저장되는가
- 수정 요청이 반영되는가
- 수정 이력이 남는가

### 6. Groq 일정 수정

- Groq API Key와 Provider를 설정한다
- 상세 일정 화면에서 수정 요청을 입력한다
- 수정 반영을 실행한다

확인 항목

- API Key 원문이 화면에 보이지 않는가
- `sessionStorage`에만 저장되는가
- 수정 요청이 반영되는가
- 수정 이력이 남는가

### 7. API Key 없이 옵션 보기 클릭

- `AI 설정`에서 API Key를 비운다
- Provider는 하나 선택한다
- 홈 화면에서 `옵션 보기`를 실행한다

확인 항목

- `API Key 확인 필요`가 표시되는가
- 화면이 깨지지 않는가
- mock 화면이 아니라 직접 호출 흐름에서 막히는가

### 8. 브라우저 재시작 후 API Key 삭제 확인

- API Key를 입력하고 저장한다
- 브라우저를 닫는다
- 브라우저를 다시 연다
- `AI 설정`을 확인한다

확인 항목

- API Key 원문이 남아 있지 않은가
- `sessionStorage`가 초기화되었는가
- Provider와 Model만 기본값 또는 마지막 상태로 보이는가

## 추가 점검

- Provider가 `Gemini` 또는 `Groq`로 정확히 표시되는가
- Model이 사용 중인 설정과 맞는가
- CORS 또는 브라우저 차단이 발생하지 않는가
- mock 모드로 화면만 테스트할 수 있는가

## Mock 모드 화면 테스트

- `CONFIG.USE_MOCK = true`로 바꾼다
- AI Key 없이도 홈 화면, 옵션 화면, 상세 일정 화면이 정상 렌더링되는지 확인한다
- API 호출 없이 화면 흐름만 점검한다
