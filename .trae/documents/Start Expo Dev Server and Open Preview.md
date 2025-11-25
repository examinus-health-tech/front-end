## Goal
Start the frontend in a local web browser using Expo, verify environment variables, and surface the preview URL.

## Context
- Framework: Expo (React Native) — not Next/Vite
- Entry: `/Users/wanderhungerbuhler/whfdev/examinus-health-tech/front-end/App.tsx` (OneSignal init near `App.tsx:134`)
- Router: `/Users/wanderhungerbuhler/whfdev/examinus-health-tech/front-end/src/routes/index.tsx`
- Scripts: `npm run web` (expo web), `npm run start` (metro)
- Env vars: `.env`, `.env.production`
  - `EXPO_PUBLIC_API_URL` (used in `src/services/api.ts`)
  - `ONESIGNAL_APP_ID` (used in `App.tsx`)

## Plan
1. Install dependencies
   - In `front-end` directory, run `npm install` (or `npm ci` if lockfile present).
2. Launch web dev server
   - Run `npm run web` to start Expo Web on default port 19006.
   - If port conflict occurs, run `EXPO_WEB_PORT=19007 npm run web`.
3. Provide preview URL
   - Wait for the server to print the local URL (e.g., `http://localhost:19006/`) and open it for you.
4. Validate environment variables
   - Confirm `.env` contains `EXPO_PUBLIC_API_URL` and `ONESIGNAL_APP_ID`.
   - Ensure public Expo prefix is used for any variable accessed in app code (`EXPO_PUBLIC_*`).
5. Quick runtime checks
   - Confirm OneSignal initialization in `/Users/wanderhungerbuhler/whfdev/examinus-health-tech/front-end/App.tsx:134` reads `process.env.ONESIGNAL_APP_ID`.
   - Confirm API client in `src/services/api.ts` uses `process.env.EXPO_PUBLIC_API_URL`.
6. Optional native run
   - If you want device/emulator testing, use `npm run start` and connect with Expo Go.

## Outputs
- Running dev server with a visible preview URL
- Confirmation that env variables are loaded and referenced correctly

## Rollback
- Stop the dev server; no persistent changes made.