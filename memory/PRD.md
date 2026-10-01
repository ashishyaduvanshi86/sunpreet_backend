# Sunpreet Singh Coaching Website - PRD

## Original Problem Statement
Build a visually appealing and animated coaching website for "Sunpreet Singh" with pages: Home, 1:1 Coaching, Training Programs, Retreats, About Me, Contact, and Shop/Product page. Premium, minimal aesthetic with animations. Must be mobile-friendly.

## Architecture
- **Frontend:** React + Tailwind CSS + Framer Motion + shadcn/ui
- **Backend:** FastAPI + MongoDB
- **Email:** Brevo SMTP (smtp-relay.brevo.com:587) — 300 free emails/day
- **Payments:** Razorpay (BLOCKED, needs valid keys)

## What's Implemented
- [x] All pages: Home, Coaching, Training Programs, Retreats, About, Contact, Shop
- [x] Responsive animated design with Framer Motion
- [x] **Brevo SMTP email integration** — replaces broken Resend, used for contact form + product notifications
- [x] Contact form with working email delivery via Brevo
- [x] Retreats page with gallery lightbox and registration modal
- [x] **Retreat Detail Page** (`/retreats/:retreatId`) — Hero with "Book Now" (WhatsApp), At a Glance, Your Stay, **Your Rooms** (room cards with amenities), What Awaits You, Inclusions/Exclusions, Sample Itinerary (accordion), Gallery (masonry + lightbox), Pricing, **Get Brochure** form (opens WhatsApp with retreat + user details to +91 8107722137). Two retreats: Bali 2026 & Gulmarg 2027.
- [x] E-commerce shop: 4 products (Handstand Canes, Fingerboard, Peg Board, Parallettes)
- [x] **Product Detail Page** (`/shop/:productId`) — image gallery, thumbnails, tabs, quantity selector, "You May Also Like"
- [x] **Coming Soon state** — all products show "Coming Soon" badge + "Notify Me" button
- [x] **Notify Me flow** — email capture modal (shop page) + inline form (detail page), subscriptions stored in MongoDB
- [x] **Stock tracking** — 20 units per product, auto "Out of Stock" when depleted with "Get Notified" option
- [x] **Admin toggle** — `POST /api/products/stock/toggle?product_id=X&coming_soon=false` to launch products + auto-email all subscribers
- [x] Quick View modal preserved on product cards
- [x] Multi-step checkout: Cart -> Address -> Payment (activates when products launch)
- [x] COD payment flow
- [x] Cart persistence in localStorage
- [x] Feedback section on Coaching page — masonry grid of 16 review screenshots with lightbox
- [x] Video testimonials with ffmpeg thumbnails on Homepage
- [x] Student Transformations before/after carousel on Homepage
- [x] Policy pages as footer modals (Terms, Privacy, Refund, Contact)
- [x] **Training Programs Page redesign (Feb 2026)** — Full-height hero, premium spacing between Beginner/Intermediate cards, shared "Students Who Showed Up" carousel matching Home, redesigned Video Library with thumbnail-style cards, **Apply for Financial Aid** modal with 3 options (Student Discount / Scholarship / Custom Discount).
- [x] **Financial Aid endpoint** `/api/financial-aid` — sends admin alert + applicant confirmation via Brevo Coaching channel.
- [x] **Admin Panel Phase 1 (Jun 2026)** — Full admin at `/admin` (single owner, JWT + bcrypt, activity log capped at 100 entries):
   - Dashboard: live counts (contacts/retreat apps/financial aid/waitlist) + recent activity
   - Submissions inbox: unified view across all forms with filter
   - Financial Aid: one-click approve (with discount code/%) and reject — both send personal emails
   - **Retreats CRUD**: tabbed editor (Basic/Content/Pricing/Gallery/Itinerary) with image URL paste, status toggle (Live / Coming Soon / Sold Out / Past Experience / Draft), and attendee count for past retreats
   - Programs CRUD: edit name, tagline, bullets, image URL, Spur.fit link, status
   - Site Content: edit home page hero + Learning Library video URL
   - Shop: stock toggle per product + view waitlist subscribers
   - Settings: brand info, WhatsApp, social handles
