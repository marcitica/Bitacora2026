# Bitácora de Pasantía – CTP Cañas

Sistema web con acceso para estudiantes y docentes de especialidad.

## Funciones

- Inicio de sesión por rol.
- Perfil del estudiante con especialidad, empresa, supervisor, fechas y horario.
- Registro diario de actividades y horas.
- Revisión docente con tres decisiones: pendiente de corrección, aprobada para impresión o rechazada.
- Observaciones visibles para el estudiante.
- Corrección de actividades pendientes o rechazadas.
- Impresión semanal únicamente cuando todas las actividades de la semana están aprobadas.
- Filtro de revisión por especialidad cuando el docente tiene una especialidad asignada.

## Instalación local

1. Instale Node.js 20 o superior.
2. Copie `.env.example` como `.env` y configure MongoDB Atlas.
3. Ejecute `npm install`.
4. Ejecute `npm run seed` para crear los datos iniciales.
5. Ejecute `npm start`.
6. Abra `http://localhost:3000`.

## Publicación recomendada

- Aplicación web y API: Render Web Service.
- Base de datos: MongoDB Atlas.
- Repositorio de código: GitHub privado.

En Render configure:

- Build Command: `npm install`
- Start Command: `npm start`
- Variables de entorno: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_NOMBRE`, `ADMIN_CORREO`, `ADMIN_PASSWORD`.

No suba el archivo `.env` a GitHub.
