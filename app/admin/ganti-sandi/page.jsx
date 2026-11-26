import Halaman from "@/components/Halaman";
import Penjaga from "@/components/sesi/Penjaga";
import FormGantiSandi from "@/components/akun/FormGantiSandi";

export const metadata = { title: "Ganti Kata Sandi Admin" };

export default function HalamanGantiSandiAdmin() {
  return (
    <Halaman>
      <section className="hero banner">
        <h1>
          GANTI <span>KATA SANDI</span>
        </h1>
      </section>
      <main className="wrap wrap-form">
        <Penjaga akses="admin">
          <div className="kotak kartu-akun">
            <h1>Ganti kata sandi</h1>
            <div className="alert info">
              Ini login pertama Anda. Demi keamanan, ganti kata sandi sementara sebelum memakai panel admin.
            </div>
            <FormGantiSandi />
          </div>
        </Penjaga>
      </main>
    </Halaman>
  );
}
