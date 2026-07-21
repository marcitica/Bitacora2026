protegerPagina("administrador");

const usuarioAdministrador = obtenerUsuario();

document.getElementById(
  "nombreAdministrador"
).textContent =
  usuarioAdministrador.nombreCompleto;

let empresas = [];

async function cargarCatalogos() {
  try {
    empresas = await solicitud("/empresas");

    const especialidades =
      await solicitud("/especialidades");

    document.getElementById(
      "empresaSupervisor"
    ).innerHTML =
      '<option value="">Seleccione empresa</option>' +
      empresas.map(
        empresa =>
          `<option value="${empresa._id}">
            ${empresa.nombreEmpresa}
          </option>`
      ).join("");

    document.getElementById(
      "empresaEstudiante"
    ).innerHTML =
      '<option value="">Seleccione empresa</option>' +
      empresas.map(
        empresa =>
          `<option value="${empresa._id}">
            ${empresa.nombreEmpresa}
          </option>`
      ).join("");

    document.getElementById(
      "especialidadEstudiante"
    ).innerHTML =
      '<option value="">Seleccione especialidad</option>' +
      especialidades.map(
        especialidad =>
          `<option value="${especialidad._id}">
            ${especialidad.nombre}
          </option>`
      ).join("");
  } catch (error) {
    alert(error.message);
  }
}

document.getElementById(
  "empresaEstudiante"
).addEventListener(
  "change",
  async event => {
    try {
      const empresaId = event.target.value;

      const supervisores = await solicitud(
        `/supervisores?empresaId=${empresaId}`
      );

      document.getElementById(
        "supervisorEstudiante"
      ).innerHTML =
        '<option value="">Seleccione supervisor</option>' +
        supervisores.map(
          supervisor =>
            `<option value="${supervisor._id}">
              ${supervisor.nombreCompleto}
            </option>`
        ).join("");
    } catch (error) {
      alert(error.message);
    }
  }
);

document.getElementById(
  "formEmpresa"
).addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    const datos = {
      nombreEmpresa:
        document.getElementById(
          "nombreEmpresa"
        ).value,

      departamento:
        document.getElementById(
          "departamentoEmpresa"
        ).value,

      direccion:
        document.getElementById(
          "direccionEmpresa"
        ).value,

      correo:
        document.getElementById(
          "correoEmpresa"
        ).value,

      telefono:
        document.getElementById(
          "telefonoEmpresa"
        ).value
    };

    try {
      await solicitud(
        "/empresas",
        {
          method: "POST",

          body: JSON.stringify(datos)
        }
      );

      alert("Empresa registrada.");

      event.target.reset();

      cargarCatalogos();
    } catch (error) {
      alert(error.message);
    }
  }
);

document.getElementById(
  "formSupervisor"
).addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    const datos = {
      nombreCompleto:
        document.getElementById(
          "nombreSupervisor"
        ).value,

      empresaId:
        document.getElementById(
          "empresaSupervisor"
        ).value,

      departamento:
        document.getElementById(
          "departamentoSupervisor"
        ).value,

      correo:
        document.getElementById(
          "correoSupervisor"
        ).value,

      telefono:
        document.getElementById(
          "telefonoSupervisor"
        ).value
    };

    try {
      await solicitud(
        "/supervisores",
        {
          method: "POST",

          body: JSON.stringify(datos)
        }
      );

      alert("Supervisor registrado.");

      event.target.reset();
    } catch (error) {
      alert(error.message);
    }
  }
);

document.getElementById(
  "formEstudiante"
).addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    const datos = {
      cedula:
        document.getElementById(
          "cedulaEstudiante"
        ).value,

      nombreCompleto:
        document.getElementById(
          "nombreEstudiante"
        ).value,

      correo:
        document.getElementById(
          "correoEstudiante"
        ).value,

      password:
        document.getElementById(
          "passwordEstudiante"
        ).value,

      especialidadId:
        document.getElementById(
          "especialidadEstudiante"
        ).value,

      empresaId:
        document.getElementById(
          "empresaEstudiante"
        ).value,

      supervisorId:
        document.getElementById(
          "supervisorEstudiante"
        ).value,

      lugarResidencia:
        document.getElementById(
          "residenciaEstudiante"
        ).value,

      periodo: "2026",

      fechaInicio:
        document.getElementById(
          "fechaInicio"
        ).value,

      fechaFin:
        document.getElementById(
          "fechaFin"
        ).value,

      horario:
        document.getElementById(
          "horarioEstudiante"
        ).value
    };

    try {
      await solicitud(
        "/estudiantes",
        {
          method: "POST",

          body: JSON.stringify(datos)
        }
      );

      alert("Estudiante registrado.");

      event.target.reset();
    } catch (error) {
      alert(error.message);
    }
  }
);

async function cargarBitacoras() {
  try {
    const registros =
      await solicitud("/bitacoras");

    const tabla =
      document.getElementById(
        "tablaRevision"
      );

    tabla.innerHTML = registros.map(
      registro => `
        <tr>

          <td>
            ${
              registro.estudianteId
                ?.nombreCompleto || ""
            }
          </td>

          <td>
            ${
              registro.estudianteId
                ?.empresaId
                ?.nombreEmpresa || ""
            }
          </td>

          <td>
            ${new Date(
              registro.fecha
            ).toLocaleDateString("es-CR")}
          </td>

          <td>${registro.tarea}</td>

          <td>${registro.totalHoras}</td>

          <td>${registro.estado}</td>

          <td>

            <select id="estado-${registro._id}">

              <option value="Pendiente" ${registro.estado === "Pendiente" ? "selected" : ""}>
                Pendiente de corrección
              </option>

              <option value="Aprobada" ${registro.estado === "Aprobada" ? "selected" : ""}>
                Aprobada para impresión
              </option>

              <option value="Rechazada" ${registro.estado === "Rechazada" ? "selected" : ""}>
                Rechazada
              </option>

            </select>

            <textarea
              id="observacion-${registro._id}"
              placeholder="Observación docente"
            >${registro.observacionesDocente || ""}</textarea>

            <button
              onclick="revisarBitacora('${registro._id}')"
            >
              Guardar revisión
            </button>

          </td>

        </tr>
      `
    ).join("");
  } catch (error) {
    alert(error.message);
  }
}

async function revisarBitacora(id) {
  const estado =
    document.getElementById(
      `estado-${id}`
    ).value;

  const observacionesDocente =
    document.getElementById(
      `observacion-${id}`
    ).value;

  try {
    await solicitud(
      `/bitacoras/${id}/revisar`,
      {
        method: "PATCH",

        body: JSON.stringify({
          estado,
          observacionesDocente
        })
      }
    );

    alert("Revisión guardada.");

    cargarBitacoras();
  } catch (error) {
    alert(error.message);
  }
}

(async function iniciarPanel() {
  await cargarCatalogos();

  await cargarBitacoras();
})();