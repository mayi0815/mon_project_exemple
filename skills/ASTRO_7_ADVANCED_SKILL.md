---
name: astro-7-advanced
version: 1.0.0
description: >-
  Production-grade Astro 7 engineering skill for AI coding agents. Use when building,
  auditing, migrating, optimizing, or deploying Astro websites and hybrid web apps.
  Covers Astro 7.4+, islands, SSR, advanced routing, content/live collections,
  typed Actions, sessions, caching, security, i18n, technical SEO, accessibility,
  performance, testing, deployment, and safe agent workflows.
---

# Astro 7 — Advanced Engineering Skill & Best Practices

**Last verified:** 2026-11-06  
**Release baseline:** Astro **7.4.x**; latest Astro GitHub release observed: **7.4.7 (2026-11-05)**.  
**Target:** Astro 7.4+, TypeScript, production web projects.  
**Runtime:** Astro 7.4.2+ requires **Node.js 22.23.4 or newer on a supported Node line**. Confirm your exact Astro release's engine requirement before installation or deployment.  
**Priority:** Accuracy and security > maintainability > performance > convenience.

> **Agent rule:** This document is an operating guide, not a license to assume the project is on the newest version. Inspect `package.json`, the lockfile, project files, and the deployment runtime first. For potentially changed APIs, check the current official Astro 7 documentation and installed package types before writing code. Distinguish stable, experimental, and platform-specific features.

---

## 0. What this skill enables

A coding agent using this skill should competently:

1. **Design:** choose prerendering, SSR, server islands, and client islands with explicit reasoning.
2. **Implement:** write idiomatic `.astro` components, typed server Actions, endpoints, middleware, content layers, and framework islands.
3. **Scale:** support CMS integrations, live content, route caching, multi-language content, and robust build pipelines.
4. **Secure:** keep secrets server-side; validate all inputs; authorize every protected action; protect payments, sessions, personal data, and cache boundaries.
5. **Optimize:** reduce browser JavaScript, optimize LCP images and fonts, profile build bottlenecks, and meet measurable Core Web Vitals budgets.
6. **Ship:** automate checks, test actual runtime behavior, deploy compatible adapters, and make changes reviewable and reversible.
7. **Migrate:** identify obsolete Astro 4/5/6 patterns and apply Astro 7 migration guidance carefully.

**Do not** use Astro merely as a React shell. Its chief architectural advantage is **HTML first, JavaScript only for the interactions that require it**.

## 1. What's new in Astro 7 (version-aware reference)

| Capability | Astro 7 status | Practical use | Caution |
|---|---|---|---|
| Rust `.astro` compiler | Stable in 7.0 | Faster component compilation | Compiler no longer silently corrects invalid HTML; write valid markup. |
| Rust Markdown/MDX pipeline | Stable in 7.0 | Faster content builds | Test custom remark/rehype integrations on upgrades. |
| Vite 8 / Rolldown | Stable in 7.0 | Faster bundling | Check custom plugins, transforms, and build hooks. |
| Queue-based rendering | Stable/default in 7.0 | Faster page rendering | Do not retain obsolete experimental flags without checking. |
| Advanced Routing (`src/fetch.ts`) | Stable in 7.0 | Custom request pipelines, proxies, Hono composition | Leave the default router in place unless customization is justified. |
| Route caching + cache provider API | Stable in 7.0 | TTL/SWR/tag/path invalidation for SSR | Provider is required; never publicly cache personalized responses. |
| CDN cache providers | Experimental/provider-specific as documented | Edge caching | Test behavior with actual adapter and deployment provider. |
| AI-friendly `astro dev` / JSON logs | Stable in 7.0 | Agent automation, health checks | Background-mode behavior depends on OS/agent detection. |
| Live Content Collections | Available since 6.0 | Runtime CMS/API/database content | Different configuration and data access from build-time collections. |
| Fonts API + CSP API | Available since 6.0 | Self-hosted optimized fonts; CSP hardening | Audit custom scripts and vendor integrations. |
| Incremental static builds | **Experimental** (7.2+) | Avoid rebuilding unchanged content | Benchmark, and preserve a stable fallback. |
| `astro preview` background mode | 7.2+ | Agent-assisted test workflows | Verify port and process lifetime. |
| `--ignore-lock` for preview | 7.3+ | Parallel preview/test instances | Cannot be combined with background/force lock modes. |
| `astro build --timings` | 7.4+ | Find costly pages, plugins and transformations | Profile before optimizing. |
| Separate build/runtime image services | 7.4+ | Sharp at build; image CDN at edge/runtime | Configure only when deployment requires it. |
| `notFound()` in `astro/fetch` | 7.4+ | Custom advanced-routing 404 handling | Only needed for custom pipelines. |
| Parallel prerendering | **Experimental** (7.4+) | CPU-parallel static generation | Can increase memory; may not work with adapter-owned prerendering. |
| Custom static redirect page | **Experimental** (7.4+) | Branded/translated static redirects | Do not mistake HTML redirects for real HTTP 3xx status. |

