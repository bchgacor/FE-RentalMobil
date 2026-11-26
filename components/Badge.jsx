import { st } from "@/lib/status";

// Label status berwarna. Pakai status (kunci dari API) atau jenis + children untuk label bebas.
export default function Badge({ status, jenis, children }) {
  if (status) return <span className={`badge ${st(status).badge}`}>{st(status).label}</span>;
  return <span className={`badge ${jenis}`}>{children}</span>;
}
