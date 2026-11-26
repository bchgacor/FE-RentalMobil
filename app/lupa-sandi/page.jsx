import KartuAkun from "@/components/akun/KartuAkun";
import FormLupa from "@/components/akun/FormLupa";

export const metadata = { title: "Lupa Kata Sandi" };

export default function HalamanLupaSandi() {
  return (
    <KartuAkun
      banner="LUPA KATA SANDI"
      judul="Lupa Kata Sandi"
      akses="tamu-saja"
      keterangan={
        <p className="abu tengah">Masukkan email akun Anda. Kami kirim tautan untuk membuat kata sandi baru.</p>
      }
    >
      <FormLupa />
    </KartuAkun>
  );
}
