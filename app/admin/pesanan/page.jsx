import Link from "next/link";
import PanelAdmin from "@/components/admin/PanelAdmin";
import SaringStatus from "@/components/admin/SaringStatus";
import Badge from "@/components/Badge";
import Plat from "@/components/Plat";
import { PESANAN, STATUS, labelStatus } from "@/data/pesanan";

export const metadata = { title: "Pesanan - Admin GantengnyaJatim Group" };

export default function HalamanPesanan() {
  return (
    <PanelAdmin aktif="pesanan">
      <main className="main">
        <header>
          <h1>Pesanan</h1>
          <p>Kelola serah terima dan penyelesaian pesanan.</p>
        </header>
        <SaringStatus status={STATUS} />
        <section className="kartu">
          <div className="tabel-bungkus">
            <table className="tabel">
              <thead>
                <tr>
                  <th>Tanggal mulai</th>
                  <th>Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Unit</th>
                  <th>Jenis</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {PESANAN.map((p) => (
                  <tr key={p.nomor} className={`s-${p.status}`}>
                    <td>{p.mulai}</td>
                    <td className="tebal">{p.nomor}</td>
                    <td>{p.pelanggan}</td>
                    <td>
                      {p.unit}
                      {p.plat && (
                        <>
                          {" · "}
                          <Plat>{p.plat}</Plat>
                        </>
                      )}
                    </td>
                    <td>{p.jenis}</td>
                    <td>
                      <Badge jenis={p.status}>{labelStatus(p.status)}</Badge>
                    </td>
                    <td>
                      <Link className="tautan" href={`/admin/${p.detail}`}>
                        Lihat detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="kecil abu" style={{ margin: "12px 0 0" }}>
            Daftar hanya menampilkan status. Semua tindakan ada di halaman detail pesanan.
          </p>
        </section>
      </main>
    </PanelAdmin>
  );
}
