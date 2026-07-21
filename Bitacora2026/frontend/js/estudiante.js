protegerPagina("estudiante");

const usuario = obtenerUsuario();

document.getElementById(
  "nombreUsuario"
).textContent = usuario.nombreCompleto;

async function cargarPerfil() {
  try {
    const estudiante = await solicitud(
      "/estudiantes/mi-perfil"
    );

    document.getElementById(
      "datosEstudiante"
    ).innerHTML = `
      <p>
        <strong>Cédula:</strong>
        ${estudiante.cedula}
      </p>

      <p>
        <strong>Nombre:</strong>
        ${estudiante.nombreCompleto}
      </p>

      <p>
        <strong>Especialidad:</strong>
        ${estudiante.especialidadId?.nombre || ""}
      </p>

      <p>
        <strong>Empresa:</strong>
        ${estudiante.empresaId?.nombreEmpresa || ""}
      </p>

      <p>
        <strong>Departamento:</strong>
        ${estudiante.empresaId?.departamento || ""}
      </p>

      <p>
        <strong>Supervisor:</strong>
        ${estudiante.supervisorId?.nombreCompleto || ""}
      </p>

      <p>
        <strong>Período:</strong>
        ${estudiante.periodo}
      </p>

      <p>
        <strong>Horario:</strong>
        ${estudiante.horario || ""}
      </p>

      <p>
        <strong>Estado:</strong>
        ${estudiante.estado}
      </p>
    `;
  } catch (error) {
    alert(error.message);
  }
}

cargarPerfil();