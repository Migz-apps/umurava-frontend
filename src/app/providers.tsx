"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/store";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { apiClient } from "@/lib/api";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Fetch current user on mount if token exists
    const token = localStorage.getItem("token");
    if (token) {
      apiClient.setToken(token);
      store.dispatch(fetchCurrentUser());
    }
  }, []);

  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          classNames: {
            toast:
              "group toast flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-foreground shadow-sm",
            title: "text-sm font-medium",
            description: "text-xs text-muted-foreground",
          },
        }}
      />
    </Provider>
  );
}
