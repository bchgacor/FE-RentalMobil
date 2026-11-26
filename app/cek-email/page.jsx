import KartuAkun from "@/components/akun/KartuAkun";
import EmailTujuan from "@/components/akun/EmailTujuan";
import KirimUlang from "@/components/akun/KirimUlang";

export const metadata = { title: "Cek Email" };

export default function HalamanCekEmail() {
  return (
    <KartuAkun banner="VERIFIKASI EMAIL" judul="Cek email Anda">
      <div className="tengah">
        <div className="kosong" style={{ padding: "8px 0 16px" }}>
          <div className="ikon" aria-hidden="true">
            ✉️
          </div>
        </div>
        <p>
          {"Kami mengirim tautan verifikasi ke "}
          <EmailTujuan />. Tautan berlaku 12 jam. Setelah diklik, Anda bisa login.
        </p>
        <KirimUlang />
      </div>
    </KartuAkun>
  );
}
