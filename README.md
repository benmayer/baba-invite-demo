# baba — Invite Friends (prototype)

A React Native prototype of the invite-friends flow. Using Expo and TypeScript.

## Prerequisites

- Node.js
- Xcode with an iOS simulator configured
- An iOS simulator already set up in Xcode (Simulator > Device)

## Getting started

```bash
# Install dependencies
npm install

# Run on iOS simulator (builds native code)
npx expo run:ios
```

## Swapping in a real API

All network calls go through `src/api/client.ts`. To connect a real backend, replace the `get` and `post` functions with `fetch` calls — the service and component layers shouldn't need any changes.
