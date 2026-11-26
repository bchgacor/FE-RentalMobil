"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { rupiah, tanggal } from "@/lib/format";
import { bersihkanForm, DOMISILI, galatKeNamaIsian } from "@/lib/labelAdmin";
import { useKirim } from "@/lib/useKirim";
import { useMuat } from "@/lib/useMuat";
import { AlertGalat, GalatKolom } from "@/components/ui/Galat";

const FOTO = "image/jpeg,image/png";

// Serah terima unit: GET unit-tersedia, POST /admin/pemesanan/{id}/serah-terima (multipart, dengan foto jaminan).
export default function SerahTerima() {
  const { id } = useParams();
  const router = useRouter();
  const {
    data,
    galat: galatMuat,
    awal,
  } = useMuat(async () => {
    const [d, u] = await Promise.all([
      api.get(`/admin/pemesanan/${encodeURIComponent(id)}`),
      api.get(`/admin/pemesanan/${encodeURIComponent(id)}/unit-tersedia`),
    ]);
    return { d: d.data, unit: u.data.unit || [] };
  }, [id]);
  const [domisili, setDomisili] = useState(null);
  const { sibuk, galat, kirim } = useKirim();

  useEffect(() => {
    if (data && !data.d.aksi?.bisa_serahkan) router.replace(`/admin/pesanan/${id}`);
  }, [data, id, router]);

  if (awal) return <p className="memuat">Memuat pesanan...</p>;
  if (galatMuat)
    return (
      <div className="alert galat">{galatMuat.status === 404 ? "Pesanan tidak ditemukan." : galatMuat.message}</div>
    );
  const { d, unit } = data;
  const lk = d.jenis_sewa === "lepas_kunci";
  const dom = domisili || d.domisili || "malang_raya";
  const malang = dom === "malang_raya";
  const g = galatKeNamaIsian(galat);

  async function onSubmit(e) {
    e.preventDefault();
    const fd = bersihkanForm(new FormData(e.currentTarget));
    if (lk && fd.get("domisili_disesuaikan") === d.domisili) fd.delete("domisili_disesuaikan");
    await kirim(async () => {
      await api.post(`/admin/pemesanan/${d.id}/serah-terima`, { form: fd });
      router.push(`/admin/pesanan/${d.id}?ok=serah`);
    });
  }

  return (
    <>
      <div className="kepala-halaman">
        <div>
          <h1>Serah Terima Unit</h1>
          <span className="abu">
            {d.nomor} · {d.pelanggan.nama}.{" "}
            {lk ? "Catat jaminan dan kondisi awal, lalu serahkan unit." : "Pilih unit dan catat kondisi awal."} Status
            pesanan menjadi Berjalan.
          </span>
        </div>
      </div>
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <AlertGalat galat={g} />
        <section className="kartu">
          <h2>Data Pesanan</h2>
          <div className="kolom-4">
            <Info label="Pelanggan" isi={d.pelanggan.nama} />
            <Info label="Tipe" isi={`${d.tipe.nama}${d.transmisi ? ` (${d.transmisi})` : ""}`} />
            <Info label="Jenis" isi={lk ? "Lepas kunci" : "Dengan sopir"} />
            <Info label="Tarif per hari" isi={rupiah(Math.round(d.total_biaya / d.durasi))} />
          </div>
          <div className="kolom-4 jarak">
            <Info label="Durasi" isi={`${d.durasi} hari`} />
            <Info
              label={lk ? "Cara terima" : "Lokasi jemput"}
              isi={
                lk
                  ? d.metode_ambil === "diantar"
                    ? `Diantar: ${d.lokasi_jemput || "-"}`
                    : "Ambil di kantor"
                  : d.lokasi_jemput || "-"
              }
            />
            <Info label="Tanggal kembali" isi={`${tanggal(d.tgl_kembali, true)}, 23.59`} />
            <Info label="Domisili pesanan" isi={DOMISILI[d.domisili] || "-"} />
          </div>
        </section>
        <section className="kartu">
          <h2>Unit yang Diserahkan</h2>
          <p className="ket">Daftar hanya berisi unit tipe ini yang kosong pada tanggal sewa.</p>
          <label htmlFor="plat">Plat nomor</label>
          <select id="plat" name="id_kendaraan" required defaultValue="">
            <option value="">Pilih unit</option>
            {unit.map((u) => (
              <option key={u.id} value={u.id}>
                {u.plat_nomor}
                {u.warna ? ` · ${u.warna}` : ""}
                {u.km_terakhir != null ? ` · ${Number(u.km_terakhir).toLocaleString("id-ID")} km` : ""}
              </option>
            ))}
          </select>
          <GalatKolom galat={g} nama="id_kendaraan" />
          {!unit.length && (
            <div className="alert peringatan" style={{ marginTop: "10px" }}>
              Tidak ada unit kosong untuk tipe ini pada tanggal sewa. Periksa status unit di Kelola Mobil.
            </div>
          )}
        </section>
        {lk && (
          <section className="kartu">
            <h2>Jaminan Diterima</h2>
            <p className="ket">
              Sewa lepas kunci. Periksa dokumen fisik, cocokkan nama dengan KTP, lalu unggah foto tiap jaminan (JPG atau
              PNG, maks 2 MB).
            </p>
            <div className="kolom-2">
              <div>
                <label htmlFor="identitas">No. identitas penyewa</label>
                <input id="identitas" name="no_identitas" type="text" inputMode="numeric" maxLength={30} required />
                <GalatKolom galat={g} nama="no_identitas" />
              </div>
              <div>
                <label htmlFor="dom">Domisili (sesuai KTP)</label>
                <select id="dom" name="domisili_disesuaikan" value={dom} onChange={(e) => setDomisili(e.target.value)}>
                  <option value="malang_raya">Malang Raya</option>
                  <option value="luar_malang_raya">Luar Malang Raya</option>
                </select>
                <p className="hint">
                  Sesuaikan jika KTP berbeda dengan profil. Perubahan dicatat di riwayat aktivitas.
                </p>
              </div>
            </div>
            <div className="kolom-2 jarak">
              <Berkas id="f-ktp" nama="foto_jaminan[ktp_asli]" label="a. Foto KTP asli" g={g} />
              <Berkas id="f-sim" nama="foto_jaminan[sim_c_asli]" label="b. Foto SIM C asli" g={g} />
              <div>
                <label htmlFor="dok">c. Dokumen tambahan</label>
                <select id="dok" name="jaminan[dokumen_tambahan]" required>
                  <option value="ktm">KTM</option>
                  <option value="kk">KK</option>
                  <option value="npwp">NPWP</option>
                  <option value="bpjs">BPJS</option>
                  <option value="paspor">Paspor</option>
                </select>
              </div>
              <Berkas id="f-dok" nama="foto_jaminan[dokumen_tambahan]" label="Foto dokumen tambahan" g={g} />
              {malang ? (
                <Berkas id="f-motor" nama="foto_jaminan[motor_stnk]" label="d. Foto sepeda motor dan STNK" g={g} />
              ) : (
                <>
                  <Berkas
                    id="f-trans"
                    nama="foto_jaminan[booking_transportasi]"
                    label="e. Bukti booking transportasi umum"
                    g={g}
                  />
                  <Berkas id="f-hotel" nama="foto_jaminan[booking_hotel]" label="e. Bukti booking hotel" g={g} />
                </>
              )}
            </div>
          </section>
        )}
        <section className="kartu">
          <h2>Kondisi Awal Unit</h2>
          <div className="kolom-3">
            <div>
              <label htmlFor="odo">Odometer awal (km)</label>
              <input id="odo" name="odometer_awal" type="number" min="0" step="1" required={lk} />
              <GalatKolom galat={g} nama="odometer_awal" />
            </div>
            <div>
              <label htmlFor="bbm">BBM awal</label>
              <select id="bbm" name="bbm_awal" required={lk}>
                <option value="penuh">Penuh</option>
                <option value="tiga_perempat">3/4</option>
                <option value="setengah">1/2</option>
                <option value="seperempat">1/4</option>
                <option value="hampir_kosong">Hampir kosong</option>
              </select>
            </div>
            <div>
              <label htmlFor="foto">Foto kondisi (opsional, maks 10)</label>
              <input id="foto" name="foto_kondisi[]" type="file" accept={FOTO} multiple />
            </div>
          </div>
          <label htmlFor="kondisi">Catatan kondisi awal</label>
          <textarea
            id="kondisi"
            name="catatan_kondisi"
            maxLength={1000}
            placeholder="Ringkas: lecet, kelengkapan, kebersihan"
          />
        </section>
        <section className="kartu">
          <h2>Konfirmasi</h2>
          <p className="ket">Setelah disimpan, status pesanan menjadi Berjalan dan unit berstatus disewa.</p>
          <div className="baris">
            <button className="btn" type="submit" disabled={sibuk || !unit.length}>
              {sibuk ? "Menyimpan..." : "Serahkan unit"}
            </button>
            <Link className="btn garis" href={`/admin/pesanan/${d.id}`}>
              Batal
            </Link>
          </div>
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

function Berkas({ id, nama, label, g }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={nama} type="file" accept={FOTO} required />
      <GalatKolom galat={g} nama={nama} />
    </div>
  );
}
