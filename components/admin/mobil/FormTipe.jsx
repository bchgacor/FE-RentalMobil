"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { tutupModal } from "@/lib/modal";
import { useKirim } from "@/lib/useKirim";
import { useMuat } from "@/lib/useMuat";
import { AlertGalat, GalatKolom } from "@/components/ui/Galat";
import Modal from "@/components/Modal";
import TawarPulihkan, { bukaKonfirmasiSimpan } from "./TawarPulihkan";

const TARIF = ["harga_sopir_per_hari", "harga_lepas_kunci_manual", "harga_lepas_kunci_matic"];

// Tambah/ubah tipe: POST /admin/tipe atau POST /admin/tipe/{id} (multipart foto[] maks 3), DELETE /admin/tipe/{id}/foto/{id_foto}.
export default function FormTipe() {
  const { id: idParam } = useParams();
  const id = idParam === "baru" ? null : idParam;
  const router = useRouter();
  const q = useSearchParams();
  const {
    data: t,
    galat: galatMuat,
    awal,
  } = useMuat(async () => (id ? (await api.get(`/admin/tipe/${encodeURIComponent(id)}`)).data : null), [id]);
  const [fotoLama, setFotoLama] = useState(null);
  const [hapusSibuk, setHapusSibuk] = useState(null);
  const { sibuk, galat, setGalat, kirim } = useKirim();

  if (awal) return <p className="memuat">Memuat...</p>;
  if (galatMuat)
    return <div className="alert galat">{galatMuat.status === 404 ? "Tipe tidak ditemukan." : galatMuat.message}</div>;
  const foto = fotoLama ?? t?.foto ?? [];
  const sisa = 3 - foto.length;

  async function hapusFoto(f) {
    setHapusSibuk(f.id);
    try {
      const r = await api.del(`/admin/tipe/${id}/foto/${f.id}`);
      setFotoLama(r.data?.foto || foto.filter((x) => x.id !== f.id));
    } catch (err) {
      setGalat(err);
    } finally {
      setHapusSibuk(null);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    tutupModal();
    const form = e.currentTarget;
    const form0 = form; // dikosongkan setelah tersimpan (halaman disimpan Next.js)
    const fd = new FormData();
    for (const k of ["nama", "merk", "kursi", "bahan_bakar"]) fd.append(k, form.elements[k].value.trim());
    for (const k of TARIF) {
      const v = parseInt(form.elements[k].value, 10);
      if (v > 0) fd.append(k, v); // kosong atau 0 = tidak ditawarkan
    }
    if (!TARIF.some((k) => fd.has(k))) {
      setGalat(
        new ApiError(422, {
          message: "Isi minimal satu tarif.",
          errors: { harga_sopir_per_hari: ["Isi minimal satu tarif."] },
        }),
      );
      return;
    }
    for (let i = 1; i <= 3; i++) {
      const inp = form.elements[`foto-${i}`];
      if (inp && !inp.disabled && inp.files[0]) fd.append("foto[]", inp.files[0]);
    }
    await kirim(async () => {
      await api.post(id ? `/admin/tipe/${id}` : "/admin/tipe", { form: fd });
      form0.reset();
      router.push("/admin/kelola-mobil?ok=tipe");
    });
  }

  const g = galat?.errors
    ? {
        ...galat,
        errors: {
          ...galat.errors,
          "foto-1": galat.errors["foto.0"] || galat.errors.foto,
          "foto-2": galat.errors["foto.1"],
          "foto-3": galat.errors["foto.2"],
        },
      }
    : galat;

  return (
    <>
      <div className="kepala-halaman">
        <div>
          <h1>{id ? "Ubah tipe mobil" : "Tambah tipe mobil"}</h1>
          <span className="abu">Data tipe tampil di katalog pelanggan.</span>
        </div>
      </div>
      {q.get("pulih") && (
        <div className="alert sukses">Tipe lama sudah dipulihkan. Periksa datanya lalu simpan bila perlu diubah.</div>
      )}
      <form id="form-tipe" onSubmit={onSubmit} encType="multipart/form-data">
        <AlertGalat galat={g} />
        <TawarPulihkan galat={galat} jenis="tipe" />
        <section className="kartu">
          <h2>Data tipe</h2>
          <div className="kolom-2">
            <div>
              <label htmlFor="nama">Nama tipe</label>
              <input
                id="nama"
                name="nama"
                type="text"
                maxLength={100}
                required
                placeholder="Innova Reborn"
                defaultValue={t?.nama}
              />
              <GalatKolom galat={g} nama="nama" />
            </div>
            <div>
              <label htmlFor="merk">Merk</label>
              <input
                id="merk"
                name="merk"
                type="text"
                maxLength={100}
                required
                placeholder="Toyota"
                defaultValue={t?.merk}
              />
              <GalatKolom galat={g} nama="merk" />
            </div>
            <div>
              <label htmlFor="kursi">Jumlah kursi</label>
              <input id="kursi" name="kursi" type="number" min="1" max="60" required defaultValue={t?.kursi} />
              <GalatKolom galat={g} nama="kursi" />
            </div>
            <div>
              <label htmlFor="bbm">Bahan bakar</label>
              <select id="bbm" name="bahan_bakar" required defaultValue={t?.bahan_bakar || "bensin"}>
                <option value="bensin">Bensin</option>
                <option value="diesel">Diesel</option>
                <option value="listrik">Listrik</option>
              </select>
            </div>
          </div>
        </section>
        <section className="kartu">
          <h2>Tarif per hari</h2>
          <div className="kolom-3">
            <Tarif id="t1" nama="harga_sopir_per_hari" label="Dengan sopir (Rp)" t={t} g={g} />
            <Tarif id="t2" nama="harga_lepas_kunci_manual" label="Lepas kunci manual (Rp)" t={t} g={g} />
            <Tarif id="t3" nama="harga_lepas_kunci_matic" label="Lepas kunci matic (Rp)" t={t} g={g} />
          </div>
          <p className="hint">
            Isi minimal satu. Kosongkan tarif untuk jenis sewa atau transmisi yang tidak ditawarkan.
          </p>
        </section>
        <section className="kartu">
          <h2>Foto</h2>
          <p className="ket">
            Sampai 3 foto, jpg atau png, maksimal 2 MB. Foto pertama tampil di kartu katalog.{" "}
            {sisa > 0 ? `Bisa menambah ${sisa} foto lagi.` : "Sudah 3 foto. Hapus foto lama untuk menggantinya."}
          </p>
          <div className="baris" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
            {foto.length ? (
              foto.map((f) => (
                <div className="foto-lama" key={f.id}>
                  {}
                  <img className="thumb" src={f.url} alt="Foto tipe" />
                  <button
                    className="btn garis sm"
                    type="button"
                    onClick={() => hapusFoto(f)}
                    disabled={hapusSibuk === f.id}
                  >
                    {hapusSibuk === f.id ? "..." : "Hapus"}
                  </button>
                </div>
              ))
            ) : (
              <p className="abu kecil">Belum ada foto. Katalog memakai gambar bawaan.</p>
            )}
          </div>
          <div className="kolom-3">
            {[1, 2, 3].slice(0, Math.max(sisa, 0)).map((i) => (
              <div key={i}>
                <label htmlFor={`f${i}`}>Foto baru {i}</label>
                <input id={`f${i}`} name={`foto-${i}`} type="file" accept="image/jpeg,image/png" />
                <GalatKolom galat={g} nama={`foto-${i}`} />
              </div>
            ))}
          </div>
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
        <p>Tipe akan disimpan dan katalog diperbarui.</p>
        <div className="baris">
          <a className="btn garis sm" href="#">
            Kembali
          </a>
          <button className="btn sm" type="submit" form="form-tipe" disabled={sibuk}>
            {sibuk ? "Menyimpan..." : "Ya, simpan"}
          </button>
        </div>
      </Modal>
    </>
  );
}

function Tarif({ id, nama, label, t, g }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={nama} type="number" min="0" step="1000" defaultValue={t?.[nama] || ""} />
      <GalatKolom galat={g} nama={nama} />
    </div>
  );
}
