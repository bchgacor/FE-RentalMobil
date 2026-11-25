// Tombol saring status tanpa JavaScript. Klik tombol -> alamat jadi #f-<status>,
// lalu CSS (:target) menyembunyikan baris tabel yang statusnya lain (baris memakai kelas s-<status>).
// Komponen ini harus diletakkan sebelum <section> berisi tabel, dalam induk yang sama.
export default function SaringStatus({ label = "Status", status, jumlah, kelas = "kartu saring" }) {
  return (
    <>
      {status.map((s) => (
        <span key={s.kunci} className="saring-target" id={`f-${s.kunci}`}></span>
      ))}
      <nav className={kelas} aria-label={`Saring ${label.toLowerCase()}`}>
        <span className="label">{label}</span>
        <a className="semua" href="#">
          Semua{jumlah ? ` ${jumlah.semua}` : ""}
        </a>
        {status.map((s) => (
          <a key={s.kunci} href={`#f-${s.kunci}`}>
            {s.label}
            {jumlah ? ` ${jumlah[s.kunci] ?? 0}` : ""}
          </a>
        ))}
      </nav>
    </>
  );
}
