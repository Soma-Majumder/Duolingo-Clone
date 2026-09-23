# Duolingo-Clone

Cloning Duolingo. First feature: a daily lesson and progress/streak system (see the [PRD](.) for requirements).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Daily lesson & streak feature

- Pick a language (Spanish, French, or Japanese) and complete that day's short lesson (multiple-choice and word-bank exercises).
- Wrong answers show the correct answer and must be retried before moving on.
- Completing the daily lesson awards XP, advances your streak, and updates your progress stats.
- The streak flame turns orange and pulses when it's "at risk" (lesson not yet done today with an active streak), and resets to zero if a full day is missed.
- Progress (lessons completed, current/longest streak, this week's completions) and a bonus practice round are available from the home screen.

Progress is currently stored in the browser's `localStorage` (no backend/auth yet), keyed per-device.
