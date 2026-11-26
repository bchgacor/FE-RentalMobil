// Kotak pesan galat di atas form, dan pesan per kolom (422) di bawah isian.

export function AlertGalat({ galat }) {
  if (!galat) return null;
  const adaKolom = galat.errors && Object.keys(galat.errors).length > 0;
  return (
    <div className="alert galat" role="alert">
      {adaKolom ? "Periksa lagi isian yang ditandai." : galat.message || String(galat)}
    </div>
  );
}

export function GalatKolom({ galat, nama }) {
  const pesan = galat?.errors?.[nama];
  if (!pesan) return null;
  return <p className="hint galat-kolom">{[].concat(pesan).join(" ")}</p>;
}

/** Props aria-invalid untuk isian yang punya galat. */
export function tandai(galat, nama) {
  return galat?.errors?.[nama] ? { "aria-invalid": true } : {};
}

export function Memuat({ teks = "Memuat..." }) {
  return (
    <p className="memuat" role="status">
      {teks}
    </p>
  );
}
