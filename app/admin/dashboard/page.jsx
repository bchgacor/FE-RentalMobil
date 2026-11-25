import PanelAdmin from "@/components/admin/PanelAdmin";
import Link from "next/link";
import Badge from "@/components/Badge";

export const metadata = { title: "Dashboard Admin - Admin GantengnyaJatim Group" };

export default function HalamanDashboard() {
  return (
    <PanelAdmin aktif="dashboard">
      <main className="main">
        <header>
          <h1>Dashboard Admin</h1>
          <p>Ringkasan operasional hari ini.</p>
        </header>
        <div className="grid grid-6">
          <div className="kartu stat">
            <div className="label">Menunggu pembayaran</div>
            <div className="angka">1</div>
          </div>
          <div className="kartu stat">
            <div className="label">Dikonfirmasi</div>
            <div className="angka">1</div>
          </div>
          <div className="kartu stat">
            <div className="label">Berjalan</div>
            <div className="angka">1</div>
          </div>
          <div className="kartu stat">
            <div className="label">Pengajuan pembatalan</div>
            <div className="angka">1</div>
          </div>
          <div className="kartu stat">
            <div className="label">Selesai</div>
            <div className="angka">2</div>
          </div>
          <div className="kartu stat">
            <div className="label">Dibatalkan</div>
            <div className="angka">1</div>
          </div>
        </div>
        <div className="grid grid-3 jarak">
          <div className="kartu stat">
            <div className="label">Unit tersedia</div>
            <div className="angka">14</div>
            <p className="ket">siap dipesan</p>
          </div>
          <div className="kartu stat">
            <div className="label">Unit dalam servis</div>
            <div className="angka">2</div>
            <p className="ket">tidak muncul di katalog</p>
          </div>
          <div className="kartu stat warna">
            <div className="label">Pendapatan terkonfirmasi</div>
            <div className="angka">Rp 2.800.000</div>
            <p className="ket">7 hari terakhir (Dikonfirmasi, Berjalan, Selesai)</p>
          </div>
        </div>
        <section className="kartu jarak">
          <h2>Perlu tindakan</h2>
          <p className="ket">Pesanan yang menunggu keputusan atau pengerjaan admin.</p>
          <div className="tabel-bungkus">
            <table className="tabel">
              <thead>
                <tr>
                  <th>Tindakan</th>
                  <th>Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Keterangan</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tebal">Serahkan unit</td>
                  <td>RM-20261103-0010</td>
                  <td>Siti Rahma</td>
                  <td>Mulai 10 Nov 2026</td>
                  <td>
                    <Badge jenis="dikonfirmasi">Dikonfirmasi</Badge>
                  </td>
                  <td>
                    <Link href="/admin/detail-dikonfirmasi" className="tautan">
                      Buka
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="tebal">Selesaikan pesanan</td>
                  <td>RM-20261101-0004</td>
                  <td>Dimas Prakoso</td>
                  <td>Kembali 5 Nov 2026, 23.59</td>
                  <td>
                    <Badge jenis="berjalan">Berjalan</Badge>
                  </td>
                  <td>
                    <Link href="/admin/detail-berjalan" className="tautan">
                      Buka
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="tebal">Proses pengajuan pembatalan</td>
                  <td>RM-20261102-0006</td>
                  <td>Rina Wulandari</td>
                  <td>Diajukan 3 Nov 2026</td>
                  <td>
                    <Badge jenis="pengajuan">Pengajuan pembatalan</Badge>
                  </td>
                  <td>
                    <Link href="/admin/detail-pengajuan-pembatalan" className="tautan">
                      Buka
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="tebal">Tagih tagihan tambahan</td>
                  <td>RM-20261024-0002</td>
                  <td>Andi Wijaya</td>
                  <td>Rp 375.000 belum dibayar</td>
                  <td>
                    <Badge jenis="selesai">Selesai</Badge>
                  </td>
                  <td>
                    <Link href="/admin/detail-selesai" className="tautan">
                      Buka
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="kartu">
          <h2>Pengingat servis</h2>
          <p className="ket">
            {"Status dihitung dari odometer dan jadwal servis. "}
            <Link href="/admin/servis" className="tautan">
              Buka halaman Servis
            </Link>
          </p>
          <div className="tabel-bungkus">
            <table className="tabel">
              <tbody>
                <tr>
                  <td className="tebal">Alphard 2022 · N 6006 IJ</td>
                  <td>Servis berkala lewat 5.000 km</td>
                  <td>
                    <Badge jenis="perlu">Perlu servis</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="tebal">Rush TRD · N 3003 EF</td>
                  <td>Servis berikut pada 50.000 km (tersisa 800 km)</td>
                  <td>
                    <Badge jenis="segera">Segera</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="tebal">Innova Reborn · N 1001 AA</td>
                  <td>Servis berikut pada 70.000 km</td>
                  <td>
                    <Badge jenis="aman">Aman</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </PanelAdmin>
  );
}
