// Isi halaman yang sama untuk pengunjung (base "") dan pelanggan (base "/user").
export default function KontenPrivasi({ base = "" }) {
  return (
    <>
      <section className="hero banner">
        <h1>
          {"KEBIJAKAN "}
          <span>PRIVASI</span>
        </h1>
      </section>
      <main className="wrap wrap-sempit teks-panjang">
        <div className="kotak">
          <h1>Kebijakan Privasi</h1>
          <p className="abu">Kerangka isi. Teks final menunggu dari perusahaan.</p>
          <h2>1. Data yang dikumpulkan</h2>
          <p>Nama, email, nomor WhatsApp, domisili, foto profil, riwayat pesanan, dan data masuk dengan Google.</p>
          <h2>2. Tujuan penggunaan</h2>
          <p>Memproses pesanan, pembayaran, serah terima unit, dan komunikasi layanan.</p>
          <h2>3. Penyimpanan</h2>
          <p>Data disimpan di server perusahaan dengan pembatasan akses.</p>
          <h2>4. Hak pengguna</h2>
          <p>Pengguna dapat meminta penghapusan akun.</p>
          <h2>5. Kontak</h2>
          <p>Hubungi kami lewat WhatsApp atau email yang tertera di bagian bawah halaman.</p>
        </div>
      </main>
    </>
  );
}
