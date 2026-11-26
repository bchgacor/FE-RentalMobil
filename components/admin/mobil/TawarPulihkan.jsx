"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

/** Tombol Simpan: periksa isian dulu, baru buka pop-up "Data sudah benar?". */
export function bukaKonfirmasiSimpan(e) {
  const form = e.currentTarget.form;
  if (form.reportValidity()) window.location.hash = "konfirmasi";
}

// Data bentrok dengan tipe/unit di tempat sampah (TIPE_ADA_DI_SAMPAH / UNIT_ADA_DI_SAMPAH): tawarkan pulihkan.
export default function TawarPulihkan({ galat, jenis }) {
  const router = useRouter();
  const [sibuk, setSibuk] = useState(false);
  const [gagal, setGagal] = useState(null);
  const d = galat?.data?.detail;
  if (!d?.id || !/_ADA_DI_SAMPAH$/.test(galat.code || "")) return null;
  async function pulihkan() {
    setSibuk(true);
    try {
      await api.post(`/admin/${jenis}/${d.id}/pulihkan`);
      router.push(`/admin/kelola-mobil/${jenis}/${d.id}?pulih=1`);
    } catch (err) {
      setGagal(err.message);
      setSibuk(false);
    }
  }
  return (
    <p>
      <span className="abu kecil">{galat.message} </span>
      <button type="button" className="btn garis sm" onClick={pulihkan} disabled={sibuk}>
        {sibuk ? "Memulihkan..." : `Pulihkan ${jenis} lama`}
      </button>
      {gagal && <span className="hint galat-kolom">{gagal}</span>}
    </p>
  );
}
