# Restore voice widget + floating call button + CTA routing

## 1. Voice widget visibility
Today the widget renders inline at the end of the page, so it only shows after the footer.

- Wrap it in a fixed, bottom-right container with a high stacking layer so it floats over the page on every route.
- It stays hidden by default and only appears when the user opens it.

## 2. Floating call button
- A round call icon pinned bottom-right on all screens, in the brand green accent.
- Tapping it opens the voice widget with a smooth fade/scale-in.
- Clicking anywhere outside the widget (or pressing Escape) closes it again, smoothly.
- While the mobile menu is open, both the button and widget hide — existing behavior kept.

## 3. CTA routing to sign up
Signup-intent CTAs move from `/contact` to `/auth` (sign in / create account, which lands on the dashboard):

- Nav "Try Basic" (desktop) and "Try Iris Basic" (mobile menu)
- Hero "Try Basic — $10"
- Pricing plan buttons for Basic / Starter / Growth

Kept on `/contact`: Enterprise plan button, "Contact Sales" in the closing CTA section, and the footer Contact link.

## Technical notes
- `ConvaiWidget.tsx`: add `open` state, fixed positioning wrapper, backdrop click + Escape listeners, keep the `iris:menu-toggle` listener, keep client-only mount and script injection.
- Route changes in `Nav.tsx`, `Hero.tsx`, `pricing.tsx`.
