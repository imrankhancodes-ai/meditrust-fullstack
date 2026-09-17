import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import store from "./redux/store";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "999px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(15,118,110,0.15)",
              boxShadow: "0 8px 30px rgba(15,118,110,0.15)",
              fontSize: "13px",
              fontWeight: 600,
              color: "#0f172a",
            },
            success: { iconTheme: { primary: "#0f766e", secondary: "#fff" } },
          }}
        />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
