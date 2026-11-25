import Halaman from "@/components/Halaman";
import KontenPrivasi from "@/components/konten/KontenPrivasi";

export const metadata = { title: "Kebijakan Privasi" };

export default function HalamanPrivasi() {
  return (
    <Halaman mode="pelanggan">
      <KontenPrivasi base="/user" />
    </Halaman>
  );
}
