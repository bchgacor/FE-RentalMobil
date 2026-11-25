import Halaman from "@/components/Halaman";
import Link from "next/link";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Plat from "@/components/Plat";

export const metadata = { title: "Detail Pesanan" };

export default function HalamanDetailSelesai() {
  return (
    <Halaman mode="pelanggan" aktif="riwayat" gaya={["riwayat"]}>
      <section className="hero banner">
        <h1>
          {"DETAIL "}
          <span>PESANAN</span>
        </h1>
      </section>
      <main className="wrap">
        <p className="kecil">
          <Link href="/user/riwayat" className="tautan">
            ← Riwayat Pemesanan
          </Link>
        </p>
        <div className="kepala-detail">
          <div>
            <h1>Pesanan RM-20261024-0002</h1>
            <span className="abu">Dibuat 24 Okt 2026, 11.30</span>
          </div>
          <Badge jenis="selesai">Selesai</Badge>
        </div>
        <div className="kotak">
          <h3>Tindakan</h3>
          <div className="alert peringatan" style={{ margin: "0" }}>
            Tagihan tambahan Rp 375.000, hubungi admin untuk pembayaran.
          </div>
          <div className="aksi-detail">
            <a href="#beri-nilai" className="btn">
              Beri penilaian
            </a>
            <Link href="/user/katalog" className="btn garis">
              Pesan lagi
            </Link>
            <Link href="/user/nota" className="btn garis">
              Unduh nota
            </Link>
          </div>
        </div>
        <div className="grid grid-2" style={{ marginTop: "20px" }}>
          <div className="grid" style={{ alignContent: "start" }}>
            <div className="kotak">
              <h3>Tahapan</h3>
              <div className="tahap" aria-label="Tahapan pesanan">
                <span>
                  <i className="on"></i>Menunggu pembayaran
                </span>
                <span>
                  <i className="on"></i>Dikonfirmasi
                </span>
                <span>
                  <i className="on"></i>Berjalan
                </span>
                <span>
                  <i className="on"></i>Selesai
                </span>
              </div>
            </div>
            <div className="kotak">
              <h3>Data Pesanan</h3>
              <dl className="data-baris">
                <dt>Tipe</dt>
                <dd>Rush TRD</dd>
                <dt>Jenis sewa</dt>
                <dd>Lepas kunci</dd>
                <dt>Tanggal</dt>
                <dd>26 sampai 27 Okt 2026</dd>
                <dt>Jam jemput</dt>
                <dd>08.00</dd>
                <dt>Durasi</dt>
                <dd>2 hari</dd>
                <dt>Kembali paling lambat</dt>
                <dd>27 Okt 2026, 23.59</dd>
                <dt>Lokasi jemput</dt>
                <dd>Jl. Veteran No. 1, Malang</dd>
                <dt>Plat nomor</dt>
                <dd>
                  <Plat>N 1234 AB</Plat>
                </dd>
              </dl>
            </div>
            <div className="kotak">
              <h3>Pembayaran</h3>
              <dl className="data-baris">
                <dt>Metode</dt>
                <dd>QRIS</dd>
                <dt>Status</dt>
                <dd>Lunas</dd>
                <dt>Nomor order</dt>
                <dd>RM-20261024-0002-PAY</dd>
              </dl>
            </div>
          </div>
          <div className="grid" style={{ alignContent: "start" }}>
            <div className="kotak">
              <h3>Rincian Biaya</h3>
              <table className="tabel">
                <thead>
                  <tr>
                    <th>Uraian</th>
                    <th className="angka">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sewa Rp 375.000 × 2 hari</td>
                    <td className="angka">Rp 750.000</td>
                  </tr>
                  <tr>
                    <td>Denda keterlambatan (1 hari)</td>
                    <td className="angka">Rp 375.000</td>
                  </tr>
                  <tr className="total">
                    <td>Total sewa</td>
                    <td className="angka">Rp 750.000</td>
                  </tr>
                </tbody>
              </table>
              <p className="tebal" style={{ marginTop: "12px" }}>
                Tagihan tambahan: Rp 375.000
              </p>
            </div>
            <div className="kotak">
              <h3>Jaminan</h3>
              <ul className="daftar-tanda">
                <li>KTP asli</li>
                <li>SIM C asli</li>
                <li>Kartu KTM</li>
                <li>Sepeda motor dan STNK (domisili Malang)</li>
              </ul>
              <p className="kecil abu">Jaminan ditahan sampai tagihan lunas.</p>
            </div>
            <div className="kotak">
              <h3>Hasil Pemeriksaan</h3>
              <dl className="data-baris">
                <dt>Kondisi bodi</dt>
                <dd>Baik</dd>
                <dt>Kebersihan</dt>
                <dd>Baik</dd>
                <dt>BBM</dt>
                <dd>Sesuai</dd>
                <dt>Catatan</dt>
                <dd>Terlambat mengembalikan 1 hari.</dd>
              </dl>
            </div>
            <div className="kotak">
              <h3>Riwayat</h3>
              <ol className="timeline">
                <li>
                  Pesanan dibuat<time>24 Okt 2026, 11.30</time>
                </li>
                <li>
                  Pembayaran diterima, pesanan dikonfirmasi<time>24 Okt 2026, 11.30</time>
                </li>
                <li>
                  Unit diserahkan<time>26 Okt 2026, 08.10</time>
                </li>
                <li>
                  Unit dikembalikan dan diperiksa<time>28 Okt 2026, 10.30</time>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <Modal id="beri-nilai" label="Beri penilaian">
          <h3>Beri penilaian</h3>
          <p className="abu kecil">Penilaian hanya dapat diberikan sekali.</p>
          <form action="/user/detail-selesai" method="get">
            <div className="field">
              <span className="label">Nilai</span>
              <div className="bintang-pilih">
                <input type="radio" name="nilai" id="s5" value="5" required />
                <label htmlFor="s5" title="5 bintang">
                  ★
                </label>
                <input type="radio" name="nilai" id="s4" value="4" />
                <label htmlFor="s4" title="4 bintang">
                  ★
                </label>
                <input type="radio" name="nilai" id="s3" value="3" />
                <label htmlFor="s3" title="3 bintang">
                  ★
                </label>
                <input type="radio" name="nilai" id="s2" value="2" />
                <label htmlFor="s2" title="2 bintang">
                  ★
                </label>
                <input type="radio" name="nilai" id="s1" value="1" />
                <label htmlFor="s1" title="1 bintang">
                  ★
                </label>
              </div>
            </div>
            <div className="field">
              <label htmlFor="ulasan">Ulasan (opsional)</label>
              <textarea id="ulasan" name="ulasan" maxLength="500" />
            </div>
            <div className="baris">
              <a href="#" className="btn garis sm">
                Batal
              </a>
              <button className="btn sm" type="submit">
                Kirim
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </Halaman>
  );
}
