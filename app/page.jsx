import Halaman from "@/components/Halaman";
import KontenIndex from "@/components/konten/KontenIndex";

export const metadata = { title: "Home" };

export default function HalamanGuest() {
  return (
    <Halaman mode="tamu" aktif="home">
      <KontenIndex />
    </Halaman>
  );
}
