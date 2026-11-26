"use client";

import { useSesi } from "@/components/sesi/SesiProvider";

// Tombol Keluar admin: memanggil POST /auth/logout lalu kembali ke halaman login admin.
export default function TombolKeluar({ className }) {
  const { keluar } = useSesi();
  return (
    <a
      className={className}
      href="/admin/masuk"
      onClick={(e) => {
        e.preventDefault();
        keluar();
      }}
    >
      Keluar
    </a>
  );
}