**Live version rule:** The point release named above is a dated snapshot. For any new project, verify `npm view astro version` and the [official releases](https://github.com/withastro/astro/releases). Only pin the version after confirming registry availability, adapter compatibility, and CI support.

---

## 2. Mandatory agent workflow

### Before touching code

- Read `package.json`, lockfile, `astro.config.*`, `tsconfig.json`, `src/`, `public/`, adapter config, and existing tests.
- Identify the package manager from the lockfile; **do not** mix package managers.
- Run/inspect `node --version`, `npx astro --version`, and integration versions.
- Identify the hosting target (static, Node, Cloudflare, Vercel, Netlify, etc.) and whether the deployment actually supports SSR, sessions, image transforms, and cache invalidation.
- Label each affected route **prerendered**, **on-demand**, or **server island**; mark all user-specific or privileged data paths.
- Define acceptance criteria, expected browser-JS impact, security assumptions, SEO requirements, and a test plan before implementation.

### During implementation

- Make small changes that are easy to review. Reuse current project patterns where sound.
- Choose stable built-in APIs before installing packages or enabling experimental flags.
- Do not introduce an extra SPA framework for static content or a large state library for one form.
- Avoid changing the project’s public URLs, structured data, translations, or metadata accidentally.
- Keep shared business logic under `src/lib/` or `src/server/`; do not duplicate it across pages, endpoints, and Actions.
- Include loading, empty, error, retry, validation, and inaccessible-network states in UX.
- Keep experimental changes behind explicit config and record a rollback plan.

### Before delivery

- Run type checks, tests, production builds, and smoke tests **on the target adapter/runtime**.
- Audit generated HTML, JS bundles, headers, image URLs, canonical/hreflang tags, and cookie behavior.
- Report exactly what changed, why, how verified, known risks, and any checks not run.
- Never claim performance improvements without measurement; never claim payment/security correctness without verification.

### Starter commands (use the existing package manager)

```bash
node --version
npm view astro version
npm create astro@latest
npx astro add react             # only if a React island is justified
npx astro add sitemap           # for discoverable public routes
npx astro add node              # example: only for a Node SSR deployment
npx astro check
npx astro build --timings
npx astro preview
```

For a **mature existing** project, prefer `npx @astrojs/upgrade` (after checking the upgrade guide and committing current work) over manually mixing major versions of Astro and official adapters.

---

## 3. Architecture decision matrix

| Requirement | Preferred Astro pattern | Why |
|---|---|---|
| Marketing page, homepage, restaurant/venue info | Prerendered `.astro` page | Cacheable HTML, strong SEO, minimal JS. |
| Blog, guides, FAQ, product descriptions | Build-time Content Collection | Schema validation, predictable build output. |
| Frequently changing public CMS data | SSR + Live Content Collection | Fresh content without requiring full rebuilds. |
| User account page / session-dependent data | SSR route | Authorization and personalization on request. |
| Personalized widget on an otherwise static page | `server:defer` server island | Keep surrounding page static/cacheable. |
| Booking date picker / map / rich interactive widget | One small hydrated client island | Limit JS to interaction. |
| Simple dropdown, accordion, form validation | Semantic HTML/CSS; small vanilla script when needed | Avoid framework/hydration overhead. |
| Typed application mutation | Astro Action (`astro:actions`) | Validation and typed client/server calling convention. |
| External webhook, REST integration, binary response | API endpoint (`src/pages/api/...`) | Standard Request/Response and raw-body control. |
| API proxy or nonstandard request pipeline | Advanced routing `src/fetch.ts` | Powerful, but adds complexity. |
| Server-side per-route caching | Cache provider + `Astro.cache` | Explicit HTTP-like freshness and invalidation. |

**Rendering rules:**

1. Keep Astro's **default static output** unless on-demand pages are necessary.
2. With a configured adapter, set `export const prerender = false` only on the pages/endpoints that need request-time rendering. With `output: 'server'`, SSR is the default and static pages must opt in with `prerender = true`.
3. Rendering mode, user authentication, and cache mode are **separate** decisions. A page can be SSR and cacheable; a personalized page usually must not be shared-cacheable.
4. Server islands require an adapter and add an independent network request: use them where this tradeoff is beneficial, not everywhere.

---

## 4. Production-oriented project layout

```text
/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .env.example                 # document names only; no secrets
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── en/                 # locale-prefixed pages (fr is unprefixed in example)
│   │   ├── zh/
│   │   ├── api/                 # endpoints & webhooks
│   │   ├── 404.astro
│   │   └── robots.txt.ts        # optional generated text
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── ui/                  # mostly static Astro components
│   │   ├── forms/
│   │   └── islands/             # explicitly hydrated components
│   ├── content.config.ts       # build-time collections
│   ├── live.config.ts          # live collections, if used
│   ├── content/                # local Markdown/MDX data
│   ├── actions/
│   │   └── index.ts
│   ├── middleware.ts
│   ├── lib/                    # domain/shared pure logic
│   ├── server/                 # DB, auth, payments, private services
│   ├── i18n/                   # dictionaries, formats, route helpers
│   ├── styles/
│   └── assets/                 # optimized source images/fonts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── public/                     # files intentionally served as-is
```

**Use `src/fetch.ts` only when customizing advanced routing.** Do not create it merely because Astro 7 supports it.

### TypeScript rules

- Use Astro's **strict** TypeScript baseline and ensure `astro check` is part of CI.
- Define `Props` for reusable `.astro` components; narrow optional values explicitly.
- Keep domain validation in Zod or other runtime validators; TypeScript is erased at runtime.
- Use discriminated unions for states and normalized typed objects for external data.
- Avoid `any`, non-null assertions around external data, and swallowed errors.
- Handle time zones, currency, and locale formatting explicitly; never rely on the browser locale for canonical business calculations.

```astro
---
interface Props {
  title: string;
  description?: string;
  priceEUR?: number;
}

const { title, description, priceEUR } = Astro.props;
---
<article>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  {priceEUR !== undefined && <p>{priceEUR.toFixed(2)} €</p>}
</article>
```

---

## 5. Astro components & islands: precise hydration

**Default:** write semantic, accessible markup in `.astro` components. Astro renders these to HTML without shipping the component's frontmatter code to the browser.

**Client directives** (apply to supported UI-framework components, not ordinary Astro components):

- `client:load` — hydrate immediately; reserve for immediately interactive, above-the-fold functionality.
- `client:idle` — hydrate during idle time; suitable for low-urgency interactions.
- `client:visible` — hydrate near viewport visibility; suitable for lower-page rich widgets.
- `client:media="(min-width: 768px)"` — hydrate only for a matching media query when needed.
- `client:only="react"` — render only on client; **last resort** for browser-only libraries.

**Best practices:**

- Keep headers, text, cards, sections, footer, pricing tables, and FAQ HTML in Astro.
- Use one localized framework island for a booking calendar rather than wrapping the whole site in React.
- Lazy-load heavy maps/video/chat, with an accessible placeholder and consent where needed.
- Keep props serializable across server/client boundaries; do not pass secrets, DB clients, functions, or private tokens.
- Prefer native `<details>` for FAQ, `dialog` where appropriate, and native forms before JS.
- A component that uses React on the server **does not automatically need hydration**.
- Audit resulting HTML for duplicate IDs, nesting errors, keyboard paths, and hydration mismatches.

```astro
---
import BookingCalendar from '../components/islands/BookingCalendar.tsx';
---
<section aria-labelledby="booking-title">
  <h2 id="booking-title">Choose your date</h2>
  <BookingCalendar client:visible />
</section>
```

**React/Preact/Svelte/Vue:** add only the integration already supported by the project's chosen versions. Avoid combining multiple UI frameworks without a demonstrated reason.

---

## 6. Rendering, endpoints, middleware & advanced routing

### Selectively SSR a page

```astro
---
export const prerender = false;
const locale = Astro.currentLocale ?? 'fr';
// Request-time lookup with proper validation and error handling.
---
<html lang={locale}><body><main><h1>Availability</h1></main></body></html>
```

### Standard API endpoint

```ts
// src/pages/api/health.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  Response.json({ ok: true }, { status: 200 });
```

- Use standard HTTP methods, status codes, meaningful errors, and `Cache-Control` correctly.
- Never store state in an in-process module variable when deploying to ephemeral or horizontally scaled runtimes.
- Treat webhook signatures as mandatory when supported; preserve raw request bodies if verification requires them.

### Middleware

- Use `src/middleware.ts` for request-scoped concerns (e.g., locale normalization, correlation IDs, authentication lookup).
- Avoid blanket DB calls on every static asset or public page.
- Restrict protected routes **server-side**. Hiding a navigation link is not authorization.
- Be cautious setting headers once streaming begins; response-level headers belong where supported by the page/endpoint pipeline.

### Astro 7 Advanced Routing (stable)

- A custom `src/fetch.ts` can replace/reorder Astro's request pipeline using the `astro/fetch` APIs.
- This is appropriate for Hono composition, API gateway logic, sophisticated proxying, or custom route precedence.
- Prefer Astro's default routing for normal websites. Recreating the pipeline can accidentally bypass **sessions, Actions, redirects, i18n, middleware, caching, or 404 handling**.
- If used, explicitly test the composition of `trailingSlash`, `redirects`, `sessions`, `actions`, `middleware`, `pages`, `i18n`, `cache`, `notFound`, or the higher-level `astro()` handler as required by the actual design.
- `src/app.ts` in older **experimental Astro 6** examples is **not** the Astro 7 stable advanced-routing entrypoint. Use the installed version's documentation.

Reference: https://docs.astro.build/en/reference/modules/astro-fetch/

---

## 7. Build-time Content Collections

Use **`src/content.config.ts`**, `defineCollection()`, a loader, and a validated schema for relatively static structured content.

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    publishedAt: z.coerce.date(),
    draft: z.boolean().default(false),
    locale: z.enum(['fr', 'en', 'zh']),
  }),
});

