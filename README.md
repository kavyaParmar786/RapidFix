# ⚡ RapidFix — Home Services On Demand

> A full-stack marketplace connecting customers with skilled home service professionals.  
> Built with **Next.js 14**, **Firebase**, **TypeScript**, and **Tailwind CSS**.

![RapidFix](./public/logo.png)

---

## 📁 Project Structure

```
rapidfix/
├── public/
│   └── logo.png                   # App logo & favicon
│
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing page
│   │   ├── layout.tsx             # Root layout with fonts & providers
│   │   ├── not-found.tsx          # 404 page
│   │   │
│   │   ├── components/            # Landing page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── CTASection.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── login/page.tsx     # Login (email + Google)
│   │   │   ├── signup/page.tsx    # Signup with role selection
│   │   │   └── role-select/page.tsx  # Post-Google role picker
│   │   │
│   │   ├── dashboard/
│   │   │   ├── customer/page.tsx  # Customer dashboard
│   │   │   └── worker/page.tsx    # Worker dashboard
│   │   │
│   │   ├── jobs/
│   │   │   ├── post/page.tsx      # Post a job
│   │   │   └── [id]/page.tsx      # Job detail view
│   │   │
│   │   ├── chat/
│   │   │   └── [id]/page.tsx      # Real-time chat
│   │   │
│   │   ├── feed/
│   │   │   └── page.tsx           # Worker job feed
│   │   │
│   │   └── profile/
│   │       └── page.tsx           # User profile editor
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Responsive navbar with notifications
│   │   │   └── Footer.tsx         # Full footer
│   │   ├── shared/
│   │   │   └── JobCard.tsx        # Reusable job card component
│   │   └── ui/
│   │       ├── Spinner.tsx        # Loading spinners
│   │       └── StarRating.tsx     # Interactive star rating
│   │
│   ├── lib/
│   │   ├── firebase.ts            # Firebase initialization
│   │   ├── auth-context.tsx       # Auth context & provider
│   │   ├── firestore.ts           # All Firestore & Storage helpers
│   │   └── utils.ts               # Utility functions & constants
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   │
│   └── styles/
│       └── globals.css            # Global styles & design tokens
│
├── firestore.rules                # Firestore security rules
├── firestore.indexes.json         # Composite indexes
├── storage.rules                  # Storage security rules
├── firebase.json                  # Firebase project config
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example             # Environment variables template
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd rapidfix
npm install
```

### 2. Firebase Setup

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → name it `rapidfix` → continue
3. Enable **Google Analytics** (optional)

#### B. Enable Authentication
1. Firebase Console → **Authentication** → **Get started**
2. Enable **Email/Password** provider
3. Enable **Google** provider
   - Add your domain to authorized domains

#### C. Create Firestore Database
1. Firebase Console → **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose a region close to your users (e.g., `asia-south1` for India)

#### D. Enable Storage
1. Firebase Console → **Storage** → **Get started**
2. Start in **production mode**
3. Choose the same region as Firestore

#### E. Get Web App Config
1. Firebase Console → **Project Settings** (gear icon)
2. Scroll to **Your apps** → **Add app** → Web (`</>`)
3. Register app as `rapidfix-web`
4. Copy the `firebaseConfig` object

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rapidfix-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rapidfix-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rapidfix-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```

### 4. Deploy Firebase Rules & Indexes

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select your project)
firebase use --add

# Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deployment to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Configure environment variables:
   - Go to **Settings** → **Environment Variables**
   - Add all `NEXT_PUBLIC_FIREBASE_*` variables from your `.env.local`
5. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... (repeat for all variables)

# Redeploy with env vars
vercel --prod
```

### Post-Deployment: Update Firebase Auth Domain

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel domain: `your-project.vercel.app`

---

## 🔥 Firebase Collections Structure

```
firestore/
├── users/{uid}
│   ├── uid, email, displayName, photoURL
│   ├── role: "customer" | "worker"
│   ├── phone, location, bio
│   ├── skills: JobCategory[]       # Worker only
│   ├── isAvailable: boolean        # Worker only
│   ├── rating: number, reviewCount
│   └── createdAt, updatedAt
│
├── jobs/{jobId}
│   ├── title, description, category
│   ├── status: posted|accepted|in_progress|completed|cancelled
│   ├── urgency: low|medium|high|emergency
│   ├── budget?, location, images[]
│   ├── customerId, customerName, customerPhoto
│   ├── workerId?, workerName?, workerPhoto?
│   ├── chatId?
│   └── createdAt, updatedAt, acceptedAt?, completedAt?
│
├── chats/{chatId}
│   ├── jobId, jobTitle
│   ├── customerId, customerName, customerPhoto
│   ├── workerId, workerName, workerPhoto
│   ├── lastMessage?, lastMessageAt?
│   └── createdAt
│   │
│   └── messages/{messageId}
│       ├── senderId, senderName, senderPhoto
│       ├── text?, imageUrl?
│       ├── type: "text" | "image" | "system"
│       ├── read: boolean
│       └── createdAt
│
├── notifications/{notifId}
│   ├── userId, type, title, body
│   ├── jobId?, chatId?
│   ├── read: boolean
│   └── createdAt
│
└── reviews/{reviewId}
    ├── jobId, reviewerId, reviewerName
    ├── revieweeId, rating, comment
    └── createdAt
```

---

## ⚙️ Key Technical Features

### 🔒 Atomic Job Locking
Uses Firestore **transactions** (`runTransaction`) to guarantee only one worker can accept a job — preventing race conditions even under high concurrency.

```typescript
await runTransaction(db, async (tx) => {
  const snap = await tx.get(jobRef)
  if (snap.data().status !== 'posted') throw new Error('Already taken')
  tx.update(jobRef, { status: 'accepted', workerId: ... })
  tx.set(chatRef, chatData)  // Chat created atomically
})
```

### ⚡ Real-time Updates
All dashboards and feeds use Firestore `onSnapshot` listeners for live updates without polling.

### 🔐 Security
- Firebase Auth for identity
- Firestore Rules enforce ownership checks server-side
- Storage Rules restrict uploads by file type and size
- Input validation on all forms

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#6366f1` (Indigo) |
| Secondary | `#8b5cf6` (Violet) |
| Accent | `#f59e0b` (Gold) |
| Electric | `#06b6d4` (Cyan) |
| Background | `#080b14` |
| Surface | `#0f1420` |
| Font Display | Syne |
| Font Body | DM Sans |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Custom CSS Variables |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Real-time | Firestore `onSnapshot` |
| Deployment | Vercel |
| Language | TypeScript |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this for personal or commercial projects.

---

Built with ❤️ for the RapidFix community.
