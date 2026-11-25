import PanelAdmin from "@/components/admin/PanelAdmin";
import Link from "next/link";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Plat from "@/components/Plat";

export const metadata = { title: "Servis - Admin GantengnyaJatim Group" };

export default function HalamanServis() {
  return (
    <PanelAdmin aktif="servis">
      <main className="main">
        <header className="kepala-aksi">
          <div>
            <h1>Servis Unit</h1>
            <p>Catat servis, pantau mobil yang tidak tersedia, dan lihat pengingat servis berkala.</p>
          </div>
          <a href="#catat-servis" className="btn">
            + Catat servis
          </a>
        </header>
        <div className="grid grid-4">
          <div className="kartu stat">
            <div className="label">Unit dalam servis</div>
            <div className="angka">1</div>
          </div>
          <div className="kartu stat">
            <div className="label">Unit tersedia</div>
            <div className="angka">14</div>
          </div>
          <div className="kartu stat">
            <div className="label">Biaya bengkel</div>
            <div className="angka">Rp 3.600.000</div>
          </div>
          <div className="kartu stat">
            <div className="label">Biaya ditagih</div>
            <div className="angka">Rp 1.000.000</div>
            <p className="ket">Ditanggung perusahaan Rp 2.600.000</p>
          </div>
        </div>
        <section className="kartu jarak">
          <h2>Sedang servis</h2>
          <p className="ket">Unit yang diservis tidak muncul di katalog.</p>
          <div className="tabel-bungkus">
            <table className="tabel">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Masuk</th>
                  <th>Jenis</th>
                  <th>Tingkat</th>
                  <th>Bengkel</th>
                  <th>Keterangan</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Plat>N 5005 GH</Plat>
                    {" Brio"}
                  </td>
                  <td>2 Nov 2026</td>
                  <td>Ganti oli dan rem</td>
                  <td>Sedang</td>
                  <td>Bengkel Maju Jaya</td>
                  <td>Rem berbunyi setelah sewa</td>
                  <td className="aksi-baris">
                    <a href="#selesai-servis" className="btn sm">
                      Selesai servis
                    </a>{" "}
                    <a href="#batal-servis" className="tautan">
                      Batal
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="kartu">
          <h2>Pengingat servis</h2>
          <p className="ket">
            Odometer terakhir terisi otomatis dari pengembalian (lepas kunci). Untuk sewa dengan sopir, isi odometer
            saat mencatat servis.
          </p>
          <div className="tabel-bungkus">
            <table className="tabel">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th className="angka">Odometer</th>
                  <th className="angka">Servis terakhir</th>
                  <th className="angka">Jadwal berikutnya</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Plat>N 6006 IJ</Plat>
                    {" Alphard 2022"}
                  </td>
                  <td className="angka">48.900 km</td>
                  <td className="angka">43.000 km</td>
                  <td className="angka">48.000 km</td>
                  <td>
                    <Badge jenis="perlu">Perlu servis</Badge>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 3003 EF</Plat>
                    {" Rush TRD"}
                  </td>
                  <td className="angka">45.000 km</td>
                  <td className="angka">40.800 km</td>
                  <td className="angka">45.800 km</td>
                  <td>
                    <Badge jenis="segera">Segera, 800 km lagi</Badge>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 1001 AA</Plat>
                    {" Innova Reborn"}
                  </td>
                  <td className="angka">62.400 km</td>
                  <td className="angka">60.000 km</td>
                  <td className="angka">65.000 km</td>
                  <td>
                    <Badge jenis="aman">Aman, 2.600 km lagi</Badge>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 4004 GH</Plat>
                    {" XL7"}
                  </td>
                  <td className="angka">22.800 km</td>
                  <td className="angka">-</td>
                  <td className="angka">-</td>
                  <td>
                    <Badge jenis="netral">Belum ada data servis</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <form className="filter jarak" action="/admin/servis" method="get">
            <div>
              <label htmlFor="interval">Interval servis (km)</label>
              <input id="interval" name="interval_km" type="number" min="500" step="500" defaultValue="5000" required />
            </div>
            <div>
              <button className="btn garis" type="submit">
                Simpan interval
              </button>
            </div>
          </form>
          <p className="hint">Servis berikutnya jatuh tempo tiap 5.000 km atau 6 bulan, mana yang lebih dulu.</p>
        </section>
        <section className="kartu">
          <h2>Riwayat servis</h2>
          <div className="tabel-bungkus">
            <table className="tabel">
              <thead>
                <tr>
                  <th>Selesai</th>
                  <th>Unit</th>
                  <th>Jenis</th>
                  <th>Bengkel</th>
                  <th>Komponen</th>
                  <th className="angka">Biaya bengkel</th>
                  <th className="angka">Ditagih ke penyewa</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10 Sep 2026</td>
                  <td>
                    <Plat>N 1001 AA</Plat>
                    {" Innova Reborn"}
                  </td>
                  <td>Servis berkala</td>
                  <td>Bengkel Maju Jaya</td>
                  <td>Oli mesin, filter oli</td>
                  <td className="angka">Rp 1.200.000</td>
                  <td className="angka">Rp 0</td>
                  <td>Selesai</td>
                </tr>
                <tr>
                  <td>15 Agu 2026</td>
                  <td>
                    <Plat>N 3003 EF</Plat>
                    {" Rush TRD"}
                  </td>
                  <td>Ganti ban</td>
                  <td>Ban Sentosa</td>
                  <td>Ban</td>
                  <td className="angka">Rp 2.400.000</td>
                  <td className="angka">Rp 1.000.000</td>
                  <td>Selesai</td>
                </tr>
                <tr>
                  <td>1 Agu 2026</td>
                  <td>
                    <Plat>N 2001 CA</Plat>
                    {" Avanza 2024"}
                  </td>
                  <td>Pemeriksaan</td>
                  <td>-</td>
                  <td>-</td>
                  <td className="angka">-</td>
                  <td className="angka">-</td>
                  <td>Dibatalkan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <Modal id="catat-servis" label="Catat servis" kelas="lebar">
          <h3>Catat servis</h3>
          <p className="ket">{'Servis juga dibuat otomatis dari pengembalian bila "unit perlu servis" dicentang.'}</p>
          <form action="/admin/servis" method="get">
            <div className="kolom-2">
              <div>
                <label htmlFor="unit">Unit</label>
                <select id="unit" name="id_kendaraan" required>
                  <option value="">Pilih unit</option>
                  <option>N 1001 AA · Innova Reborn</option>
                  <option>N 1002 AB · Innova Reborn</option>
                  <option>N 2001 CA · Avanza 2024</option>
                  <option>N 4004 GH · XL7</option>
                  <option>N 5006 GJ · Brio</option>
                  <option>N 6006 IJ · Alphard 2022</option>
                </select>
              </div>
              <div>
                <label htmlFor="jenis">Jenis servis</label>
                <input
                  id="jenis"
                  name="jenis_servis"
                  type="text"
                  maxLength="100"
                  required
                  list="jenis-umum"
                  placeholder="Servis berkala"
                />
                <datalist id="jenis-umum">
                  <option value="Servis berkala"></option>
                  <option value="Perbaikan"></option>
                  <option value="Ganti ban"></option>
                  <option value="Ganti oli"></option>
                </datalist>
              </div>
              <div>
                <label htmlFor="tingkat">Tingkat</label>
                <select id="tingkat" name="tingkat_servis" required>
                  <option value="ringan">Ringan</option>
                  <option value="sedang">Sedang</option>
                  <option value="perlu_bengkel">Perlu bengkel</option>
                </select>
              </div>
              <div>
                <label htmlFor="tgl">Tanggal masuk</label>
                <input id="tgl" name="tgl_perawatan" type="date" required />
              </div>
              <div>
                <label htmlFor="bengkel">Bengkel</label>
                <input id="bengkel" name="bengkel" type="text" maxLength="255" required />
              </div>
              <div>
                <label htmlFor="odo">Odometer (km)</label>
                <input id="odo" name="km_saat_ini" type="number" min="0" step="1" />
                <p className="hint">Tidak boleh lebih kecil dari odometer terakhir.</p>
              </div>
            </div>
            <label htmlFor="ket">Catatan</label>
            <textarea id="ket" name="catatan" maxLength="2000" />
            <div className="baris">
              <a href="#" className="btn garis sm">
                Batal
              </a>
              <button className="btn sm" type="submit">
                Catat servis
              </button>
            </div>
          </form>
        </Modal>
        <Modal id="selesai-servis" label="Selesai servis" kelas="lebar">
          <h3>Selesai servis</h3>
          <p className="ket">
            <Plat>N 5005 GH</Plat>
            {" Brio · masuk 2 Nov 2026 · Bengkel Maju Jaya"}
          </p>
          <form action="/admin/servis" method="get">
            <span className="label-grup">Komponen yang dikerjakan</span>
            <div className="kolom-2">
              <div className="cek">
                <input type="checkbox" id="c1" name="komponen" value="Oli mesin" />
                <label htmlFor="c1">Oli mesin</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="c2" name="komponen" value="Filter oli" />
                <label htmlFor="c2">Filter oli</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="c3" name="komponen" value="Filter udara" />
                <label htmlFor="c3">Filter udara</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="c4" name="komponen" value="Rem" />
                <label htmlFor="c4">Rem</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="c5" name="komponen" value="Ban" />
                <label htmlFor="c5">Ban</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="c6" name="komponen" value="Aki" />
                <label htmlFor="c6">Aki</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="c7" name="komponen" value="Kampas kopling" />
                <label htmlFor="c7">Kampas kopling</label>
              </div>
              <div className="cek">
                <input type="checkbox" id="c8" name="komponen" value="Lainnya" />
                <label htmlFor="c8">Lainnya</label>
              </div>
            </div>
            <input
              id="c8-teks"
              name="komponen_lain"
              type="text"
              maxLength="255"
              placeholder="Sebutkan komponen lainnya"
              aria-label="Komponen lainnya"
            />
            <div className="kolom-2">
              <div>
                <label htmlFor="bk">Biaya bengkel (Rp)</label>
                <input id="bk" name="biaya_bengkel" type="number" min="0" step="1000" required />
              </div>
              <div>
                <label htmlFor="odo2">Odometer (km)</label>
                <input id="odo2" name="km_saat_ini" type="number" min="55100" step="1" required />
                <p className="hint">Odometer terakhir 55.100 km.</p>
              </div>
            </div>
            <p className="kecil abu">Biaya yang ditagih ke penyewa dan jadwal servis berikutnya dihitung sistem.</p>
            <div className="baris">
              <a href="#" className="btn garis sm">
                Batal
              </a>
              <button className="btn sm" type="submit">
                Selesai servis
              </button>
            </div>
          </form>
        </Modal>
        <Modal id="batal-servis" label="Batalkan servis?">
          <h3>Batalkan servis?</h3>
          <p>Servis yang dicatat dibatalkan dan unit kembali Tersedia.</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <Link href="/admin/servis" className="btn bahaya sm">
              Ya, batalkan
            </Link>
          </div>
        </Modal>
      </main>
    </PanelAdmin>
  );
}
