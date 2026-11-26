import { GalatKolom, tandai } from "@/components/ui/Galat";
import { KOTA_JATIM, PROVINSI } from "@/lib/wilayah";

// Provinsi (pilihan) dan kabupaten/kota (isian bebas dengan saran kota di Jawa Timur).
export default function FieldDomisili({ galat, provinsi = "", kota = "" }) {
  return (
    <>
      <div className="field">
        <label htmlFor="provinsi">Provinsi domisili</label>
        <select id="provinsi" name="provinsi" required defaultValue={provinsi} {...tandai(galat, "provinsi")}>
          <option value="">Pilih provinsi</option>
          {PROVINSI.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <GalatKolom galat={galat} nama="provinsi" />
      </div>
      <div className="field">
        <label htmlFor="kota">Kabupaten/kota</label>
        <input
          id="kota"
          name="kota"
          type="text"
          maxLength={100}
          required
          list="daftar-kota"
          placeholder="Contoh: Kota Malang"
          defaultValue={kota}
          {...tandai(galat, "kota")}
        />
        <datalist id="daftar-kota">
          {KOTA_JATIM.map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>
        <p className="hint">
          Domisili Kota Malang, Kabupaten Malang, atau Kota Batu menentukan syarat jaminan sewa lepas kunci.
        </p>
        <GalatKolom galat={galat} nama="kota" />
      </div>
    </>
  );
}
