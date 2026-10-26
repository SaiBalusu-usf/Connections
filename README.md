<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14cAS1yM27mmib5JzVb9L4YvDVzhsV2pU

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Credential boundary

Use Node.js 22 or newer. GEMINI_API_KEY is read only by the local Vite server.
The browser calls /api/gemini; the key is never defined into browser code. Both
npm run dev and npm run preview bind to 127.0.0.1:3000 and accept only loopback,
same-origin JSON requests, with body, rate, and concurrency limits. Run npm test
for mocked-provider security regressions; tests do not contact Google.

This is a single-user local application. Do not publish the Vite server through
a tunnel or reverse proxy. A static-only deployment has no AI endpoint and fails
closed; public hosting requires a separately authenticated server deployment.
If an older build was published with GEMINI_API_KEY configured, revoke or rotate
that key and review usage. Deleting the old bundle alone cannot revoke it.
