"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { tutupModal } from "@/lib/modal";
import { useKirim } from "@/lib/useKirim";
import { useMuat } from "@/lib/useMuat";
import { AlertGalat, GalatKolom } from "@/components/ui/Galat";
import Modal from "@/components/Modal";
import TawarPulihkan, { bukaKonfirmasiSimpan } from "./TawarPulihkan";
import { STATUS_UNIT } from "./DaftarMobil";

const DETAIL = [
  "nama_pemilik",
  "status_kepemilikan",
  "no_rangka",
  "no_mesin",
  "no_bpkb",
  "masa_berlaku_stnk",
  "catatan",
];

// Tambah/ubah unit: POST /admin/unit atau PUT /admin/unit/{id} (JSON).
export default function FormUnit() {
  const { id: idParam } = useParams();
  const id = idParam === "baru" ? null : idParam;
  const router = useRouter();
  const q = useSearchParams();
  const {
    data,
    galat: galatMuat,
    awal,
  } = useMuat(async () => {
    const [t, u] = await Promise.all([
      api.get("/admin/tipe"),
      id ? api.get(`/admin/unit/${encodeURIComponent(id)}`) : null,
    ]);
    return { tipe: t.data, u: u?.data || null };
  }, [id]);
  const { sibuk, galat, kirim } = useKirim();

  if (awal) return <p className="memuat">Memuat...</p>;
  if (galatMuat)
    return <div className="alert galat">{galatMuat.status === 404 ? "Unit tidak ditemukan." : galatMuat.message}</div>;
  const { tipe, u } = data;
  const d = u?.detail || {};
  const g = galat?.errors
    ? {
        ...galat,
        errors: Object.fromEntries(
          Object.entries(galat.errors).map(([k, v]) => [k.replace(/^detail\.(\w+)$/, "detail[$1]"), v]),
        ),
      }
    : galat;

  async function onSubmit(e) {
    e.preventDefault();
    tutupModal();
    const form0 = e.currentTarget;
    const f = form0.elements;
    const v = (n) => {
      const x = f[n].value.trim();
      return x === "" ? null : x;
    };
    const body = {
      id_tipe: parseInt(f.id_tipe.value, 10),
      plat_nomor: v("plat_nomor"),
      tahun: parseInt(f.tahun.value, 10),
      warna: v("warna"),
      transmisi: f.transmisi.value,
      km_terakhir: v("km_terakhir") === null ? null : parseInt(f.km_terakhir.value, 10),
      detail: Object.fromEntries(DETAIL.map((k) => [k, v(`detail[${k}]`)])),
    };
    await kirim(async () => {
      if (id) await api.put(`/admin/unit/${id}`, { json: body });
      else await api.post("/admin/unit", { json: body });
      form0.reset();
      router.push("/admin/kelola-mobil?ok=unit");
    });
  }

  return (
    <>
      <div className="kepala-halaman">
        <div>
          <h1>{id ? "Ubah unit mobil" : "Tambah unit mobil"}</h1>
          <span className="abu">Satu unit = satu mobil fisik dengan plat nomornya.</span>
        </div>
      </div>
      {q.get("pulih") && (
        <div className="alert sukses">Unit lama sudah dipulihkan. Periksa datanya lalu simpan bila perlu diubah.</div>
      )}
      {!tipe.length && (
        <div className="alert peringatan">Belum ada tipe mobil. Tambahkan tipe dulu sebelum menambah unit.</div>
      )}
      <form id="form-unit" onSubmit={onSubmit}>
        <AlertGalat galat={g} />
        <TawarPulihkan galat={galat} jenis="unit" />
        <section className="kartu">
          <h2>Data unit</h2>
          {u && (
            <p className="alert info kecil">
              Status sekarang: <b>{STATUS_UNIT[u.status_tampil || u.status] || u.status}</b>. Ubah status lewat tombol
              di halaman Kelola Mobil.
            </p>
          )}
          <div className="kolom-2">
            <div>
              <label htmlFor="tipe">Tipe</label>
              <select id="tipe" name="id_tipe" required defaultValue={u?.id_tipe || q.get("tipe") || ""}>
                <option value="">Pilih tipe</option>
                {tipe.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nama} ({t.merk})
                  </option>
                ))}
              </select>
              <GalatKolom galat={g} nama="id_tipe" />
            </div>
            <div>
              <label htmlFor="plat">Plat nomor</label>
              <input
                id="plat"
                name="plat_nomor"
                type="text"
                required
                maxLength={15}
                placeholder="N 1234 AB"
                autoComplete="off"
                defaultValue={u?.plat_nomor}
                style={{ textTransform: "uppercase" }}
              />
              <p className="hint">Contoh N 1234 AB. Plat nomor harus unik.</p>
              <GalatKolom galat={g} nama="plat_nomor" />
            </div>
            <div>
              <label htmlFor="thn">Tahun</label>
              <input id="thn" name="tahun" type="number" min="1990" max="2100" required defaultValue={u?.tahun} />
              <GalatKolom galat={g} nama="tahun" />
            </div>
            <div>
              <label htmlFor="warna">Warna</label>
              <input id="warna" name="warna" type="text" maxLength={30} required defaultValue={u?.warna} />
              <GalatKolom galat={g} nama="warna" />
            </div>
            <div>
              <label htmlFor="trans">Transmisi</label>
              <select id="trans" name="transmisi" required defaultValue={u?.transmisi || "manual"}>
                <option value="manual">Manual</option>
                <option value="matic">Matic</option>
              </select>
            </div>
            <div>
              <label htmlFor="odo">Odometer (km)</label>
              <input id="odo" name="km_terakhir" type="number" min="0" step="1" defaultValue={u?.km_terakhir ?? ""} />
              <GalatKolom galat={g} nama="km_terakhir" />
            </div>
          </div>
        </section>
        <section className="kartu">
          <h2>Detail internal</h2>
          <p className="ket">Hanya terlihat oleh admin. No. rangka dan no. mesin wajib dan harus unik.</p>
          <div className="kolom-2">
            <Isian id="pemilik" k="nama_pemilik" label="Nama pemilik" d={d} g={g} max={255} />
            <div>
              <label htmlFor="milik">Status kepemilikan</label>
              <select
                id="milik"
                name="detail[status_kepemilikan]"
                defaultValue={d.status_kepemilikan || "milik_perusahaan"}
              >
                <option value="milik_perusahaan">Milik perusahaan</option>
                <option value="titipan">Titipan</option>
              </select>
            </div>
            <Isian id="rangka" k="no_rangka" label="No. rangka" d={d} g={g} max={50} wajib />
            <Isian id="mesin" k="no_mesin" label="No. mesin" d={d} g={g} max={50} wajib />
            <Isian id="bpkb" k="no_bpkb" label="No. BPKB" d={d} g={g} max={50} />
            <Isian id="stnk" k="masa_berlaku_stnk" label="Masa berlaku STNK" d={d} g={g} tipe="date" />
          </div>
          <label htmlFor="cat">Catatan</label>
          <textarea id="cat" name="detail[catatan]" maxLength={2000} defaultValue={d.catatan || ""} />
        </section>
        <div className="baris">
          <button className="btn" type="button" onClick={bukaKonfirmasiSimpan}>
            Simpan
          </button>
          <Link className="btn garis" href="/admin/kelola-mobil">
            Batal
          </Link>
        </div>
      </form>
      <Modal id="konfirmasi" label="Data sudah benar?">
        <h3>Data sudah benar?</h3>
        <p>Unit akan disimpan dan daftar unit diperbarui.</p>
        <div className="baris">
          <a className="btn garis sm" href="#">
            Kembali
          </a>
          <button className="btn sm" type="submit" form="form-unit" disabled={sibuk}>
            {sibuk ? "Menyimpan..." : "Ya, simpan"}
          </button>
        </div>
      </Modal>
    </>
  );
}

function Isian({ id, k, label, d, g, max, wajib, tipe = "text" }) {
  const nama = `detail[${k}]`;
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={nama} type={tipe} maxLength={max} required={wajib} defaultValue={d[k] || ""} />
      <GalatKolom galat={g} nama={nama} />
    </div>
  );
}
