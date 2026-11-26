"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { rupiah, tambahHari, tanggal } from "@/lib/format";
import { BAGIAN, BBM, bersihkanForm, galatKeNamaIsian, TAMBAHAN } from "@/lib/labelAdmin";
import { useKirim } from "@/lib/useKirim";
import { useKlien } from "@/lib/useKlien";
import { useMuat } from "@/lib/useMuat";
import { AlertGalat, GalatKolom } from "@/components/ui/Galat";

const KONDISI = ["baik", "lecet", "penyok", "retak", "rusak"];

// Pengembalian dan pemeriksaan unit. Ringkasan biaya dihitung back-end lewat
// POST pengembalian/preview setiap isian berubah, lalu disimpan dengan POST pengembalian.
export default function Pengembalian() {
  const { id } = useParams();
  const router = useRouter();
  const klien = useKlien();
  const {
    data: d,
    galat: galatMuat,
    awal,
  } = useMuat(async () => (await api.get(`/admin/pemesanan/${encodeURIComponent(id)}`)).data, [id]);
  const formRef = useRef(null);
  const [kondisi, setKondisi] = useState({}); // bagian -> kondisi
  const [servis, setServis] = useState(false);
  const [ringkas, setRingkas] = useState(null);
  const [galatRingkas, setGalatRingkas] = useState(null);
  const { sibuk, galat, kirim } = useKirim();
  const tunda = useRef(null);
  const urut = useRef(0);

  useEffect(() => {
    if (d && !d.aksi?.bisa_selesaikan) router.replace(`/admin/pesanan/${id}`);
  }, [d, id, router]);

  function dataForm(tanpaFoto) {
    const form = formRef.current;
    const fd = bersihkanForm(new FormData(form), { tanpaFoto });
    fd.set("unit_perlu_servis", form.elements.unit_perlu_servis.checked ? "1" : "0");
    fd.set("disetujui_penyewa", form.elements.disetujui_penyewa.checked ? "1" : "0");
    return fd;
  }
  function pratinjau() {
    if (!formRef.current) return;
    const no = ++urut.current;
    api.post(`/admin/pemesanan/${id}/pengembalian/preview`, { form: dataForm(true) }).then(
      (res) => {
        if (no !== urut.current) return;
        setRingkas(res.data.ringkasan);
        setGalatRingkas(null);
      },
      (err) => {
        if (no !== urut.current) return;
        setGalatRingkas(
          err.errors
            ? `Lengkapi isian untuk menghitung ringkasan: ${Object.values(err.errors).flat().slice(0, 2).join(" ")}`
            : err.message,
        );
      },
    );
  }
  function jadwalkan(ms) {
    clearTimeout(tunda.current);
    tunda.current = setTimeout(pratinjau, ms);
  }
  useEffect(() => {
    if (d?.aksi?.bisa_selesaikan) jadwalkan(0);
    return () => clearTimeout(tunda.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);

  if (awal) return <p className="memuat">Memuat pesanan...</p>;
  if (galatMuat)
    return (
      <div className="alert galat">{galatMuat.status === 404 ? "Pesanan tidak ditemukan." : galatMuat.message}</div>
    );
  const lk = d.jenis_sewa === "lepas_kunci";
  const st0 = d.serah_terima || {};
  const g = galatKeNamaIsian(galat);
  const sekarang = klien ? new Date() : null;
  const jamSekarang = sekarang
    ? `${String(sekarang.getHours()).padStart(2, "0")}:${String(sekarang.getMinutes()).padStart(2, "0")}`
    : "";
  const adaTagihan = ringkas ? ringkas.tagihan_tambahan > 0 : true;

  async function onSubmit(e) {
    e.preventDefault();
    await kirim(async () => {
      await api.post(`/admin/pemesanan/${d.id}/pengembalian`, { form: dataForm(false) });
      router.push(`/admin/pesanan/${d.id}?ok=selesai`);
    });
  }

  return (
    <>
      <div className="kepala-halaman">
        <div>
          <h1>Pengembalian dan pemeriksaan unit</h1>
          <span className="abu">
            {d.nomor} · {d.pelanggan.nama}. Isi setelah mobil kembali, lalu catat kondisi dan biaya tambahan.
          </span>
        </div>
      </div>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        encType="multipart/form-data"
        onInput={(e) => e.target.type !== "file" && jadwalkan(400)}
        onChange={(e) => e.target.type !== "file" && jadwalkan(200)}
        key={klien ? "klien" : "server"}
      >
        <AlertGalat galat={g} />
        <section className="kartu">
          <div className="kolom-4">
            <Info label="Pelanggan" isi={d.pelanggan.nama} />
            <Info label="Unit" isi={`${d.tipe.nama}${d.plat_nomor ? ` · ${d.plat_nomor}` : ""}`} />
            <Info label="Tarif per hari" isi={rupiah(Math.round(d.total_biaya / d.durasi))} />
            <Info label="Kembali paling lambat" isi={`${tanggal(d.tgl_kembali, true)}, 23.59`} />
          </div>
        </section>
        <section className="kartu">
          <Langkah no="1" judul="Pengembalian" />
          <p className="ket">
            Pelanggan boleh mengembalikan sampai pukul 23.59 tanggal kembali. Lewat itu dihitung 1 hari terlambat, hari
            berikutnya bertambah 1 hari. Denda = tarif per hari × hari terlambat.
          </p>
          <div className="kolom-2">
            <div>
              <label htmlFor="tglk">Tanggal kembali</label>
              <input
                id="tglk"
                name="tgl_kembali"
                type="date"
                required

                defaultValue={klien ? tambahHari(0) : ""}
              />
              <GalatKolom galat={g} nama="tgl_kembali" />
            </div>
            <div>
              <label htmlFor="jamk">Jam kembali</label>
              <input id="jamk" name="jam_kembali" type="time" required defaultValue={jamSekarang} />
              <GalatKolom galat={g} nama="jam_kembali" />
            </div>
          </div>
          {lk && (
            <div className="kolom-2 jarak">
              <div>
                <label htmlFor="odoz">
                  Odometer akhir (km){" "}
                  <span className="kecil abu">
                    awal: {st0.odometer_awal != null ? `${Number(st0.odometer_awal).toLocaleString("id-ID")} km` : "-"}
                  </span>
                </label>
                <input id="odoz" name="odometer_akhir" type="number" min={st0.odometer_awal || 0} step="1" required />
                <GalatKolom galat={g} nama="odometer_akhir" />
              </div>
              <div>
                <label htmlFor="bbmk">
                  BBM saat kembali <span className="kecil abu">awal: {BBM[st0.bbm_awal] || "-"}</span>
                </label>
                <select id="bbmk" name="bbm_akhir" required>
                  {Object.entries(BBM).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="kurang">Biaya kekurangan BBM (Rp)</label>
                <input
                  id="kurang"
                  name="biaya_kekurangan_bbm"
                  type="number"
                  min="0"
                  step="1000"
                  defaultValue="0"
                  required
                />
              </div>
              <div>
                <label htmlFor="bersih">Kebersihan</label>
                <select id="bersih" name="kebersihan" required>
                  <option value="bersih">Bersih</option>
                  <option value="kotor_biasa">Kotor biasa</option>
                  <option value="sangat_kotor">Sangat kotor</option>
                </select>
              </div>
            </div>
          )}
        </section>
        <section className="kartu">
          <Langkah no="2" judul="Pemeriksaan Kondisi" />
          <p className="ket">Isi tiap bagian. Jika tidak baik, biaya perbaikan dan foto wajib diisi.</p>
          <div className="tabel-bungkus">
            <table className="tabel">
              <thead>
                <tr>
                  <th>Bagian</th>
                  <th>Kondisi</th>
                  <th>Biaya perbaikan (Rp)</th>
                  <th>Keterangan</th>
                  <th>Foto</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(BAGIAN).map(([b, n]) => {
                  const rusak = (kondisi[b] || "baik") !== "baik";
                  return (
                    <tr key={b}>
                      <td className="tebal">{n}</td>
                      <td>
                        <select
                          name={`kondisi[${b}]`}
                          aria-label={`Kondisi ${n}`}
                          required
                          value={kondisi[b] || "baik"}
                          onChange={(e) => setKondisi({ ...kondisi, [b]: e.target.value })}
                        >
                          {KONDISI.map((k) => (
                            <option key={k} value={k}>
                              {k[0].toUpperCase() + k.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {rusak ? (
                          <input
                            name={`biaya[${b}]`}
                            type="number"
                            min="0"
                            step="1000"
                            aria-label={`Biaya perbaikan ${n}`}
                            required
                          />
                        ) : (
                          <span className="abu">-</span>
                        )}
                        <GalatKolom galat={g} nama={`biaya[${b}]`} />
                      </td>
                      <td>
                        <input
                          name={`keterangan[${b}]`}
                          type="text"
                          maxLength={255}
                          aria-label={`Keterangan ${n}`}
                          placeholder="Opsional"
                        />
                      </td>
                      <td>
                        {rusak ? (
                          <input
                            name={`foto[${b}]`}
                            type="file"
                            accept="image/jpeg,image/png"
                            aria-label={`Foto ${n}`}
                            required
                          />
                        ) : (
                          <span className="abu">-</span>
                        )}
                        <GalatKolom galat={g} nama={`foto[${b}]`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <section className="kartu">
          <Langkah no="3" judul="Biaya Tambahan Lain" />
          <p className="ket">
            Isi hanya yang berlaku. Tol dan parkir pada sewa dengan sopir dibayar langsung oleh penyewa.
          </p>
          <div className="kolom-4">
            {Object.entries(TAMBAHAN).map(([j, n]) => (
              <div key={j}>
                <label htmlFor={`bt-${j}`}>{n}</label>
                <input id={`bt-${j}`} name={`biaya_tambahan[${j}]`} type="number" min="0" step="1000" placeholder="0" />
                <input
                  name={`keterangan_tambahan[${j}]`}
                  type="text"
                  maxLength={255}
                  placeholder="Keterangan"
                  aria-label={`Keterangan ${n}`}
                  style={{ marginTop: "6px" }}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="kartu">
          <Langkah no="4" judul="Jaminan" />
          <p className="ket">
            Jaminan lepas kunci ditahan selama tagihan tambahan belum dibayar. Setelah tagihan lunas (atau tidak ada
            tagihan), kembalikan jaminan lewat tombol di halaman detail pesanan.
          </p>
        </section>
        <section className="kartu">
          <Langkah no="5" judul="Konfirmasi" />
          <label htmlFor="catat">Catatan admin</label>
          <textarea id="catat" name="catatan_admin" maxLength={2000} />
          <div className="cek">
            <input
              type="checkbox"
              id="servis"
              name="unit_perlu_servis"
              value="1"
              checked={servis}
              onChange={(e) => setServis(e.target.checked)}
            />
            <label htmlFor="servis">Unit perlu servis</label>
          </div>
          {servis && (
            <div className="kolom-2">
              <div>
                <label htmlFor="tingkat">Tingkat servis</label>
                <select id="tingkat" name="servis[tingkat]" required>
                  <option value="ringan">Ringan</option>
                  <option value="sedang">Sedang</option>
                  <option value="perlu_bengkel">Perlu bengkel</option>
                </select>
              </div>
              <div>
                <label htmlFor="perlu">Keperluan servis</label>
                <input id="perlu" name="servis[keperluan]" type="text" maxLength={100} required />
                <GalatKolom galat={g} nama="servis[keperluan]" />
              </div>
            </div>
          )}
          <div className="cek">
            <input type="checkbox" id="setuju" name="disetujui_penyewa" value="1" required />
            <label htmlFor="setuju">Penyewa sudah melihat dan menyetujui hasil pemeriksaan.</label>
          </div>
          {adaTagihan && (
            <div>
              <label htmlFor="byr">Status pembayaran tagihan tambahan</label>
              <select id="byr" name="status_pembayaran_tagihan">
                <option value="belum_dibayar">Belum dibayar</option>
                <option value="tunai">Tunai</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          )}
        </section>
        <section className="kartu">
          <h2>Ringkasan Biaya</h2>
          <p className="ket">Dihitung back-end setiap isian berubah.</p>
          {galatRingkas && <div className="alert peringatan">{galatRingkas}</div>}
          <div className="ringkasan">
            <Baris
              label="Denda keterlambatan"
              isi={
                ringkas
                  ? `${rupiah(ringkas.denda_keterlambatan)}${ringkas.hari_terlambat ? ` (${ringkas.hari_terlambat} hari)` : ""}`
                  : "Rp 0"
              }
            />
            <Baris label="Kekurangan BBM" isi={rupiah(ringkas?.kekurangan_bbm)} />
            <Baris label="Kerusakan" isi={rupiah(ringkas?.biaya_kerusakan)} />
            <Baris label="Biaya lain" isi={rupiah(ringkas?.biaya_lain)} />
            <Baris label="Tagihan tambahan" isi={rupiah(ringkas?.tagihan_tambahan)} total />
            <Baris label="Total akhir (sewa + tagihan)" isi={ringkas ? rupiah(ringkas.total_akhir) : "-"} />
          </div>
          <button className="btn jarak" type="submit" disabled={sibuk}>
            {sibuk ? "Menyimpan..." : "Selesaikan pesanan"}
          </button>
          <p className="kecil abu" style={{ marginTop: "8px" }}>
            Setelah disimpan, pesanan menjadi Selesai dan unit tersedia atau masuk servis.{" "}
            <Link className="tautan" href={`/admin/pesanan/${d.id}`}>
              Batal
            </Link>
          </p>
        </section>
      </form>
    </>
  );
}

function Info({ label, isi }) {
  return (
    <div>
      <span className="kecil abu">{label}</span>
      <br />
      <b>{isi}</b>
    </div>
  );
}
function Langkah({ no, judul }) {
  return (
    <div className="langkah-judul">
      <span className="no">{no}</span>
      <h2>{judul}</h2>
    </div>
  );
}
function Baris({ label, isi, total }) {
  return (
    <div className={total ? "baris total" : "baris"}>
      <span>{label}</span>
      <span>{isi}</span>
    </div>
  );
}
