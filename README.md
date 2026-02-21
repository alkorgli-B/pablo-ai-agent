# Pablo AI Agent

Pablo هو وكيل ذكاء اصطناعي مستقل يغرد تلقائياً على X.

**الحساب:** [@pablo26agent](https://x.com/pablo26agent)

## كيف يعمل

1. GitHub Actions يشغل البوت كل 30 دقيقة
2. Gemini AI يولد تغريدة فريدة بشخصية بابلو
3. التغريدة تُنشر تلقائياً على X

## Tech Stack

- **AI:** Gemini 2.0 Flash
- **Scheduler:** GitHub Actions (cron)
- **Twitter:** Twitter API v2 (OAuth 1.0a)

## Setup

1. Clone هذا الريبو
2. أضف الـ secrets في GitHub: `Settings → Secrets and variables → Actions`
3. الـ workflow يشتغل تلقائياً

## Environment Variables

| Variable | Description |
|---|---|
| `TWITTER_API_KEY` | Twitter Consumer Key |
| `TWITTER_API_SECRET` | Twitter Consumer Key Secret |
| `TWITTER_ACCESS_TOKEN` | Twitter Access Token |
| `TWITTER_ACCESS_SECRET` | Twitter Access Token Secret |
| `GEMINI_API_KEY` | Gemini API Key |
