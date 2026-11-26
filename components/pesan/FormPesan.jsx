"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { inisial, rupiah, tambahHari, tanggal } from "@/lib/format";
import { fotoGaleri } from "@/lib/fotoMobil";
import { useKirim } from "@/lib/useKirim";
import { useKlien } from "@/lib/useKlien";
import { useSesi } from "@/components/sesi/SesiProvider";
import { AlertGalat, GalatKolom, tandai } from "@/components/ui/Galat";
import Galeri from "./Galeri";

const LABEL = { dengan_sopir: "Dengan sopir", lepas_kunci: "Lepas kunci" };
const MALANG_RAYA = ["kota malang", "kabupaten malang", "kota batu"];
const WA = "https://wa.me/6281234567890";
const PESAN_409 = {
  TAGIHAN_BELUM_LUNAS: "Anda masih punya tagihan tambahan yang belum lunas. Lunasi dulu sebelum memesan lagi.",
  PESANAN_MENUNGGU_ADA:
    "Anda masih punya satu pesanan yang menunggu pembayaran. Selesaikan atau batalkan dulu di Riwayat Pemesanan.",
  UNIT_TIDAK_TERSEDIA: "Mobil sudah dipesan pada tanggal tersebut. Pilih tanggal lain atau mobil lain.",
  SOPIR_TIDAK_TERSEDIA: "Sopir tidak tersedia pada tanggal tersebut. Pilih tanggal lain atau sewa lepas kunci.",
};
const hurufAwal = (s) => String(s || "").replace(/^./, (c) => c.toUpperCase());
const bintang = (n) => "★★★★★".slice(0, Math.round(n || 0)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n || 0));

