# Technical Debt

## Resolved (all audited games)
- fullscreen, accessibility, text sizes, calculateXP, difficulty naming, API factories, i18n/session, hook deps, unused imports, component tests, assets.

## Remaining
- None

---

## Village Guardian Compliance Audit (2026-04-26)

### Resolved
- useGameFullscreen, useAccessibilitySettings, text sizes, API factories, useSession/useScopedI18n, hook deps, unused imports, component tests, asset dir, lint

### Remaining
- None

---

## Dungeon Liberator Compliance Audit (2026-04-26)

### Resolved
- rAF loop, text sizes, SentenceItem typing, API factories, useSession, calculateDungeonLiberatorXP, difficulty tiers, asset dir, tests, lint

### Remaining
- None

---

## Shadow Gate Dungeon Compliance Audit (2026-04-26)

### Resolved
- fullscreen, accessibility, text sizes, API factories, useSession/useScopedI18n, hook deps, component tests, asset dir, lint

### Remaining
- None

---

## Rune Forge Chamber Compliance Audit (2026-04-26)
- Resolved: accessibility labels, test mocks, lint
- Remaining: None

## Teacher Dashboard Phase 2 (2026-05-08)
- classStore complete with CRUD operations, enrollment codes, soft delete
- QR code generation works with dynamic import (ssr: false) for qrcode.react
- Next.js 15 dynamic routes require Promise-based params + generateStaticParams for static export
- confirmPassword validation still needed in authStore (deferred to Phase 3)
