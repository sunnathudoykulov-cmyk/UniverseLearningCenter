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

## AI assistant

Free-form Telegram messages are answered through the OpenAI Responses API. Configure:

- `OPENAI_API_KEY` — server-only API key. Do not paste it into client code or prefix it with `VITE_`;
- `OPENAI_MODEL` — optional model override; defaults to `gpt-5.6-luna`;
- `BOT_CONTENT_URL` — optional public JSON endpoint containing owner-managed course facts.

The assistant answers in Russian or Uzbek and is instructed to use only official course data. It must
not invent prices, schedules, available seats, teacher qualifications, guarantees, or results. Phone
numbers and email addresses typed into a free-form question are redacted before the question is sent
to OpenAI. If OpenAI is unavailable, the bot returns a deterministic administrator contact fallback.

### Edit prices and schedules with Google Sheets

1. Create a Google Sheet and name one tab `BotContent`.
2. Add this exact header row:
   `slug`, `titleRu`, `titleUz`, `descriptionRu`, `descriptionUz`, `price`, `schedule`, `groups`, `freeSeats`.
3. Add one row per course. Keep slugs stable: `general-english`, `ielts-cefr`, `russian`,
   `trki-milliy`, `arabic`, and `scratch`.
4. Open **Extensions → Apps Script** and paste `docs/google-apps-script.gs`.
5. Deploy it as a Web app that can be accessed by anyone with the URL.
6. Put the resulting `/exec` URL into the Vercel environment variable `BOT_CONTENT_URL` and redeploy once.

After that, editing cells in the sheet updates both deterministic course cards and AI answers. Warm
functions cache the sheet for up to 60 seconds. Leave unknown facts blank; the assistant will ask the
visitor to confirm them with an administrator.
