// Pop-up tanpa JavaScript: tampil saat alamat halaman berakhiran #id (CSS :target).
// Tombol tutup cukup berupa tautan ke "#".
export default function Modal({ id, label, kelas, children }) {
  return (
    <div className="modal" id={id} role="dialog" aria-modal="true" aria-label={label}>
      <div className={kelas ? `isi ${kelas}` : "isi"}>{children}</div>
    </div>
  );
}
