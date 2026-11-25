// Isi halaman yang sama untuk pengunjung (base "") dan pelanggan (base "/user").
export default function KontenSyarat({ base = "" }) {
  return (
    <>
      <section className="hero banner">
        <h1>
          {"SYARAT DAN "}
          <span>KETENTUAN</span>
        </h1>
      </section>
      <main className="wrap wrap-sempit teks-panjang">
        <div className="kotak">
          <h1>Syarat dan Ketentuan</h1>
          <p className="abu">Kerangka isi. Teks hukum final menunggu dari perusahaan.</p>
          <h2>1. Definisi dan pihak</h2>
          <p>
            Penyedia adalah PT GantengnyaJatim Group. Penyewa adalah pelanggan yang membuat pesanan melalui situs ini.
          </p>
          <h2>2. Jenis sewa</h2>
          <p>Tersedia sewa dengan sopir (tujuan di Malang dan Batu) dan sewa lepas kunci (tanpa batas kilometer).</p>
          <h2>3. Pembayaran</h2>
          <p>
            Pembayaran lewat Midtrans (QRIS dan virtual account) dengan batas waktu 1 jam. Pesanan yang tidak dibayar
            dalam 1 jam dibatalkan otomatis.
          </p>
          <h2>4. Pembatalan dan refund</h2>
          <p>
            Pesanan yang belum dibayar dapat dibatalkan langsung. Pesanan yang sudah dibayar dapat diajukan pembatalan
            sampai H-1 dengan refund penuh.
          </p>
          <h2>5. Jaminan</h2>
          <p>
            Sewa lepas kunci memerlukan jaminan butir a sampai e sesuai domisili. Jaminan ditahan sampai tagihan lunas.
          </p>
          <h2>6. Denda keterlambatan</h2>
          <p>Denda dihitung per hari sebesar harga sewa.</p>
          <h2>7. Kondisi unit dan kerusakan</h2>
          <p>Unit diperiksa saat serah terima dan saat pengembalian.</p>
          <h2>8. Tanggung jawab</h2>
          <p>Tilang dan kerusakan menjadi tanggung jawab penyewa.</p>
          <h2>9. Antar-jemput dan wilayah</h2>
          <p>
            Jam operasional 07.00 sampai 21.00 setiap hari. Antar gratis sampai batas Tlogomas; di luar itu dikenakan
            biaya yang disepakati lewat WhatsApp.
          </p>
          <h2>10. Perubahan ketentuan</h2>
          <p>Ketentuan dapat berubah. Versi terbaru selalu ada di halaman ini.</p>
        </div>
      </main>
    </>
  );
}
