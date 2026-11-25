import { Fragment } from "react";

// Form beri penilaian langsung di kartu riwayat (sesuai Figma). Bintang dipilih dengan radio + CSS.
export default function FormNilai({ nomor }) {
  return (
    <form className="nilai-inline" action="/user/riwayat" method="get" aria-label="Beri penilaian">
      <input type="hidden" name="pesanan" value={nomor} />
      <p className="tebal" style={{ margin: "14px 0 6px" }}>
        Berikan penilaian
      </p>
      <div className="bintang-pilih">
        {/* urutan 5..1 + flex row-reverse supaya bintang yang dipilih dan sebelumnya ikut menyala */}
        {[5, 4, 3, 2, 1].map((n) => (
          <Fragment key={n}>
            <input type="radio" id={`b${n}-${nomor}`} name="bintang" value={n} required={n === 5} />
            <label htmlFor={`b${n}-${nomor}`} title={`${n} bintang`}>
              ★
            </label>
          </Fragment>
        ))}
      </div>
      <textarea name="ulasan" maxLength={1000} placeholder="Ceritakan pengalaman Anda (opsional)" aria-label="Ulasan" />
      <button className="btn sm" type="submit">
        Kirim
      </button>
    </form>
  );
}
