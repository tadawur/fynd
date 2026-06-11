# Tech Stack — Fynd

## Approach: PWA First

Fynd launches as a **Progressive Web App (PWA)**. A PWA is a website that behaves like a native app — it installs to the phone's home screen, works offline, sends push notifications, and loads instantly.

The difference from a native app is invisible to most users. The difference in development cost is very visible:

| | PWA | Native (iOS + Android) |
|---|---|---|
| Development cost | ~6 000 – 10 000 € | ~13 000 – 22 000 € |
| Time to launch | 16 – 22 weeks | 24 – 36 weeks |
| App Store required | No | Yes (99 USD/yr Apple) |
| Push notifications | Yes | Yes |
| Offline support | Yes | Yes |
| Updates | Instant (no store review) | Store review required |

**Recommendation:** Launch with PWA, migrate to native after reaching 500+ active users.

---

## Frontend

| Technology | Purpose |
|---|---|
| **React** (or Vue 3) | Component framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Build tool |
| **Workbox** | PWA service worker (offline, caching) |
| **Firebase SDK** | Push notifications (FCM) |

### Why React?
Large talent pool in Slovakia and Czech Republic. Excellent PWA support. The interactive HTML prototypes already demonstrate the desired UI patterns — React migration is straightforward.

---

## Backend

| Technology | Purpose |
|---|---|
| **Node.js + Express** | API server |
| **TypeScript** | Type safety |
| **PostgreSQL** | Primary database |
| **Redis** | Caching, session management |
| **Firebase Cloud Messaging** | Push notifications |
| **Sportnet API** | Official results and registration data |

### Alternative: Supabase
For faster MVP delivery, **Supabase** (managed PostgreSQL + auth + realtime + storage) can replace the custom backend. Reduces F1 timeline by 2–3 weeks. Recommended for the initial prototype.

---

## Infrastructure

| Service | Purpose | Cost estimate |
|---|---|---|
| **Vercel** or **Netlify** | Frontend hosting | Free tier sufficient for MVP |
| **Railway** or **Render** | Backend hosting | ~20 – 40 €/month |
| **Supabase** | Database (if used) | Free tier → ~25 €/month |
| **Firebase** | Push notifications | Free tier for <100k pushes/month |
| **Cloudflare** | CDN + DNS | Free |
| **GitHub** | Version control + CI/CD | Free |

**Total infrastructure cost at launch:** ~20 – 65 €/month

---

## Real-time

Live match events require real-time data delivery:

- **WebSockets** via Supabase Realtime or a custom Socket.io server
- **Server-Sent Events (SSE)** as a lightweight alternative for live ticker

The live ticker fires an event every time a webhook arrives from Sportnet. Connected clients receive the update within ~500ms.

---

## Authentication

- Email + password (minimum viable)
- Google Sign-In (increases registration completion rate)
- Apple Sign-In (required for iOS App Store if native route taken)
- SFZ registration number verification (via Sportnet API)

Session management via JWT tokens with refresh. Token lifetime: 7 days access, 30 days refresh.

---

## Media Storage

Player profile photos and club logos stored in:
- **Supabase Storage** or **AWS S3 + CloudFront**
- Images served via CDN
- Max upload: 5 MB per image
- Automatic WebP conversion for performance

---

## Development Workflow

```
main          → production (auto-deploy on merge)
develop       → staging (auto-deploy on push)
feature/*     → feature branches (PR required to merge)
```

CI/CD via **GitHub Actions**:
1. Lint + type check
2. Unit tests
3. Build
4. Deploy to staging (develop) or production (main)

---

## Scalability Notes

- Database: PostgreSQL with read replicas when >10k users
- Push: Firebase scales to millions of notifications per day
- CDN: Cloudflare handles traffic spikes (match days)
- Backend: Horizontal scaling via container orchestration (Railway or fly.io)

Initial architecture comfortably handles 50 clubs × 100 players = 5 000 users with no infrastructure changes.
