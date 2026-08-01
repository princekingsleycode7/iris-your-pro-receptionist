## Goal

Rebrand the site from Tesla/Iris to **Clova** (Iris stays as the receptionist's name), rewrite the hero for 5-second comprehension, add a pricing page, replace the footer, and embed the ElevenLabs voice widget.

## 1. Brand swap: Tesla → Clova

- Register the uploaded shell mark (`android-chrome-512x512.png`) as a Lovable asset and use it as the logo in the nav and footer, next to the wordmark **CLOVA**. Also set it as the site favicon.
- Replace every "TESLA" wordmark, "Iris by Tesla", "Designed in California", and all Elon Musk / Tesla AI references across Nav, Footer, CTA, and section copy.
- Keep the existing accent-red/near-black palette and type system (renaming the internal token names is not required; only visible branding changes).
- Update page titles/meta on `/`, `/contact`, and the new `/pricing`.

## 2. Hero rewrite (`Hero.tsx`)

Two-column on desktop, stacked on mobile.

Left:

- H1: **Never Miss Another Customer Again.**
- Sub: "Iris answers calls instantly, books appointments, qualifies leads, and delights your customers—day and night—so you never lose business to missed calls."
- Primary CTA → **Try Iris Free for 7 Days** (links to `/pricing`), with microcopy "No credit card required. Fully set up for your business. Cancel anytime."
- Secondary CTA → **Listen to Iris in Action** (scrolls to the live-call section).

Right:

- Large "image of Iris": the uploaded headset receptionist image, presented as a dimensional composition — soft depth shadow, layered glow/ring backdrop behind her, subtle parallax/float on scroll and pointer move.
- Beneath her: a **🟢 Online** status pill (pulsing dot).
- The existing orb animation moves behind/below as a secondary accent rather than the main hero visual.

## 3. New `/pricing` page

Four plan cards (3rd highlighted as most popular), monthly billing, each with CTA to `/contact` (Enterprise → "Talk to Sales").


| Plan       | Price   | Includes                                                                                 |
| ---------- | ------- | ---------------------------------------------------------------------------------------- |
| Free       | $0/mo   | Inbound calls only · 10 minutes/month, renews monthly                                    |
| Starter    | $50/mo  | 150 minutes/month · Gmail + CRM integrations · booking & appointment taking              |
| Growth     | $500/mo | 500 minutes/month · everything in Starter · outbound calls · lead qualification & upsell |
| Enterprise | Custom  | Unlimited scale, dedicated number pool, SSO, custom integrations, priority support       |


Plus a short FAQ strip and the same nav/footer.

## 4. Footer rewrite

Product-focused links only: Features, Pricing, Integrations, Live Demo, Contact, Privacy, Terms. Oversized wordmark becomes **IRIS BY CLOVA**. Copyright "Clova © 2026".

## 5. ElevenLabs voice widget

Mount `<elevenlabs-convai agent-id="agent_9401ky6jnb3betyr39bprns2q225">` globally with the `@elevenlabs/convai-widget-embed` script loaded from the root route head, so it floats on every page. The "Listen to Iris in Action" CTA and the existing call card stay as-is.

### Technical notes

- New route file `src/routes/pricing.tsx` + `src/components/iris/PricingSection.tsx`.
- Script tag added via `__root.tsx` `head({ scripts })`; the custom element is rendered client-side only to avoid SSR/hydration issues.
- Nav gains a "Pricing" link; scrolled-pill state keeps logo + active label + CTA behavior unchanged.
- Uploaded images go through `lovable-assets` pointers rather than being copied into the repo (favicon excepted).
- Dashboard routes are untouched.