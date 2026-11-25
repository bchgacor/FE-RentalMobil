import Halaman from "@/components/Halaman";
import KontenKatalogHasil from "@/components/konten/KontenKatalogHasil";

export const metadata = { title: "Car" };

export default function HalamanKatalogHasil() {
  return (
    <Halaman mode="tamu" aktif="katalog" gaya={["katalog"]}>
      <KontenKatalogHasil />
    </Halaman>
  );
}
