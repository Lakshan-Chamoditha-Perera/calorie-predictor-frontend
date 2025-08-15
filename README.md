## Calorie Predictor Frontend

A modern, responsive Next.js frontend for estimating calories burned during physical activity. Users enter personal and activity metrics; the app sends them to a backend `predict` endpoint and displays the estimated calories burned.

### Features

- **Responsive UI**: Tailwind CSS 4-based, mobile-first layout and components
- **Form validation**: `react-hook-form` with inline error messaging
- **Async data**: `@tanstack/react-query` mutation flow with loading/success/error states
- **Notifications**: `react-toastify` for user feedback during calculations
- **Icons**: `lucide-react` for a clean, consistent icon set

### Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Data fetching**: Axios + React Query
- **Forms**: React Hook Form
- **Toasts**: React Toastify

### Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- npm (or yarn/pnpm/bun)
- A running backend with a `POST /predict` endpoint

### Quick Start

1. Install dependencies

```bash
npm install
```

2. Configure environment variables (see below)
3. Start the development server

```bash
npm run dev
```

4. Open `http://localhost:3000`

### Environment Variables

Create a `.env.local` at the project root:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

- **NEXT_PUBLIC_BASE_URL**: Base URL of the backend API. Must be publicly prefixed (`NEXT_PUBLIC_`) so the client can access it.

### Available Scripts

- `npm run dev`: Start the dev server with Turbopack
- `npm run build`: Production build
- `npm run start`: Start the production server (after build)
- `npm run lint`: Run Next.js lint

### Project Structure

```text
calorie-predictor-frontend/
  next.config.ts
  package.json
  postcss.config.mjs
  public/
  src/
    app/
      components/
        FormInput.tsx
        FormSelect.tsx
        HealthForm.tsx
      get-query-client.ts
      globals.css
      layout.tsx
      page.tsx
      providers.tsx
  tsconfig.json
```

### How It Works

- UI is rendered from `src/app/page.tsx`, which loads `HealthForm`.
- `HealthForm` uses `react-hook-form` to collect inputs:
  - `age`, `height`, `weight`, `duration`, `heartRate`, `bodyTemp`, `sex`
- On submit, a POST request is made to `${process.env.NEXT_PUBLIC_BASE_URL}/predict`.
- Success response updates the UI with the predicted calories and displays a toast.

#### Request Example

```json
{
  "age": 30,
  "height": 175,
  "weight": 70.5,
  "duration": 45,
  "heartRate": 140,
  "bodyTemp": 37.2,
  "sex": "male"
}
```

#### Expected Response Shape

```json
{
  "data": {
    "prediction": 325.7
  }
}
```

The UI reads `response.data.data.prediction` and displays it as kcal (rounded).

### Styling & UI

- Tailwind CSS 4 is configured via `postcss.config.mjs`.
- Components like `FormInput` and `FormSelect` encapsulate inputs/selects with labels, icons, and validation messages.

### React Query & Providers

- `src/app/providers.tsx` registers `QueryClientProvider` and `ToastContainer`.
- `src/app/get-query-client.ts` creates a client with sensible defaults (e.g., `staleTime`).

### Building & Running Production

```bash
npm run build
npm run start
```

Ensure `NEXT_PUBLIC_BASE_URL` is set in your deployment environment.

### Deployment

- Works out-of-the-box on platforms like Vercel, Netlify (via Next adapter), or any Node host.
- Set `NEXT_PUBLIC_BASE_URL` in the platform’s environment settings.

### Troubleshooting

- **Blank result / toasts show error**: Confirm `NEXT_PUBLIC_BASE_URL` is correct and the backend is reachable.
- **CORS errors**: Configure CORS on the backend to allow the frontend origin during development and production.
- **Validation issues**: Check input ranges (e.g., `heartRate` 30–220, `bodyTemp` 35–42, etc.).

### Contributing

1. Fork and clone the repo
2. Create a feature branch
3. Commit with clear messages
4. Open a PR

### License

No license specified.
