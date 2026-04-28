# Orchitek — Mobile App Course Landing Page

## Original Problem Statement
Build a landing page for an online live mobile app development course (Android + iOS via Kotlin Multiplatform, Firebase, etc.). Course is 1-month, batches start the 1st of every month. Pricing: Rs. 5999 regular / Rs. 4999 student. Compelling, professional, with clear sections + testimonials.

## User Choices (verbatim)
- Lead capture: Both — form + WhatsApp button
- Brand name: **Orchitek**
- Testimonials: Realistic placeholder content
- Visual style: Modern dark tech aesthetic
- Payment: Razorpay (keys provided later — currently placeholder/test_mode)

## Architecture
- **Frontend**: React + Tailwind + shadcn/ui
  - Custom theme: Void Black (#050505), Signal Orange (#FF4400), Electric Blue (#0055FF)
  - Fonts: Clash Display (heading), IBM Plex Sans (body), JetBrains Mono (overlines)
  - Razorpay checkout.js loaded in index.html
- **Backend**: FastAPI + MongoDB (motor) + razorpay SDK
  - `/api/enrollments` POST → creates lead, optionally creates Razorpay order (skipped in test_mode)
  - `/api/enrollments/verify` POST → HMAC-SHA256 signature verification
  - `/api/enrollments` GET → list enrollments
  - `/api/leads` POST → simple lead capture
  - `/api/health` → reports razorpay_configured flag

## What's Implemented (Dec 2025)
- Sticky header with brand mark + nav anchors + Enroll CTA
- Hero (left-aligned massive type, terminal panel right, abstract bg, 4-stat bento)
- Marquee tech-stack ribbon
- Curriculum bento (6 modules, JetBrains Mono numbering, lucide icons)
- TechStack table + Requirements panel (with image)
- Schedule comparison (Weekday vs Weekend, click-to-pre-select)
- Pricing (Regular / Student plans, click-to-pre-select)
- Testimonials grid (6 placeholder reviews with grayscale avatars)
- FAQ accordion (8 items)
- Final CTA section
- Footer with contact info
- Floating WhatsApp button
- Enrollment dialog (Name/Email/Phone/Schedule/Plan/Message → Razorpay)
- Test-mode short-circuit: when keys are placeholder, lead saved without checkout

## Backlog (P0/P1/P2)
- **P0 (User to provide)**: Real Razorpay live keys, real WhatsApp number, real domain
- **P1**: Admin dashboard to view leads/enrollments at `/admin`
- **P1**: Email confirmation via Resend on successful enrollment
- **P2**: Razorpay webhook endpoint with `RAZORPAY_WEBHOOK_SECRET`
- **P2**: SEO meta tags, OG image, structured data
- **P2**: Google Analytics / Meta Pixel for ad campaigns
- **P2**: Real testimonials replacement
- **P2**: Instructor bio / About-us section

## Test Credentials
None — no auth on this landing page. Razorpay test mode placeholder.

## Endpoints (curl examples)
```
curl -X POST $API/api/enrollments -d '{"name":"X","email":"x@y.z","phone":"9","schedule":"weekday","plan":"student"}'
curl $API/api/health
```
