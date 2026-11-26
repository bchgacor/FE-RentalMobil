import Link from "next/link";
import KartuAkun from "@/components/akun/KartuAkun";
import EmailTujuan from "@/components/akun/EmailTujuan";

export const metadata = { title: "Tautan Reset Terkirim" };

export default function HalamanLupaSandiTerkirim() {
  return (
    <KartuAkun banner="LUPA KATA SANDI" judul="Cek email Anda">
      <div className="alert sukses">
        {"Jika email "}
        <EmailTujuan /> terdaftar, tautan reset sudah dikirim dan berlaku 1 jam. Cek juga folder spam.
      </div>
      <Link href="/masuk" className="btn garis blok">
        Kembali ke Login
      </Link>
    </KartuAkun>
  );
}