export const collections = { articles };
```

```astro
---
import { getCollection } from 'astro:content';
const articles = (await getCollection('articles'))
  .filter(({ data }) => !data.draft)
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
---
<ul>
  {articles.map(({ id, data }) => <li><a href={`/articles/${id}/`}>{data.title}</a></li>)}
</ul>
```

- Use `astro/zod` for framework content schemas under Astro 6/7, **not deprecated older Zod imports** from `astro:content`.
- Avoid assuming entry IDs are already URL-safe or locale-aware. Define and test a slug policy.
- Keep link resolution consistent with `base` and `trailingSlash`.
- For complex CMS importers, use a **custom loader**; cache or deduplicate remote fetches and provide stable IDs.
- Prefer `render(entry)` for rendered Markdown/MDX pages per the current content API; do not render arbitrary untrusted HTML directly.
- Validate authoring metadata, enforce image-alt rules, and reject incomplete published content in CI.

## 8. Live Content Collections (runtime data)

Use for public content that must be current without a rebuild:

- File: `src/live.config.ts`.
- Define with `defineLiveCollection()` and a **live loader** implementing `loadCollection` / `loadEntry` for the data source.
- Read with `getLiveCollection()` / `getLiveEntry()`; **do not** substitute build-time `getCollection()`.
- Requires an adapter for on-demand rendering.
- Validate returned records, handle backend failures, and decide cache TTL/invalidation explicitly.
- Do not perform full-collection queries for a single entry if the source can fetch by ID.
- Keep credentials server-side; enforce authorization for restricted data. Live collections do not make private data safe by themselves.
- If data changes rarely, build-time collections may remain cheaper and faster.

Reference: https://docs.astro.build/en/guides/content-collections/

---

## 9. Type-safe Astro Actions and forms

Use Actions for browser-to-server mutations and straightforward typed RPC. Use server endpoints for external callers, webhooks, custom content types, or non-Action API contracts.

```ts
// src/actions/index.ts
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  requestQuote: defineAction({
    accept: 'form',
    input: z.object({
      email: z.email(),
      guestCount: z.coerce.number().int().min(1).max(30),
      requestedDate: z.string().min(1),
    }),
    handler: async (input, context) => {
      // In production: rate-limit and validate availability/time zone.
      // Authorize the operation if it exposes protected data.
      if (input.guestCount > 20) {
        // Example venue-specific rule, separate from schema validation.
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Please contact us for groups over 20.' });
      }
      return { accepted: true, guestCount: input.guestCount };
    },
  }),
};
```

> The above is illustrative, not a booking engine. The `guestCount > 20` check is an example of business validation separate from the general input schema; actual venue rules must be defined by the project.

**Action rules:**

- Validate at the server boundary regardless of client-side validation.
- Distinguish data validation from authorization and business invariants.
- Always handle Action result `data` and `error` states in the UI; show user-safe messages.
- Consider native forms and progressive enhancement before custom `fetch` code.
- Add rate limiting, spam controls, audit logs, and idempotency where appropriate.
- **Never** treat a quoted price or a client-provided role as authoritative.
- Use database transactions and conflict detection for stock, seats, appointments, reservations, or limited inventory.
- For payments, use provider-hosted checkout / verified payment intents and **server-verified webhooks** before marking an order as paid.
- Avoid leaking internal error details, secrets, or personally identifying data through Action return values.

Docs: https://docs.astro.build/en/guides/actions/

---

## 10. Sessions, authentication & authorization

- Use Astro sessions for **server-side state** (e.g., cart or short-lived flow data) on on-demand routes; configure a durable driver supported by the deployment adapter.
- Sessions are not a complete authentication/identity provider. Decide explicitly how logins, token verification, session fixation, revocation, and role checks work.
- For cookies, use `HttpOnly`, `Secure` in production, and appropriate `SameSite` and expiry settings; verify CSRF defenses appropriate to the auth approach and endpoint.
- Keep session stores out of local memory for multi-instance/edge production.
- Add server-side authorization checks in every sensitive Action/API endpoint and SSR route.
- Favor short-lived, opaque identifiers. Never store payment credentials or unnecessary personal data in session.
- Use dedicated roles for back-office operations and apply least privilege to DB keys.
- If the project doesn't need accounts, don't add a login system; use secure guest flows with time-limited tokens where needed.

Docs: https://docs.astro.build/en/guides/sessions/

---

## 11. Server islands (`server:defer`)

Use a server island when a small fragment needs personalized or slow request-time rendering while the enclosing page stays fast or aggressively cacheable.

```astro
---
import MemberSnippet from '../components/MemberSnippet.astro';
---
<MemberSnippet server:defer>
  <p slot="fallback" aria-live="polite">Loading your account…</p>
