# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler# React + Tailwind Starter

A production-grade multi-page React starter with Tailwind v4, React Router, and SVG components via `vite-plugin-svgr`.

> **This is a template repository.** Click "Use this template" to start a new project from this setup.

---

## Tech Stack

- **React 19** — UI library
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling via Vite plugin
- **React Router v7** — client-side routing
- **vite-plugin-svgr** — import SVGs directly as React components

---

## Project Structure

```
my-app/
├── public/
│
├── src/
│   ├── assets/
│   │   └── svg/                      # SVG source files → imported as React components
│   │
│   ├── components/                   # Reusable UI primitives
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── index.js              # Barrel export
│   │
│   ├── sections/                     # Page section components
│   │   ├── shared/                   # Used across multiple pages
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── index.js
│   │   │   └── Footer/
│   │   │       ├── Footer.jsx
│   │   │       └── index.js
│   │   ├── home/                     # Page-specific sections
│   │   │   ├── HeroSection.jsx
│   │   │   └── FeaturesSection.jsx
│   │   └── about/
│   │       └── TeamSection.jsx
│   │
│   ├── pages/                        # Route-level page components
│   │   ├── HomePage.jsx
│   │   └── AboutPage.jsx
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx            # Header + <Outlet /> + Footer
│   │
│   ├── hooks/                        # Custom React hooks
│   ├── context/                      # React context providers
│   ├── lib/
│   │   └── utils.js                  # Shared utilities
│   │
│   ├── styles/
│   │   └── globals.css               # Tailwind entry point
│   │
│   ├── router.jsx                    # React Router config
│   └── main.jsx                      # App entry point
│
├── vite.config.js
└── package.json
```

---

## Component Architecture

The project uses a strict 3-tier component model:

| Tier | Folder | Purpose |
|---|---|---|
| **UI Primitives** | `components/ui/` | Buttons, inputs, cards — no business logic |
| **Sections** | `sections/[page]/` | Page-specific content blocks, assembled from primitives |
| **Shared Sections** | `sections/shared/` | Header, Footer — used across all pages |
| **Pages** | `pages/` | Thin orchestrators — import sections, define page shape |

**Rules:**
- Pages import sections. Sections import UI components. UI components import nothing above them.
- Never import a section into another section.
- UI components have zero layout knowledge — no page-level margins or positioning.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Tailwind v4 Setup

Tailwind v4 uses a Vite plugin — there is no `tailwind.config.js`.

**`vite.config.js`**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
})
```

**`src/styles/globals.css`**
```css
@import "tailwindcss";
```

Theme customization is done in CSS instead of a config file:

```css
@import "tailwindcss";

@theme {
  --color-brand: #0f172a;
  --font-display: "Playfair Display", serif;
}
```

---

## SVG Icons

SVGs in `src/assets/svg/` are imported directly as React components via `vite-plugin-svgr`. No build scripts, no font generation, no config.

### Adding a new icon

```
1. Drop your .svg file into src/assets/svg/
2. Import and use it immediately — no extra steps
```

### Usage

```jsx
import ArrowRight from '../assets/svg/arrow-right.svg?react'
import Star from '../assets/svg/star.svg?react'

<ArrowRight className="w-5 h-5 text-blue-500" />
<Star className="w-4 h-4 text-yellow-400" />
```

Style with any Tailwind utility class directly on the component. SVGs inherit `currentColor` for fill/stroke, so `text-*` color classes work as expected.

---

## Routing

Routes are defined in `src/router.jsx`. All standard pages nest inside `MainLayout`, which renders the shared Header and Footer automatically.

```jsx
// src/router.jsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,   element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
])
```

### Adding a new page

1. Create `src/pages/MyPage.jsx`
2. Create `src/sections/my-page/` with section components
3. Add a route entry in `src/router.jsx`

---

## Using This Template

1. Click **"Use this template"** → **"Create a new repository"**
2. Name your new repo and create it
3. Clone it locally:

```bash
git clone https://github.com/YOUR_USERNAME/your-new-project.git
cd your-new-project
npm install
npm run dev
```

Each project created from this template is fully independent — changes to one never affect others.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
