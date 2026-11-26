"use client";

import { useState } from "react";

/** Status pengiriman form: { sibuk, galat, setGalat, kirim(fungsiAsync) }. */
export function useKirim() {
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState(null);
  async function kirim(fn) {
    setSibuk(true);
    setGalat(null);
    try {
      return await fn();
    } catch (e) {
      setGalat(e);
      return undefined;
    } finally {
      setSibuk(false);
    }
  }
  return { sibuk, galat, setGalat, kirim };
}
