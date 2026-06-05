# AI Disaster Predictor – Frontend

**Next.js** frontend for the AI-based Natural Disaster Risk Prediction system.  
Provides an interactive dashboard for real-time weather-based disaster risk assessment, explainable AI (SHAP) insights, and historical analytics.

---

## ✨ Features

- **Authentication** – Login / Register with JWT (stored securely)
- **Disaster Prediction** – Input 5 weather parameters → get disaster type + SHAP explanation + actionable recommendations
- **Dashboard** – Overview stats, recent predictions, quick access to new predictions
- **History** – Complete list of past predictions
- **Analytics** – Disaster breakdown pie chart + monthly trends line chart + full history table
- **Responsive Glass UI** – Modern dark/light theme with glass-morphism effects
- **State Management** – Zustand for auth and prediction state

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 16 (App Router) | React framework |
| Tailwind CSS v3 | Styling & glass effects |
| Axios | API calls |
| Zustand | State management (persist + rehydration) |
| React Hook Form | Form handling |
| Recharts | Analytics charts |
| Lucide React | Icons |
| date-fns | Date formatting (optional) |

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ and npm installed
- Backend running on `http://localhost:8000` (see main repo)

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/           # login & register pages
│   │   ├── (dashboard)/      # protected pages (dashboard, predict, history, analytics)
│   │   ├── layout.tsx        # root layout
│   │   ├── providers.tsx     # Zustand hydration provider
│   │   └── globals.css       # Tailwind + glass theme
│   ├── components/
│   │   ├── ui/               # shadcn/ui style components (button, card, etc.)
│   │   ├── layout/           # Sidebar, Navbar, ThemeToggle
│   │   ├── analytics/        # Charts & stats cards
│   │   ├── history/          # History table
│   │   └── prediction/       # Weather form & result display
│   ├── services/             # API clients (auth, prediction, analytics)
│   ├── store/                # Zustand stores (auth, prediction)
│   ├── types/                # TypeScript definitions
│   └── utils/                # constants, helpers
├── public/                   # static assets
├── .env.local                # environment variables (gitignored)
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🔐 Authentication Flow

1. User registers via `/register` → backend creates account.
2. User logs in via `/login` → backend returns `access_token`.
3. Token is stored in `localStorage` (via Zustand persist).
4. Axios interceptor adds:

```http
Authorization: Bearer <token>
```

to all API requests.

5. Protected routes redirect users to `/login` if no valid token exists.

---

## 📡 API Integration

| Endpoint | Method | Used In |
|-----------|---------|----------|
| `/api/auth/register/` | POST | Register page |
| `/api/auth/login/` | POST | Login page |
| `/api/predict/` | POST | Predict page |
| `/api/analytics/summary/` | GET | Dashboard & Analytics |
| `/api/analytics/history/` | GET | History page |

All requests automatically include the JWT token.

---

## 🎨 Styling Notes

- Tailwind CSS with custom CSS variables for dark/light mode.
- Glass effect via `.glass` class (backdrop-filter + semi-transparent background).
- Responsive across mobile, tablet, and desktop.
- Theme toggle (Sun/Moon) persists user preference in localStorage.

---

## 🧪 Building for Production

```bash
npm run build
npm start
```

Static assets will be optimized and output to the `.next/` folder.

---

## 📝 Customization

### Change API Base URL

Update:

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_URL
```

### Modify Chart Colors

Edit:

```text
src/utils/constants.ts
```

### Adjust Prediction Form Defaults

Edit:

```text
src/app/(dashboard)/predict/page.tsx
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|----------|----------|
| Login fails with CORS error | Ensure backend is running on `localhost:8000` and `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000` |
| Dashboard shows "No predictions" | Make at least one prediction via `/predict` first |
| Token invalid / 401 | Clear localStorage (`localStorage.clear()`) and login again |
| Charts not rendering | Install Recharts using `npm install recharts` |

---

## 👩‍💻 Author

**Archana K**  
Bachelor of Computer Applications  
Yenepoya (Deemed-to-be University), 2026

---

## 📄 License

Academic project – all rights reserved.