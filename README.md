# Universe Learning Center

Mobile-first bilingual website for Universe Learning Center in Samarkand.

## Run locally

```bash
npm install
npm run dev
```

Quality checks: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## Lead delivery

The consultation form posts to the same-origin Vercel Function at `/api/lead`. Configure these server-only variables in Vercel for Production, Preview, and Development as appropriate:

- `TELEGRAM_BOT_TOKEN` — token issued by BotFather;
- `TELEGRAM_CHAT_ID` — ID of the private administration group;
- `TELEGRAM_WEBHOOK_SECRET` — random secret sent by Telegram with every webhook request;
- `TELEGRAM_THREAD_ID` — optional forum topic ID;
- `ALLOWED_ORIGINS` — comma-separated list of permitted site origins.

Copy `.env.example` to `.env.local` for local `vercel dev` testing. Never prefix Telegram secrets with `VITE_` and never commit their values.

The customer bot webhook is `/api/telegram-webhook`. After deployment, register
`https://www.universesamcenter.uz/api/telegram-webhook` with Telegram using the same
`TELEGRAM_WEBHOOK_SECRET`. The bot offers RU/UZ navigation, course selection, contacts,
and a link to the site form with the selected course prefilled.
