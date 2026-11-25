import Halaman from "@/components/Halaman";
import Link from "next/link";

export const metadata = { title: "Pembayaran" };

export default function HalamanPembayaran() {
  return (
    <Halaman mode="pelanggan" aktif="katalog">
      <section className="hero banner">
        <h1>PEMBAYARAN</h1>
      </section>
      <main className="wrap wrap-sempit latar-bayar">
        <div className="kotak">
          <h1 style={{ fontSize: "24px" }}>Pembayaran</h1>
          <p>
            {"Pesanan "}
            <b>RM-20261104-0012</b>
            {" sudah dibuat. Selesaikan pembayaran dalam:"}
          </p>
          <p className="countdown" aria-label="Sisa waktu">
            00:59:48
          </p>
          <dl className="data-baris">
            <dt>Mobil</dt>
            <dd>Innova Reborn (dengan sopir)</dd>
            <dt>Tanggal</dt>
            <dd>10 sampai 12 Nov 2026, 3 hari</dd>
            <dt>Total</dt>
            <dd>Rp 2.400.000</dd>
          </dl>
        </div>
      </main>
      <div className="modal tampil" role="dialog" aria-modal="true" aria-label="Pilih metode pembayaran">
        <div className="isi snap">
          <div className="kepala">
            <b>Pilih metode pembayaran</b>
            <Link href="/user/detail-menunggu-pembayaran" className="tutup" aria-label="Tutup tanpa membayar">
              ×
            </Link>
          </div>
          <div className="badan">
            <p className="abu">
              {"Total "}
              <b style={{ color: "var(--teks)" }}>Rp 2.400.000</b>
              {" · sisa waktu 00:59:48"}
            </p>
            <div className="pilih-metode" role="radiogroup" aria-label="Metode pembayaran">
              <input className="radio-metode" type="radio" name="metode" id="m-qris" value="qris" defaultChecked />{" "}
              <label className="metode" htmlFor="m-qris">
                <span>QRIS</span>
                <span aria-hidden="true">›</span>
              </label>{" "}
              <input className="radio-metode" type="radio" name="metode" id="m-bca" value="bca" />{" "}
              <label className="metode" htmlFor="m-bca">
                <span>Virtual account BCA</span>
                <span aria-hidden="true">›</span>
              </label>{" "}
              <input className="radio-metode" type="radio" name="metode" id="m-bni" value="bni" />{" "}
              <label className="metode" htmlFor="m-bni">
                <span>Virtual account BNI</span>
                <span aria-hidden="true">›</span>
              </label>{" "}
              <input className="radio-metode" type="radio" name="metode" id="m-mandiri" value="mandiri" />{" "}
              <label className="metode" htmlFor="m-mandiri">
                <span>Virtual account Mandiri</span>
                <span aria-hidden="true">›</span>
              </label>{" "}
              <Link href="/user/nota" className="btn blok bayar bayar-qris">
                Bayar
              </Link>{" "}
              <Link href="/user/nota-va-bca" className="btn blok bayar bayar-bca">
                Bayar
              </Link>{" "}
              <Link href="/user/nota-va-bni" className="btn blok bayar bayar-bni">
                Bayar
              </Link>{" "}
              <Link href="/user/nota-va-mandiri" className="btn blok bayar bayar-mandiri">
                Bayar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Halaman>
  );
}
