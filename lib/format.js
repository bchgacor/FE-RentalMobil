// Format angka ke rupiah, contoh: 2400000 -> "Rp 2.400.000".
export function rupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}
