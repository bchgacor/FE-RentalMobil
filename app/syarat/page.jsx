import Halaman from "@/components/Halaman";
import KontenSyarat from "@/components/konten/KontenSyarat";

export const metadata = { title: "Syarat dan Ketentuan" };

export default function HalamanSyarat() {
  return (
    <Halaman mode="tamu">
      <KontenSyarat />
    </Halaman>
  );
}
