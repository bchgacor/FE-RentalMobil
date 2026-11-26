import Halaman from "@/components/Halaman";
import Profil from "@/components/profil/Profil";

export const metadata = { title: "Edit Profile" };

export default function HalamanProfil() {
  return (
    <Halaman akses="user">
      <section className="hero banner">
        <h1>
          {"EDIT "}
          <span>PROFIL</span>
        </h1>
      </section>
      <main className="wrap wrap-sempit">
        <Profil />
      </main>
    </Halaman>
  );
}
