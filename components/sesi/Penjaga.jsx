"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { nextAman } from "@/lib/api";
import { useSesi } from "./SesiProvider";

/**
 * Penjaga halaman (auth guard).
 * akses="user"      hanya pelanggan yang sudah login
 * akses="admin"     hanya admin yang sudah login (dan sudah mengganti kata sandi sementara)
 * akses="tamu-saja" halaman masuk/daftar: yang sudah login langsung dialihkan
 */
export default function Penjaga(props) {
  // alamat halaman (usePathname) hanya diketahui saat diminta, jadi dibungkus Suspense
  return (
    <Suspense fallback={props.akses === "tamu-saja" ? props.children : <MemeriksaSesi />}>
      <PenjagaDalam {...props} />
    </Suspense>
  );
}

function MemeriksaSesi() {
  return (
    <p className="memuat" role="status" style={{ padding: "40px 20px" }}>
      Memeriksa sesi login...
    </p>
  );
}

function PenjagaDalam({ akses, peran, children }) {
  const { akun, siap, sedangKeluar, selesaiKeluar } = useSesi();
  const router = useRouter();
  const path = usePathname();
  const next = useSearchParams().get("next");
  const tujuan = alihkan(akses, akun, path, peran, next);

  useEffect(() => {
    if (akses === "tamu-saja")
      selesaiKeluar(); // sudah sampai di halaman login
    else if (siap && tujuan && !sedangKeluar()) router.replace(tujuan);
  }, [akses, siap, tujuan, router, sedangKeluar, selesaiKeluar]);
  useEffect(() => {
    if (akses === "tamu-saja" && siap && tujuan) router.replace(tujuan);
  }, [akses, siap, tujuan, router]);

  if (akses === "tamu-saja") return children; // halaman tamu boleh tampil sambil menunggu
  if (!siap || tujuan) return <MemeriksaSesi />;
  return children;
}

function alihkan(akses, akun, path, peran, next) {
  const beranda = (a) =>
    a.role === "admin" ? (a.wajib_ganti_password ? "/admin/ganti-sandi" : "/admin/dashboard") : "/user/riwayat";
  if (akses === "user" || akses === "admin") {
    if (!akun) {
      const masuk = akses === "admin" ? "/admin/masuk" : "/masuk";
      return `${masuk}?next=${encodeURIComponent(path + (typeof window !== "undefined" ? window.location.search : ""))}`;
    }
    if (akun.role !== akses) return beranda(akun);
    if (akses === "admin" && akun.wajib_ganti_password && path !== "/admin/ganti-sandi") return "/admin/ganti-sandi";
    return null;
  }
  if (akses === "tamu-saja" && akun && akun.role === (peran || "user")) {
    // baru saja login dari tautan ?next=...: lanjutkan ke halaman itu
    const aman = nextAman(next, akun.role);
    return aman && !akun.wajib_ganti_password ? aman : beranda(akun);
  }
  return null;
}
