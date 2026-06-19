# Premium Flight Search & Booking Application

A high-performance, visually polished, fully responsive, and accessible Flight Search, Filtering, and Booking application built with Next.js (App Router), TypeScript, and TailwindCSS. It utilizes Zustand for robust, centralized state management that survives browser reloads across the multi-step search-and-checkout pipeline.

---

## 🚀 Key Engineering & Architecture Highlights

### 1. Robust TypeScript Architecture

- **Strict, Native Types:** Every object and data structure is rigorously typed. See `src/types/flight.ts` for comprehensive airline, aircraft, route, stop details, pricing, and baggage configurations.
- **Form Schema Type Inference:** Passenger data models (`src/types/booking.ts`) are completely backed by `yup` validation schemas, with types inferred natively via `yup.InferType` to ensure zero runtime or build-time discrepancies.
- **Type-Checking Sanitation:** Verified fully compliant with TypeScript strict mode via non-emitting type checking (`tsc --noEmit`).

### 2. Centralized State Management (`src/store/flightStore.tsx`)

- Powered by **Zustand** featuring unified states for:
  - `searchCriteria`: Real-time inputs from departure, destination, dates, passengers, and cabin classes.
  - `filters`: Multi-faceted configurations including maximum price slider, stop counts, airline/aircraft selections, departure hour brackets, refundability, punctuality rating thresholds, and inclusion of meals or seat selection.
  - `selectedFlight`: The chosen flight being carried seamlessly into checkout.
  - `bookingDetails`: Securely stored form details for multi-passenger bookings.
- **Session Persistence:** Integrated with Zustand's `persist` middleware configured with `sessionStorage` to allow users to refresh pages mid-flow without losing selected flights or pre-filled passenger details.
- **Backwards-Compatible Integration:** Custom React hooks (`useFlight`) bridge store state and dynamically pre-compute filter/sorting combinations on the fly to maximize rendering performance.

### 3. Comprehensive Form Validation & Safety

- Form orchestration built on top of **React Hook Form** and **Yup validation resolvers**.
- **Dynamic Field Arrays:** Dynamic fields scale effortlessly depending on the exact passenger count searched (supporting up to 12 passengers), offering clean inline field validation warnings for genders, names, and optional identifiers.

### 4. Fully Responsive & Polished Visual Layouts

- Designed mobile-first using advanced Tailwind layout matrices (`grid`, dynamic column splits, sticky parameters, and interactive backdrops).
- Layout sections expand and collapse dynamically to handle all viewports (from standard mobile devices up to ultra-wide displays) cleanly without any layout breakages.

### 5. Accessibility (A11y) & Semantic Layout Standards

- Employs semantic elements throughout (`main`, `form`, `h1`-`h4`, `label`, `button`, `input`).
- Supports form control inputs with explicit type declarations, placeholder indicators, screen-reader visibility, and native platform components (such as programmatic invocation of `showPicker()` for calendar dates).

### 6. Interactive Confirmation Pipeline

- Generates unique record locator PNRs dynamically.
- Automatically handles e-ticket notifications via backend API integrations.
- Supports platform-native actions like **Print Pass** layout overrides (`print:hidden` visibility controls) and **Web Share APIs** for seamless travel coordination.

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** Next.js 16 (App Router) with Turbopack compiling
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4 & PostCSS
- **State Management:** Zustand 5
- **Forms & Validation:** React Hook Form 7, @hookform/resolvers 5, Yup 1
- **Icons:** Lucide React

---

## 📂 Codebase Directory Breakdown

```text
src/
├── app/
│   ├── api/
│   │   └── send-confirmation/   # Serverless route for e-ticket booking confirmations
│   ├── booking/                 # Step 2: Passenger details and checkout matrix
│   ├── confirmation/            # Step 3: Verified PNR ticket print pass screen
│   ├── flights/                 # Step 1: Search modification, sort bar & multi-filter listings
│   ├── globals.css              # Main stylesheet configuring fonts and visual variables
│   ├── layout.tsx               # Root HTML boilerplate layout wrapper
│   └── page.tsx                 # Application landing page hosting full-screen Hero search panel
├── components/
│   ├── Booking/
│   │   ├── FlightBooking.tsx
│   │   ├── FlightBookingContent.tsx
│   │   └── FlightBookingForm.tsx    # Dynamic validation form matching passenger numbers
│   ├── Confirmation/
│   │   └── FlightConfirmation.tsx
│   ├── Flights/
│   │   ├── FlightCard.tsx           # Comprehensive card component with inline accordion details
│   │   ├── FlightEmptyState.tsx
│   │   ├── FlightFiltersSidebar.tsx # Collapsible facets (price slider, stops, airline matrices)
│   │   ├── FlightSortBar.tsx        # Dynamic sorter (cheapest, fastest, earliest departure, etc.)
│   │   ├── Flights.tsx
│   │   ├── FlightsContent.tsx
│   │   └── LoadingSkeleton.tsx
│   └── Search/
│       └── FlightSearch.tsx         # Omni-present travel input box with native date pickers
├── data/
│   └── flights.json                 # Mock live-flight database schema definitions
├── lib/
│   ├── constants.ts
│   └── utils.ts
├── store/
│   └── flightStore.tsx              # Centralized Zustand reactive store with session persistence
└── types/
    ├── booking.ts                   # Core passenger & multi-seat checkout TypeScript models
    └── flight.ts                    # Core full-flight and destination airport interface definitions
```

---

## ⚡ Setup, Installation & Verification

Follow these steps to run and verify the codebase locally:

### 1. Install Dependencies

Ensure you have Node.js installed, then execute:

```bash
pnpm install
# or
npm install
```

### 2. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

### 3. Verify Code Quality & Type Safety

To execute static analysis and type safety audits independently:

```bash
# Verify type correctness across all source files
pnpm exec tsc --noEmit

# Execute lint check validation
pnpm run lint
```

All components are fully validated to be free of any type warnings or linting compliance flags.

