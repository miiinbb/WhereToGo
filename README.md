# WHERE TO GO?

Travel planner MVP with a static front end and a Node.js AI proxy server.

## Project Overview

- Front end: HTML, CSS, JavaScript
- Server: Node.js + Express
- AI providers: Gemini or Groq
- Mock/API switch: `CONFIG.USE_MOCK`

## Folder Structure

```text
WHERE TO GO/
├─ index.html
├─ style.css
├─ app.js
├─ server.js
├─ package.json
├─ .env.example
└─ README.md
```

## Install

```bash
npm install
```

## .env Setup

Create a `.env` file in the project root.

```env
AI_PROVIDER=gemini

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

PORT=3000
```

Rules:
- `AI_PROVIDER` must be `gemini` or `groq`.
- Default provider is `gemini`.
- When using Gemini, `GEMINI_API_KEY` is required.
- When using Groq, `GROQ_API_KEY` is required.
- Never put any API key in `app.js` or `index.html`.
- The server reads environment variables only on the backend.

## Run the Server

```bash
npm run dev
```

The server runs on `PORT` from `.env` and defaults to `3000`.

## Run the Front End

Open `index.html` in the browser, or serve the folder with any static server.

## Mock / API Switch

In `app.js`:

```js
const CONFIG = {
  USE_MOCK: true
};
```

- `true`: use mock data
- `false`: call the API server

## API Endpoints

- `POST /api/travel-options`
- `POST /api/travel-details`
- `POST /api/travel-revise`

The front end API call structure stays the same.

## Troubleshooting

- If requests fail, check that the server is running on `http://localhost:3000`
- Check `.env` values
- If you want to test without an AI key, set `CONFIG.USE_MOCK = true`
- If AI responses fail to parse, the server returns a JSON error response
