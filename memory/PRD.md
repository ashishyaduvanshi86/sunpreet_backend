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
- [x] **Retreat Detail Page** (`/retreats/:retreatId`) — Hero with "Book Now" (WhatsApp), At a Glance, Your Stay, **Your Rooms** (room cards with amenities), What Awaits You, Inclusions/Exclusions, Sample Itinerary (accordion), Gallery (masonry + lightbox), Pricing, **Get Brochure** form (opens WhatsApp with retreat + user details to +91 8595146962). Two retreats: Bali 2026 & Gulmarg 2027.
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

## Key API Endpoints
- `GET /api/products/stock` — stock status for all products
- `POST /api/products/notify` — subscribe email for notifications
- `POST /api/products/stock/toggle?product_id=X&coming_soon=false` — admin: launch product
- `POST /api/contact` — contact form (sends via Brevo)
- `POST /api/orders/create` — create Razorpay order
- `POST /api/orders/verify` — verify payment + decrement stock

## Known Issues
- **P1: Razorpay Payment:** Test keys are INVALID. User needs to provide real Razorpay test keys.

## Backlog
- P1: Get valid Razorpay API keys to enable real payments
- P2: WhatsApp order confirmation after successful payment
- P2: Add progress tracker/quiz to Training Programs page
- P2: Additional UI polish and animations
