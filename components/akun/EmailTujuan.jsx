"use client";

import { useSearchParams } from "next/navigation";

// Menampilkan email dari alamat halaman (?email=...).
export default function EmailTujuan() {
  return <b>{useSearchParams().get("email") || "email Anda"}</b>;
}
