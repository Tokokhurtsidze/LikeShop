# LikeShop — Real Estate Marketplace Design Spec
**Date:** 2026-05-26  
**Status:** Approved  

---

## 1. Overview

A production-ready real estate marketplace for the Georgian market, similar to ss.ge. Built with Next.js 15 App Router, MongoDB, and deployed on Vercel. Supports property listings (sale and rent), advanced filtering, bilingual UI (Georgian/English), and SEO-optimized detail pages.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | Hybrid rendering, Vercel-native |
| Database | MongoDB + Mongoose + `mongodb` native driver | Flexible schema, Georgian market scale |
| Auth | NextAuth v5 (Credentials + Google OAuth) | Self-hosted, JWT sessions, no extra cost |
| Images | Cloudinary | Auto-optimization, CDN, signed uploads |
| Maps | Google Maps JS API | Best coverage for Georgia |
| i18n | next-intl | URL-prefix locale routing |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Validation | Zod + React Hook Form | End-to-end type-safe validation |
| Deployment | Vercel | Zero-config Next.js, ISR support |

---

## 3. Project Structure

```
likeshop/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Homepage (SSG + ISR 1hr)
│   │   ├── listings/
│   │   │   ├── page.tsx                # Listings index (SSR)
│   │   │   └── [id]/page.tsx           # Property detail (SSR + generateMetadata)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Protected layout
│   │   │   ├── page.tsx                # My listings
│   │   │   ├── new/page.tsx            # Create listing
│   │   │   └── edit/[id]/page.tsx      # Edit listing
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── (static)/
│   │       ├── about/page.tsx          # SSG
│   │       └── contact/page.tsx        # SSG
│   ├── api/
│   │   ├── listings/route.ts           # GET search/filter
│   │   ├── cloudinary-signature/route.ts
│   │   └── auth/[...nextauth]/route.ts
│   ├── sitemap.ts                      # Dynamic sitemap
│   └── robots.ts
├── components/
│   ├── listings/
│   │   ├── ListingCard.tsx
│   │   ├── ListingGrid.tsx
│   │   ├── ImageGallery.tsx
│   │   └── ListingJsonLd.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── FilterChips.tsx
│   ├── dashboard/
│   │   ├── ListingForm.tsx
│   │   └── ImageUploader.tsx
│   ├── map/
│   │   └── PropertyMap.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       └── Modal.tsx
├── lib/
│   ├── mongodb.ts                      # Mongoose connection singleton
│   ├── auth.ts                         # NextAuth config
│   ├── cloudinary.ts                   # Upload helpers
│   └── validations/
│       ├── listing.ts                  # Zod listing schema
│       └── user.ts                     # Zod user schema
├── models/
│   ├── User.ts
│   └── Listing.ts
├── actions/
│   ├── listings.ts                     # create / update / delete
│   └── auth.ts                         # register
├── messages/
│   ├── en.json
│   └── ka.json
├── middleware.ts                       # next-intl + auth protection
└── public/
```

---

## 4. Rendering Strategy

| Page | Strategy | Reason |
|---|---|---|
| Homepage | SSG + ISR (3600s) | Static shell, refreshes featured listings hourly |
| `/listings` | SSR | URL search params drive dynamic Mongoose queries |
| `/listings/[id]` | SSR | Fresh data per request + per-listing SEO metadata |
| Dashboard pages | SSR (auth-gated) | User-specific, never publicly cached |
| About / Contact | SSG | Fully static content |
| Sitemap | Dynamic Route Handler | Crawls all active listing IDs from MongoDB |

---

## 5. MongoDB Schemas

