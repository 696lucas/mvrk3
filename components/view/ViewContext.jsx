"use client";
import { createContext, useContext, useState } from "react";

const ViewContext = createContext(null);

export function ViewProvider({ children, initial = "landing" }) {
  const [view, setView] = useState(initial);
  const value = { view, setView };
  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used within ViewProvider");
  return ctx;
}

