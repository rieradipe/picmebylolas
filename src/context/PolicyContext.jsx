import { createContext, useContext, useMemo, useState, useEffect } from "react";

const PolicyContext = createContext(null);
export function PolicyProvider({ children }) {
  const [accepted, setAccepted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pm:policy:accepted")) || false;
    } catch {
      return false;
    }
  });
  const [signature, setSignature] = useState(
    () => localStorage.getItem("pm:policy:signature") || ""
  );

  useEffect(() => {
    localStorage.setItem("pm:policy:accepted", JSON.stringify(accepted));
  }, [accepted]);
  useEffect(() => {
    localStorage.setItem("pm:policy:signature", signature);
  }, [signature]);

  const value = useMemo(
    () => ({ accepted, setAccepted, signature, setSignature }),
    [accepted, signature]
  );
  return (
    <PolicyContext.Provider value={value}>{children}</PolicyContext.Provider>
  );
}
export function usePolicy() {
  const ctx = useContext(PolicyContext);
  if (!ctx) throw new Error("usePolicy must be used within PolicyProvider");
  return ctx;
}
