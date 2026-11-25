import Halaman from "@/components/Halaman";
import KontenKatalog from "@/components/konten/KontenKatalog";

export const metadata = { title: "Car" };

export default function HalamanKatalog() {
  return (
    <Halaman mode="pelanggan" aktif="katalog" gaya={["katalog"]}>
      <KontenKatalog base="/user" />
    </Halaman>
  );
}
