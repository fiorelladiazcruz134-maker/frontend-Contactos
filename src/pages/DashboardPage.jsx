import Navbar from "../components/Navbar";
import ContactsTable from "../components/ContactsTable";
import { Link } from "react-router-dom";
import RoleGuard from "../components/RoleGuard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Lista de Contactos</h1>
            <p className="text-slate-500 text-sm mt-1">Gestiona y filtra todos los contactos registrados.</p>
          </div>
          <RoleGuard action="create">
            <Link to="/nuevo" className="btn-primary">
              + Nuevo Registro
            </Link>
          </RoleGuard>
        </div>

        <ContactsTable />
      </main>
    </div>
  )
}

