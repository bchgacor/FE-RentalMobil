import Halaman from "@/components/Halaman";
import Link from "next/link";

export const metadata = { title: "Daftar" };

export default function HalamanDaftar() {
  return (
    <Halaman mode="tamu">
      <section className="hero banner">
        <h1>DAFTAR</h1>
      </section>
      <main className="wrap wrap-form">
        <div className="kotak kartu-akun">
          <div className="tab-akun">
            <Link href="/masuk" className="">
              Login
            </Link>
            <Link href="/daftar" className="aktif">
              Register
            </Link>
          </div>
          <h1>Daftar</h1>
          <form action="/cek-email" method="get">
            <div className="field">
              <label htmlFor="nama">Nama lengkap</label>
              <input id="nama" name="nama" type="text" maxLength="100" required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="wa">Nomor WhatsApp</label>
              <input
                id="wa"
                name="no_hp"
                type="tel"
                required
                pattern="(08|\\+62)[0-9]{8,13}"
                title="Nomor Indonesia, diawali 08 atau +62"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div className="field">
              <label htmlFor="provinsi">Provinsi domisili</label>
              <select id="provinsi" name="provinsi" required>
                <option value="">Pilih provinsi</option>
                <option>Kota Malang</option>
                <option>Kabupaten Malang</option>
                <option>Kota Batu</option>
                <option>Aceh</option>
                <option>Sumatera Utara</option>
                <option>Sumatera Barat</option>
                <option>Riau</option>
                <option>Kepulauan Riau</option>
                <option>Jambi</option>
                <option>Sumatera Selatan</option>
                <option>Kepulauan Bangka Belitung</option>
                <option>Bengkulu</option>
                <option>Lampung</option>
                <option>DKI Jakarta</option>
                <option>Jawa Barat</option>
                <option>Banten</option>
                <option>Jawa Tengah</option>
                <option>DI Yogyakarta</option>
                <option>Jawa Timur</option>
                <option>Bali</option>
                <option>Nusa Tenggara Barat</option>
                <option>Nusa Tenggara Timur</option>
                <option>Kalimantan Barat</option>
                <option>Kalimantan Tengah</option>
                <option>Kalimantan Selatan</option>
                <option>Kalimantan Timur</option>
                <option>Kalimantan Utara</option>
                <option>Sulawesi Utara</option>
                <option>Gorontalo</option>
                <option>Sulawesi Tengah</option>
                <option>Sulawesi Barat</option>
                <option>Sulawesi Selatan</option>
                <option>Sulawesi Tenggara</option>
                <option>Maluku</option>
                <option>Maluku Utara</option>
                <option>Papua</option>
                <option>Papua Barat</option>
                <option>Papua Barat Daya</option>
                <option>Papua Selatan</option>
                <option>Papua Tengah</option>
                <option>Papua Pegunungan</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="kota">Kabupaten/kota</label>
              <input
                id="kota"
                name="kota"
                type="text"
                maxLength="100"
                required
                list="daftar-kota"
                placeholder="Contoh: Kota Malang"
                defaultValue=""
              />
              <datalist id="daftar-kota">
                <option value="Kota Malang"></option>
                <option value="Kabupaten Malang"></option>
                <option value="Kota Batu"></option>
                <option value="Kabupaten Bangkalan"></option>
                <option value="Kabupaten Banyuwangi"></option>
                <option value="Kabupaten Blitar"></option>
                <option value="Kabupaten Bojonegoro"></option>
                <option value="Kabupaten Bondowoso"></option>
                <option value="Kabupaten Gresik"></option>
                <option value="Kabupaten Jember"></option>
                <option value="Kabupaten Jombang"></option>
                <option value="Kabupaten Kediri"></option>
                <option value="Kabupaten Lamongan"></option>
                <option value="Kabupaten Lumajang"></option>
                <option value="Kabupaten Madiun"></option>
                <option value="Kabupaten Magetan"></option>
                <option value="Kabupaten Mojokerto"></option>
                <option value="Kabupaten Nganjuk"></option>
                <option value="Kabupaten Ngawi"></option>
                <option value="Kabupaten Pacitan"></option>
                <option value="Kabupaten Pamekasan"></option>
                <option value="Kabupaten Pasuruan"></option>
                <option value="Kabupaten Ponorogo"></option>
                <option value="Kabupaten Probolinggo"></option>
                <option value="Kabupaten Sampang"></option>
                <option value="Kabupaten Sidoarjo"></option>
                <option value="Kabupaten Situbondo"></option>
                <option value="Kabupaten Sumenep"></option>
                <option value="Kabupaten Trenggalek"></option>
                <option value="Kabupaten Tuban"></option>
                <option value="Kabupaten Tulungagung"></option>
                <option value="Kota Blitar"></option>
                <option value="Kota Kediri"></option>
                <option value="Kota Madiun"></option>
                <option value="Kota Mojokerto"></option>
                <option value="Kota Pasuruan"></option>
                <option value="Kota Probolinggo"></option>
                <option value="Kota Surabaya"></option>
              </datalist>
              <p className="hint">
                Domisili Kota Malang, Kabupaten Malang, atau Kota Batu menentukan syarat jaminan sewa lepas kunci.
              </p>
            </div>
            <div className="field">
              <label htmlFor="sandi">Kata sandi</label>
              <input
                id="sandi"
                name="sandi"
                type="password"
                required
                pattern="(?=.*\\d).{8,}"
                minLength="8"
                title="Minimal 8 karakter dan mengandung angka"
                autoComplete="new-password"
              />
              <p className="hint">Minimal 8 karakter dan ada angka.</p>
            </div>
            <div className="field">
              <label htmlFor="sandi2">Konfirmasi kata sandi</label>
              <input
                id="sandi2"
                name="sandi2"
                type="password"
                required
                pattern="(?=.*\\d).{8,}"
                minLength="8"
                title="Minimal 8 karakter dan mengandung angka"
                autoComplete="new-password"
              />
              <p className="hint">Harus sama dengan kata sandi di atas.</p>
            </div>
            <button className="btn blok" type="submit">
              Daftar
            </button>
          </form>
        </div>
      </main>
    </Halaman>
  );
}
