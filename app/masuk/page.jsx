import KartuAkun from "@/components/akun/KartuAkun";
import FormMasuk from "@/components/akun/FormMasuk";

export const metadata = { title: "Masuk" };

export default function HalamanMasuk() {
  return (
    <KartuAkun banner="MASUK" judul="Masuk" tab="masuk" akses="tamu-saja">
      <FormMasuk />
    </KartuAkun>
  );
}