</MemberSnippet>
```

- Requires a server adapter. A server island renders through a separate network request.
- Pass minimal, **serializable** props; never pass functions, a DB handle, or giant payloads.
- The server must still authorize access and respect cookies/session state.
- Consider server island URL/GET vs POST behavior and caching implications; large props can force non-cacheable POST retrieval.
- During multi-region or rolling deployment, configure a stable `ASTRO_KEY` per official guidance so encrypted props can be decrypted consistently.
- Provide a useful fallback; test failures, delay, and assistive-technology behavior.
- Do not use server islands for critical SEO text that must be visible in the initial HTML.

Docs: https://docs.astro.build/en/guides/server-islands/

---

## 12. Route caching, ISR-like strategies & invalidation

Astro 7's stable route caching is explicit and **provider-dependent**. A static file on a CDN, an SSR response with a TTL, and a session-specific response have different caching requirements.

```js
// astro.config.mjs — illustrative Node SSR configuration
import { defineConfig, memoryCache } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://www.example.com',
  adapter: node({ mode: 'standalone' }),
  cache: { provider: memoryCache() },
  routeRules: {
    '/articles/[...slug]': { maxAge: 300, swr: 60, tags: ['articles'] },
  },
});
```

```astro
---
export const prerender = false;
if (Astro.cache.enabled) {
  Astro.cache.set({ maxAge: 120, swr: 30, tags: ['public-catalog'] });
}
---
<h1>Public catalog</h1>
```

**Required safeguards:**

- Cache only when response content is safe to share among viewers; **do not** cache a user-specific page merely because it is expensive.
- Explicitly disable caching for accounts, carts, booking checkout, admin, personalized prices, payment status, and tokenized links; be mindful of default route rules.
- In-memory caching is **process-local**, not a distributed cache or guaranteed persistent store.
- Test TTL, stale-while-revalidate, and cache invalidation on the real deployment provider (dev does not perform real caching).
- Use `Astro.cache` in pages and `context.cache` in API routes/middleware.
- Prefer tag-based invalidation after public CMS edits; authorization-gate any purge endpoint.
- Avoid treating experimental edge cache providers as universally supported.

Docs: https://docs.astro.build/en/guides/caching/

---

## 13. Images, video, SVG and fonts

### Images

- Put transformable assets in `src/assets/` and use `<Image />` or `<Picture />` from `astro:assets`.
- Set meaningful `alt` text (or `alt=""` for purely decorative images), intrinsic sizes or responsive sizing, and `sizes` consistent with the CSS layout.
- Use modern formats where supported; measure quality vs transfer size.
- Do not lazy-load the LCP hero image. Use appropriate high fetch priority/preload when measurement supports it.
- Lazy-load below-the-fold images; avoid layout shift.
- Use allowlisted `image.domains` / `image.remotePatterns` for remote transformations; do not accept arbitrary attacker-supplied fetch URLs.
- `public/` assets bypass Astro optimization. Use them only where that is intended.
- For Astro 7.4+, `image.service` can separately specify **`build`** and **`runtime`** services; useful with Sharp at build and a runtime CDN.

```astro
---
import { Picture } from 'astro:assets';
import hero from '../assets/hero.jpg';
---
<Picture
  src={hero}
  formats={['avif', 'webp']}
  alt="Private lounge interior"
  widths={[640, 960, 1440]}
  sizes="(max-width: 768px) 100vw, 70vw"
  loading="eager"
