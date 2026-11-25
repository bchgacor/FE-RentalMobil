import Link from "next/link";

// Kerangka halaman admin dengan sidebar (Dashboard, Kelola Mobil, Pesanan, Servis, Laporan).
const MENU = [
  { kunci: "dashboard", label: "Dashboard" },
  { kunci: "kelola-mobil", label: "Kelola Mobil" },
  { kunci: "pesanan", label: "Pesanan" },
  { kunci: "servis", label: "Servis" },
  { kunci: "laporan", label: "Laporan" },
];

export default function PanelAdmin({ aktif, children }) {
  return (
    <div className="h-admin">
      <div className="app">
        <aside className="side">
          <Link className="brand" href="/admin/dashboard">
            <img src="/img/logo.png" alt="" />
            <span>
              Gantengnya Admin<small>Rental Mobil</small>
            </span>
          </Link>
          <nav aria-label="Menu admin">
            {MENU.map((m) => (
              <Link key={m.kunci} className={m.kunci === aktif ? "aktif" : undefined} href={`/admin/${m.kunci}`}>
                {m.label}
              </Link>
            ))}
          </nav>
          <div className="keluar">
            <Link href="/admin/masuk">Keluar</Link>
          </div>
        </aside>
        {children}
      </div>
    </div>
  );
}