### User
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,           // unique index
  hashedPassword?: string, // optional — absent for OAuth users
  phone?: string,
  avatar?: string,         // Cloudinary URL
  role: 'user' | 'admin',
  listings: ObjectId[],    // ref Listing
  createdAt: Date,
  updatedAt: Date,
}
```

### Listing
```typescript
{
  _id: ObjectId,
  title: { en: string, ka: string },
  description: { en: string, ka: string },
  transactionType: 'sale' | 'rent_monthly' | 'rent_daily',
  propertyType: 'house' | 'apartment' | 'cottage' | 'commercial' | 'land',
  status: 'active' | 'inactive' | 'sold',
  price: number,
  currency: 'GEL' | 'USD',
  area: number,            // m²
  rooms: number,
  bedrooms: number,
  bathrooms: number,
  floor?: number,
  totalFloors?: number,
  location: {
    region: string,        // e.g. "Tbilisi"
    district: string,      // e.g. "Vake"
    address: string,
    coordinates: { lat: number, lng: number },
  },
  amenities: string[],     // ['parking', 'elevator', 'balcony', ...]
  images: Array<{
    publicId: string,      // Cloudinary public_id
    url: string,
    alt: string,
  }>,
  owner: ObjectId,         // ref User
  views: number,
  featured: boolean,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
- Compound: `{ transactionType, propertyType, status }`
- Single: `location.region`, `price`, `owner`, `createdAt`
- Text: `title.en`, `title.ka`, `location.address`, `location.district`

---

## 6. Auth Flow

- **Register:** Zod validation → `bcryptjs` hash → save User → sign in → redirect `/dashboard`
- **Login:** Credentials provider → verify hash → JWT session
- **Google OAuth:** NextAuth handles token exchange → upsert User
- **Session:** JWT strategy (no DB session table — serverless-friendly)
- **Protection:** `middleware.ts` matches `/[locale]/dashboard/*` → redirects unauthenticated to `/[locale]/auth/login`
- **Password reset:** out of scope for v1

---

## 7. Listing CRUD & Image Upload

**Create/Edit:**
1. `ListingForm` (React Hook Form + Zod client-side validation)
2. `ImageUploader` calls `/api/cloudinary-signature` → gets signed params → uploads directly to Cloudinary (never exposes secret to client)
3. On submit → Server Action `createListing` / `updateListing` → server-side Zod revalidation → Mongoose save
4. Max 10 images per listing, 5MB each, auto-converted to WebP via Cloudinary `f_auto,q_auto`

**Delete:**
- Server Action `deleteListing` → destroy Cloudinary assets → delete Mongoose doc

---

## 8. Search & Filter System

Filters are URL query params — deep-linkable and SEO-friendly.

**URL shape:**
```
/ka/listings?type=apartment&transaction=rent_monthly&region=Tbilisi&minPrice=500&maxPrice=2000&rooms=3&page=1
```

**Available filters:**
- `transaction`: `sale` | `rent_monthly` | `rent_daily`
- `type`: `house` | `apartment` | `cottage` | `commercial` | `land`
- `region`: Georgian region list (static enum)
- `minPrice` / `maxPrice`: number inputs
- `rooms`: `1` | `2` | `3` | `4+`
- `minArea` / `maxArea`: number inputs
- `q`: free-text (MongoDB text index search)
- `page`: pagination (20 per page)

**Data flow:** `searchParams` → `app/api/listings/route.ts` → builds Mongoose query → returns `{ listings, total, page, totalPages }`. `FilterSidebar` calls `router.push()` on change — no client state, URL is source of truth. `Suspense` boundary wraps `ListingGrid` for loading skeleton.

---

## 9. SEO Strategy

| Mechanism | Implementation |
|---|---|
| `generateMetadata` | Per listing: title, description, og:image (first Cloudinary URL) |
| JSON-LD | `RealEstateListing` Schema.org injected via `<ListingJsonLd>` component |
| Dynamic sitemap | `app/sitemap.ts` queries MongoDB for all active listing IDs |
| `robots.ts` | Disallows `/*/dashboard`, allows all else |
| Canonical URL | Set in metadata to prevent duplicate locale URLs |
| Semantic HTML | `<article>`, `<main>`, `<nav>`, `<address>`, `<figure>` throughout |
| OG tags | Title, description, image, type, locale per listing |

---

## 10. i18n (next-intl)

- Locale prefix routing: `/en/*` and `/ka/*`
- Default locale: `ka` (Georgian — primary market)
- Locale detection: `middleware.ts` reads `Accept-Language`, defaults to `ka`
- UI strings: `messages/en.json` + `messages/ka.json`
- Listing content: stored as `{ en, ka }` objects in MongoDB, served by active locale
- Slugs: use MongoDB `_id` — language-agnostic, no duplicate content risk

---

## 11. Key Dependencies

```json
{
  "next": "^15",
  "react": "^19",
  "mongoose": "^8",
  "mongodb": "^6",
  "next-auth": "^5",
  "next-intl": "^3",
  "zod": "^3",
  "react-hook-form": "^7",
  "@hookform/resolvers": "^3",
  "bcryptjs": "^2",
  "cloudinary": "^2",
  "@vis.gl/react-google-maps": "^1",
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4"
}
```

---

## 12. Out of Scope (v1)

- Payment / featured listing promotion
- Admin panel
- Password reset / email verification
- Chat / messaging between buyer and seller
- Mobile app
- Reviews / ratings
