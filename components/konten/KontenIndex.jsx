import Link from "next/link";

// Isi halaman yang sama untuk pengunjung (base "") dan pelanggan (base "/user").
export default function KontenIndex({ base = "" }) {
  return (
    <>
      <section className="hero">
        <h1>TEMAN PERJALANANMU</h1>
        <h1>
          {"DI "}
          <span>MALANG RAYA</span>
        </h1>
        <p>Sewa mobil dengan sopir atau lepas kunci, siap menemani perjalananmu di Malang, Batu, dan sekitarnya.</p>
        <div className="tombol-penutup">
          <Link href={`${base}/katalog`} className="btn">
            Pesan Sekarang
          </Link>
          <a href="#cara" className="btn garis">
            Cara Pesan
          </a>
        </div>
      </section>
      <main className="wrap">
        <h2>Kenapa Harus Memilih Kami?</h2>
        <div className="grid grid-3">
          <div className="kotak keunggulan">
            <img src="/img/unggul-1.jpg" alt="" />
            <span>Pengalaman sejak 2015</span>
          </div>
          <div className="kotak keunggulan">
            <img src="/img/unggul-2.jpg" alt="" />
            <span>Dipercaya instansi dan kampus</span>
          </div>
          <div className="kotak keunggulan">
            <img src="/img/unggul-3.jpg" alt="" />
            <span>Legalitas jelas</span>
          </div>
          <div className="kotak keunggulan">
            <img src="/img/unggul-4.jpg" alt="" />
            <span>Pesan mudah dari rumah</span>
          </div>
          <div className="kotak keunggulan">
            <img src="/img/unggul-5.png" alt="" />
            <span>Pilihan unit lengkap</span>
          </div>
          <div className="kotak keunggulan">
            <img src="/img/unggul-6.jpg" alt="" />
            <span>Harga transparan</span>
          </div>
        </div>
        <h2 className="jarak">Kata Mereka</h2>
        <div className="geser" tabIndex="0" aria-label="Ulasan pelanggan, geser ke kanan untuk melihat lainnya">
          <div className="kotak ulasan">
            <div className="bintang">★★★★★</div>
            <p>Mobil bersih dan sopir ramah. Perjalanan ke Batu jadi nyaman.</p>
            <div className="penulis">
              <span className="avatar">A</span>
              <b>Andi</b>
            </div>
          </div>
          <div className="kotak ulasan">
            <div className="bintang">★★★★★</div>
            <p>Proses pesan mudah, bayar lewat QRIS langsung terkonfirmasi.</p>
            <div className="penulis">
              <span className="avatar">S</span>
              <b>Sari</b>
            </div>
          </div>
          <div className="kotak ulasan">
            <div className="bintang">★★★★★</div>
            <p>Lepas kunci tanpa batas kilometer, sangat membantu untuk liburan keluarga.</p>
            <div className="penulis">
              <span className="avatar">R</span>
              <b>Rudi</b>
            </div>
          </div>
          <div className="kotak ulasan">
            <div className="bintang">★★★★★</div>
            <p>Unit datang tepat waktu dan kondisinya bersih. Admin cepat membalas WhatsApp.</p>
            <div className="penulis">
              <span className="avatar">D</span>
              <b>Dewi</b>
            </div>
          </div>
          <div className="kotak ulasan">
            <div className="bintang">★★★★★</div>
            <p>Tarifnya jelas, tidak ada biaya tersembunyi. Cocok untuk perjalanan kantor.</p>
            <div className="penulis">
              <span className="avatar">H</span>
              <b>Hendra</b>
            </div>
          </div>
          <div className="kotak ulasan">
            <div className="bintang">★★★★★</div>
            <p>Sopirnya hafal rute dan sopan. Anak-anak senang sepanjang perjalanan.</p>
            <div className="penulis">
              <span className="avatar">M</span>
              <b>Maya</b>
            </div>
          </div>
        </div>
        <p className="kecil abu tengah">Geser ke kanan untuk melihat ulasan lainnya →</p>
        <h2 id="cara" className="jarak">
          Cara Memesan
        </h2>
        <div className="grid grid-4">
          <div className="kotak langkah">
            <span className="nomor">1</span>
            <p>Pilih mobil</p>
          </div>
          <div className="kotak langkah">
            <span className="nomor">2</span>
            <p>Isi pesanan</p>
          </div>
          <div className="kotak langkah">
            <span className="nomor">3</span>
            <p>Bayar (QRIS atau virtual account)</p>
          </div>
          <div className="kotak langkah">
            <span className="nomor">4</span>
            <p>Konfirmasi otomatis setelah bayar</p>
          </div>
        </div>
        <h2 className="jarak">Dua Cara Menyewa</h2>
        <div className="grid grid-2">
          <div className="kotak kotak-gambar">
            <img className="gambar-1" src="/img/dengan-sopir.jpg" alt="Sewa dengan sopir" />
            <div className="isi">
              <h3>Dengan Sopir</h3>
              <p className="sub">Termasuk:</p>
              <ul className="daftar">
                <li>Mobil</li>
                <li>Sopir</li>
                <li>BBM</li>
              </ul>
              <p className="sub">Ditanggung penyewa:</p>
              <ul className="daftar">
                <li>Makan sopir</li>
                <li>Tol</li>
                <li>Parkir</li>
                <li>Penginapan sopir</li>
              </ul>
              <p className="catatan">
                Berlaku untuk tujuan di Malang dan Batu; di luar itu hubungi admin lewat WhatsApp.
              </p>
            </div>
          </div>
          <div className="kotak kotak-gambar">
            <img className="gambar-2" src="/img/lepas-kunci.jpg" alt="Sewa lepas kunci" />
            <div className="isi">
              <h3>Lepas Kunci</h3>
              <p className="sub">Syarat jaminan:</p>
              <ol className="daftar huruf">
                <li>KTP asli</li>
                <li>SIM C asli</li>
                <li>Salah satu: KTM, KK, NPWP, BPJS, atau paspor</li>
                <li>Sepeda motor dan STNK (khusus domisili Malang)</li>
                <li>Bukti booking transportasi umum dan hotel (khusus domisili luar kota)</li>
              </ol>
              <p className="catatan">
                Tanpa batas kilometer. Mobil dikembalikan paling lambat tanggal kembali pukul 23.59.
              </p>
            </div>
          </div>
        </div>
        <div className="kotak jarak">
          <h3>Jam operasional</h3>
          <p style={{ margin: "0" }}>
            07.00 sampai 21.00 setiap hari. Antar gratis sampai batas Tlogomas; di luar itu dikenakan biaya yang
            disepakati lewat WhatsApp.
          </p>
        </div>
        <div className="kotak penutup">
          <h2>Siap berangkat? Pilih mobilnya sekarang.</h2>
          <div className="tombol-penutup">
            <Link href={`${base}/katalog`} className="btn">
              Pesan Sekarang
            </Link>
            <a href="https://wa.me/6281234567890" className="btn garis">
              Tanya Admin
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
