import { GalatKolom, tandai } from "@/components/ui/Galat";

// Isian kata sandi baru: minimal 8 karakter dan mengandung angka (aturan back-end).
export default function FieldSandi({ id, nama, label, hint, galat, autoComplete = "new-password" }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={nama}
        type="password"
        required
        pattern="(?=.*\d).{8,}"
        minLength={8}
        title="Minimal 8 karakter dan mengandung angka"
        autoComplete={autoComplete}
        {...tandai(galat, nama)}
      />
      {hint && <p className="hint">{hint}</p>}
      <GalatKolom galat={galat} nama={nama} />
    </div>
  );
}
