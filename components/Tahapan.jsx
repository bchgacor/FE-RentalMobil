import { st } from "@/lib/status";

// Garis tahapan pesanan sesuai status dari back-end.
const TAHAP = ["Menunggu pembayaran", "Dikonfirmasi", "Berjalan", "Selesai"];

export default function Tahapan({ status }) {
  if (status === "dibatalkan") return <p className="abu kecil">Pesanan ini dibatalkan.</p>;
  const selesai = st(status).tahap;
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
