import Link from "next/link";

const WA = "https://wa.me/6281234567890";

export default function Footer({ base = "" }) {
  return (
    <footer className="footer">
      <div className="footer-isi">
        <div className="footer-brand">
          <Link className="footer-logo" href={base || "/"}>
            <img src="/img/gantengnyo.png" alt="Logo GantengnyaJatim Group" />
            <span>GANTENGNYAJATIMGROUP</span>
          </Link>
          <p>
            Layanan sewa mobil dengan sopir atau lepas kunci, siap menemani perjalananmu di Malang, Batu, dan
            sekitarnya.
          </p>
          <div className="footer-sosial">
            <a href={WA} aria-label="WhatsApp">
              <img src="/img/ikon-wa.png" alt="WhatsApp" />
            </a>{" "}
            <a href="https://www.instagram.com/" aria-label="Instagram">
              <img src="/img/ig.png" alt="Instagram" />
            </a>
          </div>
        </div>
        <div className="footer-kolom">
          <h4>Perusahaan</h4>
          <Link href={`${base}/about`}>Tentang Kami</Link>
          <Link href={`${base}/syarat`}>Syarat dan Ketentuan</Link>
          <Link href={`${base}/privasi`}>Kebijakan Privasi</Link>
        </div>
        <div className="footer-kolom">
          <h4>Bantuan</h4>
          <Link href={`${base}/faq`}>FAQ</Link>
          <a href={WA}>Hubungi Admin</a>
          <Link href={`${base}/katalog`}>Katalog Mobil</Link>
        </div>
        <div className="footer-kolom">
          <h4>Kontak</h4>
          <p>
            PT GantengnyaJatim Group
            <br />
            Kota Malang, Jawa Timur
          </p>
          <p>
            WhatsApp: 0812-3456-7890
            <br />
            Email: gantengnyajatimgroupindonesia@gmail.com
          </p>
          <p>Jam operasional 07.00 sampai 21.00 setiap hari.</p>
        </div>
      </div>
      <div className="footer-bawah">© 2026 GantengnyaJatim Group. Hak Cipta Dilindungi.</div>
    </footer>
  );
}
