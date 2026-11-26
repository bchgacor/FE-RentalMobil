"use client";

import { useSyncExternalStore } from "react";

const tanpaLangganan = () => () => {};

/** true setelah halaman berjalan di browser (false saat dirender di server). */
export function useKlien() {
  return useSyncExternalStore(
    tanpaLangganan,
    () => true,
    () => false,
  );
}
