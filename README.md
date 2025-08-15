# Calorie Burn Calculator Frontend

A modern, responsive Next.js frontend for estimating calories burned during physical activity. Users enter personal and activity metrics; the app sends them to a backend `predict` endpoint and displays the estimated calories burned with AI-powered metabolic algorithms.

![Calorie Burn Calculator - Mobile View](/public/image1.png)

## ✨ Features

- **🎯 High Accuracy**: Uses multiple biometric inputs for precise results
- **⚡ Instant Results**: Get your calculation in seconds
- **📱 Personalized**: Tailored to your unique physiology
- **📱 Responsive UI**: Tailwind CSS 4-based, mobile-first layout and components
- **✅ Form Validation**: `react-hook-form` with inline error messaging
- **🔄 Async Data**: `@tanstack/react-query` mutation flow with loading/success/error states
- **🔔 Notifications**: `react-toastify` for user feedback during calculations
- **🎨 Clean Icons**: `lucide-react` for a consistent icon set

![Calorie Burn Calculator - Desktop View](/public/image2.png)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Data Fetching**: Axios + React Query
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- npm (or yarn/pnpm/bun)
- A running backend with a `POST /predict` endpoint

## 🚀 Quick Start

1. **Clone the repository**

```bash
git clone <repository-url>
cd calorie-predictor-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## ⚙️ Environment Variables

Create a `.env.local` file at the project root:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

- **NEXT_PUBLIC_BASE_URL**: Base URL of the backend API. Must be publicly prefixed (`NEXT_PUBLIC_`) so the client can access it.

## 📜 Available Scripts

| Command         | Description                               |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the dev server with Turbopack       |
| `npm run build` | Production build                          |
| `npm run start` | Start the production server (after build) |
| `npm run lint`  | Run Next.js lint                          |

## 📁 Project Structure

```text
calorie-predictor-frontend/
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public/
│   ├── image1.png
│   └── image2.png
├── src/
│   └── app/
│       ├── components/
│       │   ├── FormInput.tsx
│       │   ├── FormSelect.tsx
│       │   └── HealthForm.tsx
│       ├── get-query-client.ts
│       ├── globals.css
│       ├── layout.tsx
│       ├── page.tsx
│       └── providers.tsx
└── tsconfig.json
```

## 🔄 How It Works

The application follows a simple but effective flow:

1. **UI Rendering**: The main interface is rendered from `src/app/page.tsx`, which loads the `HealthForm` component
2. **Data Collection**: `HealthForm` uses `react-hook-form` to collect user inputs:
   - **Activity Metrics**: `duration`, `heartRate`, `bodyTemp`
   - **Personal Details**: `age`, `height`, `weight`, `sex`
3. **API Request**: On form submission, a POST request is made to `${process.env.NEXT_PUBLIC_BASE_URL}/predict`
4. **Results Display**: Success response updates the UI with predicted calories and shows a success toast

### 📤 Request Example

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

### 📥 Expected Response Shape

```json
{
  "data": {
    "prediction": 325.7
  }
}
```

The UI reads `response.data.data.prediction` and displays it as kcal (rounded to nearest whole number).

## 🎨 Styling & UI Components

- **Tailwind CSS 4**: Configured via `postcss.config.mjs` for modern styling
- **Custom Components**:
  - `FormInput`: Encapsulates text inputs with labels, icons, and validation messages
  - `FormSelect`: Styled select dropdowns with consistent design
- **Color Scheme**: Modern blue gradient design with clean white form areas
- **Responsive Design**: Mobile-first approach with desktop enhancements

## 🔄 State Management & Data Flow

- **Providers**: `src/app/providers.tsx` registers `QueryClientProvider` and `ToastContainer`
- **Query Client**: `src/app/get-query-client.ts` creates a client with optimized defaults (including `staleTime` configuration)
- **Form State**: React Hook Form manages form validation and submission
- **Loading States**: React Query handles loading, success, and error states automatically

## 🏗️ Building & Production

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

**Important**: Ensure `NEXT_PUBLIC_BASE_URL` is properly configured in your deployment environment.

## 🚀 Deployment

This application works out-of-the-box on modern hosting platforms:

- **Vercel**: Deploy directly from GitHub with automatic builds
- **Netlify**: Compatible with Next.js adapter
- **Node.js Hosts**: Any platform supporting Node.js applications

**Deployment Checklist**:

- ✅ Set `NEXT_PUBLIC_BASE_URL` in platform environment settings
- ✅ Ensure backend API is accessible from your domain
- ✅ Configure CORS settings on backend for your frontend domain

## 🐛 Troubleshooting

| Issue                          | Solution                                                             |
| ------------------------------ | -------------------------------------------------------------------- |
| **Blank results/Error toasts** | Verify `NEXT_PUBLIC_BASE_URL` is correct and backend is reachable    |
| **CORS errors**                | Configure CORS on backend to allow your frontend origin              |
| **Validation errors**          | Check input ranges: `heartRate` (30-220), `bodyTemp` (35-42°C), etc. |
| **Build failures**             | Ensure Node.js version compatibility (18.18+)                        |

## 📊 Input Validation Ranges

| Field            | Range  | Unit        |
| ---------------- | ------ | ----------- |
| Age              | 1-120  | years       |
| Height           | 50-300 | centimeters |
| Weight           | 20-300 | kilograms   |
| Duration         | 1-600  | minutes     |
| Heart Rate       | 30-220 | bpm         |
| Body Temperature | 35-42  | °C          |

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Commit** your changes with clear messages
5. **Push** to your branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add appropriate TypeScript types
- Test your changes across different screen sizes
- Update documentation if needed

## 📄 License

No license specified. Please check with the project maintainers for licensing information.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review existing issues in the repository
3. Create a new issue with detailed information about your problem

---

**Made with ❤️ using Next.js, React, and modern web technologies**
