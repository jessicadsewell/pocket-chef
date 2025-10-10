import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import "./index.css";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Set up axios to include JWT in headers
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Custom resolvePageComponent using Vite's import.meta.glob
async function resolvePageComponent(
  name: string,
  pages: Record<string, () => Promise<any>>
) {
  const pageKey = Object.keys(pages).find((key) => key.endsWith(`${name}.tsx`));
  if (!pageKey) {
    throw new Error(`Page not found: ${name}`);
  }
  return (await pages[pageKey]()).default;
}

interface PageProps {
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
    };
    token?: string;
  };
}

const appElement = document.getElementById("app");

if (appElement) {
  createInertiaApp({
    id: "app",
    title: (title) => `${title} - Pocket Chef`,
    resolve: (name) =>
      resolvePageComponent(name, import.meta.glob("./Pages/**/*.tsx")),
    setup({ el, App, props }) {
      // Save token if provided
      const pageProps = props.initialPage.props as PageProps;
      if (pageProps.auth?.token) {
        localStorage.setItem("token", pageProps.auth.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${pageProps.auth.token}`;
      }

      createRoot(el).render(<App {...props} />);
    },
    progress: {
      color: "#4B5563",
    },
  });
}