/>
```

### Video

- Use optimized poster images. Avoid autoplaying full-resolution background videos on mobile.
- If using video, include accessible controls/captions where appropriate, respect reduced motion and user preferences, and minimize initial transfer.

### SVG

- Prefer optimized inline SVG for small icons; sanitize any untrusted SVG. Never render user-supplied SVG/HTML without a rigorous sanitization strategy.

### Fonts API (Astro 6+)

```js
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    { provider: fontProviders.google(), name: 'Inter', cssVariable: '--font-inter' },
  ],
});
```

- Astro's Fonts API can download/cache fonts for delivery from the site, improving consistency and privacy.
- Request only used weights, styles, languages, and subsets; prefer WOFF2.
- Test font loading, fallback metrics, CLS, and the font-provider warnings introduced with Astro 7.4.

Docs: https://docs.astro.build/en/guides/images/ and https://docs.astro.build/en/guides/fonts/

---

## 14. Styling & design systems

- Prefer scoped Astro CSS or a small documented token system. Use Tailwind only if it materially improves consistency/team velocity.
- Define tokens for colors, typography, spacing, radii, shadows, surface elevation, focus indication, and motion.
- Build mobile-first; avoid fixed heights that crop localized content.
- Use semantic classes and reusable primitives instead of deeply coupled one-off selectors.
- Ensure hover-only interfaces also work with keyboard and touch.
- Avoid excessive animations, huge scroll libraries, and JS layout measurements for ordinary CSS tasks.
- Use `prefers-reduced-motion` and sufficient contrast for all themes.

---

## 15. Technical SEO, multilingual SEO & answer-engine readiness

### Technical SEO baseline

- Set `site` to the real canonical origin in Astro config.
- Use a **unique descriptive** `<title>` and meta description per indexable page.
- Emit a self-consistent canonical URL, sensible redirects, `robots.txt`, and a sitemap using `@astrojs/sitemap` when appropriate.
- Build real internal links and human-readable URLs, with persistent slugs and 301 redirects when they change.
- Serve meaningful content as **initial HTML**; do not hide essential business information behind hydration, tabs that require JS, or client-side API calls.
- Use semantic headings, breadcrumbs, accessible navigation, Open Graph/Twitter metadata, descriptive image alt text, and correct structured data.
- Use JSON-LD types only when supported by actual, visible facts (e.g., `LocalBusiness`, `Restaurant`, `FAQPage` where eligible, `BreadcrumbList`, `Product`, `Event`). Do not invent ratings, offers, or reviews.
- Keep public text crawlable and explain the entity/service clearly: who, what, where, prices or price principles, services, FAQs, policies, contact details, and evidence.
- For GEO / AI-driven discovery, optimize **factual clarity and source consistency**, not prompt-injection tricks or unsupported ranking guarantees.

### Internationalization (`fr`, `en`, `zh` example)

- Use Astro's i18n routing as the canonical URL strategy. Define `defaultLocale`, `locales`, and `routing.prefixDefaultLocale` intentionally.
- Localize headings, page descriptions, alt text, structured data, opening hours/terms, and FAQs—not just a toggle label.
- Publish hreflang links between **true equivalent pages** and a valid canonical for each language. Add `x-default` when appropriate.
- Use language-specific slugs if feasible; implement redirects if slugs change.
- Distinguish Chinese language variants if the product requires them (`zh-CN` vs `zh-TW`) rather than conflating them.
- Set `<html lang="...">`, use `Intl` for dates/numbers/currency, and test `Europe/Paris` booking time handling across DST transitions.
- Avoid automatically redirecting search-engine users based only on IP; language negotiation should respect user choice and crawlability.

```js
// Example config excerpt
export default defineConfig({
  site: 'https://www.example.com',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
});
```

Use `astro:i18n` URL helpers to generate locale-aware links rather than manually concatenating path prefixes in dozens of components.

Docs: https://docs.astro.build/en/guides/internationalization/

---

## 16. Security and privacy guardrails

**Security is a release blocker, not a follow-up task.**

- Validate and normalize input at every untrusted boundary; Zod schemas are not a substitute for domain-specific checks.
- Escape text by default and avoid `set:html` with untrusted input. Sanitize any allowed rich HTML.
- Use typed `astro:env/server` and `astro:env/client` access when suitable; never place secrets in public env vars, client bundles, props sent to islands, or static output.
- Implement authentication + authorization on the **server**. Verify ownership/tenant/role for resource IDs and admin endpoints.
- Use least-privilege DB credentials and parameterized queries; never generate SQL by concatenating untrusted strings.
- Protect login and mutation endpoints against CSRF as appropriate, brute force, spam, and rate abuse.
- Apply Content Security Policy using Astro's **`security.csp`** facility; test third-party analytics/payment scripts and necessary hashes/nonces. Do not blindly set overly broad `'unsafe-inline'` rules.
- Set safe HTTP headers, HTTPS, secure cookies, and sensible HSTS at the deployment layer.
- Keep webhook signing secrets private; verify the provider signature, timestamp/replay tolerance, and event ID deduplication.
- Practice data minimization and retention discipline; protect personal/contact data and meet applicable privacy obligations.
- Review dependency updates and scan known vulnerabilities; pin deploy dependencies via lockfiles.
- If using `src/fetch.ts`, test that security/middleware handlers are **not accidentally bypassed**.

```js
// Example only; review your third-party script needs.
import { defineConfig } from 'astro/config';
export default defineConfig({
  security: { csp: true },
});
```

Docs: https://docs.astro.build/en/reference/configuration-reference/ and https://docs.astro.build/en/guides/environment-variables/

---

## 17. Performance budgets & measurement

**Default target budgets** (adjust to project/traffic):

| Metric | Starting target | How to verify |
|---|---|---|
| LCP (p75 field) | <= 2.5 s | Chrome UX Report / RUM |
| INP (p75 field) | <= 200 ms | RUM / CrUX |
| CLS (p75 field) | <= 0.1 | RUM / CrUX |
| Browser JS | As close to zero as practical for static pages | Network tab / bundle analysis |
| Critical HTML content | Present before client hydration | View source / JS-disabled smoke test |
| API and SSR latency | Define endpoint-specific p95 SLOs | Production traces + load tests |

**Prioritized optimization sequence:**

1. Measure field + lab performance on real representative routes/devices and network profiles.
2. Eliminate avoidable browser JS and hydration.
3. Optimize LCP images, font loading, CSS, and initial server response.
4. Improve data fetching: parallelize independent requests, cache public data, avoid N+1 queries.
5. Tune images and third-party scripts; defer low-priority widgets.
6. Profile builds using **`astro build --timings`**; inspect slow pages, Vite plugins, Markdown, and image transforms.
7. Only then evaluate advanced build options such as experimental parallel prerendering / incremental static builds.

**Performance anti-patterns:** loading every island at `client:load`; loading all locale content into every route; passing giant data arrays as props; excessive nested server islands; fetching the same API per card; optimizing thousands of unused responsive image variants; SSR with no cache strategy for truly public, stable data.

---

## 18. Testing strategy and quality gates

| Test layer | Tool / method | Minimum coverage |
|---|---|---|
| Static analysis | `astro check`, TypeScript, ESLint/Biome if adopted | All code changed; CI must fail on errors. |
| Unit | Vitest | Pricing, dates, slugs, locale helpers, input schemas, authorization helpers. |
| Component | Astro Container API / framework-specific tools | Rendering, escaping, slots, errors, accessibility. |
| Integration | Local DB/test services or mocks | Actions, storage, conflict handling, sessions, webhooks. |
| End-to-end | Playwright | Main route journeys across mobile and desktop, multiple locales. |
| Accessibility | axe + keyboard/manual testing | Focus, labels, contrast, motion, modal/calendar semantics. |
| SEO | Built HTML/head audit | Canonical, hreflang, sitemap, JSON-LD, status codes. |
| Performance | Lighthouse CI + field monitoring | Selected critical templates and high-traffic routes. |
| Security | Dependency scan + negative tests | Unauthorized access, invalid inputs, XSS, replay, rate limits. |

### Vitest config

```ts
// vitest.config.ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: { include: ['tests/unit/**/*.test.ts'] },
});
```

### Example Playwright acceptance cases

- Page is usable with JavaScript off where static HTML should suffice.
- Every locale has correct title, lang, canonical, hreflang, navigation, and 404 behavior.
- Booking availability cannot be overbooked with simultaneous requests.
- A second user cannot access an order or private document by guessing an ID.
- Mobile menu and date picker are keyboard-operable and screen-reader labeled.
- Payment is **not** considered successful based only on the browser redirect.
- Preview and production use the same runtime class and critical configuration.

Docs: https://docs.astro.build/en/guides/testing/

---

## 19. Deployment and operational readiness

- Choose the adapter to match the real host: `@astrojs/node`, `@astrojs/cloudflare`, `@astrojs/vercel`, or `@astrojs/netlify` as applicable.
- Test runtime features against that adapter rather than relying on local Node behavior alone.
- Document Node version, package-manager version, build command, output directory, secrets, DB connections, health checks, redirects, and cache provider.
- Configure production image hosting/transformation appropriately; some edge runtimes cannot use Sharp at request time.
- Use separate development, staging, and production credentials/data.
- Set timeouts, retries with backoff, observability, and graceful external-service failure handling.
- For long-running payments, use verified webhooks and durable out-of-band workflow; do not depend on a short-lived server request completing.
- Use migration-safe database deploys and ensure schema changes can be rolled out without downtime.
- Keep backups and restoration drills for transactional data.

### AI-assisted dev / preview workflow (Astro 7)

```bash
# Background mode is automatic for supported AI-agent environments; explicit flag also works:
npx astro dev --background
npx astro dev status
# Development-only readiness endpoint when running:
# GET http://localhost:4321/_astro/status -> {"ok":true}

