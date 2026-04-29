# Stockfolio Buddy

Stockfolio Buddy is a Vite, React, and TypeScript web app for the Jadwa Share Market investor experience. It lets users authenticate, browse investment funds, companies, and projects, view portfolio information, request share trades, complete account verification, review activity, and start online payments.

The app is built as a client-side single page application with protected routes, Redux Toolkit Query data fetching, cookie-based authentication, Arabic/English localization, and PWA support.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [Routing](#routing)
- [API Layer](#api-layer)
- [Authentication and Sessions](#authentication-and-sessions)
- [State Management](#state-management)
- [Internationalization](#internationalization)
- [Styling and UI](#styling-and-ui)
- [PWA Support](#pwa-support)
- [Assets](#assets)
- [Development Notes](#development-notes)
- [Build and Deployment](#build-and-deployment)
- [Troubleshooting](#troubleshooting)

## Features

- Login and registration with phone number, PIN code, password, country selection, and terms approval.
- Protected investor dashboard that redirects unauthenticated users to `/auth`.
- Dashboard tabs for investment funds, investment projects, and companies.
- Search, refresh, and project filtering by category and tags.
- Portfolio overview and latest transaction summary.
- Fund, company, and project detail pages.
- Buy/sell modal flow for investment entities.
- Investor activity pages for shares, share transactions, fund transactions, and trade requests.
- Account verification flow with ID/passport images and live photo capture.
- Profile and settings pages.
- Online payment-link creation through the Jadwa payment API.
- Session expiration handling with an app-wide modal.
- English and Arabic UI with automatic `ltr`/`rtl` document direction.
- Installable PWA behavior through `vite-plugin-pwa`.

## Tech Stack

- **React 18** for UI.
- **TypeScript** for typed application code.
- **Vite** for local development and production builds.
- **React Router** for page routing.
- **Redux Toolkit and RTK Query** for API state, caching, and data mutations.
- **TanStack Query** is configured at the app root for components that need it.
- **react-i18next and i18next-browser-languagedetector** for translations and language detection.
- **Tailwind CSS** for styling.
- **shadcn/ui and Radix UI** for reusable UI primitives.
- **Lucide React** for icons.
- **Framer Motion** for animation.
- **Recharts** for charts.
- **react-pdf** for PDF/document viewing.
- **vite-plugin-pwa** for service worker and manifest generation.

## Getting Started

### Prerequisites

Install Node.js and npm before running the project. This repository includes a `package-lock.json`, so npm is the safest package manager to use.

### Installation

```sh
npm install
```

### API Base URL

The backend base URL and endpoint constants are defined in:

```text
src/api/GlobalData.ts
```

The current `base_url` points to a local network address:

```ts
export const base_url = "http://192.168.1.5:80";
```

Before running the app against another backend, update this value or replace it with an environment-based setup. The file also contains commented alternatives for localhost and production.

### Start Development Server

```sh
npm run dev
```

Vite is configured to run on port `8080`:

```text
http://localhost:8080
```

## Available Scripts

```sh
npm run dev
```

Starts the Vite development server.

```sh
npm run build
```

Creates a production build in `dist`.

```sh
npm run build:dev
```

Creates a development-mode build.

```sh
npm run lint
```

Runs ESLint across the project.

```sh
npm run preview
```

Serves the built `dist` output locally for previewing production assets.

## Project Structure

```text
src/
  api/
    GlobalData.ts          Backend URLs, endpoint constants, company ID, payment URLs
    privateData.ts         Placeholder private integration values
  assets/
    icons/                 Custom JSX icons
    images/                App logos and image assets
  components/
    Dashboard/             Dashboard list and overview components
    ui/                    shadcn/Radix reusable UI primitives
    *.tsx                  Feature components, modals, cards, inputs, layout
  data/
    countries.json         Country data used by form controls
  hooks/
    useAuth.ts             Auth form behavior
    useDashboard.ts        Dashboard tabs, filters, data loading, modal state
    useProfile.tsx         Profile and verification behavior
    use*.ts                Feature-specific hooks
  interfaces/
    *.ts                   TypeScript interfaces for API/domain models
  lib/
    countryCityUtils.ts    Country/city helper functions
    countries_cities.json  Country/city data
    utils.ts               Shared utility helpers
  locales/
    en/common.json         English translations
    ar/common.json         Arabic translations
  pages/
    Activity/              Investor activity subpages
    *.tsx                  Route-level pages
  routes/
    ProtectedRoute.tsx     Auth guard for private routes
  store/
    api/                   RTK Query API slices
    index.ts               Redux store configuration
    sessionSlice.ts        Session-expiration state
```

Other important root files:

- `vite.config.ts` configures Vite, the `@` alias, the dev server, Lovable tagging in development, and PWA settings.
- `tailwind.config.ts` configures Tailwind theme and content scanning.
- `components.json` stores shadcn/ui configuration.
- `eslint.config.js` configures linting.
- `public/` contains static browser assets, icons, manifest files, and robots.txt.
- `dist/` contains generated build output and should not be edited by hand.

## Application Flow

The entry point is:

```text
src/main.tsx
```

It imports global CSS, initializes i18n, registers the PWA service worker, and renders `App`.

`src/App.tsx` wraps the app with:

- Redux `Provider`
- TanStack `QueryClientProvider`
- Tooltip provider
- Toast providers
- React Router
- App install prompt
- Session expiration modal

The default authenticated route renders `Index`, which currently returns the dashboard.

## Routing

Routes are defined in `src/App.tsx`.

Public route:

- `/auth` - login and registration

Protected routes:

- `/` - dashboard
- `/profile` - user profile
- `/investorActivity` - investor activity landing page
- `/Activity/MyShares` - owned shares
- `/Activity/MyShares/:id` - fund transactions for a selected share/fund
- `/Activity/MyTransactions` - user transactions
- `/Activity/MyTradeRequest` - trade requests
- `/Settings` - app/user settings
- `/fund-details/:id` - fund details
- `/company-details/:id` - company details
- `/project-details/:id` - investment project details
- `/payment-complete/:orderId` - payment completion result

Fallback route:

- `*` - not found page

## API Layer

Most API calls use RTK Query.

The shared API instance is:

```text
src/store/api/baseApi.ts
```

It uses `baseQueryWithAuth` from:

```text
src/store/api/baseQuery.ts
```

That base query:

- Reads `authToken` from cookies.
- Adds it as a Bearer token in the `Authorization` header.
- Detects 401/session-expired responses.
- Removes the cookie when the session is invalid.
- Dispatches `sessionExpired()` so the UI can show the session modal.

Feature API slices are located in `src/store/api/`, including:

- `authApi.ts` - login, logout, registration, PIN verification, role resolution.
- `investmentEntityApi.ts` - funds and companies.
- `investmentProjectsApi.ts` - projects, project filters, project interest toggling.
- `investorApi.ts` - investor profile, portfolio, updates.
- `stocksApi.ts` - stock-related API calls.
- `companyInfoApi.ts` - platform/company information.
- `applicantApi.ts` - verification/applicant data.
- `paymentApi.ts` - online payment-link requests.
- `utils/notificationApi.ts` - notifications.
- `shares/*` - share holders, share transactions, and share trade requests.

The payment API is separate from `baseApi` because it uses a different base URL:

```text
https://live-api.noonmar.com/v1
```

## Authentication and Sessions

Authentication is cookie based. The protected-route check is implemented in:

```text
src/routes/ProtectedRoute.tsx
```

The route guard checks for an `authToken` cookie. If it does not exist, the user is redirected to `/auth`.

Session expiration state is stored in:

```text
src/store/sessionSlice.ts
```

When the backend returns an expired or invalid token response, the app clears the token and opens the session-expiration modal.

## State Management

Redux store setup lives in:

```text
src/store/index.ts
```

The store includes:

- `baseApi.reducer` for most backend endpoints.
- `onlinePaymentApi.reducer` for payment requests.
- `session` reducer for session expiration.

RTK Query middleware is registered for both API slices.

Local UI state is usually kept inside custom hooks, especially:

- `useAuth` for authentication form state.
- `useDashboard` for dashboard tab, search, filters, modal, and fetched data state.
- `useProfile` for user profile and account verification state.
- `useFundDetails`, `useInvestorActivity`, `useSettings`, and related hooks for page-specific logic.

## Internationalization

i18n setup is in:

```text
src/i18n.ts
```

Translation files are:

```text
src/locales/en/common.json
src/locales/ar/common.json
```

The app detects language from local storage, cookies, browser settings, the HTML tag, path, or subdomain. The fallback language is English.

`App.tsx` updates the document language and direction:

- English uses `ltr`.
- Arabic uses `rtl`.

When adding user-facing text, prefer translation keys instead of hard-coded strings. Add matching keys to both English and Arabic files.

## Styling and UI

The app uses Tailwind CSS with shadcn/ui components. Shared UI primitives are in:

```text
src/components/ui/
```

General guidance:

- Reuse existing UI components before creating new ones.
- Keep route-level layout inside `src/pages`.
- Keep reusable feature UI inside `src/components`.
- Keep data-fetching and page behavior in hooks when it grows beyond simple component state.
- Use `cn` from `src/lib/utils.ts` for conditional class names.
- Use Lucide icons for common interface icons.

Global styles are in:

```text
src/index.css
src/App.css
src/pages/styles/profile.css
```

## PWA Support

PWA configuration is in `vite.config.ts` through `vite-plugin-pwa`.

The app:

- Registers the service worker immediately in `src/main.tsx`.
- Uses `autoUpdate` registration.
- Includes icons from `public/`.
- Sets manifest metadata for "Jadwa Share Market".
- Enables PWA behavior during development.

Static PWA assets live in:

```text
public/
```

Generated service worker files appear in `dist/` after builds.

## Assets

Source images and custom icons live in:

```text
src/assets/
```

Static browser assets live in:

```text
public/
```

Use `src/assets` for assets imported by React components. Use `public` for files that must be available by direct URL, such as PWA icons, favicon files, manifest files, and `robots.txt`.

## Development Notes

- The import alias `@` points to `src`.
- Dashboard state such as active tab, search text, selected project filters, and filter visibility is saved in `sessionStorage`.
- `authToken` is stored in browser cookies through `js-cookie`.
- Some current text in the code is hard-coded inside components; new work should prefer translation keys.
- `src/api/privateData.ts` currently contains empty placeholder values. Do not commit real private credentials into the repository.
- Build output in `dist/`, generated service workers, and dependencies in `node_modules/` should not be edited manually.

## Build and Deployment

Create a production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

Before deploying, check:

- `base_url` points to the intended backend.
- Payment API settings are correct.
- PWA icons and manifest metadata are up to date.
- English and Arabic translation files contain any new keys.
- `npm run lint` passes.
- `npm run build` completes successfully.

## Troubleshooting

### The app redirects to `/auth`

The protected routes require an `authToken` cookie. Log in again or check whether the backend returned a session-expired response.

### API calls fail immediately

Check `src/api/GlobalData.ts` and confirm `base_url` is reachable from your browser. If you are using a local network IP, your machine and backend server must be on the same network.

### Payment requests fail

Payment requests use `jadwaBaseUrl` and `jadwaPaymentEP` from `src/api/GlobalData.ts`, not the main `base_url`. Confirm the payment token, accepted currency, and request body expected by the payment provider.

### Text appears in the wrong direction

Check the active language. `App.tsx` sets `document.documentElement.dir` to `rtl` only when the language is `ar`.

### A new translation key shows as plain text or is missing

Add the key to both:

```text
src/locales/en/common.json
src/locales/ar/common.json
```

Then restart the dev server if the change is not picked up automatically.

### PWA changes do not appear

Browsers can cache service workers aggressively. Rebuild the app, clear site data, unregister the old service worker in DevTools, and reload.

### TypeScript import paths fail

Use the `@` alias for imports from `src`, for example:

```ts
import { Button } from "@/components/ui/button";
```

The alias is configured in `vite.config.ts`.
