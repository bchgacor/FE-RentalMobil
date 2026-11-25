import Link from "next/link";
import { rupiah } from "@/lib/format";

// Satu kartu di daftar katalog.
export default function KartuMobil({ mobil, base = "" }) {
  return (
    <div className="kotak mobil">
      <img src={mobil.gambar} alt={mobil.nama} loading="lazy" />
      <div className="nama">{mobil.nama}</div>
      <div className="isi">
        {mobil.ringkas}
        <br />
        <b className="oranye">{rupiah(mobil.tarif)}</b>/hari
        <br />★ {mobil.rating} · Sisa {mobil.sisa} unit
        <br />
        <br />
        <Link className="btn" href={`${base}/pesan/${mobil.slug}`}>
          Pesan
        </Link>
      </div>
    </div>
  );
}
