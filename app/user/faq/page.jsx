import Halaman from "@/components/Halaman";
import KontenFaq from "@/components/konten/KontenFaq";

export const metadata = { title: "FAQ" };

export default function HalamanFaq() {
  return (
    <Halaman mode="pelanggan">
      <KontenFaq base="/user" />
    </Halaman>
  );
}
