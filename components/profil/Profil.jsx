"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { api, ApiError, sesi } from "@/lib/api";
import { inisial } from "@/lib/format";
import { tutupModal } from "@/lib/modal";
import { useKirim } from "@/lib/useKirim";
import { useMuat } from "@/lib/useMuat";
import Modal from "@/components/Modal";
import FieldDomisili from "@/components/akun/FieldDomisili";
import FieldSandi from "@/components/akun/FieldSandi";
import { AlertGalat, GalatKolom, tandai } from "@/components/ui/Galat";

const MALANG_RAYA = ["kota malang", "kabupaten malang", "kota batu"];

// Profil pelanggan: GET/POST /profil (multipart, foto opsional) dan PUT /profil/password.
export default function Profil() {
  const { data, galat, awal } = useMuat(async () => (await api.get("/profil")).data, []);
  if (awal) return <p className="memuat">Memuat profil...</p>;
  if (galat) return <div className="alert galat">{galat.message}</div>;
  return (
    <>
      <FormProfil awal={data} />
      <FormSandi />
    </>
  );
}

function FormProfil({ awal }) {
  const formRef = useRef(null);
  const [profil, setProfil] = useState(awal);
  const [pratinjau, setPratinjau] = useState(null);
  const [hapusFoto, setHapusFoto] = useState(false);
  const [kota, setKota] = useState(awal.kota || "");
  const [ok, setOk] = useState(false);
  const [versi, setVersi] = useState(0); // memaksa isian kembali ke data terbaru setelah disimpan
  const { sibuk, galat, setGalat, kirim } = useKirim();
  const malang = MALANG_RAYA.includes(kota.trim().toLowerCase());
  const foto = hapusFoto ? null : pratinjau || profil.foto;

  function pilihFoto(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      setGalat(new ApiError(422, { errors: { foto: ["Foto maksimal 2 MB."] } }));
      e.target.value = "";
      return;
    }
    setPratinjau(URL.createObjectURL(f));
    setHapusFoto(false);
  }

  async function simpan(e) {
    e.preventDefault();
    tutupModal();
    setOk(false);
    const form = formRef.current;
    const fd = new FormData();
    for (const k of ["nama", "no_hp", "provinsi", "kota"]) fd.append(k, String(form.elements[k].value).trim());
    if (form.elements.foto.files[0] && !hapusFoto) fd.append("foto", form.elements.foto.files[0]);
    if (hapusFoto) fd.append("hapus_foto", "1");
    await kirim(async () => {
      const r = await api.post("/profil", { form: fd });
      setProfil(r.data);
      setPratinjau(null);
      setHapusFoto(false);
      setVersi((v) => v + 1);
      sesi.ubahAkun({ nama: r.data.nama }); // nama di navbar ikut berubah
      setOk(true);
    });
  }

  return (
    <div className="kotak">
      {ok && (
        <div className="alert sukses" role="status">
          Profil berhasil disimpan.
        </div>
      )}
      <form id="form-profil" ref={formRef} onSubmit={simpan} key={versi}>
        <AlertGalat galat={galat} />
        <div className="baris" style={{ marginBottom: "16px" }}>
          {foto ? (
            <img src={foto} alt="Foto profil" className="foto-profil" />
          ) : (
            <span className="foto-profil inisial" aria-label="Belum ada foto">
              {inisial(profil.nama)}
            </span>
          )}
          <div className="field" style={{ margin: "0" }}>
            <label htmlFor="foto">Ganti Foto</label>
            <input id="foto" name="foto" type="file" accept="image/jpeg,image/png,image/webp" onChange={pilihFoto} />
            <p className="hint">jpg, png, atau webp, maksimal 2 MB.</p>
            <GalatKolom galat={galat} nama="foto" />
            {(profil.foto || pratinjau) && (
              <div className="cek">
                <input
                  type="checkbox"
                  id="hapus-foto"
                  checked={hapusFoto}
                  onChange={(e) => setHapusFoto(e.target.checked)}
                />
                <label htmlFor="hapus-foto">Hapus foto</label>
              </div>
            )}
          </div>
        </div>
        <div className="field">
          <label htmlFor="nama">Nama lengkap</label>
          <input
            id="nama"
            name="nama"
            type="text"
            maxLength={100}
            required
            defaultValue={profil.nama}
            {...tandai(galat, "nama")}
          />
          <GalatKolom galat={galat} nama="nama" />
        </div>
        <div className="field">
          <span className="label">Email</span>
          <p style={{ margin: "0" }}>{profil.email}</p>
          <p className="hint">Email tidak bisa diubah.</p>
        </div>
        <div className="field">
          <label htmlFor="wa">Nomor WhatsApp</label>
          <input
            id="wa"
            name="no_hp"
            type="tel"
            required
            pattern="(08|\+62)[0-9]{8,13}"
            title="Nomor Indonesia, diawali 08 atau +62"
            defaultValue={profil.no_hp || ""}
            {...tandai(galat, "no_hp")}
          />
          <GalatKolom galat={galat} nama="no_hp" />
        </div>
        <div onInput={(e) => e.target.name === "kota" && setKota(e.target.value)}>
          <FieldDomisili galat={galat} provinsi={profil.provinsi || ""} kota={profil.kota || ""} />
        </div>
        <p className="kecil abu" style={{ marginTop: "-6px" }}>
          {kota
            ? `Domisili terhitung ${malang ? "Malang Raya: jaminan lepas kunci memakai sepeda motor dan STNK." : "luar Malang Raya: jaminan lepas kunci memakai bukti booking transportasi dan hotel."}`
            : "Menentukan syarat jaminan untuk sewa lepas kunci."}
        </p>
        <div className="baris">
          <button
            type="button"
            className="btn"
            disabled={sibuk}
            onClick={() => formRef.current.reportValidity() && (window.location.hash = "konfirmasi-simpan")}
          >
            {sibuk ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link href="/user/riwayat" className="btn garis">
            Batal
          </Link>
        </div>
      </form>
      <Modal id="konfirmasi-simpan" label="Konfirmasi simpan">
        <h3>Simpan perubahan?</h3>
        <p>Yakin simpan perubahan?</p>
        <div className="baris">
          <a href="#" className="btn garis sm">
            Kembali
          </a>
          <button className="btn sm" type="submit" form="form-profil">
            Ya, simpan
          </button>
        </div>
      </Modal>
    </div>
  );
}

