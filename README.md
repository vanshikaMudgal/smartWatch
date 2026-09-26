# TRILYONEX Rockfall Safety Simulation

A frontend-only smartwatch evacuation simulation built with React and Vite. The six navigation steps are stored locally in JavaScript; no backend, API, GPS hardware, or external data is used.

## Run locally

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The generated static site is in `dist/` and can be deployed to Vercel, Netlify, or another static host. The interface is self-contained and uses system fonts; it makes no network requests at runtime.