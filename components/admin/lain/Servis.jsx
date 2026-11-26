"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { rupiah, tambahHari, tanggal } from "@/lib/format";
import { tutupModal } from "@/lib/modal";
import { useKirim } from "@/lib/useKirim";
import { useKlien } from "@/lib/useKlien";
import { useMuat } from "@/lib/useMuat";
import { AlertGalat, GalatKolom } from "@/components/ui/Galat";
import { DaftarTerdampak } from "@/components/admin/Konfirmasi";
import Modal from "@/components/Modal";
import Plat from "@/components/Plat";

const TINGKAT = { ringan: "Ringan", sedang: "Sedang", perlu_bengkel: "Perlu bengkel" };
const PENGINGAT = { perlu_servis: ["Perlu servis", "perlu"], segera: ["Segera", "segera"], aman: ["Aman", "aman"] };
const KOMPONEN = ["Oli mesin", "Filter oli", "Filter udara", "Rem", "Ban", "Aki", "Kampas kopling"];
const sedangServis = (s) => s === "dalam_servis" || s === "dalam_perawatan";
const km = (n) => (n == null ? "-" : `${Number(n).toLocaleString("id-ID")} km`);
const tgl = (iso) => (iso ? tanggal(iso, true) : "-");

// Servis unit: GET /admin/servis + /admin/servis/status-unit, POST catat, POST {id}/selesai (multipart), POST {id}/batal, PUT interval.
export default function Servis() {
  const klien = useKlien();
  const {
    data,
    galat: galatMuat,
    awal,
    muatUlang,
  } = useMuat(async () => {
    const [s, u] = await Promise.all([api.get("/admin/servis"), api.get("/admin/servis/status-unit")]);
    return { ...s.data, unit: u.data };
  });
  const [info, setInfo] = useState(null);
  const [pilih, setPilih] = useState(null); // servis yang sedang dipilih untuk selesai/batal
  const [idUnit, setIdUnit] = useState("");
  const [terdampak, setTerdampak] = useState(null);
  const [lain, setLain] = useState(false);
  const catat = useKirim();
  const selesai = useKirim();
  const batal = useKirim();
  const interval = useKirim();

  if (awal) return <p className="memuat">Memuat data servis...</p>;
  if (galatMuat) return <div className="alert galat">{galatMuat.message}</div>;
  const { ringkasan: rk, sedang_servis: sedang, riwayat, unit } = data;
  const uPilih = unit.find((u) => String(u.id_kendaraan) === idUnit);
  const uSelesai = pilih && unit.find((u) => u.id_kendaraan === pilih.id_kendaraan);

  function beres(teks) {
    tutupModal();
    setInfo({ teks, jenis: "sukses" });
    muatUlang();
  }

  async function onCatat(e, konfirmasi = false) {
    e?.preventDefault();
    const f = document.getElementById("form-catat");
    const v = (n) => f.elements[n].value.trim();
    const body = {
      id_kendaraan: parseInt(v("id_kendaraan"), 10),
      jenis_servis: v("jenis_servis"),
      tingkat_servis: v("tingkat_servis"),
      tgl_perawatan: v("tgl_perawatan"),
      bengkel: v("bengkel"),
      km_saat_ini: v("km_saat_ini") === "" ? null : parseInt(v("km_saat_ini"), 10),
      catatan: v("catatan") || null,
      konfirmasi,
    };
    await catat.kirim(async () => {
      try {
        await api.post("/admin/servis", { json: body });
      } catch (err) {
        if (err.code === "PESANAN_TERDAMPAK") {
          setTerdampak(err);
          return;
        }
        if (err.code === "UNIT_SEDANG_DISEWA")
          err.message = "Unit sedang disewa. Catat servis setelah unit dikembalikan.";
        throw err;
      }
      f.reset();
      setIdUnit("");
      setTerdampak(null);
      beres("Servis dicatat. Unit tidak muncul di katalog sampai servis selesai.");
    });
  }

  async function onSelesai(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const komponen = [...f.querySelectorAll('input[name="komponen"]:checked')]
      .map((c) => (c.value === "Lainnya" ? f.elements.komponen_lain.value.trim() : c.value))
      .filter(Boolean);
    await selesai.kirim(async () => {
      if (!komponen.length)
        throw new ApiError(422, {
          message: "Pilih minimal satu komponen.",
          errors: { komponen: ["Pilih minimal satu komponen yang dikerjakan."] },
        });
      const fd = new FormData();
      komponen.forEach((k) => fd.append("komponen[]", k));
      fd.append("biaya_bengkel", f.elements.biaya_bengkel.value);
      fd.append("km_saat_ini", f.elements.km_saat_ini.value);
      await api.post(`/admin/servis/${pilih.id}/selesai`, { form: fd });
      f.reset();
      setLain(false);
      beres("Servis selesai dicatat. Unit kembali tersedia.");
    });
  }

  async function onBatal() {
    await batal.kirim(async () => {
      try {
        await api.post(`/admin/servis/${pilih.id}/batal`);
        beres("Servis dibatalkan. Unit kembali tersedia.");
      } catch (err) {
        tutupModal();
        setInfo({ teks: err.message, jenis: "galat" });
      }
    });
  }

  async function onInterval(e) {
    e.preventDefault();
    const n = parseInt(e.currentTarget.elements.interval_km.value, 10);
    await interval.kirim(async () => {
      const r = await api.put("/admin/servis/interval", { json: { interval_km: n } });
      setInfo({
        teks: `Interval servis disimpan: tiap ${km(r.data.interval_km)}. Jadwal servis dihitung ulang.`,
        jenis: "sukses",
      });
      muatUlang();
    });
  }

  return (
    <>
      {info && (
        <div className={`alert ${info.jenis}`} role="status">
          {info.teks}
        </div>
      )}
      <div className="grid grid-4">
        <Stat label="Unit dalam servis" isi={rk.unit_dalam_servis} />
        <Stat label="Unit tersedia" isi={rk.unit_tersedia} />
        <Stat label="Biaya bengkel" isi={rupiah(rk.total_biaya_bengkel)} />
        <Stat
          label="Biaya ditagih"
          isi={rupiah(rk.total_ditagih)}
          ket={`Ditanggung perusahaan ${rupiah(rk.total_ditanggung_perusahaan)}`}
        />
      </div>
      <section className="kartu jarak">
        <h2>Sedang servis</h2>
        <p className="ket">Unit yang diservis tidak muncul di katalog.</p>
        <div className="tabel-bungkus">
          <table className="tabel">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Masuk</th>
                <th>Jenis</th>
                <th>Tingkat</th>
                <th>Bengkel</th>
                <th>Keterangan</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!sedang.length && (
                <tr>
                  <td colSpan={7} className="memuat">
                    Tidak ada unit yang sedang diservis.
                  </td>
                </tr>
              )}
              {sedang.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Unit s={s} />
                  </td>
                  <td>{tgl(s.tgl_perawatan)}</td>
                  <td>
                    {s.jenis_servis}
                    {s.asal_pesanan && (
                      <>
                        <br />
                        <span className="kecil abu">dari {s.asal_pesanan}</span>
                      </>
                    )}
                  </td>
                  <td>{TINGKAT[s.tingkat_servis] || s.tingkat_servis}</td>
                  <td>{s.bengkel}</td>
                  <td>{s.catatan || "-"}</td>
                  <td className="aksi-baris">
                    <a href="#selesai-servis" className="btn sm" onClick={() => setPilih(s)}>
                      Selesai servis
                    </a>{" "}
                    <a href="#batal-servis" className="tautan" onClick={() => setPilih(s)}>
                      Batal
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="kartu">
        <h2>Pengingat servis</h2>
        <p className="ket">
          Odometer terakhir terisi otomatis dari pengembalian (lepas kunci). Untuk sewa dengan sopir, isi odometer saat
          mencatat servis.
        </p>
        <div className="tabel-bungkus">
          <table className="tabel">
            <thead>
              <tr>
                <th>Unit</th>
                <th className="angka">Odometer</th>
                <th className="angka">Servis terakhir</th>
                <th className="angka">Jadwal berikutnya</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!unit.length && (
                <tr>
                  <td colSpan={5} className="memuat">
                    Belum ada unit.
                  </td>
                </tr>
              )}
              {unit.map((u) => {
                const [label, jenis] = PENGINGAT[u.status] || [u.status, ""];
                return (
                  <tr key={u.id_kendaraan}>
                    <td>
                      <Unit s={u} />
                    </td>
                    <td className="angka">{km(u.km_terakhir)}</td>
                    <td className="angka">{u.servis_terakhir ? tgl(u.servis_terakhir) : "Belum pernah"}</td>
                    <td className="angka">
                      {km(u.km_berikutnya)}
                      {u.tgl_berikutnya && (
                        <>
                          <br />
                          <span className="kecil abu">atau {tgl(u.tgl_berikutnya)}</span>
                        </>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${jenis}`}>
                        {label}
                        {u.status === "segera" && u.sisa_km > 0
                          ? `, ${Number(u.sisa_km).toLocaleString("id-ID")} km lagi`
                          : ""}
                      </span>
                      {sedangServis(u.status_unit) && <span className="kecil abu"> (sedang diservis)</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <form className="filter jarak" onSubmit={onInterval}>
          <div>
            <label htmlFor="interval">Interval servis (km)</label>
            <input
              id="interval"
              name="interval_km"
              type="number"
              min="500"
              step="500"
              defaultValue={rk.interval_km || 5000}
              required
            />
            <GalatKolom galat={interval.galat} nama="interval_km" />
          </div>
          <div>
            <button className="btn garis" type="submit" disabled={interval.sibuk}>
              {interval.sibuk ? "Menyimpan..." : "Simpan interval"}
            </button>
          </div>
        </form>
        {interval.galat && !interval.galat.errors && <div className="alert galat">{interval.galat.message}</div>}
        <p className="hint">Servis berikutnya jatuh tempo sesuai interval km atau 6 bulan, mana yang lebih dulu.</p>
      </section>
      <section className="kartu">
        <h2>Riwayat servis</h2>
        <div className="tabel-bungkus">
          <table className="tabel">
            <thead>
              <tr>
                <th>Masuk</th>
                <th>Unit</th>
                <th>Jenis</th>
                <th>Bengkel</th>
                <th>Komponen</th>
                <th className="angka">Biaya bengkel</th>
                <th className="angka">Ditagih ke penyewa</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!riwayat.length && (
                <tr>
                  <td colSpan={8} className="memuat">
                    Belum ada riwayat servis.
                  </td>
                </tr>
              )}
              {riwayat.map((s) => (
                <tr key={s.id}>
                  <td>{tgl(s.tgl_perawatan)}</td>
                  <td>
                    <Unit s={s} />
                  </td>
                  <td>{s.jenis_servis}</td>
                  <td>{s.bengkel}</td>
                  <td>{s.komponen?.length ? s.komponen.join(", ") : "-"}</td>
                  <td className="angka">{s.biaya_bengkel == null ? "-" : rupiah(s.biaya_bengkel)}</td>
                  <td className="angka">{rupiah(s.biaya_ditagih_ke_penyewa)}</td>
                  <td>
                    <span className={`badge ${s.status === "selesai" ? "selesai" : "dibatalkan"}`}>
                      {s.status === "selesai" ? "Selesai" : "Dibatalkan"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal id="catat-servis" label="Catat servis" kelas="lebar">
        <h3>Catat servis</h3>
        <p className="ket">{'Servis juga dibuat otomatis dari pengembalian bila "unit perlu servis" dicentang.'}</p>
        <form id="form-catat" onSubmit={onCatat}>
          <AlertGalat galat={catat.galat} />
          {terdampak && (
            <>
              <div className="alert peringatan">{terdampak.message}</div>
              <DaftarTerdampak err={terdampak} />
              <button
                className="btn bahaya sm"
                type="button"
                onClick={() => onCatat(null, true)}
                disabled={catat.sibuk}
              >
                Tetap catat servis
              </button>
            </>
          )}
          <div className="kolom-2">
            <div>
              <label htmlFor="unit">Unit</label>
              <select
                id="unit"
                name="id_kendaraan"
                required
                value={idUnit}
                onChange={(e) => {
                  setIdUnit(e.target.value);
                  setTerdampak(null);
                }}
              >
                <option value="">Pilih unit</option>
                {unit.map((u) => (
                  <option key={u.id_kendaraan} value={u.id_kendaraan} disabled={sedangServis(u.status_unit)}>
                    {u.plat_nomor} · {u.unit}
                    {sedangServis(u.status_unit) ? " (sedang diservis)" : ""}
                  </option>
                ))}
              </select>
              <GalatKolom galat={catat.galat} nama="id_kendaraan" />
            </div>
            <div>
              <label htmlFor="jenis">Jenis servis</label>
              <input
                id="jenis"
                name="jenis_servis"
                type="text"
                maxLength={100}
                required
                list="jenis-umum"
                placeholder="Servis berkala"
              />
              <datalist id="jenis-umum">
                <option value="Servis berkala"></option>
                <option value="Perbaikan"></option>
                <option value="Ganti ban"></option>
                <option value="Ganti oli"></option>
              </datalist>
              <GalatKolom galat={catat.galat} nama="jenis_servis" />
            </div>
            <div>
              <label htmlFor="tingkat">Tingkat</label>
              <select id="tingkat" name="tingkat_servis" required>
                {Object.entries(TINGKAT).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tgl">Tanggal masuk</label>
              <input
                id="tgl"
                name="tgl_perawatan"
                type="date"
                required
                defaultValue={klien ? tambahHari(0) : ""}
                key={klien ? "k" : "s"}
              />
              <GalatKolom galat={catat.galat} nama="tgl_perawatan" />
            </div>
            <div>
              <label htmlFor="bengkel">Bengkel</label>
              <input id="bengkel" name="bengkel" type="text" maxLength={255} required />
              <GalatKolom galat={catat.galat} nama="bengkel" />
            </div>
            <div>
              <label htmlFor="odo">Odometer (km)</label>
              <input
                id="odo"
                name="km_saat_ini"
                type="number"
                min={uPilih?.km_terakhir || 0}
                step="1"
                key={idUnit}
                defaultValue={uPilih?.km_terakhir ?? ""}
              />
              <p className="hint">
                Tidak boleh lebih kecil dari odometer terakhir
                {uPilih?.km_terakhir != null ? ` (${km(uPilih.km_terakhir)})` : ""}.
              </p>
              <GalatKolom galat={catat.galat} nama="km_saat_ini" />
            </div>
          </div>
          <label htmlFor="ket">Catatan</label>
          <textarea id="ket" name="catatan" maxLength={2000} />
          <div className="baris">
            <a href="#" className="btn garis sm">
              Batal
            </a>
            <button className="btn sm" type="submit" disabled={catat.sibuk}>
              {catat.sibuk ? "Menyimpan..." : "Catat servis"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal id="selesai-servis" label="Selesai servis" kelas="lebar">
        <h3>Selesai servis</h3>
        {pilih ? (
          <>
            <p className="ket">
              <Unit s={pilih} /> · masuk {tgl(pilih.tgl_perawatan)} · {pilih.bengkel} · {pilih.jenis_servis}
            </p>
            {pilih.asal_pesanan && (
              <p className="kecil abu">
                Servis ini berasal dari pengembalian pesanan {pilih.asal_pesanan}. Biaya yang ditagih ke penyewa
                dihitung otomatis oleh sistem.
              </p>
            )}
            <form onSubmit={onSelesai} key={pilih.id}>
              <AlertGalat galat={selesai.galat} />
              <span className="label-grup">Komponen yang dikerjakan</span>
              <div className="kolom-2">
                {KOMPONEN.concat("Lainnya").map((k, i) => (
                  <div className="cek" key={k}>
                    <input
                      type="checkbox"
                      id={`c${i + 1}`}
                      name="komponen"
                      value={k}
                      onChange={k === "Lainnya" ? (e) => setLain(e.target.checked) : undefined}
                    />
                    <label htmlFor={`c${i + 1}`}>{k}</label>
                  </div>
                ))}
              </div>
              <GalatKolom galat={selesai.galat} nama="komponen" />
              {lain && (
                <input
                  id="c8-teks"
                  name="komponen_lain"
                  type="text"
                  maxLength={255}
                  required
                  placeholder="Sebutkan komponen lainnya"
                  aria-label="Komponen lainnya"
                />
              )}
              <div className="kolom-2">
                <div>
                  <label htmlFor="bk">Biaya bengkel (Rp)</label>
                  <input id="bk" name="biaya_bengkel" type="number" min="0" step="1000" required />
                  <GalatKolom galat={selesai.galat} nama="biaya_bengkel" />
                </div>
                <div>
                  <label htmlFor="odo2">Odometer (km)</label>
                  <input
                    id="odo2"
                    name="km_saat_ini"
                    type="number"
                    min={uSelesai?.km_terakhir || 0}
                    step="1"
                    required
                    defaultValue={uSelesai?.km_terakhir ?? ""}
                  />
                  {uSelesai?.km_terakhir != null && (
                    <p className="hint">Odometer terakhir {km(uSelesai.km_terakhir)}.</p>
                  )}
                  <GalatKolom galat={selesai.galat} nama="km_saat_ini" />
                </div>
              </div>
              <p className="kecil abu">Biaya yang ditagih ke penyewa dan jadwal servis berikutnya dihitung sistem.</p>
              <div className="baris">
                <a href="#" className="btn garis sm">
                  Batal
                </a>
                <button className="btn sm" type="submit" disabled={selesai.sibuk}>
                  {selesai.sibuk ? "Menyimpan..." : "Selesai servis"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <p>Pilih servis dari tabel Sedang servis.</p>
        )}
      </Modal>

      <Modal id="batal-servis" label="Batalkan servis?">
        <h3>Batalkan servis?</h3>
        <p>
          {pilih ? (
            <>Servis {pilih.plat_nomor} dibatalkan dan unit kembali Tersedia.</>
          ) : (
            "Servis yang dicatat dibatalkan dan unit kembali Tersedia."
          )}
        </p>
        <div className="baris">
          <a href="#" className="btn garis sm">
            Kembali
          </a>
          <button type="button" className="btn bahaya sm" onClick={onBatal} disabled={batal.sibuk || !pilih}>
            {batal.sibuk ? "Membatalkan..." : "Ya, batalkan"}
          </button>
        </div>
      </Modal>
    </>
  );
}

function Stat({ label, isi, ket }) {
  return (
    <div className="kartu stat">
      <div className="label">{label}</div>
      <div className="angka">{isi}</div>
      {ket && <p className="ket">{ket}</p>}
    </div>
  );
}

function Unit({ s }) {
  const nama = String(s.unit || "")
    .replace(s.plat_nomor, "")
    .trim();
  return (
    <>
      <Plat>{s.plat_nomor}</Plat> {nama}
    </>
  );
}
