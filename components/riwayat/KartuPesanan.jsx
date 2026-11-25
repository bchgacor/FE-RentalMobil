import Link from "next/link";
import Badge from "@/components/Badge";
import Tahapan from "@/components/Tahapan";
import FormNilai from "./FormNilai";
import { rupiah } from "@/lib/format";

// Satu kartu pesanan di halaman Riwayat Pemesanan.
export default function KartuPesanan({ pesanan: p }) {
  return (
    <div className="kartu">
      <img src={p.gambar} alt={p.mobil} />
      <div className="detail">
        <b>{p.mobil}</b> · {p.nomor} <Badge jenis={p.status}>{p.label}</Badge>
        <br />
        {p.waktu} · {rupiah(p.total)}
        <Tahapan selesai={p.tahap} />
        {p.tagihan && <p className={p.tagihan.lunas ? "tagihan lunas" : "tagihan"}>{p.tagihan.teks}</p>}
        {p.aksi.luar ? (
          <a className="btn sm" href={p.aksi.href}>
            {p.aksi.label}
          </a>
        ) : (
          <Link className="btn sm" href={p.aksi.href}>
            {p.aksi.label}
          </Link>
        )}{" "}
        <Link className="tautan" href={p.detail}>
          Lihat detail
        </Link>
        {p.nilai === "form" && <FormNilai nomor={p.nomor} />}
        {p.nilai && p.nilai !== "form" && (
          <div className="nilai-sudah">
            <p className="tebal" style={{ margin: "14px 0 4px" }}>
              Anda sudah memberi nilai
            </p>
            <div className="bintang" aria-label={`${p.nilai.bintang} dari 5 bintang`}>
              {"★".repeat(p.nilai.bintang)}
            </div>
            <p className="ulasan-teks">{p.nilai.ulasan}</p>
          </div>
        )}
      </div>
    </div>
  );
}
