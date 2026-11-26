import PanelAdmin from "@/components/admin/PanelAdmin";
import Servis from "@/components/admin/lain/Servis";

export const metadata = { title: "Servis - Admin GantengnyaJatim Group" };

export default function HalamanServis() {
  return (
    <PanelAdmin aktif="servis">
      <main className="main">
        <header className="kepala-aksi">
          <div>
            <h1>Servis Unit</h1>
            <p>Catat servis, pantau mobil yang tidak tersedia, dan lihat pengingat servis berkala.</p>
          </div>
          <a href="#catat-servis" className="btn">
            + Catat servis
          </a>
        </header>
        <Servis />
      </main>
    </PanelAdmin>
  );
}
