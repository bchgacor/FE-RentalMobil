import HalamanAdmin from "@/components/admin/HalamanAdmin";
import Link from "next/link";
import Modal from "@/components/Modal";

export const metadata = { title: "Unit mobil - Admin GantengnyaJatim Group" };

export default function HalamanUnitForm() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link href="/admin/kelola-mobil" className="kembali">
          ← Kembali ke Kelola Mobil
        </Link>
        <div className="kepala-halaman">
          <div>
            <h1>Unit mobil</h1>
            <span className="abu">Tambah atau ubah unit.</span>
          </div>
        </div>
        <form id="form-unit" action="/admin/kelola-mobil" method="get">
          <section className="kartu">
            <h2>Data unit</h2>
            <div className="kolom-2">
              <div>
                <label htmlFor="tipe">Tipe</label>
                <select id="tipe" name="tipe" required>
                  <option value="">Pilih tipe</option>
                  <option>Innova Reborn</option>
                  <option>Avanza 2024</option>
                  <option>Rush TRD</option>
                  <option>XL7</option>
                  <option>Brio</option>
                  <option>Alphard 2022</option>
                </select>
              </div>
              <div>
                <label htmlFor="plat">Plat nomor</label>
                <input
                  id="plat"
                  name="plat"
                  type="text"
                  required
                  maxLength="12"
                  pattern="[A-Z]{1,2} [0-9]{1,4} [A-Z]{1,3}"
                  title="Format: N 1234 AB"
                  style={{ textTransform: "uppercase" }}
                  placeholder="N 1234 AB"
                />
                <p className="hint">Plat nomor harus unik.</p>
              </div>
              <div>
                <label htmlFor="thn">Tahun</label>
                <input id="thn" name="tahun" type="number" min="1990" max="2026" required />
              </div>
              <div>
                <label htmlFor="warna">Warna</label>
                <input id="warna" name="warna" type="text" maxLength="30" required />
              </div>
              <div>
                <label htmlFor="trans">Transmisi</label>
                <select id="trans" name="transmisi" required>
                  <option>Manual</option>
                  <option>Matic</option>
                </select>
              </div>
              <div>
                <label htmlFor="odo">Odometer (km)</label>
                <input id="odo" name="odometer" type="number" min="0" step="1" required />
              </div>
              <div>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" required>
                  <option>Tersedia</option>
                  <option>Dalam servis</option>
                  <option>Tidak tersedia</option>
                </select>
                <p className="hint">
                  Disewa mengikuti pesanan Berjalan. Tandai Tidak tersedia bila unit dibawa keluar kota.
                </p>
              </div>
            </div>
          </section>
          <section className="kartu">
            <h2>Detail internal</h2>
            <p className="ket">Hanya terlihat oleh admin.</p>
            <div className="kolom-2">
              <div>
                <label htmlFor="pemilik">Nama pemilik</label>
                <input id="pemilik" name="pemilik" type="text" maxLength="100" />
              </div>
              <div>
                <label htmlFor="milik">Status kepemilikan</label>
                <select id="milik" name="status_kepemilikan">
                  <option>Milik perusahaan</option>
                  <option>Titipan</option>
                </select>
              </div>
              <div>
                <label htmlFor="rangka">No. rangka</label>
                <input id="rangka" name="no_rangka" type="text" maxLength="30" required />
              </div>
              <div>
                <label htmlFor="mesin">No. mesin</label>
                <input id="mesin" name="no_mesin" type="text" maxLength="30" required />
              </div>
              <div>
                <label htmlFor="bpkb">No. BPKB</label>
                <input id="bpkb" name="no_bpkb" type="text" maxLength="30" />
              </div>
              <div>
                <label htmlFor="stnk">Masa berlaku STNK</label>
                <input id="stnk" name="masa_stnk" type="date" />
              </div>
            </div>
            <label htmlFor="cat">Catatan</label>
            <textarea id="cat" name="catatan" maxLength="300" />
          </section>
          <div className="baris">
            <a href="#konfirmasi" className="btn">
              Simpan
            </a>
            <Link href="/admin/kelola-mobil" className="btn garis">
              Batal
            </Link>
          </div>
        </form>
        <Modal id="konfirmasi" label="Data sudah benar?">
          <h3>Data sudah benar?</h3>
          <p>Unit akan disimpan dan daftar unit diperbarui.</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <button className="btn sm" type="submit" form="form-unit">
              Ya, simpan
            </button>
          </div>
        </Modal>
      </main>
    </HalamanAdmin>
  );
}