# CI/profiling:
npx astro check
npx astro build --timings

# Inspect a real production build with the chosen adapter:
npx astro preview
```

- `--json` enables structured CLI logs.
- `astro dev --background` writes a lock/info file to `.astro/dev.json`.
- `astro preview --background` is supported in 7.2+.
- Use `--ignore-lock` only when intentionally running additional dev/preview servers; do not combine it with options requiring lock ownership.
- Do not assume the dev-only `/_astro/status` endpoint exists in a production deployment.

Docs: https://docs.astro.build/en/guides/build-with-ai/

---

## 20. Experimental features: use only with measured justification

### Experimental incremental static builds (7.2+)

Useful for huge static sites where unchanged pages and their dependencies can be reliably reused. Read the exact current flag/reference before enabling; use reproducible builds and a no-cache comparison on CI to detect invalid reuse.

### Experimental parallel prerendering (7.4+)

```js
import { defineConfig } from 'astro/config';
export default defineConfig({
  experimental: {
    parallelPrerender: { workers: 4 },
  },
});
```

- Measure build-time savings and peak memory; less concurrency may be faster on small CI machines.
- Check adapter compatibility; Astro's Cloudflare adapter performs its own prerendering and may ignore this flag.

### Experimental custom static redirect page (7.4+)

- `experimental.redirectPage: true` plus `src/pages/3xx.astro` allows custom HTML redirect output.
- A static HTML redirect page **does not replace** a real HTTP 301/302 delivered by hosting/router configuration. Prefer HTTP redirects when available and important to SEO.

### Experimental CDN cache providers

- Verify provider-specific constraints and invalidation support, and use production-like integration tests.

**Experimental acceptance checklist:** feature flag documented, risk owner, benchmark, compatibility checks, fallback plan, and a rollback procedure.

---

## 21. Upgrade and migration guide for AI coding agents

When upgrading to Astro 7:

1. Read the official [Astro v7 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/) **and** all major-version guides crossed by the project.
2. Update Node runtime to the **currently required minimum** (7.4.2+ requires 22.23.4+ within supported Node lines); update local, CI, and host runtimes together.
3. Upgrade Astro and official integrations compatibly using `npx @astrojs/upgrade`.
4. Audit custom Vite/Rollup plugins for Vite 8 / Rolldown compatibility.
5. Update content collection patterns to loaders and `astro/zod` as appropriate to the installed version.
6. Check new Rust compiler behavior on malformed HTML and Markdown processing differences.
7. Remove stale experimental flags that became stable or changed shape.
8. If using early advanced-routing examples, replace obsolete Astro 6 experimental `src/app.ts` conventions with Astro 7 `src/fetch.ts` and the current APIs.
9. Test server islands, sessions, Actions, forms, image behavior, and all adapter-specific deploys.
10. Compare build output and perform staged canary/rollback rather than a one-shot production migration.

**Common outdated patterns to reject:**

- Treating every Astro website as `output: 'server'` merely to use one booking form.
- Using `client:load` for entire layouts without a demonstrated need.
- Treating `astro:content` as the current source for Zod imports (use `astro/zod` in modern Astro).
- Assuming SSR responses are cached by default or that sessions are shared across serverless instances without a durable store.
- Using experimental `src/app.ts` for stable Astro 7 advanced routing.
- Copying Astro 4 `<ViewTransitions />` patterns when current docs call for `<ClientRouter />` or native MPA transitions.
- Assuming `ClientRouter` is necessary for SEO or for ordinary navigation (it is not).
- Recommending Astro 6 as the newest version in late 2026.

---

## 22. Example: premium multilingual booking website architecture

This is a **reference pattern** for a venue, restaurant, or private entertainment website with **French / English / Chinese**, strong SEO, and simple guest reservations. Adapt to the actual business requirements; do not treat it as an automatically approved product specification.

**Recommended responsibility split:**

| Area | Architecture |
|---|---|
| Venue info, concept, room descriptions, menus, FAQ | Prerendered Astro routes + content collections |
| Language-aware URLs and metadata | Astro i18n router + localized content + hreflang |
| Image-rich premium design | Optimized Astro assets + CSS + self-hosted fonts |
| Availability by room/time/guest count | SSR endpoint/Action with server-side booking service |
| Rich calendar/time-slot selection | Small client island (React only if complexity warrants it) |
| Reservations/payments | Database transactional hold + server-created checkout session + verified webhook |
| Guest confirmation | Transactional email after confirmed state transition; signed one-time link for guest changes |
| Admin | SSR protected routes and Actions, strong RBAC, audit logs |
| FAQ/LocalBusiness structured data | HTML + validated facts in JSON-LD |
| Analytics | Consent-aware events, order funnel attribution, no sensitive data exposure |

**Booking invariants:**

1. Server calculates price using trusted rate tables and business rules; client only displays a quote.
2. Capacity, minimum/maximum group size, duration, cleaning buffers, and opening hours are validated server-side.
3. Time slots are held/confirmed via atomic DB constraints or transactions, not a client-side lock.
4. Store a booking state machine (`draft → held → paid/confirmed` or `expired/cancelled/refunded`) with clear allowed transitions.
5. Persist idempotency keys, provider payment IDs, and webhook delivery IDs to prevent duplicates.
6. Handle partial failure between DB, payment provider, and email; retries must be safe.
7. Observe local time rules (e.g. `Europe/Paris`) and DST. Persist timestamps in UTC plus necessary venue time-zone metadata.
8. Do not publicly cache `/book`, `/checkout`, `/my-booking`, `/admin`, or payment/status URLs.
9. Provide accessible no-JavaScript or reduced-JavaScript alternative where practical.
10. Define cancellation/refund terms and privacy retention before launch.

**Do not** store a reservation solely in browser localStorage, trust frontend prices, or mark it paid based on `?success=true`.

---

## 23. Deliverables an AI agent must provide for substantial Astro changes

For features bigger than a small component, include:

1. **Decision record:** static vs SSR, adapter, content approach, hydration strategy, storage/caching boundary.
2. **Files changed:** explicit paths and a concise overview.
3. **Security review:** input validation, authorization, secrets, CSRF/replay considerations, public/private cache decision.
4. **SEO/a11y review:** initial HTML, page metadata, locale linking, keyboard support, responsive layout.
5. **Verification:** command outputs or honest summary, unit/E2E coverage, production build test.
6. **Performance evidence:** measured before/after if claiming improvements; otherwise state expected impact as a hypothesis.
7. **Deployment notes:** env keys, DB migrations, adapter implications, rollback instructions.

## 24. Definition of done: copyable review checklist

- [ ] Astro version, Node minimum, adapters, lockfile, and deployment runtime are compatible.
- [ ] Default-to-static reasoning is recorded; no unnecessary SSR, hydration, or framework dependency.
- [ ] Public SEO content renders in initial HTML; no critical content hidden behind client-only islands.
- [ ] Inputs are validated and sensitive operations are authorized server-side.
- [ ] Secret values never enter static HTML, client bundles, logs, or browser-readable props.
- [ ] Shared caches cannot serve user-specific content; invalidation behavior is understood.
- [ ] Forms have accessible errors, loading states, success confirmation, and safe retry behavior.
- [ ] Images/fonts are responsive, optimized, correctly sized, and accessible.
- [ ] Canonical, hreflang, lang attribute, sitemap, redirects, and structured data are correct.
- [ ] Mobile navigation, keyboard focus, and reduced-motion behavior are tested.
- [ ] Unit and E2E tests cover critical paths, including failed and unauthorized requests.
- [ ] `astro check`, production build, adapter preview, and meaningful smoke tests succeed.
- [ ] No unsupported claims about Lighthouse scores or AI/Google search rankings.
- [ ] Experimental features have documented evidence, alternatives, and rollback plans.

---

## 25. Reusable coding-agent instruction prompt

Copy this into a task description when you want a coding agent to apply this skill:

> You are a senior Astro 7 engineer. Follow `ASTRO_7_ADVANCED_SKILL.md` and the project's existing conventions. Before coding, inspect the installed Astro version, Node version, adapter, content pipeline, lockfile, routes, and tests. Prefer prerendered, semantic Astro components with zero browser JS; use the smallest possible hydrated island for necessary interaction. Choose stable official APIs and use current Astro 7 docs, not outdated examples. Implement typed validation and server-side authorization, protect private data from caching, maintain multilingual SEO and accessibility, test the deployed runtime assumptions, and run `astro check` plus a production build. Report precise file changes, tests, security/caching concerns, and unverified limitations. Never invent API compatibility or claim tests you did not run.

---

## 26. Primary sources and update checklist

**Official documentation and releases (consult before major implementation):**

1. Astro GitHub releases (latest patches): https://github.com/withastro/astro/releases
2. Astro 7.0 release (Rust compiler, Vite 8, advanced routing, caching, AI tooling): https://astro.build/blog/astro-7/
3. Astro 7.4 release (`--timings`, split image services, experimental features): https://astro.build/blog/astro-740/
4. Astro 7 upgrade guide: https://docs.astro.build/en/guides/upgrade-to/v7/
5. Astro documentation: https://docs.astro.build/en/getting-started/
6. On-demand rendering: https://docs.astro.build/en/guides/on-demand-rendering/
7. Advanced Routing API: https://docs.astro.build/en/reference/modules/astro-fetch/
8. Route caching: https://docs.astro.build/en/guides/caching/
9. Content and live collections: https://docs.astro.build/en/guides/content-collections/
10. Actions: https://docs.astro.build/en/guides/actions/
11. Sessions: https://docs.astro.build/en/guides/sessions/
12. Server islands: https://docs.astro.build/en/guides/server-islands/
13. Images: https://docs.astro.build/en/guides/images/
14. Fonts: https://docs.astro.build/en/guides/fonts/
15. Internationalization: https://docs.astro.build/en/guides/internationalization/
16. View transitions: https://docs.astro.build/en/guides/view-transitions/
17. Testing: https://docs.astro.build/en/guides/testing/
18. Build with AI: https://docs.astro.build/en/guides/build-with-ai/
19. Configuration and CSP: https://docs.astro.build/en/reference/configuration-reference/
20. Core Web Vitals: https://web.dev/articles/vitals

**Periodic update workflow:**

- Check GitHub releases, `npm view astro version`, docs' version selector, and your locked dependency versions.
- Update this skill's `Last verified`, version notes, Node requirements, and stability labels.
- Check whether any experimental feature became stable or changed API.
- Run a smoke-test project with the chosen adapter and the code examples used here.
- Record notable incompatible changes instead of silently rewriting project rules.

**Limitations:** This is expert guidance and representative examples, not an executed application. Integrations, deployment settings, and code snippets must be validated in the target project. Third-party support and version details can change after the verification date.
