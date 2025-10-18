# Podcasts App - INDITEX Technical Test

> **Single Page Application** To explore and play the 100 most popular music podcasts according to Apple iTunes.

---

## Table of Contents

- [Project Description](#-project-description)
- [Technologies and Stack](#-technologies-and-stack)
- [Installation and Configuration](#-installation-and-configuration)
- [Architecture](#-architecture)
- [Available Commands](#-available-commands)
- [Project Structure](#-project-structure)

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
- **pnpm**: ≥ 8.x (required package manager)

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

---
