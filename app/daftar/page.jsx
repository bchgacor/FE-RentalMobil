import KartuAkun from "@/components/akun/KartuAkun";
import FormDaftar from "@/components/akun/FormDaftar";

export const metadata = { title: "Daftar" };

export default function HalamanDaftar() {
  return (
    <KartuAkun banner="DAFTAR" judul="Daftar" tab="daftar" akses="tamu-saja">
      <FormDaftar />
    </KartuAkun>
  );
}
