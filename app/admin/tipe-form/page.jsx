import HalamanAdmin from "@/components/admin/HalamanAdmin";
import Link from "next/link";
import Modal from "@/components/Modal";

export const metadata = { title: "Tipe mobil - Admin GantengnyaJatim Group" };

export default function HalamanTipeForm() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link href="/admin/kelola-mobil" className="kembali">
          ← Kembali ke Kelola Mobil
        </Link>
        <div className="kepala-halaman">
          <div>
            <h1>Tipe mobil</h1>
            <span className="abu">Tambah atau ubah tipe.</span>
          </div>
        </div>
        <form id="form-tipe" action="/admin/kelola-mobil" method="get">
          <section className="kartu">
            <h2>Data tipe</h2>
            <div className="kolom-2">
              <div>
                <label htmlFor="nama">Nama tipe</label>
                <input id="nama" name="nama" type="text" maxLength="100" required defaultValue="Innova Reborn" />
              </div>
              <div>
                <label htmlFor="merk">Merk</label>
                <input id="merk" name="merk" type="text" maxLength="50" required defaultValue="Toyota" />
              </div>
              <div>
                <label htmlFor="kursi">Jumlah kursi</label>
                <input id="kursi" name="kursi" type="number" min="2" max="30" required defaultValue="7" />
              </div>
              <div>
                <label htmlFor="bbm">Bahan bakar</label>
                <select id="bbm" name="bbm" required defaultValue="Diesel">
                  <option>Bensin</option>
                  <option>Diesel</option>
                </select>
              </div>
            </div>
          </section>
          <section className="kartu">
            <h2>Tarif per hari</h2>
            <div className="kolom-3">
              <div>
                <label htmlFor="t1">Dengan sopir (Rp)</label>
                <input id="t1" name="tarif_sopir" type="number" min="0" step="1000" required defaultValue="800000" />
              </div>
              <div>
                <label htmlFor="t2">Lepas kunci manual (Rp)</label>
                <input id="t2" name="tarif_manual" type="number" min="0" step="1000" defaultValue="450000" />
              </div>
              <div>
                <label htmlFor="t3">Lepas kunci matic (Rp)</label>
                <input id="t3" name="tarif_matic" type="number" min="0" step="1000" defaultValue="500000" />
              </div>
            </div>
            <p className="hint">Kosongkan atau isi 0 bila tipe tidak disewakan lepas kunci.</p>
          </section>
          <section className="kartu">
            <h2>Foto</h2>
            <p className="ket">Sampai 3 foto, jpg atau png, maksimal 2 MB.</p>
            <div className="kolom-3">
              <div>
                <label htmlFor="f1">Foto 1</label>
                <input id="f1" name="foto1" type="file" accept="image/jpeg,image/png" />
              </div>
              <div>
                <label htmlFor="f2">Foto 2</label>
                <input id="f2" name="foto2" type="file" accept="image/jpeg,image/png" />
              </div>
              <div>
                <label htmlFor="f3">Foto 3</label>
                <input id="f3" name="foto3" type="file" accept="image/jpeg,image/png" />
              </div>
            </div>
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
          <p>Tipe akan disimpan dan katalog diperbarui.</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <button className="btn sm" type="submit" form="form-tipe">
              Ya, simpan
            </button>
          </div>
        </Modal>
      </main>
    </HalamanAdmin>
  );
}
