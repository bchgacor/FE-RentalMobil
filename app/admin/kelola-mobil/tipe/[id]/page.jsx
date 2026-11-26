import Link from "next/link";
import { Suspense } from "react";
import HalamanAdmin from "@/components/admin/HalamanAdmin";
import FormTipe from "@/components/admin/mobil/FormTipe";

export const metadata = { title: "Tipe Mobil - Admin GantengnyaJatim Group" };

export default function HalamanFormTipe() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link className="kembali" href="/admin/kelola-mobil">
          ← Kembali ke Kelola Mobil
        </Link>
        <Suspense fallback={<p className="memuat">Memuat...</p>}>
          <FormTipe />
        </Suspense>
      </main>
    </HalamanAdmin>
  );
}
