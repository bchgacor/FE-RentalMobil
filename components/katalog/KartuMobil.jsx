import Link from "next/link";
import { rupiah } from "@/lib/format";
import { fotoKartu } from "@/lib/fotoMobil";

const hurufAwal = (s) => String(s || "").replace(/^./, (c) => c.toUpperCase());

// Satu kartu di daftar katalog. tipe = data GET /katalog/tipe, jenis = dengan_sopir | lepas_kunci.
export default function KartuMobil({ tipe, jenis, cari }) {
  const trans = cari.transmisi;
  const query = new URLSearchParams({ jenis, tgl_mulai: cari.tgl_mulai, durasi: cari.durasi });
  if (jenis === "lepas_kunci" && trans) query.set("transmisi", trans);

  let harga;
  if (jenis === "dengan_sopir") {
    harga = (
      <>
        <b className="oranye">{rupiah(tipe.tarif.dengan_sopir)}</b>/hari
      </>
    );
  } else if (trans) {
    harga = (
      <>
        <b className="oranye">{rupiah(tipe.tarif[`lepas_kunci_${trans}`])}</b>/hari ({hurufAwal(trans)})
      </>
    );
  } else {
    harga = (
      <>
        {tipe.tarif.lepas_kunci_manual ? (
          <>
            Manual <b className="oranye">{rupiah(tipe.tarif.lepas_kunci_manual)}</b>
          </>
        ) : null}
        {tipe.tarif.lepas_kunci_manual && tipe.tarif.lepas_kunci_matic ? " · " : null}
        {tipe.tarif.lepas_kunci_matic ? (
          <>
            Matic <b className="oranye">{rupiah(tipe.tarif.lepas_kunci_matic)}</b>
          </>
        ) : null}
        /hari
      </>
    );
  }

  return (
    <div className="kotak mobil">
      <img src={fotoKartu(tipe, jenis, trans)} alt={tipe.nama} loading="lazy" />
      <div className="nama">{tipe.nama}</div>
      <div className="isi">
        {tipe.merk} · {tipe.kursi} kursi · {hurufAwal(tipe.bahan_bakar)}
        <br />
        {harga}
        <br />
        {tipe.rating_rata == null ? "Belum ada ulasan" : `★ ${String(tipe.rating_rata).replace(".", ",")}`} · Sisa{" "}
        {tipe.sisa_unit} unit
        <br />
        <br />
        <Link className="btn" href={`/pesan/${tipe.id}?${query}`}>
          Pesan
        </Link>
      </div>
    </div>
  );
}
