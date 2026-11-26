"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { rupiah } from "@/lib/format";
import { muatSnap } from "@/lib/midtrans";
import { rentang } from "@/lib/status";
import { useMuat } from "@/lib/useMuat";

function ambilToken(id) {
  try {
    return JSON.parse(sessionStorage.getItem(`snap_${id}`) || "null");
  } catch {
    return null;
  }
}
function simpanToken(id, t) {
  try {
    if (t) sessionStorage.setItem(`snap_${id}`, JSON.stringify(t));
    else sessionStorage.removeItem(`snap_${id}`);
  } catch {}
}

// Halaman pembayaran: tombol membuka jendela Midtrans Snap (metode bayar dipilih di sana).
export default function Pembayaran() {
  const { id } = useParams();
  const router = useRouter();
  const {
    data: d,
    galat,
    awal,
  } = useMuat(async () => (await api.get(`/pemesanan/${encodeURIComponent(id)}`)).data, [id]);
  const [token, setToken] = useState(null);
  const [pesan, setPesan] = useState(null); // { teks, jenis }
  const [sibuk, setSibuk] = useState(false);
  const [habis, setHabis] = useState(false);

  // token Snap yang dibuat saat pesanan dibuat (disimpan sementara di sessionStorage)
  const sudahBaca = useRef(false);
  useEffect(() => {
    if (sudahBaca.current) return;
    sudahBaca.current = true;
    const t = ambilToken(id);
    if (t) setTimeout(() => setToken(t), 0);
  }, [id]);

  useEffect(() => {
    if (d && d.status !== "menunggu_pembayaran" && d.status !== "dibatalkan") router.replace(`/user/pesanan/${d.id}`);
  }, [d, router]);

  if (awal) return <p className="memuat">Memuat pesanan...</p>;
  if (galat) {
    return (
      <div className="kotak kosong">
        <div className="alert galat" role="alert">
          {galat.status === 404 ? "Pesanan tidak ditemukan." : galat.message}
        </div>
        <Link className="btn" href="/user/riwayat">
          Ke Riwayat Pemesanan
        </Link>
      </div>
    );
  }
  if (habis || d.status === "dibatalkan" || (d.status === "menunggu_pembayaran" && !d.aksi?.bisa_bayar)) {
    return (
      <div className="kotak kosong">
        <div className="ikon" aria-hidden="true">
          ⌛
        </div>
        <div className="alert galat" role="alert">
          Pembayaran tidak diterima dalam 1 jam, pesanan dibatalkan.
        </div>
        <Link className="btn" href="/katalog">
          Pesan ulang
        </Link>
      </div>
    );
  }
  if (d.status !== "menunggu_pembayaran") return <p className="memuat">Membuka detail pesanan...</p>;

  async function bayar() {
    setPesan(null);
    setSibuk(true);
    try {
      let t = token;
      if (!t?.token) {
        const r = await api.post(`/pemesanan/${id}/pembayaran`);
        t = { token: r.data.snap_token, batas: r.data.batas_pembayaran };
        simpanToken(id, t);
        setToken(t);
      }
      if (String(t.token).startsWith("snap-palsu-")) {
        setPesan({
          jenis: "info",
          teks:
            "Back-end sedang memakai gateway pembayaran palsu (mode uji lokal), jadi jendela Midtrans tidak bisa dibuka. " +
            "Status pesanan berubah setelah back-end menerima notifikasi pembayaran (webhook) yang dikirim penguji.",
        });
        return;
      }
      const snap = await muatSnap();
      snap.pay(t.token, {
        onSuccess: () => router.push(`/user/pesanan/${id}?bayar=proses`),
        onPending: () => router.push(`/user/pesanan/${id}?bayar=proses`),
        onError: () => {
          // token mungkin sudah dipakai atau kedaluwarsa: minta token baru di klik berikutnya
          simpanToken(id, null);
          setToken(null);
          setPesan({ jenis: "galat", teks: "Pembayaran gagal diproses. Silakan coba lagi." });
        },
        onClose: () =>
          setPesan({ jenis: "info", teks: "Jendela pembayaran ditutup. Klik Bayar sekarang untuk melanjutkan." }),
      });
    } catch (err) {
      if (err.code === "PEMBAYARAN_KEDALUWARSA") setHabis(true);
      else setPesan({ jenis: "galat", teks: err.message });
    } finally {
      setSibuk(false);
    }
  }

  return (
    <div className="kotak">
      <h1 style={{ fontSize: "24px" }}>Pembayaran</h1>
      <p>
        Pesanan <b>{d.nomor}</b> sudah dibuat. Unit ditahan selama 1 jam sampai pembayaran selesai.
      </p>
      {token?.batas && <HitungMundur batas={token.batas} onHabis={() => setHabis(true)} />}
      <dl className="data-baris">
        <dt>Mobil</dt>
        <dd>
          {d.tipe.nama} (
          {d.jenis_sewa === "dengan_sopir" ? "dengan sopir" : `lepas kunci${d.transmisi ? `, ${d.transmisi}` : ""}`})
        </dd>
        <dt>Tanggal</dt>
        <dd>
          {rentang(d.tgl_mulai, d.tgl_kembali)}, {d.durasi} hari
        </dd>
        <dt>Total</dt>
        <dd>
          <b>{rupiah(d.total_biaya)}</b>
        </dd>
      </dl>
      <p className="kecil abu">
        Metode pembayaran (QRIS atau virtual account BCA, BNI, Mandiri) dipilih di jendela Midtrans setelah menekan
        tombol di bawah.
      </p>
      {pesan && (
        <div className={`alert ${pesan.jenis}`} role="alert">
          {pesan.teks}
        </div>
      )}
      <button className="btn blok" type="button" onClick={bayar} disabled={sibuk}>
        {sibuk ? "Membuka pembayaran..." : "Bayar sekarang"}
      </button>
      <p className="tengah kecil" style={{ marginTop: "12px" }}>
        <Link className="tautan" href={`/user/pesanan/${d.id}`}>
          Lihat detail pesanan
        </Link>
      </p>
    </div>
  );
}

function HitungMundur({ batas, onHabis }) {
  const akhir = new Date(batas).getTime();
  const [sekarang, setSekarang] = useState(() => Date.now());
  const sisa = Math.max(0, Math.floor((akhir - sekarang) / 1000));
  useEffect(() => {
    if (!sisa) {
      onHabis();
      return;
    }
    const t = setTimeout(() => setSekarang(Date.now()), 1000);
    return () => clearTimeout(t);
  }, [sisa, onHabis]);
  const z = (n) => String(n).padStart(2, "0");
  return (
    <p>
      Selesaikan pembayaran dalam:{" "}
      <span className="countdown" aria-label="Sisa waktu">
        {z(Math.floor(sisa / 3600))}:{z(Math.floor(sisa / 60) % 60)}:{z(sisa % 60)}
      </span>
    </p>
  );
}
