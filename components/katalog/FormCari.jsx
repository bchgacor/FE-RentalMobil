"use client";

import { useSearchParams } from "next/navigation";
import { tambahHari } from "@/lib/format";
import { useKlien } from "@/lib/useKlien";

// Form pencarian katalog. Tanggal mulai paling cepat besok, paling jauh 30 hari lagi.
export default function FormCari() {
  const q = useSearchParams();
  const klien = useKlien(); // tanggal hari ini dihitung di browser
  const batas = klien ? { min: tambahHari(1), max: tambahHari(30) } : {};

  return (
    <form className="kotak pencarian" action="/katalog-hasil" method="get" key={q.toString()}>
      <div>
        <label htmlFor="tgl">Tanggal mulai</label>
        <input
          id="tgl"
          name="tgl_mulai"
          type="date"
          defaultValue={q.get("tgl_mulai") || ""}
          min={batas.min}
          max={batas.max}
          required
        />
      </div>
      <div>
        <label htmlFor="dur">Durasi (hari)</label>
        <input
          id="dur"
          name="durasi"
          type="number"
          defaultValue={q.get("durasi") || ""}
          min="1"
          max="30"
          step="1"
          required
        />
      </div>
      <div>
        <label htmlFor="kursi">Kursi</label>
        <select id="kursi" name="kursi" defaultValue={q.get("kursi") || ""}>
          <option value="">Semua</option>
          <option value="5">5 kursi</option>
          <option value="7">7 kursi</option>
          <option value="9+">9 ke atas</option>
        </select>
      </div>
      <div>
        <label htmlFor="trans">Transmisi</label>
        <select id="trans" name="transmisi" defaultValue={q.get("transmisi") || ""}>
          <option value="">Semua</option>
          <option value="manual">Manual</option>
          <option value="matic">Matic</option>
        </select>
      </div>
      <div>
        <button className="btn" type="submit">
          Cari
        </button>
      </div>
    </form>
  );
}
