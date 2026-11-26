import KartuAkun from "@/components/akun/KartuAkun";
import FormReset from "@/components/akun/FormReset";

export const metadata = { title: "Buat Kata Sandi Baru" };

// Alamat ini dipakai tautan di email dari back-end: FRONTEND_URL/reset-password?token=...&email=...
export default function HalamanResetPassword() {
  return (
    <KartuAkun banner="KATA SANDI BARU" judul="Buat Password Baru">
      <FormReset />
    </KartuAkun>
  );
}
