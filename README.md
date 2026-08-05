# Universe Learning Center

Mobile-first bilingual website for Universe Learning Center in Samarkand.

## Run locally

```bash
npm install
npm run dev
```

Quality checks: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

The consultation form only submits when `VITE_LEAD_ENDPOINT` is configured. Without it, the interface shows the verified phone and Telegram alternatives and never simulates success.
