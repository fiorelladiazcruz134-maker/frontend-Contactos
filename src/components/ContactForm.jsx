import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRecords } from '../api/records';

export default function ContactForm({ isOpen = true, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    correo: '',
    telefono: '',
    estado: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // quitamos el error apenas empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // validador rapido
  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.documento.trim()) {
      newErrors.documento = 'El documento es obligatorio';
    } else if (formData.documento.trim().length < 8) {
      newErrors.documento = 'El documento debe tener al menos 8 caracteres';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }

    if (!formData.estado) {
      newErrors.estado = 'Seleccione un estado válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const newRecord = await apiRecords.createRecord(formData);

        if (onSuccess) onSuccess(newRecord);

        // cerramos el modal o mandamos al dashboard
        if (onClose) {
          onClose();
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        // manejando los errores del mock
        if (err.field) {
          setErrors(prev => ({ ...prev, [err.field]: err.message }));
        } else {
          setErrors(prev => ({ ...prev, general: err.message || 'Ocurrió un error inesperado al guardar.' }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-6 rounded-xl shadow-xl overflow-hidden relative">
        <h2 className="text-xl font-bold mb-6 text-slate-800">Registrar Nuevo Contacto</h2>
      
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`input-field ${errors.nombre ? 'input-error' : ''}`}
              placeholder="Ej. Juan Pérez"
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          {/* Documento */}
          <div>
            <label htmlFor="documento" className="block text-sm font-semibold text-slate-700 mb-1">Documento de Identidad (DNI/CE)</label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              className={`input-field ${errors.documento ? 'input-error' : ''}`}
              placeholder="Ej. 12345678"
              maxLength={15}
            />
            {errors.documento && <p className="text-red-500 text-sm mt-1">{errors.documento}</p>}
          </div>

          {/* Correo */}
          <div>
            <label htmlFor="correo" className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className={`input-field ${errors.correo ? 'input-error' : ''}`}
              placeholder="ejemplo@correo.com"
            />
            {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-semibold text-slate-700 mb-1">Teléfono Móvil</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={`input-field ${errors.telefono ? 'input-error' : ''}`}
              placeholder="Ej. 987654321"
            />
            {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-semibold text-slate-700 mb-1">Estado Inicial</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`input-field ${errors.estado ? 'input-error' : ''}`}
            >
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="inactive">Inactivo</option>
            </select>
            {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              else navigate('/dashboard');
            }}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary min-w-[140px] flex justify-center items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Contacto'}
          </button>
        </div>
      </form>
    </div>
  );
}
