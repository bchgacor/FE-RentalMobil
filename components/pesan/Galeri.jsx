// Galeri foto tanpa JavaScript: foto kecil adalah label untuk radio, CSS menampilkan foto besar yang dipilih.
export default function Galeri({ nama, foto }) {
  return (
    <>
      {foto.map((_, i) => (
        <input key={i} className="radio-foto" type="radio" name="foto" id={`foto${i}`} defaultChecked={i === 0} />
      ))}
      <div className="foto-besar">
        {foto.map((src, i) => (
          <img key={src + i} className={`fu fu${i}`} src={src} alt={`${nama} foto ${i + 1}`} loading="lazy" />
        ))}
      </div>
      {foto.length > 1 && (
        <div className="galeri-kecil">
          {foto.map((src, i) => (
            <label key={src + i} className={`kecil-foto kf${i}`} htmlFor={`foto${i}`}>
              <img src={src} alt={`Foto ${i + 1}`} loading="lazy" />
            </label>
          ))}
        </div>
      )}
    </>
  );
}
