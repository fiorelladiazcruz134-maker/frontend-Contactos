import { mockContacts } from '../mocks/contacts';

export const recordsService = {
  getRecords: async () => {
    return new Promise((resolve) => {
      // delay falso
      setTimeout(() => {
        resolve([...mockContacts]);
      }, 1500);
    });
  },

  createRecord: async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // ver q no haya doble correo
        const emailExists = mockContacts.find(
          c => c.correo.toLowerCase() === data.correo.trim().toLowerCase()
        );
        if (emailExists) {
          return reject({ field: 'correo', message: 'Este correo electrónico ya está registrado en el sistema.' });
        }

        // Validar duplicados por documento
        const docExists = mockContacts.find(
          c => c.documento === data.documento.trim()
        );
        if (docExists) {
          return reject({ field: 'documento', message: 'Este documento de identidad ya está registrado.' });
        }

        // Crear nuevo registro
        const newId = mockContacts.length > 0 ? Math.max(...mockContacts.map(c => c.id)) + 1 : 1;
        const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

        const newRecord = {
          id: newId,
          nombre: data.nombre.trim(),
          documento: data.documento.trim(),
          correo: data.correo.trim(),
          telefono: data.telefono.trim(),
          estado: data.estado,
          fechaRegistro: today,
          observaciones: 'Registro creado desde el formulario del sistema.'
        };

        // meterlo al array fake
        mockContacts.unshift(newRecord);

        resolve(newRecord);
      }, 1000);
    });
  },

  updateRecordStatus: async (id, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const recordIndex = mockContacts.findIndex(c => c.id === id);
        if (recordIndex === -1) {
          return reject(new Error('Registro no encontrado.'));
        }

        // Crear nueva referencia para el array y el objeto para que React detecte el cambio si fuera necesario
        // Pero como es un mock en memoria, simplemente mutamos
        mockContacts[recordIndex] = {
          ...mockContacts[recordIndex],
          estado: status
        };

        resolve(mockContacts[recordIndex]);
      }, 500); // Retraso más corto para una mejor UX
    });
  }
};
