// Isi halaman yang sama untuk pengunjung (base "") dan pelanggan (base "/user").
export default function KontenFaq({ base = "" }) {
  return (
    <>
      <section className="hero banner">
        <h1>FAQ</h1>
      </section>
      <main className="wrap wrap-sempit">
        <h1>FAQ</h1>
        <details>
          <summary>Bagaimana cara memesan?</summary>
          <p>Pilih tanggal dan durasi di Katalog, pilih mobil, isi Form Pesan, lalu bayar lewat pop-up pembayaran.</p>
        </details>
        <details>
          <summary>Metode pembayaran apa saja?</summary>
          <p>QRIS dan virtual account lewat Midtrans. Metode dipilih di pop-up pembayaran.</p>
        </details>
        <details>
          <summary>Bagaimana jika pembayaran lewat 1 jam?</summary>
          <p>Pembayaran tidak diterima dalam 1 jam, pesanan dibatalkan. Anda dapat memesan ulang.</p>
        </details>
        <details>
          <summary>Bagaimana membatalkan pesanan?</summary>
          <p>
            Sebelum bayar, batalkan langsung. Setelah bayar, ajukan pembatalan sampai H-1 dan Anda diarahkan ke WhatsApp
            admin.
          </p>
        </details>
        <details>
          <summary>Apa saja syarat jaminan?</summary>
          <p>
            Lepas kunci: KTP asli, SIM C asli, salah satu dari KTM/KK/NPWP/BPJS/paspor, dan sepeda motor beserta STNK
            (domisili Malang) atau bukti booking transportasi umum dan hotel (domisili luar kota).
          </p>
        </details>
        <details>
          <summary>Berapa denda keterlambatan?</summary>
          <p>Denda dihitung per hari sebesar harga sewa.</p>
        </details>
        <details>
          <summary>Apakah bisa mengubah jadwal?</summary>
          <p>Batalkan pesanan lalu pesan ulang.</p>
        </details>
        <details>
          <summary>Apakah ada batas kilometer?</summary>
          <p>Tidak ada.</p>
        </details>
      </main>
    </>
  );
}
