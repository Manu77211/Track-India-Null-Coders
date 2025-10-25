# Track India - Frontend Application

> Modern Next.js dashboard for tracking Indian infrastructure development with real-time updates, AI chat, and interactive visualizations

[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Design System](#design-system)
- [Development](#development)

---

## 🎯 Overview

Track India Frontend is a modern, responsive Next.js application that visualizes Indian infrastructure development data with real-time updates, AI-powered chat, interactive dashboards, and predictive analytics. Built with a clean black/white theme and full dark mode support.

### Key Capabilities

- 📊 **Interactive Dashboard** with live data visualizations
- 💬 **AI Chat Interface** powered by RAG + Gemini Pro
- 📰 **Real-time Updates** with filtering and search
- 🗺️ **Interactive Maps** using Leaflet
- 📈 **Data Export** to PDF with charts
- 🌓 **Dark Mode** with theme persistence
- ⚡ **Optimized Performance** with prefetching and lazy loading

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Track India Frontend                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   User Layer     │         │  Presentation    │         │  Data Layer      │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ • Browser        │────────▶│ Next.js Pages    │◀────────│ API Client       │
│ • Mobile         │         │ • Dashboard      │         │ • Fetch API      │
│ • Desktop        │         │ • Updates        │         │ • Error Handling │
└──────────────────┘         │ • Chat           │         │ • Caching        │
                             │ • About          │         └──────────────────┘
                             └──────────────────┘                  │
                                      │                            │
                                      ▼                            ▼
                             ┌──────────────────┐         ┌──────────────────┐
                             │  Components      │         │  Backend API     │
                             ├──────────────────┤         ├──────────────────┤
                             │ • Charts         │◀────────│ Flask Server     │
                             │ • Maps           │         │ • /api/updates   │
                             │ • Chat Interface │         │ • /api/stats     │
                             │ • Export Tools   │         │ • /api/chat      │
                             └──────────────────┘         └──────────────────┘
                                      │
                                      ▼
                             ┌──────────────────┐
                             │  State & Context │
                             ├──────────────────┤
                             │ • Theme Context  │
                             │ • React Query    │
                             │ • Local Storage  │
                             └──────────────────┘
```

### Component Hierarchy

```
App Layout (layout.tsx)
    ├── Navbar (global navigation)
    ├── ThemeProvider (dark mode)
    └── Page Content
            ├── Dashboard Page
            │   ├── Map Component (Leaflet)
            │   ├── Trend Chart (Recharts)
            │   ├── Driver Chart (Recharts)
            │   └── Export Button (jsPDF)
            │
            ├── Updates Page
            │   ├── Filter Controls
            │   ├── Update Cards
            │   └── Detail Page (dynamic route)
            │
            ├── Chat Page
            │   ├── ChatInterface
            │   ├── ChatMessage (markdown)
            │   └── Source Citations
            │
            └── About Page
                ├── Feature Cards
                └── Team Section
```

---

## ✨ Features

### 📊 Dashboard

- **Interactive Map**: District-wise project visualization using Leaflet
- **Trend Charts**: Time-series data with Recharts
- **Driver Analysis**: Top ministries by project count
- **Quick Stats**: Active projects, funding, policies, completed projects
- **PDF Export**: Download dashboard with charts as PDF
- **Predictive Analytics**: AI-powered trend forecasting
- **Real-time Data**: Auto-refresh from backend API

### 💬 AI Chat

- **Natural Language**: Ask questions about infrastructure projects
- **RAG-Powered**: Retrieves relevant context before answering
- **Source Citations**: Each answer includes 5 relevant sources
- **Markdown Support**: Rich text formatting in responses
- **Chat History**: Maintains conversation context
- **Loading States**: Smooth animations during AI processing

### 📰 Live Updates

- **Real-time Feed**: 50+ infrastructure updates from NewsAPI + data.gov.in
- **Filtering**: By type (all/news/project) and date
- **Search**: Full-text search across titles and descriptions
- **Pagination**: Efficient data loading with limits
- **Detail Pages**: Dynamic routes for individual updates
- **Related Items**: 5 similar updates on detail pages
- **Impact Scores**: Visual indicators for project significance

### 🎨 Design System

- **Black/White Theme**: Professional grayscale palette
- **Dark Mode**: Full support with theme toggle
- **Responsive**: Mobile-first design (320px - 4K)
- **Animations**: Framer Motion for smooth transitions
- **Accessibility**: ARIA labels, keyboard navigation
- **Loading States**: Custom liquid loader animation
- **Consistent UI**: Unified component library

---

## 🛠️ Tech Stack

### Core Framework

| Technology       | Version | Purpose                      |
| ---------------- | ------- | ---------------------------- |
| **Next.js**      | 14.0.0  | React framework with SSR/SSG |
| **React**        | 18      | UI library                   |
| **TypeScript**   | 5       | Type safety                  |
| **Tailwind CSS** | 3.3     | Utility-first styling        |

### UI & Animations

| Technology        | Purpose                      |
| ----------------- | ---------------------------- |
| **Framer Motion** | 10.16.16 - Smooth animations |
| **GSAP**          | 3.13.0 - Advanced animations |
| **Lucide React**  | 0.294.0 - Icon library       |

### Data Visualization

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| **Recharts**      | 2.8.0 - Charts and graphs      |
| **Leaflet**       | 1.9.4 - Interactive maps       |
| **React Leaflet** | 4.2.1 - Leaflet React bindings |

### State & Data

| Technology      | Purpose                              |
| --------------- | ------------------------------------ |
| **React Query** | 5.14.0 - Data fetching & caching     |
| **Zustand**     | 4.4.7 - Lightweight state management |

### Export & Display

| Technology         | Purpose                     |
| ------------------ | --------------------------- |
| **jsPDF**          | 2.5.1 - PDF generation      |
| **html2canvas**    | 1.4.1 - Screenshot to image |
| **React Markdown** | 10.1.0 - Markdown rendering |

---

## 📁 Project Structure

```
Track-India-Null-Coders/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx             # Root layout with navbar
│   │   ├── page.tsx               # Home page
│   │   ├── loading.tsx            # Loading state (LiquidLoader)
│   │   ├── globals.css            # Global styles
│   │   │
│   │   ├── dashboard/             # Dashboard route
│   │   │   ├── page.tsx          # Main dashboard page
│   │   │   └── components/
│   │   │       ├── Map.tsx       # District map
│   │   │       ├── TrendChart.tsx # Time-series chart
│   │   │       └── DriverChart.tsx # Ministry chart
│   │   │
│   │   ├── updates/               # Updates route
│   │   │   ├── page.tsx          # Updates listing
│   │   │   └── [id]/             # Dynamic route
│   │   │       └── page.tsx      # Single update detail
│   │   │
│   │   ├── chat/                  # Chat route
│   │   │   ├── page.tsx          # Chat page
│   │   │   └── components/
│   │   │       ├── ChatInterface.tsx  # Main chat UI
│   │   │       └── ChatMessage.tsx    # Message component
│   │   │
│   │   └── about/                 # About route
│   │       └── page.tsx          # About page
│   │
│   ├── components/                # Shared components
│   │   ├── Navbar.tsx            # Global navigation
│   │   ├── LoadingBar.tsx        # Top progress bar
│   │   ├── LiquidLoader.tsx      # Animated loader
│   │   ├── ExportButton.tsx      # PDF export
│   │   └── DistrictSearch.tsx    # Search component
│   │
│   ├── contexts/                  # React contexts
│   │   └── ThemeContext.tsx      # Dark mode provider
│   │
│   └── lib/                       # Utilities
│       ├── api.ts                # API client functions
│       └── charts.ts             # Chart configurations
│
├── public/                        # Static assets
│   └── images/                   # Images, logos, etc.
│
├── tailwind.config.js            # Tailwind configuration
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

### Key Directories

- **`src/app/`**: Next.js 14 App Router pages and layouts
- **`src/components/`**: Reusable React components
- **`src/contexts/`**: React Context providers for global state
- **`src/lib/`**: Utility functions and API clients

---

## 🚀 Installation

### Prerequisites

- Node.js 16+ (recommended: 18 LTS)
- npm or yarn package manager
- Backend API running on port 8010

### Step 1: Clone Repository

```bash
cd Track-India-Null-Coders
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Run Development Server

```bash
npm run dev
# or
yarn dev
```

### Step 4: Open Browser

```
http://localhost:3000
```

---

## ⚙️ Configuration

### Environment Variables (Optional)

Create a `.env.local` file if you need custom configuration:

```env
# Backend API URL (default: http://localhost:8010)
NEXT_PUBLIC_API_URL=http://localhost:8010

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### API Configuration

The frontend connects to the Flask backend by default at `http://localhost:8010`. Update in `src/lib/api.ts` if needed:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";
```

---

## 🗂️ Pages & Routes

### Public Routes

| Route           | File                        | Description                       |
| --------------- | --------------------------- | --------------------------------- |
| `/`             | `app/page.tsx`              | Home page with feature highlights |
| `/dashboard`    | `app/dashboard/page.tsx`    | Interactive data dashboard        |
| `/updates`      | `app/updates/page.tsx`      | Live updates feed                 |
| `/updates/[id]` | `app/updates/[id]/page.tsx` | Single update detail              |
| `/chat`         | `app/chat/page.tsx`         | AI-powered chat interface         |
| `/about`        | `app/about/page.tsx`        | About the project                 |

### Route Features

#### 1. Home Page (`/`)

- Hero section with animations
- Feature cards (Dashboard, Chat, Updates)
- Quick navigation
- Dark mode support

#### 2. Dashboard (`/dashboard`)

- **Interactive Map**: Click districts for details
- **Trend Chart**: Time-series with multiple metrics
- **Driver Chart**: Top 10 ministries by projects
- **Quick Stats**: 4 key metrics
- **Export PDF**: Download full dashboard
- **Predictive Analytics**: AI-powered forecasts

#### 3. Updates (`/updates`)

- **Filter Controls**: Type (all/news/project), limit
- **Update Cards**: Title, description, date, source
- **Pagination**: Load more functionality
- **Search**: Filter by keywords
- **Detail Links**: Navigate to full update

#### 4. Update Detail (`/updates/[id]`)

- **Full Content**: Complete update information
- **Impact Score**: Visual progress indicator
- **Quick Stats**: Key metrics
- **Related Updates**: 5 similar items
- **Back Navigation**: Return to listing
- **Share Options**: Copy link, social media

#### 5. Chat (`/chat`)

- **Message Input**: Text area with submit
- **Chat History**: Conversation display
- **AI Responses**: Markdown-formatted answers
- **Source Citations**: Clickable sources
- **Loading State**: Animated while processing
- **Error Handling**: User-friendly error messages

#### 6. About (`/about`)

- **Mission Statement**: Project goals
- **Features**: Key capabilities
- **Data Sources**: API information
- **Technology Stack**: Tech used
- **Team**: Null Coders information

---

## 🧩 Components

### Core Components

#### 1. Navbar (`components/Navbar.tsx`)

```tsx
// Global navigation with dark mode toggle
- Logo and branding
- Desktop navigation links
- Mobile hamburger menu
- Theme toggle button
- Prefetch enabled on all links
```

#### 2. LoadingBar (`components/LoadingBar.tsx`)

```tsx
// Top progress bar during navigation
- Grayscale gradient animation
- Auto-hide after page load
- Smooth transitions
```

#### 3. LiquidLoader (`components/LiquidLoader.tsx`)

```tsx
// Animated loading screen
- 7 liquid bars with physics
- Grayscale theme (black/white)
- Droplet animations
- Wave effects
- Dark mode support
```

#### 4. ExportButton (`components/ExportButton.tsx`)

```tsx
// PDF export functionality
- Captures current page
- Converts to PDF
- Includes charts and maps
- Download trigger
```

### Dashboard Components

#### 1. Map (`app/dashboard/components/Map.tsx`)

```tsx
// Interactive Leaflet map
- District boundaries
- Click interactions
- Tooltips
- Zoom controls
- Responsive sizing
```

#### 2. TrendChart (`app/dashboard/components/TrendChart.tsx`)

```tsx
// Time-series line chart
- Multiple data series
- Responsive design
- Hover tooltips
- Legend
- Grid lines
```

#### 3. DriverChart (`app/dashboard/components/DriverChart.tsx`)

```tsx
// Bar chart for ministry data
- Top 10 ministries
- Horizontal bars
- Color coding
- Value labels
```

### Chat Components

#### 1. ChatInterface (`app/chat/components/ChatInterface.tsx`)

```tsx
// Main chat container
- Message list
- Input form
- Auto-scroll
- Loading states
- Error handling
```

#### 2. ChatMessage (`app/chat/components/ChatMessage.tsx`)

```tsx
// Individual message display
- User/AI differentiation
- Markdown rendering
- Source citations
- Timestamp
- Avatar
```

---

## 🎨 Design System

### Color Palette

#### Light Mode

```css
Background: white (#ffffff)
Text: gray-900 (#111827)
Accent: gray-900 (#111827)
Secondary: gray-600 (#4b5563)
Border: gray-200 (#e5e7eb)
```

#### Dark Mode

```css
Background: black (#000000)
Text: white (#ffffff)
Accent: white (#ffffff)
Secondary: gray-300 (#d1d5db)
Border: gray-700 (#374151)
```

### Typography

```css
Headings: font-bold
- h1: text-5xl (48px)
- h2: text-3xl (30px)
- h3: text-2xl (24px)

Body: font-normal
- Large: text-xl (20px)
- Base: text-base (16px)
- Small: text-sm (14px)
```

### Spacing

```css
Container: max-w-7xl mx-auto px-4
Section Padding: py-16
Component Gap: gap-6, gap-8
```

### Animations

```javascript
// Framer Motion Variants
fadeIn: {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

slideIn: {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring" }
}
```

### Responsive Breakpoints

```css
sm: 640px   // Mobile landscape
md: 768px   // Tablet portrait
lg: 1024px  // Tablet landscape
xl: 1280px  // Desktop
2xl: 1536px // Large desktop
```

---

## 💻 Development

### Build Commands

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Development Workflow

1. **Start Backend**

   ```bash
   cd python
   python app.py
   ```

2. **Start Frontend**

   ```bash
   npm run dev
   ```

3. **Open Browser**
   ```
   http://localhost:3000
   ```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Auto-formatting on save
- **Components**: Functional components with hooks
- **CSS**: Tailwind utility classes

### Performance Optimization

✅ **Implemented:**

- Link prefetching on all navigation
- Image optimization with Next.js Image
- Code splitting by route
- Lazy loading for heavy components
- Debounced search inputs
- Memoized expensive computations
- React Query for data caching

---

## 📊 Performance Metrics

| Metric                   | Value | Target |
| ------------------------ | ----- | ------ |
| First Contentful Paint   | <1.5s | ✅     |
| Largest Contentful Paint | <2.5s | ✅     |
| Time to Interactive      | <3.5s | ✅     |
| Cumulative Layout Shift  | <0.1  | ✅     |
| Lighthouse Score         | 90+   | ✅     |

---

## 🔧 Troubleshooting

### Common Issues

1. **Cannot connect to backend**

   - Ensure Flask server is running on port 8010
   - Check API_BASE_URL in `lib/api.ts`
   - Verify CORS is enabled in Flask

2. **Charts not rendering**

   - Check if data is loading from API
   - Open browser console for errors
   - Verify Recharts is installed

3. **Dark mode not working**

   - Clear browser local storage
   - Check ThemeContext provider
   - Verify theme toggle button

4. **Build errors**
   ```bash
   # Clear cache and reinstall
   rm -rf .next node_modules
   npm install
   npm run build
   ```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Manual Build

```bash
# Build production
npm run build

# Start server
npm start
```

### Environment Variables (Production)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

---

## 📈 Future Enhancements

- [ ] User authentication
- [ ] Personalized dashboards
- [ ] Data export (CSV, Excel)
- [ ] Advanced filtering
- [ ] Real-time WebSocket updates
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] Multi-language support

---

## 👥 Team

**Null Coders**  
Track India Hackathon Project • 2025

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Contact: team@nullcoders.dev

---

**Built with ❤️ for India's Development Tracking**
