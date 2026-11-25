import HalamanAdmin from "@/components/admin/HalamanAdmin";
import Link from "next/link";

export const metadata = { title: "Selesaikan pesanan - Admin GantengnyaJatim Group" };

export default function HalamanSelesaikanPesanan() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link href="/admin/detail-berjalan" className="kembali">
          ← Kembali ke pesanan
        </Link>
        <div className="kepala-halaman">
          <div>
            <h1>Pengembalian dan pemeriksaan unit</h1>
            <span className="abu">
              RM-20261101-0004 · Dimas Prakoso. Isi setelah mobil kembali, lalu catat kondisi dan biaya tambahan.
            </span>
          </div>
        </div>
        <form action="/admin/detail-selesai" method="get">
          <section className="kartu">
            <div className="kolom-4">
              <div>
                <span className="kecil abu">Pelanggan</span>
                <br />
                <b>Dimas Prakoso</b>
              </div>
              <div>
                <span className="kecil abu">Unit</span>
                <br />
                <b>Rush TRD · N 3003 EF</b>
              </div>
              <div>
                <span className="kecil abu">Tarif per hari</span>
                <br />
                <b>Rp 375.000</b>
              </div>
              <div>
                <span className="kecil abu">Kembali paling lambat</span>
                <br />
                <b>5 Nov 2026, 23.59</b>
              </div>
            </div>
          </section>
          <section className="kartu">
            <div className="langkah-judul">
              <span className="no">1</span>
              <h2>Pengembalian</h2>
            </div>
            <p className="ket">
              Pelanggan boleh mengembalikan sampai pukul 23.59 tanggal kembali. Lewat itu dihitung 1 hari terlambat,
              hari berikutnya bertambah 1 hari.
            </p>
            <div className="kolom-2">
              <div>
                <label htmlFor="tglk">Tanggal kembali</label>
                <input id="tglk" name="tgl_kembali" type="date" required />
              </div>
              <div>
                <label htmlFor="jamk">Jam kembali</label>
                <input id="jamk" name="jam_kembali" type="time" required />
              </div>
              <div>
                <label htmlFor="tarifd">Tarif denda per hari</label>
                <input id="tarifd" name="tarif_denda" type="text" defaultValue="Rp 375.000" readOnly />
              </div>
              <div>
                <label htmlFor="hari">Hari terlambat</label>
                <input id="hari" name="hari_terlambat" type="number" min="0" step="1" defaultValue="0" required />
              </div>
              <div>
                <label htmlFor="odoa">Odometer awal (km)</label>
                <input id="odoa" name="odometer_awal" type="number" defaultValue="45000" readOnly />
              </div>
              <div>
                <label htmlFor="odoz">Odometer akhir (km)</label>
                <input id="odoz" name="odometer_akhir" type="number" min="45000" step="1" required />
              </div>
              <div>
                <label htmlFor="bbmk">BBM saat kembali (awal: Penuh)</label>
                <select id="bbmk" name="bbm_akhir" required>
                  <option>Penuh</option>
                  <option>3/4</option>
                  <option>1/2</option>
                  <option>1/4</option>
                  <option>Hampir kosong</option>
                </select>
              </div>
              <div>
                <label htmlFor="kurang">Biaya kekurangan BBM</label>
                <input id="kurang" name="biaya_bbm" type="number" min="0" step="1000" defaultValue="0" />
              </div>
              <div>
                <label htmlFor="bersih">Kebersihan</label>
                <select id="bersih" name="kebersihan">
                  <option>Bersih</option>
                  <option>Cukup</option>
                  <option>Kotor</option>
                </select>
              </div>
            </div>
          </section>
          <section className="kartu">
            <div className="langkah-judul">
              <span className="no">2</span>
              <h2>Pemeriksaan Kondisi</h2>
            </div>
            <p className="ket">Isi tiap bagian. Foto wajib jika ada kerusakan.</p>
            <div className="tabel-bungkus">
              <table className="tabel">
                <thead>
                  <tr>
                    <th>Bagian</th>
                    <th>Kondisi</th>
                    <th>Biaya perbaikan (Rp)</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tebal">Depan (bumper dan kap)</td>
                    <td>
                      <select name="kondisi_1" aria-label="Kondisi Depan (bumper dan kap)" required>
                        <option>Baik</option>
                        <option>Lecet</option>
                        <option>Penyok</option>
                        <option>Retak</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td>
                      <input
                        name="biaya_1"
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue="0"
                        aria-label="Biaya perbaikan Depan (bumper dan kap)"
                      />
                    </td>
                    <td>
                      <input
                        name="ket_1"
                        type="text"
                        maxLength="150"
                        aria-label="Keterangan Depan (bumper dan kap)"
                        placeholder="Opsional"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="tebal">Belakang (bumper dan bagasi)</td>
                    <td>
                      <select name="kondisi_2" aria-label="Kondisi Belakang (bumper dan bagasi)" required>
                        <option>Baik</option>
                        <option>Lecet</option>
                        <option>Penyok</option>
                        <option>Retak</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td>
                      <input
                        name="biaya_2"
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue="0"
                        aria-label="Biaya perbaikan Belakang (bumper dan bagasi)"
                      />
                    </td>
                    <td>
                      <input
                        name="ket_2"
                        type="text"
                        maxLength="150"
                        aria-label="Keterangan Belakang (bumper dan bagasi)"
                        placeholder="Opsional"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="tebal">Sisi kiri</td>
                    <td>
                      <select name="kondisi_3" aria-label="Kondisi Sisi kiri" required>
                        <option>Baik</option>
                        <option>Lecet</option>
                        <option>Penyok</option>
                        <option>Retak</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td>
                      <input
                        name="biaya_3"
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue="0"
                        aria-label="Biaya perbaikan Sisi kiri"
                      />
                    </td>
                    <td>
                      <input
                        name="ket_3"
                        type="text"
                        maxLength="150"
                        aria-label="Keterangan Sisi kiri"
                        placeholder="Opsional"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="tebal">Sisi kanan</td>
                    <td>
                      <select name="kondisi_4" aria-label="Kondisi Sisi kanan" required>
                        <option>Baik</option>
                        <option>Lecet</option>
                        <option>Penyok</option>
                        <option>Retak</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td>
                      <input
                        name="biaya_4"
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue="0"
                        aria-label="Biaya perbaikan Sisi kanan"
                      />
                    </td>
                    <td>
                      <input
                        name="ket_4"
                        type="text"
                        maxLength="150"
                        aria-label="Keterangan Sisi kanan"
                        placeholder="Opsional"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="tebal">Atap</td>
                    <td>
                      <select name="kondisi_5" aria-label="Kondisi Atap" required>
                        <option>Baik</option>
                        <option>Lecet</option>
                        <option>Penyok</option>
                        <option>Retak</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td>
                      <input
                        name="biaya_5"
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue="0"
                        aria-label="Biaya perbaikan Atap"
                      />
                    </td>
                    <td>
                      <input
                        name="ket_5"
                        type="text"
                        maxLength="150"
                        aria-label="Keterangan Atap"
                        placeholder="Opsional"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="tebal">Kaca dan lampu</td>
                    <td>
                      <select name="kondisi_6" aria-label="Kondisi Kaca dan lampu" required>
                        <option>Baik</option>
                        <option>Lecet</option>
                        <option>Penyok</option>
                        <option>Retak</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td>
                      <input
                        name="biaya_6"
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue="0"
                        aria-label="Biaya perbaikan Kaca dan lampu"
                      />
                    </td>
                    <td>
                      <input
                        name="ket_6"
                        type="text"
                        maxLength="150"
                        aria-label="Keterangan Kaca dan lampu"
                        placeholder="Opsional"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="tebal">Ban dan velg</td>
                    <td>
                      <select name="kondisi_7" aria-label="Kondisi Ban dan velg" required>
                        <option>Baik</option>
                        <option>Lecet</option>
                        <option>Penyok</option>
                        <option>Retak</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td>
                      <input
                        name="biaya_7"
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue="0"
                        aria-label="Biaya perbaikan Ban dan velg"
                      />
                    </td>
                    <td>
                      <input
                        name="ket_7"
                        type="text"
                        maxLength="150"
                        aria-label="Keterangan Ban dan velg"
                        placeholder="Opsional"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="tebal">Interior</td>
                    <td>
                      <select name="kondisi_8" aria-label="Kondisi Interior" required>
                        <option>Baik</option>
                        <option>Lecet</option>
                        <option>Penyok</option>
                        <option>Retak</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td>
                      <input
                        name="biaya_8"
                        type="number"
                        min="0"
                        step="1000"
                        defaultValue="0"
                        aria-label="Biaya perbaikan Interior"
                      />
                    </td>
                    <td>
                      <input
                        name="ket_8"
                        type="text"
                        maxLength="150"
                        aria-label="Keterangan Interior"
                        placeholder="Opsional"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <label htmlFor="fotok" className="jarak">
              Foto kondisi (wajib jika ada kerusakan)
            </label>
            <input id="fotok" name="foto_kondisi" type="file" accept="image/jpeg,image/png" multiple />
          </section>
          <section className="kartu">
            <div className="langkah-judul">
              <span className="no">3</span>
              <h2>Biaya Tambahan Lain</h2>
            </div>
            <p className="ket">Isi hanya yang berlaku.</p>
            <div className="kolom-4">
              <div>
                <label htmlFor="l1">Cuci</label>
                <input id="l1" name="lain_1" type="number" min="0" step="1000" defaultValue="0" />
              </div>
              <div>
                <label htmlFor="l2">Kelengkapan hilang</label>
                <input id="l2" name="lain_2" type="number" min="0" step="1000" defaultValue="0" />
              </div>
              <div>
                <label htmlFor="l3">Tol</label>
                <input id="l3" name="lain_3" type="number" min="0" step="1000" defaultValue="0" />
              </div>
              <div>
                <label htmlFor="l4">Parkir</label>
                <input id="l4" name="lain_4" type="number" min="0" step="1000" defaultValue="0" />
              </div>
              <div>
                <label htmlFor="l5">Lainnya</label>
                <input id="l5" name="lain_5" type="number" min="0" step="1000" defaultValue="0" />
              </div>
            </div>
          </section>
          <section className="kartu">
            <div className="langkah-judul">
              <span className="no">4</span>
              <h2>Pengembalian Jaminan</h2>
            </div>
            <p className="ket">
              Jaminan ditahan selama tagihan tambahan belum dibayar. Centang hanya jika tagihan nol atau sudah lunas.
            </p>
            <div className="cek">
              <input type="checkbox" id="k1" name="k1" />
              <label htmlFor="k1">KTP asli</label>
            </div>
            <div className="cek">
              <input type="checkbox" id="k2" name="k2" />
              <label htmlFor="k2">SIM C asli</label>
            </div>
            <div className="cek">
              <input type="checkbox" id="k3" name="k3" />
              <label htmlFor="k3">KTM, KK, NPWP, BPJS, atau paspor</label>
            </div>
            <div className="cek">
              <input type="checkbox" id="k4" name="k4" />
              <label htmlFor="k4">Sepeda motor dan STNK</label>
            </div>
          </section>
          <section className="kartu">
            <div className="langkah-judul">
              <span className="no">5</span>
              <h2>Konfirmasi</h2>
            </div>
            <label htmlFor="catat">Catatan admin</label>
            <textarea id="catat" name="catatan_admin" maxLength="500" />
            <div className="cek">
              <input type="checkbox" id="servis" name="perlu_servis" />
              <label htmlFor="servis">Unit perlu servis</label>
            </div>
            <div className="kolom-2">
              <div>
                <label htmlFor="tingkat">Tingkat servis</label>
                <select id="tingkat" name="tingkat">
                  <option>Ringan</option>
                  <option>Sedang</option>
                  <option>Berat</option>
                </select>
              </div>
              <div>
                <label htmlFor="perlu">Keperluan servis</label>
                <input id="perlu" name="keperluan" type="text" maxLength="150" />
              </div>
            </div>
            <p className="hint">
              {'Diisi bila "Unit perlu servis" dicentang. Servis dibuat otomatis dengan asal pesanan tercatat.'}
            </p>
            <div className="cek">
              <input type="checkbox" id="setuju" name="persetujuan" required />
              <label htmlFor="setuju">Penyewa sudah melihat dan menyetujui hasil pemeriksaan.</label>
            </div>
            <label htmlFor="byr">Status pembayaran tagihan</label>{" "}
            <select id="byr" name="status_tagihan" required>
              <option>Belum dibayar</option>
              <option>Tunai</option>
              <option>Transfer</option>
            </select>
          </section>
          <section className="kartu">
            <h2>Ringkasan Biaya</h2>
            <p className="ket">Dihitung sistem saat form diisi.</p>
            <div className="ringkasan">
              <div className="baris">
                <span>Denda keterlambatan</span>
                <span>Rp 0</span>
              </div>
              <div className="baris">
                <span>Kekurangan BBM</span>
                <span>Rp 0</span>
              </div>
              <div className="baris">
                <span>Kerusakan</span>
                <span>Rp 0</span>
              </div>
              <div className="baris">
                <span>Biaya lain</span>
                <span>Rp 0</span>
              </div>
              <div className="baris total">
                <span>Tagihan tambahan</span>
                <span>Rp 0</span>
              </div>
            </div>
            <button className="btn jarak" type="submit">
              Selesaikan pesanan
            </button>
            <p className="kecil abu" style={{ marginTop: "8px" }}>
              Setelah disimpan, pesanan menjadi Selesai dan unit tersedia atau masuk servis.
            </p>
          </section>
        </form>
      </main>
    </HalamanAdmin>
  );
}
