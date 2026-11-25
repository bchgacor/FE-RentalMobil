import HalamanAdmin from "@/components/admin/HalamanAdmin";
import Link from "next/link";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";

export const metadata = { title: "Detail RM-20261102-0006 - Admin GantengnyaJatim Group" };

export default function HalamanDetailPengajuanPembatalan() {
  return (
    <HalamanAdmin>
      <main className="halaman">
        <Link href="/admin/pesanan" className="kembali">
          ← Kembali ke pesanan
        </Link>
        <div className="kepala-halaman">
          <div>
            <h1>RM-20261102-0006</h1>
            <span className="abu">Dibuat pada 2 Nov 2026, 16.45</span>
          </div>
          <Badge jenis="pengajuan">Pengajuan pembatalan</Badge>
        </div>
        <section className="kartu">
          <h2>Tindakan</h2>
          <p>
            Pelanggan mengajukan pembatalan lewat WhatsApp. Pembayaran lewat QRIS: refund lewat Midtrans. Bila virtual
            account, refund diproses manual lewat WhatsApp.
          </p>
          <div className="aksi">
            <a href="#setujui" className="btn">
              Setujui
            </a>
            <a href="#tolak" className="btn garis">
              Tolak
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
              <i></i>Berjalan
            </span>
            <span>
              <i></i>Selesai
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
                <dd>Dengan sopir</dd>
                <dt>Plat nomor</dt>
                <dd>Belum ditetapkan (diisi saat Serahkan unit)</dd>
                <dt>Tanggal</dt>
                <dd>12 Nov 2026 sampai 13 Nov 2026</dd>
                <dt>Jam jemput</dt>
                <dd>08.00</dd>
                <dt>Durasi</dt>
                <dd>2 hari</dd>
                <dt>Kembali paling lambat</dt>
                <dd>13 Nov 2026, 23.59</dd>
                <dt>Lokasi jemput</dt>
                <dd>Jl. Veteran No. 1, Malang</dd>
                <dt>Tujuan</dt>
                <dd>Batu, Malang kota</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Pembayaran</h2>
              <dl className="data-baris">
                <dt>Metode, status</dt>
                <dd>QRIS, lunas</dd>
                <dt>Nomor order</dt>
                <dd>RM-20261102-0006-PAY</dd>
              </dl>
            </section>
            <section className="kartu">
              <h2>Riwayat Aktivitas</h2>
              <ol className="timeline">
                <li>
                  Pesanan dibuat oleh pelanggan<time>2 Nov 2026, 16.45</time>
                </li>
                <li>
                  Pembayaran diterima, pesanan dikonfirmasi otomatis<time>2 Nov 2026, 16.45</time>
                </li>
                <li>
                  Pelanggan mengajukan pembatalan<time>3 Nov 2026, 09.00</time>
                </li>
              </ol>
            </section>
          </div>
          <div>
            <section className="kartu">
              <h2>Data Pelanggan</h2>
              <dl className="data-baris">
                <dt>Nama</dt>
                <dd>Rina Wulandari</dd>
                <dt>WhatsApp</dt>
                <dd>0812-4444-0004</dd>
                <dt>Email</dt>
                <dd>rina@contoh.id</dd>
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
                      <td>Sewa Rp 600.000 × 2 hari</td>
                      <td className="angka">Rp 1.200.000</td>
                    </tr>
                    <tr className="total">
                      <td>Total</td>
                      <td className="angka">Rp 1.200.000</td>
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
        <Modal id="setujui" label="Setujui pembatalan?">
          <h3>Setujui pembatalan?</h3>
          <p>Status menjadi Dibatalkan, unit dilepas, dan dana dikembalikan penuh tanpa potongan.</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <Link href="/admin/detail-dibatalkan" className="btn sm">
              Ya, setujui
            </Link>
          </div>
        </Modal>
        <Modal id="tolak" label="Tolak pembatalan?">
          <h3>Tolak pembatalan?</h3>
          <p>Status pesanan kembali ke Dikonfirmasi dan tanggal sewa tetap terblokir.</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <Link href="/admin/detail-dikonfirmasi" className="btn bahaya sm">
              Ya, tolak
            </Link>
          </div>
        </Modal>
      </main>
    </HalamanAdmin>
  );
}
