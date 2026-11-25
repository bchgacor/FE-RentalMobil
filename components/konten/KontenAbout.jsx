// Isi halaman yang sama untuk pengunjung (base "") dan pelanggan (base "/user").
export default function KontenAbout({ base = "" }) {
  return (
    <>
      <section className="hero banner">
        <h1>
          {"ABOUT "}
          <span>GANTENGNYAJATIMGROUP</span>
        </h1>
      </section>
      <main className="wrap">
        <div className="kotak">
          <p>
            PT GantengnyaJatim Group adalah perusahaan yang bergerak di bidang jasa transportasi, travel pariwisata,
            serta event organizer sejak tahun 2015 yang berlokasi di Kota Malang, Indonesia. Kami berkomitmen memberikan
            pelayanan perjalanan yang berkualitas dengan harga terjangkau bagi pelanggan, baik wisata domestik maupun
            internasional.
          </p>
          <p>
            Layanan kami meliputi transport service, paket wisata domestik dan internasional, pemesanan tiket dan hotel,
            event organizer, pencucian dan salon mobil dan motor, serta catering dan kafe.
          </p>
          <div className="galeri">
            <img src="/img/galeri-1.jpg" alt="Dokumentasi perjalanan 1" />
            <img src="/img/galeri-2.jpg" alt="Dokumentasi perjalanan 2" />
            <img src="/img/galeri-3.jpg" alt="Dokumentasi perjalanan 3" />
            <img src="/img/galeri-4.jpg" alt="Dokumentasi perjalanan 4" />
            <img src="/img/galeri-5.jpg" alt="Dokumentasi perjalanan 5" />
            <img src="/img/galeri-6.jpg" alt="Dokumentasi perjalanan 6" />
          </div>
        </div>
        <div className="grid grid-2 jarak">
          <div className="kotak visimisi">
            <img src="/img/visi.jpg" alt="Visi" />
            <div>
              <h3 className="oranye">Visi</h3>
              <p>
                Menjadi perusahaan tour and travel yang unggul dan maju dengan selalu memberikan kepuasan kepada
                pelanggan melalui produk dan layanan yang berkualitas dan berstandar tinggi.
              </p>
            </div>
          </div>
          <div className="kotak visimisi">
            <img src="/img/misi.jpg" alt="Misi" />
            <div>
              <h3 className="oranye">Misi</h3>
              <ul className="daftar">
                <li>Membangun hubungan jangka panjang dengan pelanggan.</li>
                <li>Menjalin kerja sama di bidang pariwisata dengan pihak terkait.</li>
                <li>Membangun jaringan di komunitas, perusahaan, dan lembaga pemerintah.</li>
                <li>Mengenalkan dunia pariwisata Indonesia kepada masyarakat dalam negeri.</li>
              </ul>
            </div>
          </div>
        </div>
        <h2 className="jarak">Our Partner</h2>
        <div className="partner">
          <div className="partner-jalur">
            <img src="/img/partner/5758.png" alt="Logo mitra" />
            <img src="/img/partner/aftur.png" alt="Logo mitra" />
            <img src="/img/partner/atria-malang.png" alt="Logo mitra" />
            <img src="/img/partner/images.png" alt="Logo mitra" />
            <img src="/img/partner/jambuluwak.png" alt="Logo mitra" />
            <img src="/img/partner/logo-jtp-grup.png" alt="Logo mitra" />
            <img src="/img/partner/logo-juragan-99-01.png" alt="Logo mitra" />
            <img src="/img/partner/logo-krisna-oleh-oleh-khas-bali.png" alt="Logo mitra" />
            <img src="/img/partner/mhs-trans.png" alt="Logo mitra" />
            <img src="/img/partner/mobil-dolan.png" alt="Logo mitra" />
            <img src="/img/partner/nelongso2.png" alt="Logo mitra" />
            <img src="/img/partner/qof.png" alt="Logo mitra" />
            <img src="/img/partner/savana.png" alt="Logo mitra" />
            <img src="/img/partner/toko.png" alt="Logo mitra" />
            <img src="/img/partner/5758.png" alt="" />
            <img src="/img/partner/aftur.png" alt="" />
            <img src="/img/partner/atria-malang.png" alt="" />
            <img src="/img/partner/images.png" alt="" />
            <img src="/img/partner/jambuluwak.png" alt="" />
            <img src="/img/partner/logo-jtp-grup.png" alt="" />
            <img src="/img/partner/logo-juragan-99-01.png" alt="" />
            <img src="/img/partner/logo-krisna-oleh-oleh-khas-bali.png" alt="" />
            <img src="/img/partner/mhs-trans.png" alt="" />
            <img src="/img/partner/mobil-dolan.png" alt="" />
            <img src="/img/partner/nelongso2.png" alt="" />
            <img src="/img/partner/qof.png" alt="" />
            <img src="/img/partner/savana.png" alt="" />
            <img src="/img/partner/toko.png" alt="" />
          </div>
        </div>
        <h2 className="jarak">Management</h2>
        <div className="grid grid-orang">
          <div className="kotak orang">
            <img src="/img/pengurus/m-amin-direktur.png" alt="Foto M Amin" />
            <b>M Amin</b>
            <span className="jabatan">Direktur</span>
          </div>
          <div className="kotak orang">
            <img src="/img/pengurus/indra-cahya-w-manajer-executive.png" alt="Foto Indra Cahya W" />
            <b>Indra Cahya W</b>
            <span className="jabatan">Manajer Executive</span>
          </div>
          <div className="kotak orang">
            <img src="/img/pengurus/m.-dzulfiqar-sekertaris.png" alt="Foto M. Dzulfiqar" />
            <b>M. Dzulfiqar</b>
            <span className="jabatan">Sekretaris</span>
          </div>
          <div className="kotak orang">
            <img src="/img/pengurus/s.prasetiyo-bendahara.png" alt="Foto S. Prasetiyo" />
            <b>S. Prasetiyo</b>
            <span className="jabatan">Bendahara</span>
          </div>
          <div className="kotak orang">
            <img src="/img/pengurus/r-agus-bakhtiar-kordinator-pemasaran.png" alt="Foto R Agus Bakhtiar" />
            <b>R Agus Bakhtiar</b>
            <span className="jabatan">Koordinator Pemasaran</span>
          </div>
          <div className="kotak orang">
            <img src="/img/pengurus/m-rizki-m-kordinator-produksi.png" alt="Foto M Rizki M" />
            <b>M Rizki M</b>
            <span className="jabatan">Koordinator Produksi</span>
          </div>
          <div className="kotak orang">
            <img src="/img/pengurus/setiawan-eko-kordinator-admintrasi.png" alt="Foto Setiawan Eko" />
            <b>Setiawan Eko</b>
            <span className="jabatan">Koordinator Administrasi</span>
          </div>
          <div className="kotak orang">
            <img src="/img/pengurus/a.r.-habibi-operasional.png" alt="Foto A.R. Habibi" />
            <b>A.R. Habibi</b>
            <span className="jabatan">Operasional</span>
          </div>
        </div>
      </main>
    </>
  );
}
