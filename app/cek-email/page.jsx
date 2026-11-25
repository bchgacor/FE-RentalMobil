import Halaman from "@/components/Halaman";
import Link from "next/link";

export const metadata = { title: "Cek Email" };

export default function HalamanCekEmail() {
  return (
    <Halaman mode="tamu">
      <section className="hero banner">
        <h1>
          {"CEK "}
          <span>EMAIL</span>
        </h1>
      </section>
      <main className="wrap wrap-form">
        <div className="kotak kartu-akun">
          <h1>Cek email Anda</h1>
          <div className="tengah">
            <div className="kosong" style={{ padding: "8px 0 16px" }}>
              <div className="ikon" aria-hidden="true">
                ✉️
              </div>
            </div>
            <p>
              {"Kami mengirim tautan verifikasi ke "}
              <b>budi@contoh.id</b>. Tautan berlaku 12 jam.
            </p>
            <Link href="/cek-email" className="btn garis">
              Kirim ulang (tunggu 00:45)
            </Link>
            <p className="hint kecil abu" style={{ marginTop: "8px" }}>
              Kirim ulang maksimal 3 kali per jam.
            </p>
          </div>
          <p className="tengah kecil" style={{ marginTop: "16px" }}>
            <Link href="/verifikasi" className="tautan">
              Buka tautan verifikasi dari email
            </Link>
          </p>
        </div>
      </main>
    </Halaman>
  );
}
