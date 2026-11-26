"use client";

import { useEffect, useEffectEvent, useState } from "react";

/**
 * Ambil data saat komponen tampil: { data, galat, memuat, muatUlang }.
 * ambilData: fungsi async yang mengembalikan data. kunci: daftar nilai; data diambil ulang bila berubah.
 */
export function useMuat(ambilData, kunci = []) {
  const [ulang, setUlang] = useState(0);
  const [hasil, setHasil] = useState({ kunci: null, data: null, galat: null });
  const kunciSekarang = JSON.stringify(kunci) + "#" + ulang;
  const ambil = useEffectEvent(ambilData);

  useEffect(() => {
    let batal = false;
    ambil().then(
      (data) => !batal && setHasil({ kunci: kunciSekarang, data, galat: null }),
      (galat) => !batal && setHasil({ kunci: kunciSekarang, data: null, galat }),
    );
    return () => {
      batal = true;
    };
  }, [kunciSekarang]);

  const memuat = hasil.kunci !== kunciSekarang;
  return {
    data: hasil.data,
    galat: memuat ? null : hasil.galat,
    memuat,
    // memuat pertama kali (belum ada data sama sekali)
    awal: memuat && hasil.kunci === null,
    muatUlang: () => setUlang((u) => u + 1),
  };
}
