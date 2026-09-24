# Design System

This documents the visual language already in use across the app — token names, components,
states, and motion — so new UI stays consistent instead of re-deriving one-off styles. It
describes what's implemented in [`src/app/globals.css`](src/app/globals.css) and
`src/components/`, not an aspirational spec.

Brand names/colors intentionally mirror Duolingo's own (`duo-green`, `duo-blue`, etc.) — that's
a deliberate product choice for this clone, not an oversight.

## Tokens (`src/app/globals.css`)

All color, font, and animation tokens are declared once in the Tailwind v4 `@theme` block and
consumed as utility classes (`bg-duo-green`, `text-duo-eel`, `font-sans`, …) or `var(--color-*)`
in arbitrary values. Never hardcode a hex value or a raw Tailwind palette color (`bg-green-50`,
`text-slate-600`, etc.) in a component — add or reuse a token instead.

### Color

| Role | Base | Dark (borders/pressed/text-on-light) | Light (tint backgrounds) |
|---|---|---|---|
| Primary (correct / success / CTA) | `--color-duo-green` | `--color-duo-green-dark` | `--color-duo-green-light` |
| Secondary (info / links / word-bank) | `--color-duo-blue` | `--color-duo-blue-dark` | `--color-duo-blue-light` |
| Danger (incorrect / errors) | `--color-duo-red` | `--color-duo-red-dark` | `--color-duo-red-light` |
| Warning (streak-at-risk) | `--color-duo-orange` | `--color-duo-orange-dark` | `--color-duo-orange-light` |
| Reward (XP) | `--color-duo-yellow` | `--color-duo-yellow-dark` | — |
| Accent (variety) | `--color-duo-purple` | `--color-duo-purple-dark` | — |

Each `*-light` tint is a near-white wash (e.g. `--color-duo-green-light: #f0fdf4`) used as a
background behind the base/dark pair to indicate state — never use a raw `bg-{color}-50`
Tailwind utility for this; it silently drifts from the brand palette. `*-dark` doubles as both
the pressable-button shadow color and the text color used on a light tint background.

Neutrals: `--color-duo-gray-100` (subtle fill) through `--color-duo-gray-700`, plus
`--color-duo-eel` (`#3c3c3c`, primary body/heading text — not `gray-900`).

### Typography

Single font family: `--font-sans` → Nunito (`--font-nunito`, loaded in
[`layout.tsx`](src/app/layout.tsx)). No secondary display face — weight carries hierarchy:

- `font-extrabold` / `font-black` — headings, numerals (XP, streak count), primary buttons
- `font-bold` — labels, secondary buttons, body emphasis
- Uppercase + `tracking-wide` — small labels/eyebrows (`text-xs`/`text-sm font-bold uppercase`)

### Shape & elevation

- **Radius**: `rounded-full` for pills, avatars, and circular lesson nodes; `rounded-2xl` for
  buttons, cards, and badges; `rounded-3xl` for page-level section containers; `rounded-xl` for
  small chips (word-bank tiles).
- **Pressable shadow** (buttons, `DuoButton`): a flat, hard-edged "pushable" shadow, not blur —
  `shadow-[0_4px_0_var(--duo-shadow)]` at rest, collapsing to `0_1px_0` + `translate-y-[3px]` on
  `:active`. Each `DuoButton` variant only needs to set the `--duo-shadow` custom property to its
  `*-dark` token — the shadow/translate mechanics live once in the shared base class. See
  [`DuoButton.tsx`](src/components/DuoButton.tsx).
- **Circular pressable nodes** (`LessonPath`'s lesson button) use the same "pushable" idea via
  `border-b-8` collapsing to `border-b-4` on `:active` instead of `box-shadow`, since a thick
  bottom border reads better on a circle than an offset shadow.
- **Cards/sections** use a plain `border-2 border-duo-gray-200` outline, not a shadow — elevation
  in this system comes from color/border, not blur.

### Motion

Four keyframes only, defined once in `globals.css`, applied as `.animate-duo-*` utility classes:

| Class | Use |
|---|---|
| `animate-duo-pop` | Pop-in on lesson completion / correct feedback |
| `animate-duo-bounce` | Idle attention-getter (mascots, at-risk streak flame) |
| `animate-duo-pulse-ring` | Ring pulse on the current/active lesson node |
| `animate-duo-slide-up` | Feedback banner entering from the bottom |

No continuous motion elsewhere — the app is touch-first and mostly static; animation marks a
state change, it doesn't run ambiently.

## Components (`src/components/`)

| Component | Purpose | Notes |
|---|---|---|
| `DuoButton` | All button actions | Variants: `primary`, `secondary`, `danger`, `outline`. See pressable shadow above. |
| `Badge` (in `StatBadge.tsx`) | Pill container for a stat | Internal — `StreakBadge`/`XpBadge` are the public API; `tone="warning"` gives the at-risk tint. |
| `FeedbackBanner` | Post-answer correct/incorrect banner | Slides up; tint background is `*-light`, icon circle is the base color. |
| `LessonProgressBar` | Lesson-in-progress bar | Track is `gray-200`, fill is `duo-green`. |
| `LessonPath` | Home-screen lesson node(s) | Circular pressable node + locked/upcoming node. |
| `WeekStreakCalendar` | 7-day streak strip | Reuses `FlameIcon`'s `active` prop; today gets a `ring-2 ring-duo-blue`. |
| `icons.tsx` | `FlameIcon`, `BoltIcon`, `LockIcon`, `CheckIcon`, `StarIcon` | Plain inline SVG, colored via `var(--color-duo-*)` — no icon font/library. |

### State conventions

Applied consistently across `MultipleChoiceExercise`, `WordBankExercise`, `DuoButton`, and
`StatBadge`:

- **Selected (unchecked)**: `border-duo-blue` + `bg-duo-blue-light`
- **Correct**: `border-duo-green` + `bg-duo-green-light`, text `duo-green-dark`
- **Incorrect**: `border-duo-red` + `bg-duo-red-light`, text `duo-red-dark`
- **Warning / at-risk**: `border-duo-orange/40` + `bg-duo-orange-light`
- **Disabled**: flat gray (`bg-duo-gray-200`/`text-duo-gray-400`), shadow drops to
  `--color-duo-gray-300`, no press animation
- Border weight for state indication is always `border-2` (or `border-b-4`/`border-b-8` for the
  pressable variants above), always paired with a tint background — never color-only.

## Content voice

- Second person, encouraging, never punitive on a wrong answer ("Not quite right", not "Wrong").
- Headlines are short and declarative ("Lesson Complete!").
- Numerals (XP, streak) are always paired with their glyph (`BoltIcon`, `FlameIcon`), never shown bare.

## Adding to this system

- New state color → add a `--color-duo-{name}` **and** `--color-duo-{name}-dark` pair; add a
  `-light` tint too if it'll ever sit behind text/icons as a background.
- New button-like affordance → prefer extending `DuoButton`'s `Variant` union over writing a new
  pressable-shadow block from scratch.
- New badge/pill → extend the internal `Badge` in `StatBadge.tsx` rather than duplicating its
  `rounded-2xl border-2 px-3 py-1.5` shell.
