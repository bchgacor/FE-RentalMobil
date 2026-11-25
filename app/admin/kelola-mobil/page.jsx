import PanelAdmin from "@/components/admin/PanelAdmin";
import Link from "next/link";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Plat from "@/components/Plat";

export const metadata = { title: "Kelola Mobil - Admin GantengnyaJatim Group" };

export default function HalamanKelolaMobil() {
  return (
    <PanelAdmin aktif="kelola-mobil">
      <main className="main">
        <header>
          <h1>Kelola Mobil</h1>
          <p>Menambahkan atau mengedit info mobil.</p>
        </header>
        <div className="baris" style={{ marginBottom: "16px" }}>
          <Link href="/admin/tipe-form" className="btn">
            Tambah tipe
          </Link>
          <Link href="/admin/unit-form" className="btn garis">
            Tambah unit
          </Link>
        </div>
        <section className="kartu">
          <h2>Tipe mobil</h2>
          <p className="ket">Tarif per hari. Tipe yang masih punya unit atau pemesanan tidak bisa dihapus.</p>
          <div className="tabel-bungkus">
            <table className="tabel">
              <thead>
                <tr>
                  <th></th>
                  <th>Tipe</th>
                  <th>Merk</th>
                  <th>Kursi</th>
                  <th>BBM</th>
                  <th className="angka">Dengan sopir</th>
                  <th className="angka">Lepas kunci manual</th>
                  <th className="angka">Lepas kunci matic</th>
                  <th>Unit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img className="thumb" src="/img/mobil/ds-innova-reborn.png" alt="" />
                  </td>
                  <td className="tebal">Innova Reborn</td>
                  <td>Toyota</td>
                  <td>7</td>
                  <td>Diesel</td>
                  <td className="angka">Rp 800.000</td>
                  <td className="angka">Rp 450.000</td>
                  <td className="angka">Rp 500.000</td>
                  <td>3</td>
                  <td>
                    <Link href="/admin/tipe-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-tipe" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img className="thumb" src="/img/mobil/ds-avanza-2024.png" alt="" />
                  </td>
                  <td className="tebal">Avanza 2024</td>
                  <td>Toyota</td>
                  <td>7</td>
                  <td>Bensin</td>
                  <td className="angka">Rp 700.000</td>
                  <td className="angka">Rp 325.000</td>
                  <td className="angka">Rp 350.000</td>
                  <td>2</td>
                  <td>
                    <Link href="/admin/tipe-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-tipe" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img className="thumb" src="/img/mobil/ds-rush-trd.png" alt="" />
                  </td>
                  <td className="tebal">Rush TRD</td>
                  <td>Toyota</td>
                  <td>7</td>
                  <td>Bensin</td>
                  <td className="angka">Rp 700.000</td>
                  <td className="angka">Rp 375.000</td>
                  <td className="angka">Rp 375.000</td>
                  <td>2</td>
                  <td>
                    <Link href="/admin/tipe-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-tipe" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img className="thumb" src="/img/mobil/ds-xl7.png" alt="" />
                  </td>
                  <td className="tebal">XL7</td>
                  <td>Suzuki</td>
                  <td>7</td>
                  <td>Bensin</td>
                  <td className="angka">Rp 700.000</td>
                  <td className="angka">Rp 375.000</td>
                  <td className="angka">Rp 375.000</td>
                  <td>1</td>
                  <td>
                    <Link href="/admin/tipe-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-tipe" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img className="thumb" src="/img/mobil/ds-brio.png" alt="" />
                  </td>
                  <td className="tebal">Brio</td>
                  <td>Honda</td>
                  <td>5</td>
                  <td>Bensin</td>
                  <td className="angka">Rp 600.000</td>
                  <td className="angka">Rp 275.000</td>
                  <td className="angka">Rp 275.000</td>
                  <td>2</td>
                  <td>
                    <Link href="/admin/tipe-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-tipe" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img className="thumb" src="/img/mobil/ds-alphard-2022.png" alt="" />
                  </td>
                  <td className="tebal">Alphard 2022</td>
                  <td>Toyota</td>
                  <td>7</td>
                  <td>Bensin</td>
                  <td className="angka">Rp 2.700.000</td>
                  <td className="angka">-</td>
                  <td className="angka">-</td>
                  <td>1</td>
                  <td>
                    <Link href="/admin/tipe-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-tipe" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="kartu">
          <h2>Unit mobil</h2>
          <p className="ket">
            Status Disewa mengikuti pesanan Berjalan. Unit yang sedang disewa tidak bisa diubah statusnya.
          </p>
          <div className="tabel-bungkus">
            <table className="tabel">
              <thead>
                <tr>
                  <th>Plat nomor</th>
                  <th>Tipe</th>
                  <th>Tahun</th>
                  <th>Warna</th>
                  <th>Transmisi</th>
                  <th className="angka">Odometer</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Plat>N 1001 AA</Plat>
                  </td>
                  <td>Innova Reborn</td>
                  <td>2021</td>
                  <td>Hitam</td>
                  <td>Manual</td>
                  <td className="angka">62.400 km</td>
                  <td>
                    <Badge jenis="tersedia">Tersedia</Badge>
                  </td>
                  <td className="aksi-baris">
                    <a href="#nonaktif-unit" className="btn garis sm">
                      Tandai tidak tersedia
                    </a>{" "}
                    <Link href="/admin/unit-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-unit" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 1002 AB</Plat>
                  </td>
                  <td>Innova Reborn</td>
                  <td>2022</td>
                  <td>Putih</td>
                  <td>Matic</td>
                  <td className="angka">41.200 km</td>
                  <td>
                    <Badge jenis="tersedia">Tersedia</Badge>
                  </td>
                  <td className="aksi-baris">
                    <a href="#nonaktif-unit" className="btn garis sm">
                      Tandai tidak tersedia
                    </a>{" "}
                    <Link href="/admin/unit-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-unit" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 2001 CA</Plat>
                  </td>
                  <td>Avanza 2024</td>
                  <td>2024</td>
                  <td>Hitam</td>
                  <td>Matic</td>
                  <td className="angka">12.300 km</td>
                  <td>
                    <Badge jenis="tersedia">Tersedia</Badge>
                  </td>
                  <td className="aksi-baris">
                    <a href="#nonaktif-unit" className="btn garis sm">
                      Tandai tidak tersedia
                    </a>{" "}
                    <Link href="/admin/unit-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-unit" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 3003 EF</Plat>
                  </td>
                  <td>Rush TRD</td>
                  <td>2022</td>
                  <td>Putih</td>
                  <td>Matic</td>
                  <td className="angka">45.000 km</td>
                  <td>
                    <Badge jenis="disewa">Disewa</Badge>
                  </td>
                  <td className="aksi-baris">
                    <Link href="/admin/unit-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-unit" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 4004 GH</Plat>
                  </td>
                  <td>XL7</td>
                  <td>2023</td>
                  <td>Krem</td>
                  <td>Manual</td>
                  <td className="angka">22.800 km</td>
                  <td>
                    <Badge jenis="tersedia">Tersedia</Badge>
                  </td>
                  <td className="aksi-baris">
                    <a href="#nonaktif-unit" className="btn garis sm">
                      Tandai tidak tersedia
                    </a>{" "}
                    <Link href="/admin/unit-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-unit" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 5005 GH</Plat>
                  </td>
                  <td>Brio</td>
                  <td>2021</td>
                  <td>Putih</td>
                  <td>Matic</td>
                  <td className="angka">55.100 km</td>
                  <td>
                    <Badge jenis="servis">Dalam servis</Badge>
                  </td>
                  <td className="aksi-baris">
                    <Link href="/admin/unit-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-unit" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 5006 GJ</Plat>
                  </td>
                  <td>Brio</td>
                  <td>2022</td>
                  <td>Abu-abu</td>
                  <td>Manual</td>
                  <td className="angka">33.700 km</td>
                  <td>
                    <Badge jenis="tersedia">Tersedia</Badge>
                  </td>
                  <td className="aksi-baris">
                    <a href="#nonaktif-unit" className="btn garis sm">
                      Tandai tidak tersedia
                    </a>{" "}
                    <Link href="/admin/unit-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-unit" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Plat>N 6006 IJ</Plat>
                  </td>
                  <td>Alphard 2022</td>
                  <td>2022</td>
                  <td>Hitam</td>
                  <td>Matic</td>
                  <td className="angka">48.900 km</td>
                  <td>
                    <Badge jenis="netral">Tidak tersedia</Badge>
                  </td>
                  <td className="aksi-baris">
                    <a href="#aktif-unit" className="btn garis sm">
                      Tandai tersedia
                    </a>{" "}
                    <Link href="/admin/unit-form" className="tautan">
                      Ubah
                    </Link>
                    {" · "}
                    <a href="#hapus-unit" className="tautan">
                      Hapus
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <Modal id="hapus-tipe" label="Hapus tipe?">
          <h3>Hapus tipe?</h3>
          <p>Yakin hapus tipe ini? Tipe yang masih punya unit atau pemesanan ditolak.</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <Link href="/admin/kelola-mobil" className="btn bahaya sm">
              Ya, hapus
            </Link>
          </div>
        </Modal>
        <Modal id="nonaktif-unit" label="Tandai tidak tersedia?">
          <h3>Tandai tidak tersedia?</h3>
          <p>
            Unit tidak muncul di katalog sampai ditandai tersedia lagi. Jika ada pesanan Dikonfirmasi yang kekurangan
            unit, sistem menampilkan daftarnya lebih dulu.
          </p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <Link href="/admin/kelola-mobil" className="btn bahaya sm">
              Ya, tandai
            </Link>
          </div>
        </Modal>
        <Modal id="aktif-unit" label="Tandai tersedia?">
          <h3>Tandai tersedia?</h3>
          <p>Unit kembali muncul di katalog dan bisa dipesan.</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <Link href="/admin/kelola-mobil" className="btn sm">
              Ya, tandai
            </Link>
          </div>
        </Modal>
        <Modal id="hapus-unit" label="Hapus unit?">
          <h3>Hapus unit?</h3>
          <p>Yakin hapus unit ini? Unit yang punya pemesanan ditolak.</p>
          <div className="baris">
            <a href="#" className="btn garis sm">
              Kembali
            </a>
            <Link href="/admin/kelola-mobil" className="btn bahaya sm">
              Ya, hapus
            </Link>
          </div>
        </Modal>
      </main>
    </PanelAdmin>
  );
}
