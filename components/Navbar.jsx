"use client";

import Link from "next/link";
import { useSesi } from "@/components/sesi/SesiProvider";
import { inisial } from "@/lib/format";

// Navbar halaman publik. Menu berubah sesuai akun yang sedang login (dibaca dari SesiProvider).
// aktif: kunci menu yang sedang dibuka (home, about, katalog, riwayat).
const MENU = [
  { kunci: "home", label: "Home", href: "/" },
  { kunci: "about", label: "About Us", href: "/about" },
  { kunci: "katalog", label: "Car", href: "/katalog" },
];

export default function Navbar({ aktif }) {
  const { akun, keluar } = useSesi();
  const pelanggan = akun?.role === "user";
  const menu = pelanggan ? [...MENU, { kunci: "riwayat", label: "Riwayat Pemesanan", href: "/user/riwayat" }] : MENU;
  return (
    <nav className="nav">
      <Link className="logo" href="/">
        <img src="/img/logo.png" alt="Logo GantengnyaJatim Group" /> GANTENGNYAJATIMGROUP
      </Link>
      <input type="checkbox" id="burger-cek" className="burger-cek" aria-hidden="true" />
      <label className="burger" htmlFor="burger-cek" aria-label="Buka menu">
        ☰
      </label>
      <div className="menu" id="menu">
        {menu.map((m) => (
          <Link key={m.kunci} className={m.kunci === aktif ? "aktif" : undefined} href={m.href}>
            {m.label}
          </Link>
        ))}
        {pelanggan ? (
          <div className="kanan">
            <Link className="nama-user" href="/user/profil" title={`Profil ${akun.nama}`}>
              <span className="avatar">{inisial(akun.nama)}</span>
              <span>{akun.nama}</span>
            </Link>
            <button className="btn garis" type="button" onClick={keluar}>
              Keluar
            </button>
          </div>
        ) : akun?.role === "admin" ? (
          <div className="kanan">
            <Link className="btn" href="/admin/dashboard">
              Panel admin
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
