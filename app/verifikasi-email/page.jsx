import KartuAkun from "@/components/akun/KartuAkun";
import Verifikasi from "@/components/akun/Verifikasi";

export const metadata = { title: "Verifikasi Email" };

// Alamat ini dipakai tautan di email dari back-end: FRONTEND_URL/verifikasi-email?token=...
export default function HalamanVerifikasiEmail() {
  return (
    <KartuAkun banner="VERIFIKASI EMAIL" judul="Verifikasi email">
      <Verifikasi />
    </KartuAkun>
  );
}
