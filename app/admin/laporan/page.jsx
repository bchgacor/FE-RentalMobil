import PanelAdmin from "@/components/admin/PanelAdmin";
import Badge from "@/components/Badge";
import Plat from "@/components/Plat";

export const metadata = { title: "Laporan - Admin GantengnyaJatim Group" };

export default function HalamanLaporan() {
  return (
    <PanelAdmin aktif="laporan">
      <main className="main">
        <header>
          <h1>Laporan Transaksi</h1>
          <p>Semua pendapatan dari pesanan yang sudah dikonfirmasi.</p>
        </header>
        <form className="kartu filter" action="/admin/laporan" method="get">
          <div>
            <label htmlFor="per">Periode (menurut tanggal mulai sewa)</label>
            <select id="per" name="periode" defaultValue="7 hari terakhir">
              <option>7 hari terakhir</option>
              <option>30 hari terakhir</option>
              <option>Bulan ini</option>
              <option>Bulan lalu</option>
            </select>
          </div>
          <div>
            <button className="btn" type="submit">
              Terapkan
            </button>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <a href="/dokumen/laporan.pdf" className="btn garis">
              Unduh PDF
            </a>
          </div>
        </form>
        <span className="saring-target" id="f-berjalan"></span>
        <span className="saring-target" id="f-selesai"></span>
        <span className="saring-target" id="f-dibatalkan"></span>
        <p className="abu">Periode: 29 Okt sampai 4 Nov 2026 (7 hari terakhir).</p>
        <div className="grid grid-3">
          <div className="kartu stat warna">
            <div className="label">Total pendapatan</div>
            <div className="angka">Rp 2.800.000</div>
            <p className="ket">Dikonfirmasi, Berjalan, dan Selesai; sewa ditambah tagihan tambahan</p>
          </div>
          <div className="kartu stat">
            <div className="label">Jumlah transaksi</div>
            <div className="angka">4</div>
          </div>
          <div className="kartu stat">
            <div className="label">Dibatalkan</div>
            <div className="angka">1</div>
          </div>
        </div>
        <nav className="kartu saring jarak" aria-label="Tampilkan status">
          <span className="label">Tampilkan status</span>
          <a href="#" className="semua">
            Semua 4
          </a>
          <a href="#f-berjalan">Berjalan 1</a>
          <a href="#f-selesai">Selesai 2</a>
          <a href="#f-dibatalkan">Dibatalkan 1</a>
        </nav>
        <section className="kartu">
          <h2>Pesanan pada periode ini</h2>
          <div className="tabel-bungkus">
            <table className="tabel">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal mulai</th>
                  <th>Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th className="angka">Sewa</th>
                  <th className="angka">Tagihan tambahan</th>
                  <th className="angka">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="s-berjalan">
                  <td>1</td>
                  <td>3 Nov 2026</td>
                  <td className="tebal">RM-20261101-0004</td>
                  <td>Dimas Prakoso</td>
                  <td>
                    {"Rush TRD · "}
                    <Plat>N 3003 EF</Plat>
                  </td>
                  <td>
                    <Badge jenis="berjalan">Berjalan</Badge>
                  </td>
                  <td className="angka">Rp 1.125.000</td>
                  <td className="angka">-</td>
                  <td className="angka">Rp 1.125.000</td>
                </tr>
                <tr className="s-selesai">
                  <td>2</td>
                  <td>30 Okt 2026</td>
                  <td className="tebal">RM-20261018-0003</td>
                  <td>Eko Prasetyo</td>
                  <td>
                    {"Brio · "}
                    <Plat>N 5005 GH</Plat>
                  </td>
                  <td>
                    <Badge jenis="selesai">Selesai</Badge>
                  </td>
                  <td className="angka">Rp 550.000</td>
                  <td className="angka">-</td>
                  <td className="angka">Rp 550.000</td>
                </tr>
                <tr className="s-selesai">
                  <td>3</td>
                  <td>29 Okt 2026</td>
                  <td className="tebal">RM-20261024-0002</td>
                  <td>Andi Wijaya</td>
                  <td>
                    {"Rush TRD · "}
                    <Plat>N 3003 EF</Plat>
                  </td>
                  <td>
                    <Badge jenis="selesai">Selesai</Badge>
                  </td>
                  <td className="angka">Rp 750.000</td>
                  <td className="angka">Rp 375.000</td>
                  <td className="angka">Rp 1.125.000</td>
                </tr>
                <tr className="s-dibatalkan">
                  <td>4</td>
                  <td>1 Nov 2026</td>
                  <td className="tebal">RM-20261020-0001</td>
                  <td>Budi Santoso</td>
                  <td>Xenia 2018</td>
                  <td>
                    <Badge jenis="dibatalkan">Dibatalkan</Badge>
                  </td>
                  <td className="angka">-</td>
                  <td className="angka">-</td>
                  <td className="angka">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </PanelAdmin>
  );
}
