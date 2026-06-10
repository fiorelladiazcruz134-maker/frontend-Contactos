import { useState, useEffect } from 'react';
import { apiRecords } from '../api/records';
import ContactDetailModal from './ContactDetailModal';

export default function ContactsTable() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiRecords.getRecords();
        setRecords(data);
      } catch (err) {
        setError(err.message || 'Error al cargar los registros desde el servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // actualiza el estado directo pa q no se sienta lento
  const handleStatusChange = async (id, newStatus) => {
    try {
      setRecords(prev => prev.map(c => c.id === id ? { ...c, estado: newStatus } : c));
      if (selectedContact?.id === id) {
        setSelectedContact(prev => ({ ...prev, estado: newStatus }));
      }
      await apiRecords.updateRecordStatus(id, newStatus);
    } catch (err) {
      console.error('falla al actualizar', err);
    }
  };

  // filtro combinado
  const filteredContacts = records.filter(contact => {
    const matchesSearch =
      contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.documento.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || contact.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'active': return <span className="badge-active">Activo</span>;
      case 'pending': return <span className="badge-pending">Pendiente</span>;
      case 'inactive': return <span className="badge-inactive">Inactivo</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Filters Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:w-1/2 md:w-1/3 relative">
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <div className="w-full sm:w-1/3 md:w-1/4">
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="pending">Pendiente</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Documento</th>
              <th className="px-6 py-4">Correo</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading && (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-500 font-medium">Cargando registros...</p>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 inline-block max-w-md">
                    <svg className="w-8 h-8 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-semibold">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Reintentar conexión
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && records.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <svg className="w-12 h-12 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="font-medium text-lg">No hay registros disponibles</p>
                    <p className="text-sm mt-1">Aún no se ha creado ningún contacto en el sistema.</p>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && records.length > 0 && filteredContacts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  <p className="font-medium">No se encontraron registros que coincidan con los filtros.</p>
                  <p className="text-sm mt-1">Prueba cambiando tu búsqueda o estado.</p>
                </td>
              </tr>
            )}

            {!isLoading && !error && filteredContacts.length > 0 && (
              filteredContacts.map(contact => (
                <tr
                  key={contact.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedContact(contact)}
                >
                  <td className="px-6 py-4 font-medium text-slate-800">{contact.nombre}</td>
                  <td className="px-6 py-4 text-slate-500">{contact.documento}</td>
                  <td className="px-6 py-4 text-slate-500">{contact.correo}</td>
                  <td className="px-6 py-4 text-slate-500">{contact.telefono}</td>
                  <td className="px-6 py-4">{getStatusBadge(contact.estado)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <ContactDetailModal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        contact={selectedContact}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
