# LaZure — Frontend

Nail booking platform for Armenia. Built with React + TypeScript + Vite + CSS Modules.

---

## 🚀 Getting Started

```bash
# Go to frontend folder
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
# http://localhost:5173
```

---

## 🗂 Folder Structure

```
src/
├── assets/
│   └── images/          # Local photos (photo1.jpg, photo2.jpg...)
│
├── components/          # Reusable components (used on multiple pages)
│   ├── Navbar/
│   │   ├── Navbar.tsx
│   │   └── Navbar.module.css
│   └── Footer/
│       ├── Footer.tsx
│       └── Footer.module.css
│
├── pages/               # One folder per page/route
│   ├── Home/
│   │   ├── Home.tsx
│   │   └── Home.module.css
│   ├── Artists/
│   ├── ArtistProfile/
│   ├── Booking/
│   ├── Confirmation/
│   ├── Auth/
│   ├── Dashboard/
│   │   ├── ClientDashboard.tsx
│   │   ├── ClientDashboard.module.css
│   │   ├── ArtistDashboard.tsx
│   │   └── ArtistDashboard.module.css
│   ├── Admin/
│   └── NotFound/
│
├── data/
│   └── mockData.ts      # Mock data (replace with API calls in Phase 2)
│
├── types/
│   └── index.ts         # TypeScript interfaces
│
├── styles/
│   └── global.css       # CSS variables + global styles
│
├── App.tsx              # Routes
└── main.tsx             # Entry point
```

---

## 🎨 Design System

### Colors (CSS Variables)
All colors are defined in `src/styles/global.css`.  
**Never use hardcoded hex values** — always use variables.

```css
/* Backgrounds */
--cream: #FAF7F4          /* main background */
--warm-white: #FFFCFA     /* cards, sections */
--blush: #F2E4DC          /* hover states, tags */

/* Brand Colors */
--rose: #D9A89A
--deep-rose: #B07060      /* accents, prices, italic text */
--mauve: #8B6B6B

/* Navy (buttons, active states) */
--navy: #001f3f
--navy-light: #002d5a

/* Text */
--dark: #2C2020           /* headings */
--text: #3D2B2B           /* body text */
--text-light: #7A5C5C     /* subtitles, labels */
--border: #EAD8D0         /* borders, dividers */
```

### Typography
```css
--font-display: 'Cormorant Garamond', serif   /* headings, names, prices */
--font-body: 'DM Sans', sans-serif            /* body text, buttons, labels */
```

### Spacing
```css
--section-padding: 100px 60px    /* section padding */
--nav-height: 80px               /* navbar height */
```

---

## 📄 How to Create a New Page

### Step 1 — Create files
```
src/pages/MyPage/
├── MyPage.tsx
└── MyPage.module.css
```

### Step 2 — Basic template (MyPage.tsx)
```tsx
import styles from './MyPage.module.css'

const MyPage = () => {
  return (
    <main className={styles.main}>
      <h1>My Page</h1>
    </main>
  )
}

export default MyPage
```

### Step 3 — Basic CSS (MyPage.module.css)
```css
.main {
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--cream);
}
```

### Step 4 — Add route in App.tsx
```tsx
import MyPage from './pages/MyPage/MyPage'

<Route path="/my-page" element={<MyPage />} />
```

---

## 🧩 How to Create a New Component

### Step 1 — Create files
```
src/components/MyComponent/
├── MyComponent.tsx
└── MyComponent.module.css
```

### Step 2 — Component template
```tsx
import styles from './MyComponent.module.css'

// Define props interface
interface MyComponentProps {
  title: string
  onClick?: () => void
}

const MyComponent = ({ title, onClick }: MyComponentProps) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      {onClick && (
        <button className={styles.btn} onClick={onClick}>
          Click me
        </button>
      )}
    </div>
  )
}

export default MyComponent
```

### Step 3 — Use in a page
```tsx
import MyComponent from '../../components/MyComponent/MyComponent'

<MyComponent title="Hello" onClick={() => console.log('clicked')} />
```

---

## 🔗 Navigation (React Router)

```tsx
import { useNavigate } from 'react-router-dom'

const MyPage = () => {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate('/artists')}>
      Find Artists
    </button>
  )
}
```

### Available Routes
| Path | Page |
|------|------|
| `/` | Home |
| `/artists` | Find an Artist |
| `/artist/:username` | Artist Profile |
| `/booking/:artistId` | Booking |
| `/confirmation` | Booking Confirmation |
| `/auth` | Sign In |
| `/dashboard/client` | Client Dashboard |
| `/dashboard/artist` | Artist Dashboard |
| `/admin` | Admin Panel |
| `*` | 404 Not Found |

---

## 📦 Data (Mock → API)

Currently all data comes from `src/data/mockData.ts`.

**Phase 2:** Replace mock imports with API calls.

```tsx
// ❌ Phase 1 (now) — mock data
import { artists } from '../../data/mockData'

// ✅ Phase 2 — API call
const [artists, setArtists] = useState([])
useEffect(() => {
  fetch('/api/artists').then(r => r.json()).then(setArtists)
}, [])
```

Component structure stays the same — only the data source changes!

---

## 📐 Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `ArtistCard.tsx` |
| CSS Modules | camelCase | `.artistCard`, `.bookBtn` |
| Pages folder | PascalCase | `ArtistProfile/` |
| Variables | camelCase | `const artistName` |
| Interfaces | PascalCase | `interface Artist {}` |
| Routes | kebab-case | `/artist/:username` |

---

## 🎨 CSS Modules Rules

```css
/* ✅ Good — camelCase */
.artistCard { }
.bookBtn { }
.sectionTitle { }

/* ❌ Bad — kebab-case doesn't work in CSS Modules */
.artist-card { }
.book-btn { }
```

**Never use inline styles** (except dynamic values like status colors):
```tsx
/* ✅ OK — dynamic value */
<div style={{ background: status.bg, color: status.text }}>

/* ❌ Bad — static value, use CSS Module instead */
<div style={{ padding: '24px', borderRadius: '12px' }}>
```

---

## 🏗 TypeScript Interfaces

All interfaces are in `src/types/index.ts`.

```typescript
export interface Artist {
  id: string
  name: string
  username: string
  photo: string
  specialty: string[]
  rating: number
  reviews: number
  priceFrom: number
  available: 'today' | 'tomorrow' | 'this-week'
}

export interface Service {
  id: string
  name: string
  icon: string
  duration: string
  priceFrom: number
}

export interface Booking {
  id: string
  artistId: string
  clientId: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
}
```

---

## ✅ Checklist — Before Every Commit

- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No hardcoded colors (use CSS variables)
- [ ] No hardcoded data (use mockData or props)
- [ ] Responsive — check mobile view
- [ ] New component has its own CSS module
- [ ] New page has route in App.tsx

---

## 🔮 Phase 2 — What Will Change

| Now (Mock) | Phase 2 (Real) |
|-----------|----------------|
| `mockData.ts` | FastAPI backend |
| `alert()` confirmations | Real API responses |
| Hardcoded time slots | Artist availability API |
| Local photos | Cloudinary CDN |
| Fake OTP | Real SMS (Twilio) |
| No auth check | JWT token validation |

---

*LaZure Frontend — Built by Tatevik Aghakhanyan — 2026*
