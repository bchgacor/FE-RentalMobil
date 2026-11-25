import Halaman from "@/components/Halaman";
import Link from "next/link";
import Modal from "@/components/Modal";

export const metadata = { title: "Edit Profile" };

export default function HalamanProfil() {
  return (
    <Halaman mode="pelanggan">
      <section className="hero banner">
        <h1>
          {"EDIT "}
          <span>PROFIL</span>
        </h1>
      </section>
      <main className="wrap wrap-sempit">
        <div className="kotak">
          <form id="form-profil" action="/user/profil" method="get">
            <div className="baris" style={{ marginBottom: "16px" }}>
              <img
                src="/img/authorization.jpg"
                alt="Foto profil"
                style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", flexShrink: "0" }}
              />
              <div className="field" style={{ margin: "0" }}>
                <label htmlFor="foto">Ganti Foto</label>
                <input id="foto" name="foto" type="file" accept="image/jpeg,image/png,image/webp" />
                <p className="hint">jpg, png, atau webp, maksimal 2 MB.</p>
              </div>
            </div>
            <div className="field">
              <label htmlFor="nama">Nama lengkap</label>
              <input id="nama" name="nama" type="text" maxLength="100" required defaultValue="Budi Santoso" />
            </div>
            <div className="field">
              <span className="label">Email</span>
              <p style={{ margin: "0" }}>budi@contoh.id</p>
              <p className="hint">Email tidak bisa diubah.</p>
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
                defaultValue="081200000000"
              />
            </div>
            <div className="field">
              <label htmlFor="provinsi">Provinsi domisili</label>
              <select id="provinsi" name="provinsi" required defaultValue="Jawa Timur">
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
                defaultValue="Kota Malang"
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
            <div className="baris">
              <a href="#konfirmasi-simpan" className="btn">
                Simpan Perubahan
              </a>
              <Link href="/user" className="btn garis">
                Batal
              </Link>
            </div>
          </form>
        </div>
        <div className="kotak">
          <h3>Ganti kata sandi</h3>
          <p className="kecil abu">Setelah diganti, akun ini otomatis keluar dari perangkat lain.</p>
          <form action="/user/profil" method="get">
            <div className="field">
              <label htmlFor="lama">Kata sandi lama</label>
              <input id="lama" name="lama" type="password" required autoComplete="current-password" />
            </div>
            <div className="field">
              <label htmlFor="baru">Kata sandi baru</label>
              <input
                id="baru"
                name="baru"
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
              <label htmlFor="baru2">Konfirmasi kata sandi baru</label>
              <input
                id="baru2"
                name="baru2"
                type="password"
                required
                pattern="(?=.*\\d).{8,}"
                minLength="8"
                title="Minimal 8 karakter dan mengandung angka"
                autoComplete="new-password"
              />
            </div>
            <button className="btn" type="submit">
              Simpan Kata Sandi
            </button>
          </form>
        </div>
        <Modal id="konfirmasi-simpan" label="Konfirmasi simpan">
          <h3>Simpan perubahan?</h3>
          <p>Yakin simpan perubahan?</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <button className="btn sm" type="submit" form="form-profil">
              Ya, simpan
            </button>
          </div>
        </Modal>
      </main>
    </Halaman>
  );
}
