// Garis tahapan pesanan. selesai: berapa tahap yang sudah dilalui (0-4).
const TAHAP = ["Menunggu pembayaran", "Dikonfirmasi", "Berjalan", "Selesai"];

export default function Tahapan({ selesai }) {
  return (
    <div className="tahap" aria-label="Tahapan pesanan">
      {TAHAP.map((t, i) => (
        <span key={t}>
          <i className={i < selesai ? "on" : undefined}></i>
          {t}
        </span>
      ))}
    </div>
  );
}