- [x] **Admin Panel Phase 2 (Feb 2026)** — Refinements based on user feedback:
   - Products seeded into MongoDB content_documents (4 products with numeric prices)
   - Admin Shop & Programs restructured: live data on TOP, dashed "Add New" CTA card BELOW
   - Activity Log & Email Log removed from sidebar and dashboard (routes deleted)
   - Newsletter renamed to **Broadcast** with multi-segment audience targeting: All Contacts, Retreat Applicants (with retreat filter), Financial Aid Applicants, Notify Me Waitlist (with product filter), and Custom Selected Emails. Recipient counter dedupes across segments.
   - New endpoint `GET /api/admin/audiences` returns all segments + counts in one call
   - Public Shop & ProductDetail now consume `useContent('products', fallback)` — CMS-managed with hardcoded fallback
- [x] **Frontend-served Video Testimonials (Feb 2026)** — Home page testimonials moved to static `frontend/src/data/testimonials.js` + thumbnails in `public/thumbnails/`. Videos remain playable even during Render cold start. Verified via Playwright with /api/testimonials blocked.
- [x] **TrainingPrograms CMS merge (Feb 2026)** — `TrainingProgramsPage` now uses `useContent('programs', [])` with per-id merge on top of `STATIC_PROGRAMS`. Admin edits to image/programLink/bullets flow to public site; rich detail (problem/overview/faq/testimonials) remains in static fallback. Draft/archived statuses filtered from public listing.
- [x] **About + Coaching CMS wire-up (Feb 2026)** — Hero h1, gallery (About), years label (About), hero headline, intro, and "What's Included" list (Coaching) now consume `useContent` with hardcoded fallbacks. Admin Site Content editors (Home/About/Coaching/Testimonials) already exist and now flow to public pages.
- [x] **ProgramEditor parity fix (Feb 2026)** — Bug: clicking Edit on Beginner/Intermediate in admin showed empty Detail/FAQ tabs. Root cause: ProgramEditor used legacy field names + DEFAULT_PROGRAMS only had minimal shape. Fix: (1) DEFAULT_PROGRAMS in `seed_content.py` now seeds full rich data (shortDesc, sessions, setting, primaryFocus, problem.{headline,points}, overview.{headline,features}, testimonials, faq) for foundations/beginner/intermediate. (2) ProgramEditor rewritten with 4 tabs (Card / Detail Page / Testimonials / FAQ) matching the public page schema. (3) ProgramDetail made defensive against missing nested fields. (4) DB force re-seeded.
- [x] **Deeper CMS wire-up (Feb 2026)** — About bio paragraphs (list editor) + philosophy section (eyebrow/headline/image/paragraphs) and Coaching pricing tiers (2-tier grid with gold highlight on tier 2) now consume CMS with hardcoded fallbacks.
- [x] **Sold Out retreat fix (Feb 2026, iteration_17+18)** — `sold_out` status fully works: retreats move OUT of Upcoming grid into a dedicated **"Sold Out Retreats"** section below it, rendered as small tiles (generalized PastExperiencesCarousel with eyebrow/title/badge/testIdPrefix props). Upcoming only shows live + coming_soon. Detail page hero shows disabled "Sold Out · Bookings Closed" (brochure stays visible for sold_out; hidden only for past). Verified with live→sold_out→past→live mutations.
- [x] **Age field across all forms (Oct 2026, iter_19)** — Contact, Retreat Apply, Retreat Enquiry, Brochure (WhatsApp), Financial Aid now capture optional Age. Backend models + admin notification emails updated.
- [x] **Request-an-Invite crash fixed (Oct 2026, iter_19)** — Modal was crashing on `selectedRetreat.highlights.map` — CMS retreats only expose `inclusions`. Added fallback `(highlights || inclusions || [])` + conditional render.
- [x] **Static placeholder removed from /retreats (Oct 2026, iter_19)** — Upcoming grid is now purely CMS-driven; the hardcoded Bali fallback no longer renders.
- [x] **Admin contact inbox fixed (Oct 2026, iter_20)** — Pre-existing silent data-loss bug: POST wrote to `contact_submissions` but admin read `contacts`. 46 historical rows were invisible. Aligned to `db.contacts` + migrated all historical rows.
- [x] **Financial Aid modal UX (Feb 2026)** — scrollable overlay + sticky circular X close; Student Discount form simplified (removed College/Student ID fields).
- [x] **Past retreat handling (Feb 2026)** — Book Now disabled, brochure hidden, "This Retreat Has Concluded" notice shown.
- [x] **RetreatEditor expanded (Feb 2026)** — new "Glance" tab (icon+title+desc cards) and "Rooms" tab (photo URL w/ preview, name, desc, amenities).
- [x] **Program detail URL-routable (Feb 2026)** — `/programs/:programId` deep links with not-found fallback.
- [x] **Admin brand renamed → Sunpreet Singh (Feb 2026)** — sidebar + login page.
- [x] **Programs schema simplified + cache invalidation (Feb 2026)** — Per user direction, public Training Programs page reverted to user-provided code (2 programs only: Beginner + Intermediate, ₹2999 each, 4-week duration, FAQ-only detail view — Problem/Overview/Testimonials sections removed). DB re-seeded to match. ProgramEditor simplified to 2 tabs (Program Details + FAQ) with clearly visible tab styling. `useContent` hook now exposes `invalidateContent(key)` which clears localStorage + dispatches a window CustomEvent so any mounted hook refetches; cache TTL also reduced to 60s. Wired into AdminContent/Programs/Retreats/Shop save flows. Verified end-to-end: admin save → public update within 2.5s without reload.
- [x] **CMS-managed content** — all retreats/programs/settings moved from `.js` files to MongoDB `content_documents` collection with public `GET /api/content/:key` (5-min localStorage cache) + admin-protected `PUT /api/admin/content/:key`. Frontend fetches from API with static `.js` as fallback.
- [x] **Past Experiences carousel** (`/retreats`) — horizontal scroll with arrows + dot indicators showing all retreats marked `status: past`. Click → full retreat detail page (read-only, no Book Now). Scales to N entries.
- [x] **Health check** `GET /api/health` — for UptimeRobot pings to keep Render free tier awake.

