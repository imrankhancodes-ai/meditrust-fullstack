# MediTrust

**AI-Powered Prescription & Healthcare Platform**

MediTrust is a full-stack healthcare platform where patients can upload a prescription, get it automatically read and structured using AI, check medicine availability on the platform (with alternatives from other companies), book doctor appointments, book pathology/lab tests, and chat for basic health guidance — all in one place.

Built and maintained by **[E-Skills Web](https://eskillsweb.com)**.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [AI / Prescription Extraction Flow](#ai--prescription-extraction-flow)
- [Database Design](#database-design)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)
- [Disclaimer](#disclaimer)
- [About](#about)

---

## Overview

MediTrust solves a simple but common problem: patients receive a prescription, often handwritten, and have no easy way to understand what's written, whether the medicines are available nearby, or how to act on it (book a doctor follow-up, get a lab test done, ask a quick question). MediTrust brings all of this into a single connected flow.

**In one sentence:** Upload a prescription → get it explained → order what's available → book what's needed → ask what's unclear.

---

## Core Features

### 1. Prescription Upload & AI Extraction

- Patient uploads a photo of a prescription (printed or handwritten)
- Gemini API extracts structured data: medicine name, dosage, frequency, duration
- Low-confidence extractions are flagged for manual review instead of guessed
- Extracted medicines are fuzzy-matched against the platform's medicine database

### 2. Medicine Availability & Alternatives

- Checks if each prescribed medicine is available on MediTrust
- If unavailable: shows a suggested external link to search/purchase elsewhere
- Always shows **alternative brands** carrying the same generic/salt composition, so users aren't locked into one company

### 3. Doctor Appointment Booking

- Browse doctors by specialization
- View available time slots and book appointments
- Doctors manage their own availability via a dedicated panel

### 4. Pathology / Lab Test Booking

- Browse available tests and diagnostic labs
- Book a test slot (with optional home sample collection)
- Pathologists manage test catalogs and bookings via their own panel

### 5. Basic Health Chat (AI-Assisted)

- Chat window for general, non-diagnostic health questions
- Implemented via **polling** (periodic REST calls), not WebSockets — simpler and sufficient for this use case
- AI is explicitly restricted: no diagnosis, no dosage recommendations
- Always nudges toward booking a real doctor consultation for anything specific

---

## User Roles

| Role            | Capabilities                                                                                |
| --------------- | ------------------------------------------------------------------------------------------- |
| **Patient**     | Upload prescriptions, view extracted details, order medicines, book doctors/tests, use chat |
| **Doctor**      | Manage profile & availability, view/accept appointments, consult patients                   |
| **Pathologist** | Manage test catalog, view/accept test bookings                                              |
| **Admin**       | Manage medicine catalog, verify doctors/pathologists, oversee platform activity             |

---

## Tech Stack

**Frontend**

- React (Vite)
- Redux Toolkit — global/auth state
- TanStack Query — server state & caching
- Tailwind CSS — styling

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT — authentication
- Polling (REST) — chat updates, no WebSockets

**AI / External Services**

- Gemini API — prescription extraction (vision + structured output) and health chat
- Cloud storage (e.g. Cloudinary) — prescription image uploads

---

## System Architecture

```
┌─────────────┐      ┌──────────────┐      ┌───────────────┐
│   React     │◄────►│  Express API │◄────►│    MongoDB     │
│  (Client)   │      │   (Server)   │      │  (Mongoose)    │
└─────────────┘      └──────┬───────┘      └───────────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
          ┌──────▼──────┐        ┌───────▼───────┐
          │  Gemini API │        │  Chat (polling │
          │ (extraction │        │  via REST API) │
          │  + chat)    │        └────────────────┘
          └─────────────┘
```

---

## AI / Prescription Extraction Flow

```
1. Patient uploads prescription image
        │
        ▼
2. Image sent to Gemini API with a structured-output prompt
   → returns JSON: [{ medicine_name, dosage, frequency, duration, confidence }]
        │
        ▼
3. Each medicine name is fuzzy-matched against the `medicines` collection
        │
        ├── Match found + in stock  → "Available" (add to cart)
        ├── Match found, out of stock → suggested external link
        └── No confident match      → flagged for manual patient/admin review
        │
        ▼
4. Alternatives (same generic name, different company) are shown alongside every matched medicine
```

**Safety principle:** the AI never silently guesses. Anything below a confidence threshold is surfaced to the user as "unclear — please verify" rather than auto-filled.

---

## Database Design (Key Collections)

```
User            { name, email, password, role, phone }
Doctor          { userId, specialization, fee, availableSlots[] }
Pathologist     { userId, labName, testsOffered[] }
Prescription    { patientId, imageUrl, extractedData[], status, uploadedAt }
Medicine        { name, genericName, company, price, stock, category }
Appointment     { patientId, doctorId, slotTime, status }
TestBooking     { patientId, pathologistId, testId, slotTime, status }
Test            { name, pathologistId, price }
ChatMessage     { senderId, receiverId/sessionId, message, isAI, timestamp }
```

Medicine alternatives are resolved at query time by matching `genericName` across different `company` values — no separate mapping table required.

---

## Folder Structure

```
meditrust/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── hooks/
│   │   └── services/        # API calls (axios/TanStack Query)
│   └── ...
├── server/                  # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/          # auth, role-based access
│   └── services/            # Gemini integration, matching logic
└── README.md
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/imrankhan919/meditrust.git
cd meditrust

# Install backend + frontend dependencies (one command)
npm run setup

# (Optional) seed demo users, pathologists & products
npm run seed

# Set up environment variables (see below)

# Run backend + frontend together
# → API at http://localhost:8080, app at http://localhost:5173
npm run dev

# Or run them individually:
npm run server   # backend only (with --watch)
npm run client   # frontend only
```

---

## Deploying on Render (single service)

The Express server serves both the API (`/api/*`) and the built React app
(`client/dist`), so the whole platform deploys as **one Render web service**:

```bash
# 1. Commit & push (never commit real .env files)
# 2. Render Dashboard → New → Blueprint → select this repo (uses render.yaml)
# 3. Fill in the secret env vars when prompted:
#      MONGO_URI, JWT_SECRET (auto-generated), GEMINI_API_KEY,
#      CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
# 4. Deploy. Render runs:
#      Build:   npm run build   (installs root + client deps, builds client/dist)
#      Start:   npm start                      (node server/server.js)
# 5. (Optional) set FRONTEND_URL to your public URL
#      e.g. https://meditrust.onrender.com — used for CORS.
```

Notes:
- The frontend uses same-origin `/api` when `VITE_API_BASE_URL` is unset, so no
  client env config is needed on Render.
- Health check endpoint for Render: `GET /api/health`.
- Free-tier disks are ephemeral — prescription uploads live only as temp files
  (permanent copies go to Cloudinary), so nothing is lost on restarts.
- Never run `npm run seed` against production — it wipes collections.

> The frontend expects `VITE_API_BASE_URL` (see `client/.env.example`) to point at the
> backend, e.g. `VITE_API_BASE_URL=http://localhost:8080`.

---

## API Endpoints

Auth header for protected routes: `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/api/auth/register` | – | Register (`name, email, phone, password`) |
| POST | `/api/auth/login` | – | Login → `{ token, name, email, phone }` |
| GET | `/api/auth/me` | user | Own profile (incl. `userType`) |
| PUT | `/api/auth/me` | user | Update profile (`userType` rejected) |
| GET | `/api/products?search=&category=&minPrice=&maxPrice=&sort=` | – | Active products, filterable/sortable |
| GET | `/api/products/:pid` | – | Single product |
| GET | `/api/products/:pid/alternatives` | – | Same `genericName`, different `company`, in stock |
| POST | `/api/ai/prescription` | user | Upload prescription image (multipart `prescription`) |
| GET | `/api/ai/prescriptions` | user | Own prescription history |
| GET | `/api/ai/prescriptions/:pid` | user | Single prescription (owner/admin) |
| GET | `/api/ai/find/:pid` | user | AI availability match for a prescription |
| GET | `/api/cart` | user | Get-or-create own cart (populated) |
| POST | `/api/cart` | user | Add/increment (`productId, quantity`, stock-checked) |
| PUT | `/api/cart/:productId` | user | Set quantity (0 removes) |
| DELETE | `/api/cart/:productId` | user | Remove line item |
| DELETE | `/api/cart` | user | Clear cart |
| POST | `/api/orders` | user | Checkout from cart (`shippingAddress`), decrements stock, clears cart |
| GET | `/api/orders` | user | Own orders, newest first |
| GET | `/api/orders/:oid` | user | Single order (owner/admin) |
| PUT | `/api/orders/:oid/cancel` | user | Cancel while `placed` (restores stock) |
| GET | `/api/chat` | user | Full chat history (poll every ~5s) |
| POST | `/api/chat` | user | Send message → returns user + AI reply |
| GET | `/api/doctor` | – | All doctors |
| POST | `/api/doctor/request` | user | Apply to become a doctor |
| POST | `/api/doctor/:did` | user | Book appointment |
| GET | `/api/doctor/appointments` | doctor | Own appointments |
| PUT | `/api/doctor/appointments/:aid` | user | Update appointment status |
| GET | `/api/pathologist` | – | All pathologists |
| GET | `/api/pathologist/tests` | – | All pathology tests |
| POST | `/api/pathologist/request` | user | Apply to become a pathologist |
| POST | `/api/pathologist/add` | pathologist | Add a test |
| PUT | `/api/pathologist/test/:tid` | pathologist | Update own test |
| DELETE | `/api/pathologist/test/:tid` | pathologist | Delete own test |
| POST | `/api/pathologist/:pid` | user | Book test (`pathologyTest`) |
| GET | `/api/admin/users` | admin | All users |
| GET | `/api/admin/products` | admin | All products (incl. inactive) |
| POST | `/api/admin/product` | admin | Create product (multipart `image` + `genericName, company, category, requiresPrescription`) |
| PUT | `/api/admin/product/:pid` | admin | Update product |
| DELETE | `/api/admin/product/:pid` | admin | Soft-delete (`isActive: false`) |
| GET | `/api/admin/doctors` | admin | All doctor applications |
| PUT | `/api/admin/doctor/:did` | admin | Verify doctor (`isVerified`) |
| GET | `/api/admin/pathologists` | admin | All pathologist applications |
| PUT | `/api/admin/pathologists/:pid` | admin | Verify pathologist (`isVerified`) |
| GET | `/api/admin/orders` | admin | All orders |
| PUT | `/api/admin/orders/:oid` | admin | Update order status |

---

## Environment Variables

**server/.env**

```
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**client/.env**

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## Roadmap

- [ ] Auth & role-based access (Patient / Doctor / Pathologist / Admin)
- [ ] Medicine catalog + admin panel
- [ ] Prescription upload + Gemini extraction + fuzzy matching
- [ ] Medicine availability + alternatives display
- [ ] Doctor panel + appointment booking
- [ ] Pathologist panel + test booking
- [ ] Polling-based chat with AI-assisted basic advice
- [ ] Payments integration (future)
- [ ] Order tracking / delivery (future)

---

## Disclaimer

MediTrust is built for educational and demonstration purposes. It is **not a certified medical product** and must not be used for actual diagnosis, treatment, or medicine dispensing. AI-extracted prescription data and chat responses can be inaccurate — always verify with a licensed medical professional before acting on any information shown by this platform.

---

## About

MediTrust is built and maintained by **E-Skills Web** ([eskillsweb.com](https://eskillsweb.com)), a tech training institute based in Indore, India, with branches in Mandsaur and Udaipur — also operating under the **Robotwala EdTech** brand.

- 🌐 Website: [eskillsweb.com](https://eskillsweb.com)
- 📸 Instagram: [@eskillsweb](https://instagram.com/eskillsweb)
- 💻 GitHub: [imrankhan919](https://github.com/imrankhan919)

© E-Skills Web. All rights reserved.
