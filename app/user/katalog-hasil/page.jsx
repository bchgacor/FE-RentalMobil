import Halaman from "@/components/Halaman";
import KontenKatalogHasil from "@/components/konten/KontenKatalogHasil";

export const metadata = { title: "Car" };

export default function HalamanKatalogHasil() {
  return (
    <Halaman mode="pelanggan" aktif="katalog" gaya={["katalog"]}>
      <KontenKatalogHasil base="/user" />
    </Halaman>
  );
}
