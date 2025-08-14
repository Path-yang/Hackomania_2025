"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import LocalStorageProvider from "./LocalStorageProvider";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <LocalStorageProvider>
        {children}
      </LocalStorageProvider>
    </QueryClientProvider>
  );
} 