function FormSandi() {
  const { sibuk, galat, setGalat, kirim } = useKirim();
  const [ok, setOk] = useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setOk(false);
    if (fd.get("password_baru") !== fd.get("konfirmasi")) {
      setGalat(new ApiError(422, { errors: { konfirmasi: ["Harus sama dengan kata sandi baru."] } }));
      return;
    }
    await kirim(async () => {
      await api.put("/profil/password", {
        json: {
          password_lama: fd.get("password_lama"),
          password_baru: fd.get("password_baru"),
          konfirmasi: fd.get("konfirmasi"),
        },
      });
      form.reset();
      setOk(true);
    });
  }
  return (
    <div className="kotak">
      <h3>Ganti kata sandi</h3>
      <p className="kecil abu">Setelah diganti, akun ini otomatis keluar dari perangkat lain.</p>
      {ok && (
        <div className="alert sukses" role="status">
          Kata sandi berhasil diganti.
        </div>
      )}
      <form onSubmit={onSubmit}>
        <AlertGalat galat={galat} />
        <div className="field">
          <label htmlFor="lama">Kata sandi lama</label>
          <input
            id="lama"
            name="password_lama"
            type="password"
            required
            autoComplete="current-password"
            {...tandai(galat, "password_lama")}
          />
          <GalatKolom galat={galat} nama="password_lama" />
        </div>
        <FieldSandi
          id="baru"
          nama="password_baru"
          label="Kata sandi baru"
          hint="Minimal 8 karakter dan ada angka."
          galat={galat}
        />
        <FieldSandi id="baru2" nama="konfirmasi" label="Konfirmasi kata sandi baru" galat={galat} />
        <button className="btn" type="submit" disabled={sibuk}>
          {sibuk ? "Menyimpan..." : "Simpan Kata Sandi"}
        </button>
      </form>
    </div>
  );
}
