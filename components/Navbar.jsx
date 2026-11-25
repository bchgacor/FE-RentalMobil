import Link from "next/link";

// Navbar halaman publik. mode "tamu" untuk pengunjung, "pelanggan" untuk yang sudah masuk.
// aktif: kunci menu yang sedang dibuka (home, about, katalog, riwayat).
const MENU = [
  { kunci: "home", label: "Home", path: "" },
  { kunci: "about", label: "About Us", path: "/about" },
  { kunci: "katalog", label: "Car", path: "/katalog" },
];

export default function Navbar({ mode = "tamu", aktif }) {
  const base = mode === "pelanggan" ? "/user" : "";
  const menu =
    mode === "pelanggan" ? [...MENU, { kunci: "riwayat", label: "Riwayat Pemesanan", path: "/riwayat" }] : MENU;
  return (
    <nav className="nav">
      <Link className="logo" href={base || "/"}>
        <img src="/img/logo.png" alt="Logo GantengnyaJatim Group" /> GANTENGNYAJATIMGROUP
      </Link>
      <input type="checkbox" id="burger-cek" className="burger-cek" aria-hidden="true" />
      <label className="burger" htmlFor="burger-cek" aria-label="Buka menu">
        ☰
      </label>
      <div className="menu" id="menu">
        {menu.map((m) => (
          <Link key={m.kunci} className={m.kunci === aktif ? "aktif" : undefined} href={base + m.path || "/"}>
            {m.label}
          </Link>
        ))}
        {mode === "pelanggan" ? (
          <div className="kanan">
            <Link className="nama-user" href="/user/profil" title="Profil">
              <span className="avatar">BS</span>
              <span>Budi Santoso</span>
            </Link>
            <Link className="btn garis" href="/">
              Keluar
            </Link>
          </div>
        ) : (
          <div className="kanan">
            <Link className="btn garis" href="/masuk">
              Masuk
            </Link>
            <Link className="btn" href="/daftar">
              Daftar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