function tglKembali(mulai, durasi) {
  const d = parseInt(durasi, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(mulai) && d >= 1 ? tambahHari(d - 1, mulai) : null;
}

// Halaman pesan satu tipe mobil: detail dari GET /katalog/tipe/{id}, kirim ke POST /pemesanan.
// Next.js menyimpan halaman yang pernah dibuka beserta state-nya; key dari alamat membuat form
// mulai dari isi tautan katalog yang baru diklik.
export default function FormPesan() {
  const q = useSearchParams();
  const { id } = useParams();
  return <IsiFormPesan key={`${id}?${q.toString()}`} />;
}

function IsiFormPesan() {
  const { id } = useParams();
  const router = useRouter();
  const q = useSearchParams();
  const { akun, siap } = useSesi();
  const pelanggan = akun?.role === "user";

  const [jenis, setJenis] = useState(q.get("jenis") === "lepas_kunci" ? "lepas_kunci" : "dengan_sopir");
  const [tgl, setTgl] = useState(q.get("tgl_mulai") || "");
  const [durasi, setDurasi] = useState(q.get("durasi") || "1");
  const [transmisi, setTransmisi] = useState(q.get("transmisi") || "manual");
  const [metode, setMetode] = useState("ambil_di_kantor");
  const [tipe, setTipe] = useState(null);
  const [galatMuat, setGalatMuat] = useState(null);
  const [kota, setKota] = useState(null);
  const { sibuk, galat, setGalat, kirim } = useKirim();

  const klien = useKlien();
  const batas = klien ? { min: tambahHari(1), max: tambahHari(30) } : {};

  // detail tipe; diambil ulang (dengan jeda) saat tanggal atau durasi berubah supaya sisa unit akurat
  useEffect(() => {
    let batal = false;
    const t = setTimeout(
      () => {
        api
          .get(`/katalog/tipe/${encodeURIComponent(id)}`, {
            auth: false,
            query: tgl && durasi ? { tgl_mulai: tgl, durasi } : null,
          })
          .then((res) => !batal && (setTipe(res.data), setGalatMuat(null)))
          .catch((err) => !batal && setGalatMuat(err));
      },
      tipe ? 500 : 0,
    );
    return () => {
      batal = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tgl, durasi]);

  // syarat jaminan lepas kunci bergantung domisili di profil
  useEffect(() => {
    if (pelanggan)
      api.get("/me").then(
        (r) => setKota(r.data.kota || ""),
        () => {},
      );
  }, [pelanggan]);

  // hanya transmisi yang punya tarif yang bisa dipilih
  const pilihanTrans = useMemo(
    () => (tipe ? ["manual", "matic"].filter((x) => tipe.tarif[`lepas_kunci_${x}`]) : []),
    [tipe],
  );
  const trans = pilihanTrans.includes(transmisi) ? transmisi : pilihanTrans[0] || "manual";
  const tarif = !tipe
    ? 0
    : jenis === "dengan_sopir"
      ? tipe.tarif.dengan_sopir || 0
      : tipe.tarif[`lepas_kunci_${trans}`] || 0;
  const dur = parseInt(durasi, 10) || 0;
  const kembali = tglKembali(tgl, durasi);

  if (galatMuat && !tipe) {
    return (
      <div className="alert galat" role="alert">
        {galatMuat.status === 404 ? "Mobil tidak ditemukan. Silakan pilih lagi dari katalog." : galatMuat.message}{" "}
        <Link className="tautan" href="/katalog">
          Kembali ke katalog
        </Link>
      </div>
    );
  }
  if (!tipe) return <p className="memuat">Memuat data mobil...</p>;

  const lk = ["manual", "matic"].filter((x) => tipe.tarif[`lepas_kunci_${x}`]);
  const adaJenisLain = jenis === "dengan_sopir" ? lk.length > 0 : !!tipe.tarif.dengan_sopir;
  const habis = tipe.sisa_unit === 0;
  const malang = kota !== null && MALANG_RAYA.includes(kota.trim().toLowerCase());
  const kembaliKeHasil =
    tgl && durasi ? `/katalog-hasil?${new URLSearchParams({ tgl_mulai: tgl, durasi })}` : "/katalog";

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (jenis === "dengan_sopir" && fd.get("dalam_wilayah") === "tidak") {
      setGalat(
        new Error(
          "Sewa dengan sopir hanya untuk tujuan di Malang dan Batu. Untuk tujuan lain, hubungi admin lewat WhatsApp dulu.",
        ),
      );
      return;
    }
    if (!pelanggan) {
      // simpan pilihan di alamat supaya form terisi lagi setelah login
      const p = new URLSearchParams({ jenis, tgl_mulai: tgl, durasi });
      if (jenis === "lepas_kunci") p.set("transmisi", trans);
      router.push("/masuk?next=" + encodeURIComponent(`/pesan/${id}?${p}`));
      return;
    }
    const data = {
      id_tipe: Number(id),
      jenis_sewa: jenis,
      tgl_mulai: tgl,
      durasi: dur,
      jam_serah: fd.get("jam_serah"),
      catatan: String(fd.get("catatan") || "").trim() || null,
      setuju_syarat: fd.get("setuju_syarat") === "on",
    };
    if (jenis === "dengan_sopir") {
      data.tujuan = String(fd.get("tujuan")).trim();
      data.lokasi_jemput = String(fd.get("lokasi_jemput")).trim();
    } else {
      data.transmisi = trans;
      data.metode_ambil = metode;
      data.lokasi_jemput = metode === "diantar" ? String(fd.get("lokasi_jemput")).trim() : null;
      data.setuju_syarat_jaminan = fd.get("setuju_syarat_jaminan") === "on";
    }
    await kirim(async () => {
      try {
        const res = await api.post("/pemesanan", { json: data });
        const d = res.data;
        try {
          sessionStorage.setItem(
            `snap_${d.id}`,
            JSON.stringify({ token: d.midtrans?.snap_token, batas: d.batas_pembayaran }),
          );
        } catch {}
        router.push(`/user/pesanan/${d.id}/bayar`);
      } catch (err) {
        if (err.status === 409 && PESAN_409[err.code]) err.message = PESAN_409[err.code];
        throw err;
      }
    });
  }

  return (
    <>
      <Link className="kembali" href={kembaliKeHasil}>
        ← Kembali ke katalog
      </Link>
      <div className="dua-kolom">
        <section aria-label="Detail mobil">
          <div className="kotak">
            <Galeri nama={tipe.nama} foto={fotoGaleri(tipe, jenis, trans)} />
            <h2 style={{ marginBottom: "4px" }}>{tipe.nama}</h2>
            <p>
              {jenis === "dengan_sopir" ? (
                tipe.tarif.dengan_sopir ? (
                  <>
                    <b>Dengan sopir:</b> {rupiah(tipe.tarif.dengan_sopir)}/hari.
                  </>
                ) : (
                  <b>Tidak disewakan dengan sopir.</b>
                )
              ) : lk.length ? (
                <>
                  <b>Lepas kunci:</b> {lk.map((x) => `${x} ${rupiah(tipe.tarif[`lepas_kunci_${x}`])}`).join(", ")} per
                  hari.
                </>
              ) : (
                <b>Tidak disewakan lepas kunci.</b>
              )}
              {tipe.sisa_unit != null && ` Sisa ${tipe.sisa_unit} unit pada tanggal ini.`}
            </p>
            <table className="spek-tabel">
              <tbody>
                <tr>
                  <td>Merk</td>
                  <td>{tipe.merk}</td>
                </tr>
                <tr>
                  <td>Kursi</td>
                  <td>{tipe.kursi} kursi</td>
                </tr>
                <tr>
                  <td>Bahan bakar</td>
                  <td>{hurufAwal(tipe.bahan_bakar)}</td>
                </tr>
                <tr>
                  <td>Rating</td>
                  <td>
                    {tipe.rating_rata == null ? "Belum ada ulasan" : `★ ${String(tipe.rating_rata).replace(".", ",")}`}
                  </td>
                </tr>
              </tbody>
            </table>
            {jenis === "dengan_sopir" ? (
              <>
                <div className="grid grid-2">
                  <div>
                    <p className="tebal">Termasuk:</p>
                    <ul className="daftar-tanda">
                      <li>Mobil</li>
                      <li>Sopir</li>
                      <li>BBM</li>
                    </ul>
                  </div>
                  <div>
                    <p className="tebal">Ditanggung penyewa:</p>
                    <ul className="daftar-tanda tidak">
                      <li>Makan sopir</li>
                      <li>Tol</li>
                      <li>Parkir</li>
                      <li>Penginapan sopir</li>
                    </ul>
                  </div>
                </div>
                <p className="kecil abu">Hanya untuk tujuan di Malang dan Batu.</p>
              </>
            ) : (
              <p className="kecil abu">
                Tanpa batas kilometer. Mobil dikembalikan paling lambat tanggal kembali pukul 23.59.
              </p>
            )}
          </div>
          <h3 className="jarak-kecil">Ulasan</h3>
          {tipe.review?.length ? (
            tipe.review.map((r, i) => (
              <div className="kotak ulasan" key={i}>
                <div className="bintang" aria-label={`${r.rating} dari 5`}>
                  {bintang(r.rating)}
                </div>
                <p>{r.komentar}</p>
                <div className="penulis">
                  <span className="avatar">{inisial(r.nama)}</span>
                  <b>{r.nama}</b> · {tanggal(r.tgl_review, true)}
                </div>
              </div>
            ))
          ) : (
            <p className="abu">Belum ada ulasan untuk mobil ini.</p>
          )}
        </section>

        <form className="kotak" onSubmit={onSubmit} aria-label="Form pesan">
          <h2 style={{ fontSize: "22px" }}>Form Pesan</h2>
          <p className="kecil">
            Jenis sewa: <b>{LABEL[jenis]}</b>
            {adaJenisLain && (
              <>
                {" · "}
                <button
                  type="button"
                  className="tautan"
                  style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }}
                  onClick={() => setJenis(jenis === "dengan_sopir" ? "lepas_kunci" : "dengan_sopir")}
                >
                  Ganti ke {LABEL[jenis === "dengan_sopir" ? "lepas_kunci" : "dengan_sopir"].toLowerCase()}
                </button>
              </>
            )}
          </p>
          {siap && !pelanggan && (
            <div className="alert info">
              Anda perlu login sebagai pelanggan untuk memesan. Pilihan Anda tetap tersimpan setelah login.
            </div>
          )}
          <AlertGalat galat={galat} />
          <div className="field baris-2">
            <div>
              <label htmlFor="tgl">Tanggal mulai</label>
              <input
                id="tgl"
                name="tgl_mulai"
                type="date"
                min={batas.min}
                max={batas.max}
                required
                value={tgl}
                onChange={(e) => setTgl(e.target.value)}
                {...tandai(galat, "tgl_mulai")}
              />
              <GalatKolom galat={galat} nama="tgl_mulai" />
            </div>
            <div>
              <label htmlFor="dur">Durasi (hari)</label>
              <input
                id="dur"
                name="durasi"
                type="number"
                min="1"
                max="30"
                step="1"
                required
                value={durasi}
                onChange={(e) => setDurasi(e.target.value)}
                {...tandai(galat, "durasi")}
              />
              <GalatKolom galat={galat} nama="durasi" />
            </div>
          </div>

          {jenis === "lepas_kunci" && (
            <>
              <div className="field">
                <label htmlFor="trans">Transmisi</label>
                <select
                  id="trans"
                  name="transmisi"
                  required
                  value={trans}
                  onChange={(e) => setTransmisi(e.target.value)}
                >
                  {pilihanTrans.map((x) => (
                    <option key={x} value={x}>
                      {hurufAwal(x)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <span className="label-grup">Cara terima unit</span>
                <div className="cek">
                  <input
                    type="radio"
                    id="ambil-kantor"
                    name="metode_ambil"
                    value="ambil_di_kantor"
                    checked={metode === "ambil_di_kantor"}
                    onChange={() => setMetode("ambil_di_kantor")}
                  />
                  <label htmlFor="ambil-kantor">Ambil sendiri di kantor</label>
                </div>
                <div className="cek">
                  <input
                    type="radio"
                    id="diantar"
                    name="metode_ambil"
                    value="diantar"
                    checked={metode === "diantar"}
                    onChange={() => setMetode("diantar")}
                  />
                  <label htmlFor="diantar">Diantar ke alamat saya</label>
                </div>
                {metode === "ambil_di_kantor" && (
                  <p className="hint">
                    Kantor GantengnyaJatim Group, Kota Malang. Alamat lengkap dikirim admin setelah pesanan
                    dikonfirmasi.
                  </p>
                )}
              </div>
            </>
          )}

          <div className="field">
            <label htmlFor="jam">{jenis === "dengan_sopir" ? "Jam jemput" : "Jam serah terima"}</label>
            <input
              id="jam"
              name="jam_serah"
              type="time"
              required
              min={jenis === "lepas_kunci" ? "07:00" : undefined}
              max={jenis === "lepas_kunci" ? "21:00" : undefined}
              {...tandai(galat, "jam_serah")}
            />
            {jenis === "lepas_kunci" && <p className="hint">Antara 07.00 dan 21.00.</p>}
            <GalatKolom galat={galat} nama="jam_serah" />
          </div>

          {jenis === "dengan_sopir" && (
            <>
              <div className="field">
                <label htmlFor="tujuan">Tujuan perjalanan</label>
                <input
                  id="tujuan"
                  name="tujuan"
                  type="text"
                  maxLength={1000}
                  required
                  placeholder="Batu, Malang kota"
                  {...tandai(galat, "tujuan")}
                />
                <p className="hint">Boleh lebih dari satu, pisahkan dengan koma.</p>
                <GalatKolom galat={galat} nama="tujuan" />
              </div>
              <div className="field">
                <label htmlFor="wilayah">Semua tujuan di Malang dan Batu?</label>
                <select id="wilayah" name="dalam_wilayah" required>
                  <option value="ya">Ya</option>
                  <option value="tidak">Tidak</option>
                </select>
                <p className="hint">
                  Jika tidak, hubungi admin lewat{" "}
                  <a className="tautan" href={WA}>
                    WhatsApp
                  </a>
                  .
                </p>
              </div>
            </>
          )}

          {(jenis === "dengan_sopir" || metode === "diantar") && (
            <div className="field">
              <label htmlFor="lokasi">{jenis === "dengan_sopir" ? "Lokasi jemput" : "Alamat pengantaran"}</label>
              <input
                id="lokasi"
                name="lokasi_jemput"
                type="text"
                maxLength={255}
                required
                placeholder="Alamat lengkap"
                {...tandai(galat, "lokasi_jemput")}
              />
              <GalatKolom galat={galat} nama="lokasi_jemput" />
            </div>
          )}

          {jenis === "lepas_kunci" && (
            <>
              <div className="syarat">
                <p className="tebal">Syarat jaminan lepas kunci</p>
                <ol className="daftar huruf">
                  <li>Menyertakan jaminan KTP asli.</li>
                  <li>Menyertakan jaminan SIM C asli.</li>
                  <li>Menyertakan jaminan KTM, KK, NPWP, BPJS, atau paspor.</li>
                  <li>Menyertakan sepeda motor dan STNK (khusus penyewa domisili Malang Raya).</li>
                  <li>
                    Menyertakan bukti booking transportasi umum (pesawat, kereta, atau bus) dan bukti booking hotel
                    (khusus penyewa domisili luar kota).
                  </li>
                </ol>
                {kota !== null ? (
                  <p className="kecil abu">
                    Butir {malang ? "d" : "e"} berlaku karena domisili profil Anda: <b>{kota || "-"}</b>.{" "}
                    <Link className="tautan" href="/user/profil">
                      Ubah di Profil
                    </Link>
                    . Admin memeriksa dokumen fisik saat serah terima.
                  </p>
                ) : (
                  <p className="kecil abu">
                    Butir d untuk domisili Malang Raya, butir e untuk domisili luar kota (diambil dari profil). Admin
                    memeriksa dokumen fisik saat serah terima.
                  </p>
                )}
              </div>
              <div className="cek">
                <input type="checkbox" id="setuju-jaminan" name="setuju_syarat_jaminan" required />
                <label htmlFor="setuju-jaminan">Saya sanggup memenuhi syarat jaminan di atas.</label>
              </div>
            </>
          )}

          <div className="field">
            <label htmlFor="catatan">Catatan (opsional)</label>
            <textarea id="catatan" name="catatan" maxLength={300} />
          </div>
          <div className="cek">
            <input type="checkbox" id="setuju-sk" name="setuju_syarat" required />
            <label htmlFor="setuju-sk">
              Saya menyetujui{" "}
              <Link className="tautan" href="/syarat" target="_blank" rel="noopener">
                Syarat dan Ketentuan
              </Link>
              .
            </label>
          </div>
          <div className="ringkasan" aria-label="Ringkasan biaya">
            <div className="baris">
              <span>Tarif × durasi</span>
              <span>
                {rupiah(tarif)} × {dur || "-"} hari
              </span>
            </div>
            <div className="baris">
              <span>Tanggal kembali</span>
              <span>{kembali ? `${tanggal(kembali, true)}, 23.59` : "-"}</span>
            </div>
            <div className="baris total">
              <span>Total</span>
              <span>{dur ? rupiah(tarif * dur) : "-"}</span>
            </div>
          </div>
          {habis && <div className="alert galat">Semua unit sudah dipesan pada tanggal ini. Pilih tanggal lain.</div>}
          {!tarif && <div className="alert info">Mobil ini tidak disewakan untuk jenis sewa ini.</div>}
          <button className="btn blok" type="submit" disabled={sibuk || habis || !tarif}>
            {sibuk ? "Membuat pesanan..." : "Buat Pesanan"}
          </button>
          <p className="hint kecil abu" style={{ marginTop: "8px" }}>
            Metode pembayaran dipilih di jendela pembayaran Midtrans.
          </p>
        </form>
      </div>
    </>
  );
}
