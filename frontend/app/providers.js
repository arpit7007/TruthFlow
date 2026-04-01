"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <ToastContainer />
      </ThemeProvider>
    </SessionProvider>
  );
}