# AGENT INSTRUCTIONS: Greater Bogor Cafe Explorer

Welcome, Agent. You are working on the **Greater Bogor Cafe Explorer** repository. This is a production-ready spatial web application built with a specific architecture. **You must read and adhere to this document completely before making any changes.**

---

## 1. System Architecture
*   **Framework**: Nuxt 3 (Vue 3, Composition API with `<script setup>`)
*   **Language**: TypeScript (strict mode, no `any` types).
*   **Styling**: Tailwind CSS + `@tailwindcss/forms`.
*   **Map Engine**: `maplibre-gl` (Vanilla GL JS wrapped in Vue).
*   **State**: Pinia (`@pinia/nuxt`).
*   **Backend/Auth/DB**: Supabase (PostgreSQL, Auth, Storage).
*   **Icons**: `nuxt-icon` using `lucide` icon sets.
*   **Utils**: `@vueuse/core` for reactivity helpers.

---

## 2. Database Schema & RLS
The database uses PostgreSQL via Supabase.
*   `profiles`: Extends `auth.users`. Contains `role` ('admin', 'user', 'guest'), `full_name`, and `avatar_url`.
*   `cafes`: Stores location (`lat`, `lng`), `rating_avg`, and `rating_count`.
*   `reviews`: Links user to cafe. Contains 1-5 rating and comment. A DB trigger auto-updates the `cafes` rating averages on insert/update/delete.
*   `cafe_images`: Stores storage paths for uploaded photos.

### Row Level Security (RLS) Rules:
*   **Public (Guests)**: Can `SELECT` cafes, reviews, profiles, and images.
*   **Users (Authenticated)**: Can `INSERT` reviews and images. Can `UPDATE`/`DELETE` only their own reviews/images.
*   **Admins**: Can `INSERT`/`UPDATE`/`DELETE` cafes, and modify ANY user's review/image.

---

## 3. Core Invariants (DO NOT VIOLATE)

### A. Single-Entity Marker State Machine
**CRITICAL:** Never render two separate markers at identical GPS coordinates. Every cafe on the map is represented by a SINGLE HTML marker instance (`CafeMarker.vue`) that dynamically upgrades its state.
1.  **State 1 (Baseline / Unreviewed Cafe)**: `rating_count === 0`. Small ($24\text{px}$), muted slate disc (`bg-slate-500`) with a coffee icon. `z-index: 10`.
2.  **State 2 (Community Reviewed Cafe)**: `rating_count > 0`. The baseline pin becomes a dynamic circular avatar ring.
    *   **Size**: `Math.min(65, 35 + ((Rating / 5.0) * 15) + (RatingCount / 10))`
    *   **Border**: $\ge 4.5$ = Gold, $4.0 - 4.4$ = Orange, $< 4.0$ = Slate.
    *   **Avatar Cycling**: Background cycles through reviewer avatars every 3 seconds based on a global pinia tick (`useMapStore.globalAvatarTick`).

### B. Public Registration is Disabled
Public self-registration (`signUp`) is disabled. All user accounts are created and managed by the Admin. DO NOT build public signup forms. Use the API endpoint (`server/api/admin/create-user.post.ts`) which uses the `service_role` key to bypass RLS.

---

## 4. Map & Spatial Logic
*   **SSR Safety**: `maplibre-gl` relies on the `window` object and **MUST NOT** run on the server. The `MapContainer.vue` is wrapped in `<ClientOnly>` in `pages/index.vue`.
*   **Vue Injection**: MapLibre controls the DOM for markers. To use Vue components as markers, we create isolated Vue micro-apps in `MapContainer.vue` and inject them into MapLibre markers.
*   **Memory Leaks**: You MUST call `app.unmount()` on these dynamically created Vue apps in the `onBeforeUnmount` hook of `MapContainer.vue` to prevent severe memory leaks.

---

## 5. State Management Flow
*   **Pinia**: Used for global shared state: User Auth session (`useAuthStore`), Map Center, Selected Cafe, Cafe List, and the Global Avatar Cycling Tick (`useMapStore`).
*   **Component State (`ref` / `reactive`)**: Used for transient UI state (e.g., is the review modal open? forms inside the modal).

---

## 6. Local Development Workflow
*   **Mock Data Bypass**: For UI/UX development without needing live Supabase credentials, the app is currently wired to `utils/mockData.ts`.
*   `useAuthStore` and `useMapStore` rely on this mock data. The top navigation bar in `index.vue` has buttons to simulate logging in as different roles to test the UI conditionally.

---

## 7. Next Implementation Roadmap
If you are an AI agent picking up this repo next, your tasks are:
*   [ ] Set up actual Supabase environment variables in `.env` and configure `nuxt.config.ts`.
*   [ ] Swap `useMapStore.ts` to fetch `cafes` and `reviews` from Supabase via `@nuxtjs/supabase` composables (`useSupabaseClient`) instead of `mockData.ts`.
*   [ ] Implement actual Supabase Storage buckets for `cafe_images` and wire up the `ReviewModal.vue` file upload UI to push to storage.
*   [ ] Build an Admin Dashboard UI route (`/admin`) to manage cafes and create user accounts using the `server/api/admin/create-user.post.ts` endpoint.
