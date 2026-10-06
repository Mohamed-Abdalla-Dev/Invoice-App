# Invoice App

A web application for managing invoices, built with React and TypeScript. Browse and filter invoices, create and edit invoices, delete them, and track their status and amounts due. The responsive interface supports both light and dark themes.

> **Note:** This is a frontend demo with no backend or database connection. Invoice data and the theme preference are stored in the browser's `localStorage`. Sample invoices are loaded when the app is used for the first time.

## Features

- Browse invoices and filter them by status: all, draft, pending, or paid.
- Create, edit, and delete invoices, including client details, addresses, and line items.
- Calculate line-item totals and due dates based on payment terms.
- Mark invoices as paid.
- Format amounts by currency, with GBP, USD, EUR, SAR, EGP, and SDG available in the form.
- Switch between light and dark themes, with the preference saved between visits.
- Responsive layouts for mobile and desktop screens.

## Tech Stack

- **React 19** and **TypeScript**
- **Vite** for development and production builds
- **React Router** for navigation
- **TanStack React Query** for invoice data queries and keeping the UI up to date after changes
- **React Hook Form** and **Zod** for form management and validation
- **Tailwind CSS 4** for styling
- **Lucide React** for icons

## Requirements

- Node.js version compatible with Vite 8
- npm

## Getting Started

```bash
npm install
npm run dev
```

Once the development server starts, open the URL printed in the terminal (usually `http://localhost:5173`).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check the app and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check files with Oxlint |

## Pages and Routes

| Route | Page |
| --- | --- |
| `/` | Invoice dashboard with the invoice list, filtering, and invoice creation |
| `/invoice/:id` | Invoice details, with edit, delete, and status update actions |

## Data and Storage

- Initial sample invoices are defined in `src/utils/mockData.ts`.
- Invoices are read from and written to `localStorage` using the `invoices-app-data` key.
- The theme preference is stored using the `theme` key.
- The invoice service simulates an API response with a short delay, but does not make network requests or sync data across devices.
- Clearing site data or using a different browser/profile removes the invoices saved in that browser.

## Project Structure

```text
invoice-app/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── image-daniel.jpg
├── src/
│   ├── components/
│   │   ├── CustomButton.tsx
│   │   ├── InputField.tsx
│   │   └── InvoiceStatusBadge.tsx
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── features/
│   │   └── invoices/
│   │       ├── InvoiceCard.tsx
│   │       ├── InvoiceDetails.tsx
│   │       ├── InvoiceFormDrawer.tsx
│   │       ├── InvoicesDashboard.tsx
│   │       └── InvoicesHeader.tsx
│   ├── hooks/
│   │   └── useInvoices.ts
│   ├── layouts/
│   │   └── Sidebar.tsx
│   ├── services/
│   │   ├── formatters.ts
│   │   └── invoiceService.ts
│   ├── types/
│   │   ├── formSchema.ts
│   │   └── invoice.ts
│   ├── utils/
│   │   └── mockData.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Directory Responsibilities

- `src/features/invoices/`: Invoice pages and workflows, including the list, details, and create/edit form.
- `src/components/`: Reusable interface components.
- `src/hooks/`: React Query hooks for invoice queries and mutations.
- `src/services/`: Local invoice data access and date/currency formatting.
- `src/types/`: TypeScript data models and the invoice form validation schema.
- `src/context/` and `src/layouts/`: Theme state and the app's sidebar layout.
- `src/utils/`: Sample invoice data.
- `public/`: Static assets served as-is.
