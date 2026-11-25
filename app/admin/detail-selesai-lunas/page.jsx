import HalamanAdmin from "@/components/admin/HalamanAdmin";
import Link from "next/link";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Plat from "@/components/Plat";

export const metadata = { title: "Detail RM-20261018-0003 - Admin GantengnyaJatim Group" };

export default function HalamanDetailSelesaiLunas() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link href="/admin/pesanan" className="kembali">
          ← Kembali ke pesanan
        </Link>
        <div className="kepala-halaman">
          <div>
            <h1>RM-20261018-0003</h1>
            <span className="abu">Dibuat pada 28 Okt 2026, 08.15</span>
          </div>
          <Badge jenis="selesai">Selesai</Badge>
        </div>
        <section className="kartu">
          <h2>Tindakan</h2>
          <div className="alert sukses" style={{ margin: "0 0 4px" }}>
            Tagihan tambahan nol atau sudah lunas. Jaminan bisa dikembalikan ke pelanggan.
          </div>
          <div className="aksi">
            <a href="#kembalikan" className="btn">
              Kembalikan jaminan
            </a>
          </div>
          <p className="kecil" style={{ margin: "12px 0 0" }}>
            <a href="https://wa.me/6281234567890" className="tautan">
              Hubungi pelanggan
            </a>
            {" · "}
            <Link href="/admin/pesanan" className="tautan">
              Lihat pesanan lain pelanggan ini
            </Link>
          </p>
        </section>
        <section className="kartu">
          <h2>Tahapan</h2>
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
        </section>
        <div className="grid grid-2 mulai">
          <div>
            <section className="kartu">
              <h2>Data Pesanan</h2>
              <dl className="data-baris">
                <dt>Tipe</dt>
                <dd>Brio</dd>
                <dt>Jenis sewa</dt>
                <dd>Lepas kunci</dd>
                <dt>Plat nomor</dt>
                <dd>
                  <Plat>N 5005 GH</Plat>
                </dd>
                <dt>Tanggal</dt>
                <dd>30 Okt 2026 sampai 31 Okt 2026</dd>
                <dt>Jam jemput</dt>
                <dd>08.00</dd>
                <dt>Durasi</dt>
                <dd>2 hari</dd>
                <dt>Kembali paling lambat</dt>
                <dd>31 Okt 2026, 23.59</dd>
                <dt>Lokasi jemput</dt>
                <dd>Jl. Veteran No. 1, Malang</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Pembayaran</h2>
              <dl className="data-baris">
                <dt>Metode, status</dt>
                <dd>QRIS, lunas</dd>
                <dt>Nomor order</dt>
                <dd>RM-20261018-0003-PAY</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Jaminan</h2>
              <dl className="data-baris">
                <dt>Dokumen</dt>
                <dd>a. KTP asli, b. SIM C asli, c. KTM, d. Sepeda motor dan STNK</dd>
                <dt>No. identitas</dt>
                <dd>3573 0000 0000 0001</dd>
                <dt>Domisili pesanan</dt>
                <dd>Malang</dd>
                <dt>Status</dt>
                <dd>Siap dikembalikan.</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Hasil Pemeriksaan</h2>
              <dl className="data-baris">
                <dt>Kondisi bodi</dt>
                <dd>Baik</dd>
                <dt>Kebersihan</dt>
                <dd>Baik</dd>
                <dt>BBM saat kembali</dt>
                <dd>Sesuai</dd>
                <dt>Odometer</dt>
                <dd>45.000 km sampai 45.320 km</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Riwayat Aktivitas</h2>
              <ol className="timeline">
                <li>
                  Pesanan dibuat oleh pelanggan<time>28 Okt 2026, 08.15</time>
                </li>
                <li>
                  Pembayaran diterima, pesanan dikonfirmasi otomatis<time>28 Okt 2026, 08.15</time>
                </li>
                <li>
                  Unit diserahkan (N 5005 GH) oleh Admin Rental<time>30 Okt 2026, 08.00</time>
                </li>
                <li>
                  Unit dikembalikan dan diperiksa oleh Admin Rental<time>31 Okt 2026, 20.10</time>
                </li>
              </ol>
            </section>
          </div>
          <div>
            <section className="kartu">
              <h2>Data Pelanggan</h2>
              <dl className="data-baris">
                <dt>Nama</dt>
                <dd>Eko Prasetyo</dd>
                <dt>WhatsApp</dt>
                <dd>0812-6666-0006</dd>
                <dt>Email</dt>
                <dd>eko@contoh.id</dd>
                <dt>Domisili</dt>
                <dd>Malang</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Rincian Biaya</h2>
              <div className="tabel-bungkus">
                <table className="tabel">
                  <tbody>
                    <tr>
                      <td>Sewa Rp 275.000 × 2 hari</td>
                      <td className="angka">Rp 550.000</td>
                    </tr>
                    <tr className="total">
                      <td>Total</td>
                      <td className="angka">Rp 550.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section className="kartu">
              <h2>Catatan Admin</h2>
              <p className="ket kecil abu">Hanya terlihat oleh admin.</p>
              <form method="get">
                <label htmlFor="cat">Catatan</label>
                <textarea
                  id="cat"
                  name="catatan"
                  maxLength="500"
                  placeholder="Misalnya: bukti booking sudah dicek"
                />{" "}
                <button className="btn sm" type="submit">
                  Simpan catatan
                </button>
              </form>
            </section>
          </div>
        </div>
        <Modal id="kembalikan" label="Kembalikan jaminan?">
          <h3>Kembalikan jaminan?</h3>
          <p>Pastikan jaminan fisik (KTP, SIM C, dan lainnya) sudah diserahkan kembali kepada pelanggan.</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <Link href="/admin/detail-selesai-lunas" className="btn sm">
              Ya, kembalikan
            </Link>
          </div>
        </Modal>
      </main>
    </HalamanAdmin>
  );
}
