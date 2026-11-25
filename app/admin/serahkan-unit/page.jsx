import HalamanAdmin from "@/components/admin/HalamanAdmin";
import Link from "next/link";

export const metadata = { title: "Serahkan unit - Admin GantengnyaJatim Group" };

export default function HalamanSerahkanUnit() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link href="/admin/detail-dikonfirmasi" className="kembali">
          ← Kembali ke pesanan
        </Link>
        <div className="kepala-halaman">
          <div>
            <h1>Serah Terima Unit</h1>
            <span className="abu">
              RM-20261103-0010 · Siti Rahma. Catat jaminan dan kondisi awal, lalu serahkan unit. Status pesanan menjadi
              Berjalan.
            </span>
          </div>
        </div>
        <form action="/admin/detail-berjalan" method="get">
          <section className="kartu">
            <h2>Data Pesanan</h2>
            <div className="kolom-4">
              <div>
                <span className="kecil abu">Pelanggan</span>
                <br />
                <b>Siti Rahma</b>
              </div>
              <div>
                <span className="kecil abu">Unit</span>
                <br />
                <b>Avanza 2024 Matic</b>
              </div>
              <div>
                <span className="kecil abu">Jenis</span>
                <br />
                <b>Lepas kunci</b>
              </div>
              <div>
                <span className="kecil abu">Tarif per hari</span>
                <br />
                <b>Rp 350.000</b>
              </div>
            </div>
            <div className="kolom-4 jarak">
              <div>
                <span className="kecil abu">Durasi</span>
                <br />
                <b>3 hari</b>
              </div>
              <div>
                <span className="kecil abu">Lokasi jemput</span>
                <br />
                <b>Jl. Veteran No. 1, Malang</b>
              </div>
              <div>
                <span className="kecil abu">Tanggal kembali</span>
                <br />
                <b>12 Nov 2026, 23.59</b>
              </div>
              <div>
                <span className="kecil abu">Domisili pesanan</span>
                <br />
                <b>Malang</b>
              </div>
            </div>
            <div className="alert peringatan jarak" style={{ marginBottom: "0" }}>
              {"Periksa lokasi antar: jika di luar batas Tlogomas, hubungi pelanggan lewat "}
              <a href="https://wa.me/6281234567890" className="tautan">
                WhatsApp
              </a>
              {" untuk biaya antar."}
            </div>
          </section>
          <section className="kartu">
            <h2>Unit yang Diserahkan</h2>
            <p className="ket">
              Daftar hanya berisi unit tipe ini yang kosong pada tanggal sewa. Unit pengganti dari tipe yang sama, atau
              tipe setara atau lebih tinggi dengan persetujuan pelanggan, diperbolehkan.
            </p>
            <label htmlFor="plat">Plat nomor</label>{" "}
            <select id="plat" name="plat" required>
              <option value="">Pilih unit</option>
              <option>N 2001 CA · Avanza 2024 Matic · 12.300 km</option>
              <option>N 2002 CB · Avanza 2024 Matic · 8.900 km</option>
            </select>
          </section>
          <section className="kartu">
            <h2>Jaminan Diterima</h2>
            <p className="ket">Sewa lepas kunci. Admin memeriksa dokumen fisik dan mencocokkan nama dengan KTP.</p>
            <div className="kolom-2">
              <div>
                <label htmlFor="identitas">No. identitas penyewa</label>
                <input
                  id="identitas"
                  name="no_identitas"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{16}"
                  title="16 digit sesuai KTP"
                  required
                />
              </div>
              <div>
                <label htmlFor="dom">Domisili pesanan</label>
                <select id="dom" name="domisili" required defaultValue="Malang">
                  <option>Malang</option>
                  <option>Luar kota</option>
                </select>
                <p className="hint">Sesuaikan jika KTP berbeda. Perubahan dicatat di riwayat aktivitas.</p>
              </div>
            </div>
            <div className="kotak-jaminan">
              <div className="cek">
                <input type="checkbox" id="ja" name="ja" required />
                <label htmlFor="ja">a. KTP asli</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="jb" name="jb" required />
                <label htmlFor="jb">b. SIM C asli</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="jc" name="jc" required />
                <label htmlFor="jc">c. Salah satu dari KTM, KK, NPWP, BPJS, atau paspor</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="jd" name="jd" />
                <label htmlFor="jd">d. Sepeda motor dan STNK (domisili Malang)</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="je" name="je" />
                <label htmlFor="je">
                  e. Bukti booking transportasi umum dan bukti booking hotel (domisili luar kota)
                </label>
              </div>
            </div>
            <p className="hint">
              Centang d untuk domisili Malang atau e untuk luar kota. Untuk e, cocokkan nama dengan KTP, tanggal dengan
              masa sewa, dan kode booking ke sumbernya, lalu catat hasilnya di catatan admin.
            </p>
          </section>
          <section className="kartu">
            <h2>Kondisi Awal Unit</h2>
            <div className="kolom-3">
              <div>
                <label htmlFor="odo">Odometer awal (km)</label>
                <input id="odo" name="odometer_awal" type="number" min="0" step="1" required />
              </div>
              <div>
                <label htmlFor="bbm">BBM awal</label>
                <select id="bbm" name="bbm_awal" required>
                  <option>Penuh</option>
                  <option>3/4</option>
                  <option>1/2</option>
                  <option>1/4</option>
                  <option>Hampir kosong</option>
                </select>
              </div>
              <div>
                <label htmlFor="foto">Foto kondisi (opsional)</label>
                <input id="foto" name="foto_kondisi" type="file" accept="image/jpeg,image/png" />
              </div>
            </div>
            <label htmlFor="kondisi">Catatan kondisi awal</label>
            <textarea
              id="kondisi"
              name="catatan_kondisi"
              maxLength="500"
              required
              placeholder="Ringkas: lecet, kelengkapan, kebersihan"
            />
          </section>
          <section className="kartu">
            <h2>Konfirmasi</h2>
            <p className="ket">Setelah disimpan, status pesanan menjadi Berjalan dan unit berstatus disewa.</p>
            <div className="baris">
              <button className="btn" type="submit">
                Serahkan unit
              </button>
              <Link href="/admin/detail-dikonfirmasi" className="btn garis">
                Batal
              </Link>
            </div>
          </section>
        </form>
      </main>
    </HalamanAdmin>
  );
}