## Key API Endpoints
- `GET /api/health` — health check (UptimeRobot)
- `GET /api/content/:key` — public CMS content (retreats, programs, home, about, coaching, settings, **products**)
- `PUT /api/admin/content/:key` — update content (auth)
- `POST /api/auth/login` — admin login
- `GET /api/auth/me` — current admin
- `POST /api/auth/change-password` — change admin password
- `GET /api/admin/dashboard` — stats + recent activity
- `GET /api/admin/submissions?source=…` — unified inbox
- `GET /api/admin/audiences` — broadcast segments + counts (contacts, retreat_applicants, financial_aid_applicants, waitlist)
- `POST /api/admin/financial-aid/:id/approve` — approve + auto-email
- `POST /api/admin/financial-aid/:id/reject` — reject + auto-email
- `POST /api/admin/newsletter` — send broadcast to recipient list
- `GET /api/products/stock` — stock status for all products
- `POST /api/products/notify` — subscribe email for notifications
- `POST /api/products/stock/toggle?product_id=X&coming_soon=false` — admin: launch product
- `POST /api/contact` — contact form (sends via Brevo)
- `POST /api/financial-aid` — financial aid applications (student / scholarship / custom)
- `POST /api/orders/create` — create Razorpay order
- `POST /api/orders/verify` — verify payment + decrement stock

## Known Issues
- **P1: Razorpay Payment:** Test keys are INVALID. User needs to provide real Razorpay test keys.

## Backlog
- P2: Image file uploads (currently paste URL only). Cloudflare R2 or S3 integration.
- P2: Programs Past/Archive section on `/programs` page (admin status `archived` is in place; UI section pending)
- P2: Expand Site Content CMS — About Me page, Coaching page tiers, testimonials editor
- P2: Email blast tool (send launch announcements to waitlist subscribers)
- P2: Add real video URLs to Learning Library
- P1: Razorpay integration once keys provided
- P3: Multi-admin / role-based access
- P3: Revenue & analytics reports

