import { useEffect } from 'react';
import RoleGuard from './RoleGuard';

export default function ContactDetailModal({ isOpen, onClose, contact, onStatusChange }) {
  // bloquea el scroll de atras
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Detalles del Contacto</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shrink-0">
                  {contact.nombre.charAt(0)}
               </div>
               <div>
                 <h4 className="text-xl font-bold text-slate-800">{contact.nombre}</h4>
                 <p className="text-sm text-slate-500 mt-1">Doc: {contact.documento}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-2">Información de Contacto</p>
                 <div className="text-sm text-slate-700 font-medium mb-1">{contact.correo}</div>
                 <div className="text-sm text-slate-700">{contact.telefono}</div>
               </div>
               
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-2">Estado y Fecha</p>
                <div className="mb-2">
                  {contact.estado === 'active' && <span className="badge-active">Activo</span>}
                  {contact.estado === 'pending' && <span className="badge-pending">Pendiente</span>}
                  {contact.estado === 'inactive' && <span className="badge-inactive">Inactivo</span>}
                </div>
                 <div className="mt-3 text-sm text-slate-700 font-medium">
                   Registrado: {contact.fechaRegistro || 'N/A'}
                 </div>
               </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-2">Observaciones</p>
                 <p className="text-sm text-slate-700 whitespace-pre-wrap">{contact.observaciones || 'Sin observaciones.'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <RoleGuard action="change_status">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">Actualizar Estado:</span>
              <select 
                value={contact.estado}
                onChange={(e) => onStatusChange && onStatusChange(contact.id, e.target.value)}
                className="text-sm border border-slate-300 rounded-lg py-1 px-2 text-slate-800 bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Activo</option>
                <option value="pending">Pendiente</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </RoleGuard>
          
          <button 
            onClick={onClose}
            className="btn-secondary"
          >
            Cerrar Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
