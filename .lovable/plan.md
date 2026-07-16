## Iris by Tesla — Landing Page Build Plan

Replace the placeholder index route with a fully animated, single-page landing for Iris, Tesla's enterprise AI receptionist. Follow the chosen "Tesla industrial minimalism" direction exactly: white base, `#171A20` charcoal, `#E81919` accent, Outfit display + Inter body, generous white space, sharp geometric type.

### Design tokens (src/styles.css)
- Add `--color-tesla-dark: #171A20`, `--color-tesla-red: #E81919`, `--color-tesla-gray: #393C41` under `@theme inline`.
- Register `--font-display` (Outfit) and `--font-sans` (Inter).
- Add keyframes: `fade-up`, `pulse-ring`, `waveform`, `marquee`, `float` — exposed as `animate-*` utilities.

### Fonts
- Load Outfit (300–900) + Inter (300–800) via `<link>` tags in `src/routes/__root.tsx` head (never `@import` in CSS, per Tailwind v4 rule).

### Head metadata (__root.tsx)
- Title: "Iris by Tesla — The AI Receptionist for Enterprise"
- Description: "Iris is Tesla's autonomous AI receptionist. Zero wait. Human-grade voice. Enterprise scale."
- Matching og:title/description, og:type=website, twitter:card=summary_large_image.

### Route: `src/routes/index.tsx`
Rewrite the placeholder. Compose from small components in `src/components/iris/`:

1. `Nav.tsx` — fixed, translucent-on-scroll, TESLA wordmark + inline nav links + "Reserve Access" pill.
2. `Hero.tsx` — full-viewport centered hero. Eyebrow "Introducing Iris", H1 "Beyond Human.", subhead, animated Iris interface visual (concentric pulse rings + animated waveform bars + soft radial glow) instead of the placeholder image. Staggered fade-up entrance.
3. `ProblemSection.tsx` — dark charcoal, two-column: copy + metric list (0ms wait, 100% context) with red left borders + animated neural-orb visual (SVG concentric rings + rotating dots).
4. `VoiceSection.tsx` — light, centered eyebrow "Synthesized Empathy", H2, three feature cards (Adaptive Tone, Multi-Lingual, No Scripts).
5. `ScaleSection.tsx` — stone-50, two-column: animated globe/grid SVG + copy + red-dot bullet list (SOC2, E2E encrypted, Custom API).
6. `TranscriptSection.tsx` — live call transcript demo with typewriter effect on scroll (Caller ↔ Iris exchange showing a real-world resolution).
7. `IntegrationsSection.tsx` — "Integrates with everything you use." horizontal marquee of partner wordmarks (Salesforce, Zendesk, Hubspot, ServiceNow, Slack, SAP).
8. `CTASection.tsx` — dark rounded card "The Future is Calling." + Contact Sales button + subtle animated wireframe backdrop.
9. `Footer.tsx` — oversized "IRIS BY TESLA" wordmark at ~12vw in `text-tesla-dark/5`, 4-column sitemap, legal bar.

Note on count: the request specifies hero + 6 sections + footer. Sections 3–8 above = 6 sections (Problem, Voice, Scale, Transcript, Integrations, CTA). Hero and Footer are separate.

### Motion / smoothness
- All entrance animations via a lightweight `useInView` hook (`IntersectionObserver`) toggling a `data-visible` attribute; CSS handles the transitions with `cubic-bezier(0.2, 0.8, 0.2, 1)` and staggered delays.
- Hero pulse rings + waveform bars: pure CSS keyframes (already smooth, no JS).
- Transcript: typewriter effect using `requestAnimationFrame`, triggered when the section enters viewport.
- Metric counters (0ms, 100%, etc.): count-up on enter via rAF.
- Smooth-scroll for in-page nav anchors via `scroll-behavior: smooth` on `html`.
- Respect `prefers-reduced-motion` — disable non-essential animations.

### Assets
- No stock photos. Replace every `data-lov-image-placeholder` from the prototype with pure CSS/SVG visuals (waveform, pulse rings, neural orb, grid globe, wireframe backdrop). Keeps the page fast and on-brand.

### Files touched
- `src/styles.css` — theme tokens, keyframes, `@utility` classes.
- `src/routes/__root.tsx` — font `<link>`s + real head metadata.
- `src/routes/index.tsx` — new landing composition.
- `src/components/iris/*.tsx` — Nav, Hero, ProblemSection, VoiceSection, ScaleSection, TranscriptSection, IntegrationsSection, CTASection, Footer, plus a `useInView` hook.

### Out of scope
- No backend, no forms wired to storage, no auth. "Reserve Access" and "Contact Sales" are visual CTAs only.
- No routing beyond `/`.
