// Font Poppins disimpan di proyek (paket @fontsource), jadi tidak bergantung pada Google Fonts.
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
// Urutan impor CSS mengikuti urutan di prototipe HTML (riwayat sebelum index, tambahan sesudahnya).
import "../styles/dasar.css";
import "../styles/riwayat.css";
import "../styles/index.css";
import "../styles/about.css";
import "../styles/katalog.css";
import "../styles/pesan.css";
import "../styles/admin.css";

export const metadata = {
  title: { default: "GantengnyaJatim Group", template: "%s - GantengnyaJatim Group" },
  description: "Sewa mobil dengan sopir atau lepas kunci di Malang Raya.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
