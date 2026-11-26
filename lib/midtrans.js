// Memuat Midtrans Snap.js sekali saja. Client Key diatur di .env.local (NEXT_PUBLIC_MIDTRANS_CLIENT_KEY).
// Server Key TIDAK boleh ada di front-end.
let janji = null;

export function muatSnap() {
  if (typeof window !== "undefined" && window.snap) return Promise.resolve(window.snap);
  const kunci = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  if (!kunci)
    return Promise.reject(
      new Error("Client Key Midtrans belum diisi di .env.local (NEXT_PUBLIC_MIDTRANS_CLIENT_KEY)."),
    );
  if (janji) return janji;
  janji = new Promise((ok, gagal) => {
    const s = document.createElement("script");
    s.src =
      process.env.NEXT_PUBLIC_MIDTRANS_PRODUKSI === "true"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
    s.setAttribute("data-client-key", kunci);
    s.onload = () => ok(window.snap);
    s.onerror = () => {
      janji = null;
      gagal(new Error("Halaman pembayaran Midtrans gagal dimuat. Periksa koneksi internet."));
    };
    document.head.appendChild(s);
  });
  return janji;
}
