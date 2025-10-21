# Podcasts App - INDITEX Technical Test

> **Single Page Application** To explore and play the 100 most popular music podcasts according to Apple iTunes.

---

## Table of Contents

- [Project Description](#-project-description)
- [Technologies and Stack](#-technologies-and-stack)
- [Installation and Configuration](#-installation-and-configuration)
- [Architecture](#-architecture)
- [Navigation & User Flow](#-navigation--user-flow)
- [Available Commands](#-available-commands)
- [Performance Optimizations](#-performance-optimizations)
- [Testing](#-testing)
- [Deployment](#-deployment)

---

## 🎯 Project Description

### Application Views

| View | Route | Description |
|---|---|---|
| **Main** | `/` | List of 100 podcasts with a search filter |
| **Podcast Detail** | `/podcast/:podcastId` | Sidebar with info + list of episodes |
| **Episode Detail** | `/podcast/:podcastId/episode/:episodeId` | Sidebar + player + HTML description |

---

## 🛠️ Technologies and Stack

### Core

- **[React 19.1.1](https://react.dev/)**: UI library with the latest features
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)**: Static typing
- **[Vite 7.1.7](https://vitejs.dev/)**: Ultra-fast build tool with HMR

### Routing & State

- **[React Router DOM 7.9.4](https://reactrouter.com/)**: Declarative routing with clean URLs
- **React Context API**: Global state without external dependencies

### Code Quality

- **[ESLint 9.36](https://eslint.org/)**: Linting with strict configuration
- **[Prettier 3.6.2](https://prettier.io/)**: Automatic code formatting
- **[Husky 9.1.7](https://typicode.github.io/husky/)**: Git hooks for CI/CD
- **[lint-staged 16.2.4](https://github.com/lint-staged/lint-staged)**: Linting on staged files
- **[Commitlint](https://commitlint.js.org/)**: Conventional commits enforcement

### Testing

- **[Vitest 3.2.4](https://vitest.dev/)**: Vite-compatible test runner
- **[Testing Library](https://testing-library.com/)**: User-centric testing
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)**: Additional matchers

### Utilities

- **[DOMPurify 3.2.7](https://github.com/cure53/DOMPurify)**: HTML sanitization for descriptions

---

## 📦 Installation and Configuration

### Prerequisites

- **Node.js**: ≥ 18.x
- **pnpm**: ≥ 10.x (required package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/keinerapo/podcast-app.git
cd podcasts-app

# Install dependencies
pnpm install

# Configure git hooks
pnpm prepare
```

---

## 🏗️ Architecture

### Feature-Sliced Design

The project follows **Feature-Sliced Design** principles for scalability and maintainability:

```
src/
├── app/              # Application layer: providers, routing
├── features/         # Feature modules (independent)
│   ├── podcasts/           # Main list view
│   ├── podcast-detail/     # Podcast detail view
│   └── episode-player/     # Episode player view
├── shared/           # Shared toolkit
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and cache services
│   ├── types/              # TypeScript types
│   ├── utils/              # Helper functions
│   └── constants/          # App constants
└── styles/           # Global CSS (from scratch)
```

**Key Principles:**
- **Layer separation**: Each layer has a single responsibility
- **Feature independence**: Features don't import from each other
- **Unidirectional dependencies**: Features → Shared → External libraries

### Technical Decisions

#### CORS Proxy Strategy

The iTunes API doesn't provide CORS headers, making direct browser calls impossible. The application uses **AllOrigins** as a proxy service:

```typescript
// Proxy wraps iTunes API requests
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(itunesUrl)}`;
```

**Benefits**:
- ✅ Enables client-side API consumption without backend
- ✅ Maintains SPA architecture (no server required)
- ✅ Custom error handling with `ProxyError` class

**Trade-offs**:
- ⚠️ External service dependency (AllOrigins uptime)
- ⚠️ Additional network hop increases latency
- ⚠️ Rate limiting controlled by third-party

#### CSS Architecture

Custom CSS implementation without frameworks (Tailwind, Bootstrap, MUI):

```
styles/
├── variables.css    # Design tokens (colors, spacing, typography)
├── reset.css        # Browser normalization
└── base.css         # Global styles

features/
└── */**.module.css  # Component-scoped styles
```

**Benefits**:
- ✅ Full control over styling and bundle size
- ✅ CSS Modules prevent style collisions
- ✅ Design tokens ensure consistency
- ✅ No framework-specific learning curve

**Trade-offs**:
- ⚠️ More manual CSS writing vs utility classes
- ⚠️ Longer initial setup vs framework defaults

#### Global Loading State

Centralized loading management using React Context instead of external state libraries:

```typescript
// LoadingProvider wraps entire app
<LoadingProvider>
  <LoadingIndicator />  {/* Single global indicator */}
  <AppRouter />
</LoadingProvider>
```

**Benefits**:
- ✅ No external dependencies (Redux, Zustand, etc.)
- ✅ Simple API: `useLoading()` hook
- ✅ Unified UX: single loading indicator in header
- ✅ Automatic cleanup on component unmount

**Trade-offs**:
- ⚠️ Less granular control vs local loading states
- ⚠️ Not suitable for complex multi-loading scenarios

### Cache Strategy

The application implements a **Cache-Aside pattern** with LocalStorage to optimize performance and reduce API calls.

#### Implementation Details

- **TTL (Time To Live)**: 24 hours
- **Storage**: Browser LocalStorage
- **Pattern**: Cache-Aside (Lazy Loading)
- **Scope**: API responses (top podcasts, podcast details)

#### How It Works

```typescript
// 1. Check cache first
const cached = cacheService.get('podcasts:top');
if (cached) return cached;

// 2. Fetch from API if cache miss
const data = await fetchFromAPI();

// 3. Store in cache with timestamp
cacheService.set('podcasts:top', data);

// 4. Return data
return data;
```

#### Benefits

✅ **Reduced API Calls**: Subsequent requests served from cache  
✅ **Faster Load Times**: LocalStorage access is instantaneous  
✅ **Offline Support**: Cached data available without network  
✅ **Bandwidth Savings**: Reduces data consumption for users  

#### Trade-offs

⚠️ **Stale Data Risk**: Data may be outdated within the 24h window  
⚠️ **Storage Limits**: LocalStorage has ~5-10MB limit per domain  
⚠️ **No Server Sync**: Cache is local; not shared across devices  

#### Configuration

TTL and cache keys are centralized in `shared/constants/api.constants.ts`:

```typescript
export const CACHE_CONFIG = {
  TTL: 24 * 60 * 60 * 1000, // 24 hours
  KEYS: {
    TOP_PODCASTS: 'podcasts:top',
    PODCAST_DETAIL: (id: string) => `podcasts:detail:${id}`,
  },
};
```

---

## 🧭 Navigation & User Flow

### Routing Structure

```
/ (Main)  →  /podcast/:id (Detail)  →  /podcast/:id/episode/:id (Player)
```

### Key Architectural Decisions

#### 1. Component Reusability

`PodcastSidebar` is shared between **Podcast Detail** and **Episode Player** pages:
- ✅ Maintains visual consistency
- ✅ Reduces code duplication
- ✅ Keeps podcast context during episode playback

```typescript
// Cross-feature import (exception to FSD isolation)
import { PodcastSidebar } from '@features/podcast-detail/components/PodcastSidebar';
```

#### 2. Data Fetching Optimization

Both **Podcast Detail** and **Episode Player** use the same hook:

```typescript
// Single API call, shared data
const { podcastDetail } = usePodcastDetail(podcastId);

// Episode Player filters from existing data
const episode = podcastDetail.episodes.find(ep => ep.id === episodeId);
```

**Benefits**:
- No additional API call for episode details
- Leverages 24h cache
- Consistent data structure

#### 3. Layout Consistency

All pages use the same CSS Grid pattern with responsive breakpoints:
- Desktop (>1024px): `300px sidebar + 1fr main`
- Tablet (768-1024px): `250px sidebar + 1fr main`
- Mobile (<768px): Stacked vertically (1fr)

#### 4. Security & Internationalization

- **DOMPurify**: Sanitizes HTML descriptions to prevent XSS attacks
- **Intl API**: Native formatting for dates and durations (no external libraries)

---

## 🚀 Available Commands

### Development

```bash
# Development mode
pnpm dev

# Opens at http://localhost:5173
```

### Production

```bash
# Production build
pnpm build

# Preview of production build
pnpm preview
```

### Code Quality

```bash
# Run linter
pnpm lint

# Auto-fix linting issues
pnpm lint --fix

# Format code with Prettier
pnpm format
```

### Testing

```bash
# Run tests on watch mode
pnpm test

# Run tests once
pnpm test:run

# Coverage report
pnpm test:coverage
```

### Performance

```bash
# Build with bundle analysis
pnpm build:analyze
```

---

## ⚡ Performance Optimizations

### Code Splitting & Lazy Loading

All pages load on-demand using `React.lazy()` + `Suspense`:

```typescript
const MainPage = lazy(() => import('@features/podcasts/pages'));
```

**Impact**: Initial bundle reduced ~5-10%, pages load only when visited.

### Bundle Strategy

- **react-vendor.js** (71 KB gzipped): React + React DOM
- **router-vendor.js**: React Router separate chunk  
- **Page chunks**: 1-4 KB each (lazy loaded)
- **CSS splitting**: Per-component CSS (1-5 KB each)

### Build Optimizations

- **Target**: `esnext` (modern browsers)
- **Minifier**: ESBuild (faster than Terser)
- **Cache busting**: Hashed filenames for immutable caching
- **Tree shaking**: Automatic dead code elimination

**Analysis**: Run `pnpm build:analyze` to visualize bundle composition in `dist/stats.html`

---

## 🧪 Testing

### Test Coverage

- **154 tests** across 14 test suites
- **Unit tests**: Hooks, components, pages
- **Integration tests**: User flows and interactions
- **Coverage**: 100% pass rate

### Testing Strategy

```typescript
// Custom hooks (useDebounce, useLocalStorage, usePodcasts, usePodcastDetail)
describe('usePodcasts', () => {
  it('should fetch and cache podcasts', async () => {
    // Test caching, loading states, error handling
  });
});

// Components with user interactions
describe('SearchFilter', () => {
  it('should debounce search input', async () => {
    // Test real user behavior with waitFor
  });
});

// Pages with routing context
describe('MainPage', () => {
  it('should render podcast list and filter', () => {
    // Test using custom renderWithRouter utility
  });
});
```

### Testing Tools

- **Vitest**: Fast test runner with hot reload
- **Testing Library**: User-centric testing (no implementation details)
- **Custom utilities**: `renderWithRouter` for routing tests
- **Centralized fixtures**: Reusable mock data in `test/fixtures`

---

## 🚀 Deployment

### Build for Production

```bash
# 1. Build the application
pnpm build

# Output: dist/ folder with optimized assets
```

### Static Hosting Options

The app is a **pure SPA** (no backend required). Deploy to any static host:

#### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Create netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### GitHub Pages

**Automatic Deployment (Recommended)**

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Enable GitHub Pages**:
   - Go to your repository → Settings → Pages
   - Source: GitHub Actions

2. **Push to main branch**:
   ```bash
   git push origin main
   ```

3. **Access your app**:
   - URL: `https://keinerapo.github.io/podcast-app/`
   - GitHub Actions will automatically build and deploy

**Manual Deployment**

If you fork this repo and want to deploy to your own GitHub Pages:

```bash
# 1. Update vite.config.ts base path
# Change: base: mode === 'production' ? '/podcast-app/' : '/',
# To:     base: mode === 'production' ? '/your-repo-name/' : '/',

# 2. Update .github/workflows/deploy.yml if needed

# 3. Enable GitHub Pages in your repo settings

# 4. Push to main
git push origin main
```

### Environment Variables

No environment variables required. API endpoints are hardcoded:
- iTunes API: `https://itunes.apple.com`
- CORS Proxy: `https://api.allorigins.win`

### Browser Compatibility

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **ES2020+ support** required
- **No IE11 support** (uses native Intl API)

---
