# Duolingo

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

## Sound effects

Original Web Audio tones play when checking a correct or incorrect answer and
when pressing Continue after the final correct answer. Lessons and practice use
the same sounds. Sound starts enabled; the Sound on/off button in lessons and
on the completion screen saves your preference in this browser. Muting stops
the current sound. Each new cue replaces the previous one.

No audio files, external services, or extra packages are needed. Playback failures
do not interrupt lessons or visual feedback. If the sound preference cannot be
saved, the selected setting still applies for the current lesson session.

## Dragon encouragement

Immediately after the second correct answer, the dragon appears with a speech
bubble saying "Keep going youre doing great". It stays across questions in lessons
and practice. Its wings flap briefly on each correct answer from that point onward,
then rest. A wrong answer gives it a sad face and hides the speech bubble; the
dragon then fades away over 1.8 seconds. It returns on the next correct answer.
Continuing does not restart the animation. Reduced-motion preferences disable
flapping and make the fade immediate.
The message uses reserved space, does not take focus, and needs no dismissal.
The home-screen dragon keeps its existing animation.

## Read answers aloud

Selecting an answer or adding a word-bank tile reads that choice using an
available browser voice. Read aloud starts on and has its own toggle, separate
from sound effects; its preference is saved in this browser. Removing a word,
checking an answer, continuing, disabling read aloud, or leaving the lesson
stops speech. Rapid selections replace earlier speech instead of queuing it.

Exercises specify the language of their choices, including English choices
within foreign-language lessons. Japanese choices keep their visible romanized
spelling but use native-script speech text. If no voice matches the language,
the app shows a short notice and the exercise remains usable.

No speech API key, microphone permission, or backend is required. Available
voices and pronunciation depend on the browser and device; some browser voices
use an online service. Native-speaker pronunciation review is still needed.
Run `npm test` for voice selection, cancellation, failure, and content checks.
