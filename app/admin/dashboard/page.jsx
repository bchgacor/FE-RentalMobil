import PanelAdmin from "@/components/admin/PanelAdmin";
import Dashboard from "@/components/admin/lain/Dashboard";

export const metadata = { title: "Dashboard Admin - Admin GantengnyaJatim Group" };

export default function HalamanDashboard() {
  return (
    <PanelAdmin aktif="dashboard">
      <main className="main">
        <header>
          <h1>Dashboard Admin</h1>
          <p>Ringkasan operasional hari ini.</p>
        </header>
        <Dashboard />
      </main>
    </PanelAdmin>
  );
}
