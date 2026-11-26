"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { api, sesi } from "@/lib/api";
import { useKlien } from "@/lib/useKlien";

// Menyimpan akun yang sedang login untuk seluruh aplikasi (state global lewat React Context).
const SesiContext = createContext({
  akun: null,
  siap: false,
  keluar: () => {},
  sedangKeluar: () => false,
  selesaiKeluar: () => {},
});

export function useSesi() {
  return useContext(SesiContext);
}

// Akun dibaca dari localStorage dan diperbarui saat login/logout (juga dari tab lain).
function langganan(beritahu) {
  window.addEventListener("rental-sesi", beritahu);
  window.addEventListener("storage", beritahu);
  return () => {
    window.removeEventListener("rental-sesi", beritahu);
    window.removeEventListener("storage", beritahu);
  };
}
const bacaAkun = () => (sesi.token() ? JSON.stringify(sesi.akun()) : "null");

export default function SesiProvider({ children }) {
  const router = useRouter();
  const siap = useKlien(); // false saat dirender di server
  const teksAkun = useSyncExternalStore(langganan, bacaAkun, () => "null");
  const akun = useMemo(() => JSON.parse(teksAkun), [teksAkun]);
  // saat keluar, penjaga halaman tidak perlu mengalihkan ke halaman login dengan ?next=
  const sedangKeluar = useRef(false);

  // token ditolak API (401): kembali ke halaman login yang sesuai
  useEffect(() => {
    const saatHabis = (e) => {
      if (e.detail?.jenis === "habis")
        router.replace((e.detail.role === "admin" ? "/admin/masuk" : "/masuk") + "?sesi=habis");
    };
    window.addEventListener("rental-sesi", saatHabis);
    return () => window.removeEventListener("rental-sesi", saatHabis);
  }, [router]);

  const keluar = useCallback(async () => {
    const role = sesi.akun()?.role;
    sedangKeluar.current = true;
    try {
      await api.post("/auth/logout", { alihkan401: false });
    } catch {
      // token yang sudah tidak berlaku pun tetap dianggap keluar
    }
    sesi.hapus();
    router.replace(role === "admin" ? "/admin/masuk" : "/masuk");
  }, [router]);

  const status = useMemo(
    () => ({
      sedangKeluar: () => sedangKeluar.current,
      selesaiKeluar: () => {
        sedangKeluar.current = false;
      },
    }),
    [],
  );
  const nilai = useMemo(() => ({ akun, siap, keluar, ...status }), [akun, siap, keluar, status]);
  return <SesiContext.Provider value={nilai}>{children}</SesiContext.Provider>;
}
