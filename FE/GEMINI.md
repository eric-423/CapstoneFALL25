# Gemini Project Context

## Project Overview

This is a web application built with React and Vite. It uses TypeScript and Tailwind CSS for styling. The project is structured with a clear separation of concerns, including components, pages, routes, and API services. It appears to be a front-end for an e-commerce or ordering system, with features like user authentication, product browsing, and order management.

### Key Technologies:

*   **Framework:** React
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **Data Fetching:** React Query, Axios
*   **State Management:** React Context
*   **Form Handling:** React Hook Form
*   **UI Components:** Shadcn UI, Ant Design

## Building and Running

### Prerequisites:

*   Node.js and npm (or yarn/pnpm)

### Development:

To start the development server, run:

```bash
npm run dev
```

### Building for Production:

To create a production build, run:

```bash
npm run build
```

### Linting:

To check for linting errors, run:

```bash
npm run lint
```

To fix linting errors, run:

```bash
npm run lint:fix
```

### Formatting:

To check for formatting errors with Prettier, run:

```bash
npm run prettier
```

To fix formatting errors, run:

```bash
npm run prettier:fix
```

## Development Conventions

*   **Component Structure:** Components are organized into `components/ui` for general UI elements and `components/common` for more specific, reusable components.
*   **Styling:** The project uses Tailwind CSS for utility-first styling.
*   **Routing:** Routes are defined in `src/routes/index.ts` and use React Router with lazy loading for code splitting.
*   **API Interaction:** API calls are managed in the `src/apis` directory, with separate files for different resources. React Query is used for data fetching and caching.
*   **State Management:** Global state, such as the shopping cart, is managed using React Context.
*   **Type Safety:** TypeScript is used throughout the project to ensure type safety.
*   **Code Style:** The project uses ESLint and Prettier to enforce a consistent code style.
