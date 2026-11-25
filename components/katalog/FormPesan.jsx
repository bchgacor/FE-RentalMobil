import Link from "next/link";
import { rupiah } from "@/lib/format";

const DURASI = 3; // contoh durasi untuk ringkasan biaya (tahap slicing)
const WA = "https://wa.me/6281234567890";

// Form pesan di kolom kanan. Pengunjung diarahkan ke halaman masuk, pelanggan ke pembayaran.
export default function FormPesan({ mobil, masuk = false }) {
  const base = masuk ? "/user" : "";
  const sopir = mobil.jenis === "ds";
  return (
    <form className="kotak" action={masuk ? "/user/pembayaran" : "/masuk"} method="get" aria-label="Form pesan">
      <h2 style={{ fontSize: "22px" }}>Form Pesan</h2>
      <p className="kecil">
        Jenis sewa: <b>{sopir ? "Dengan sopir" : "Lepas kunci"}</b>
      </p>
      <input type="hidden" name="jenis" value={sopir ? "dengan_sopir" : "lepas_kunci"} />
      <div className="field baris-2">
        <div>
          <label htmlFor="tgl">Tanggal mulai</label>
          <input id="tgl" name="tgl_mulai" type="date" min="2026-11-05" max="2026-12-04" required />
        </div>
        <div>
          <label htmlFor="dur">Durasi (hari)</label>
          <input id="dur" name="durasi" type="number" min="1" max="30" step="1" defaultValue={DURASI} required />
        </div>
      </div>

      {sopir ? <BagianSopir /> : <BagianLepasKunci mobil={mobil} masuk={masuk} base={base} />}

      <div className="field">
        <label htmlFor="catatan">Catatan (opsional)</label>
        <textarea id="catatan" name="catatan" maxLength={300} />
      </div>
      <div className="cek">
        <input type="checkbox" id="setuju-sk" name="setuju_sk" required />
        <label htmlFor="setuju-sk">
          Saya menyetujui{" "}
          <Link className="tautan" href={`${base}/syarat`} target="_blank" rel="noopener">
            Syarat dan Ketentuan
          </Link>
          .
        </label>
      </div>
      <div className="ringkasan" aria-label="Ringkasan biaya">
        <div className="baris">
          <span>Tarif × durasi</span>
          <span>
            {rupiah(mobil.tarif)} × {DURASI} hari
          </span>
        </div>
        <div className="baris">
          <span>Tanggal kembali</span>
          <span>12 Nov 2026, 23.59</span>
        </div>
        <div className="baris total">
          <span>Total</span>
          <span>{rupiah(mobil.tarif * DURASI)}</span>
        </div>
      </div>
      <button className="btn blok" type="submit">
        Buat Pesanan
      </button>
      <p className="hint kecil abu" style={{ marginTop: "8px" }}>
        Metode pembayaran dipilih di pop-up pembayaran.
      </p>
    </form>
  );
}

function BagianSopir() {
  return (
    <>
      <div className="field">
        <label htmlFor="jam">Jam jemput</label>
        <input id="jam" name="jam_serah" type="time" required />
      </div>
      <div className="field">
        <label htmlFor="tujuan">Tujuan perjalanan</label>
        <input id="tujuan" name="tujuan" type="text" maxLength={1000} required placeholder="Batu, Malang kota" />
        <p className="hint">Boleh lebih dari satu, pisahkan dengan koma.</p>
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
      <div className="field">
        <label htmlFor="lokasi">Lokasi jemput</label>
        <input id="lokasi" name="lokasi_jemput" type="text" maxLength={255} required placeholder="Alamat lengkap" />
      </div>
    </>
  );
}

function BagianLepasKunci({ mobil, masuk, base }) {
  return (
    <>
      <div className="field">
        <label htmlFor="trans">Transmisi</label>
        <select id="trans" name="transmisi" required>
          {mobil.pilihanTransmisi.map((t) => (
            <option key={t} value={t.toLowerCase()}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <span className="label-grup">Cara terima unit</span>
        <div className="cek">
          <input type="radio" id="ambil-kantor" name="metode_ambil" value="ambil_di_kantor" defaultChecked />
          <label htmlFor="ambil-kantor">Ambil sendiri di kantor</label>
        </div>
        <div className="cek">
          <input type="radio" id="diantar" name="metode_ambil" value="diantar" />
          <label htmlFor="diantar">Diantar ke alamat saya</label>
        </div>
        <p className="hint info-kantor">
          Kantor GantengnyaJatim Group, Kota Malang. Alamat lengkap dikirim admin setelah pesanan dikonfirmasi.
        </p>
      </div>
      <div className="field">
        <label htmlFor="jam">Jam serah terima</label>
        <input id="jam" name="jam_serah" type="time" required min="07:00" max="21:00" />
        <p className="hint">Antara 07.00 dan 21.00.</p>
      </div>
      <div className="syarat">
        <p className="tebal">Syarat jaminan lepas kunci</p>
        <ol className="daftar huruf">
          <li>Menyertakan jaminan KTP asli.</li>
          <li>Menyertakan jaminan SIM C asli.</li>
          <li>Menyertakan jaminan KTM, KK, NPWP, BPJS, atau paspor.</li>
          <li>Menyertakan sepeda motor dan STNK (khusus penyewa domisili Malang Raya).</li>
          {!masuk && (
            <li>
              Menyertakan bukti booking transportasi umum (pesawat, kereta, atau bus) dan bukti booking hotel (khusus
              penyewa domisili luar kota).
            </li>
          )}
        </ol>
        {masuk ? (
          <p className="kecil abu">
            Butir d berlaku karena domisili profil Anda: Kota Malang.{" "}
            <Link className="tautan" href={`${base}/profil`}>
              Ubah di Profil
            </Link>
            . Admin memeriksa dokumen fisik saat serah terima.
          </p>
        ) : (
          <p className="kecil abu">
            Butir d atau e berlaku menurut domisili profil Anda. Tunjukkan bukti booking asli saat serah terima; Anda
            juga dapat mengirimkannya lebih dulu lewat WhatsApp admin.
          </p>
        )}
      </div>
      <div className="cek">
        <input type="checkbox" id="setuju-jaminan" name="setuju_syarat_jaminan" required />
        <label htmlFor="setuju-jaminan">Saya sanggup memenuhi syarat jaminan di atas.</label>
      </div>
      <div className="field lokasi-antar">
        <label htmlFor="lokasi">Alamat pengantaran</label>
        <input id="lokasi" name="lokasi_jemput" type="text" maxLength={255} placeholder="Alamat lengkap" />
      </div>
    </>
  );
}
