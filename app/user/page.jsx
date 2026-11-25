import Halaman from "@/components/Halaman";
import KontenIndex from "@/components/konten/KontenIndex";

export const metadata = { title: "Home" };

export default function HalamanUser() {
  return (
    <Halaman mode="pelanggan" aktif="home">
      <KontenIndex base="/user" />
    </Halaman>
  );
}
