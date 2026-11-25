// Label status berwarna, misalnya <Badge jenis="selesai">Selesai</Badge>.
export default function Badge({ jenis, children }) {
  return <span className={`badge ${jenis}`}>{children}</span>;
}
