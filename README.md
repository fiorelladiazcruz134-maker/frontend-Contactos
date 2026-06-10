# Administrador de Contactos (Test Frontend)

Un proyectito rápido hecho con React + Vite para gestionar contactos como un mini CRM.

## Lo que tiene

1. **Formulario**: Para meter los contactos. Valida que pongas todo bien (correo, dni, etc).
2. **Tabla**: Lista los registros y tiene un buscador y filtro por estado.
3. **Detalles**: Le das click a un registro y abre un modal con toda la data.
4. **Login Falso**: Simula un login conectándose a un mock local. Tarda un poquito a propósito para que se vea real.
5. **API Mockeada**: Todo el CRUD (`getRecords`, `createRecord`, `updateRecordStatus`) está hecho con data local para no necesitar un backend.
6. **Optimistic Updates**: Cuando le cambias el estado a alguien, la tabla se actualiza de una sin recargar la página.
7. **Modo Local/Real**: Dejé armada la carpeta `api/` para que con solo cambiar una variable de entorno (`VITE_USE_LOCAL_DATA`) le empiece a pegar a una API real.
8. **Sesión**: Te desloguea si te quedas inactivo por 1 minuto.
9. **Permisos**: Hay roles `admin` y `user`. El admin puede hacer todo, el user solo mira.

## Para correrlo

1. `npm install`
2. `npm run dev`

### Usuarios para probar:

- **Admin**: `admin@test.com` / `password123`
- **User Normal**: `user@test.com` / `password123`
