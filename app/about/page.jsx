import Halaman from "@/components/Halaman";
import KontenAbout from "@/components/konten/KontenAbout";

export const metadata = { title: "About Us" };

export default function HalamanAbout() {
  return (
    <Halaman aktif="about" gaya={["about"]}>
      <KontenAbout />
    </Halaman>
  );
}
