/* =====================================================
   CONFIGURACIÓN
===================================================== */

const API_BITACORAS = "/api/bitacoras";
const API_ESTUDIANTES = "/api/estudiantes";

const token = localStorage.getItem("token");

const usuarioGuardado = JSON.parse(
  localStorage.getItem("usuario") || "{}"
);

/* =====================================================
   ELEMENTOS DEL DOM
===================================================== */

const formularioBitacora =
  document.getElementById("formBitacora");

const registroId =
  document.getElementById("registroId");

const fecha =
  document.getElementById("fecha");

const horaEntrada =
  document.getElementById("horaEntrada");

const horaSalida =
  document.getElementById("horaSalida");

const tarea =
  document.getElementById("tarea");

const mensajeBitacora =
  document.getElementById("mensajeBitacora");

const tablaBitacoras =
  document.getElementById("tablaBitacoras");

const totalHoras =
  document.getElementById("totalHoras");

const btnGuardarActividad =
  document.getElementById("btnGuardarActividad");

const btnCancelarEdicion =
  document.getElementById("btnCancelarEdicion");

const btnCerrarSesion =
  document.getElementById("btnCerrarSesion");

const btnImprimirSemana =
  document.getElementById("btnImprimirSemana");

const semanaImprimir =
  document.getElementById("semanaImprimir");

const reporteImpresion =
  document.getElementById("reporteImpresion");

const cuerpoTablaImpresion =
  document.getElementById("cuerpoTablaImpresion");

/* =====================================================
   VARIABLES
===================================================== */

let registrosBitacora = [];
let datosEstudiante = {};

/* =====================================================
   VERIFICAR SESIÓN
===================================================== */

function verificarSesion() {
  if (!token) {
    window.location.href = "/login.html";
    return false;
  }

  if (
    usuarioGuardado.rol &&
    usuarioGuardado.rol !== "estudiante"
  ) {
    window.location.href = "/dashboard.html";
    return false;
  }

  return true;
}

/* =====================================================
   FUNCIÓN PARA SOLICITUDES A LA API
===================================================== */

async function solicitarAPI(
  url,
  opciones = {}
) {
  const configuracion = {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opciones.headers || {})
    }
  };

  const respuesta = await fetch(
    url,
    configuracion
  );

  const texto = await respuesta.text();

  let datos = {};

  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch (error) {
      throw new Error(
        `El servidor devolvió una respuesta inválida: ${texto}`
      );
    }
  }

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
      datos.message ||
      "Ocurrió un error al comunicarse con el servidor."
    );
  }

  return datos;
}

/* =====================================================
   CARGAR DATOS DEL ESTUDIANTE
===================================================== */

async function cargarDatosEstudiante() {
  try {
    /*
     * Esta ruta debe devolver el estudiante autenticado.
     *
     * Si tu ruta real tiene otro nombre, cambia solamente:
     * /api/estudiantes/mi-perfil
     */
    const respuesta = await solicitarAPI(
      `${API_ESTUDIANTES}/mi-perfil`
    );

    datosEstudiante =
      respuesta.estudiante ||
      respuesta.usuario ||
      respuesta;

    mostrarDatosEstudiante();
  } catch (error) {
    console.warn(
      "No se pudo cargar el perfil completo:",
      error.message
    );

    datosEstudiante = {
      ...usuarioGuardado
    };

    mostrarDatosEstudiante();
  }
}

/* =====================================================
   MOSTRAR DATOS DEL ESTUDIANTE
===================================================== */

function mostrarDatosEstudiante() {
  const nombre =
    datosEstudiante.nombreCompleto ||
    usuarioGuardado.nombreCompleto ||
    usuarioGuardado.nombre ||
    "";

  const especialidad =
    datosEstudiante.especialidadId?.nombre ||
    datosEstudiante.especialidad?.nombre ||
    datosEstudiante.especialidad ||
    "Desarrollo Web";

  const empresa =
    datosEstudiante.empresaId?.nombreEmpresa ||
    datosEstudiante.empresa?.nombreEmpresa ||
    datosEstudiante.empresa ||
    "";

  const supervisor =
    datosEstudiante.supervisorId?.nombreCompleto ||
    datosEstudiante.supervisor?.nombreCompleto ||
    datosEstudiante.supervisor ||
    "";

  document.getElementById(
    "nombreEstudiante"
  ).textContent = nombre;

  document.getElementById(
    "especialidadEstudiante"
  ).textContent = especialidad;

  document.getElementById(
    "empresaEstudiante"
  ).textContent = empresa;

  document.getElementById(
    "supervisorEstudiante"
  ).textContent = supervisor;
}

/* =====================================================
   CARGAR REGISTROS
===================================================== */

async function cargarRegistros() {
  try {
    mensajeBitacora.textContent = "";

    /*
     * Si tu backend usa otra ruta, cambia solamente
     * esta dirección.
     */
    const respuesta = await solicitarAPI(
      `${API_BITACORAS}/mis-registros`
    );

    registrosBitacora =
      respuesta.bitacoras ||
      respuesta.registros ||
      respuesta;

    if (!Array.isArray(registrosBitacora)) {
      registrosBitacora = [];
    }

    ordenarRegistros();
    mostrarRegistros();
  } catch (error) {
    console.error(
      "Error al cargar registros:",
      error
    );

    mensajeBitacora.textContent =
      error.message;
  }
}

/* =====================================================
   ORDENAR REGISTROS
===================================================== */

function ordenarRegistros() {
  registrosBitacora.sort(
    (a, b) =>
      new Date(b.fecha) -
      new Date(a.fecha)
  );
}

/* =====================================================
   MOSTRAR REGISTROS EN LA TABLA
===================================================== */

function mostrarRegistros() {
  tablaBitacoras.innerHTML = "";

  let sumaHoras = 0;

  if (registrosBitacora.length === 0) {
    tablaBitacoras.innerHTML = `
      <tr>
        <td colspan="8" class="sin-registros">
          No existen actividades registradas.
        </td>
      </tr>
    `;

    totalHoras.textContent = "0.00";
    return;
  }

  registrosBitacora.forEach(
    (registro) => {
      const horas = obtenerHorasRegistro(
        registro
      );

      sumaHoras += horas;

      const estado =
        registro.estado || "Pendiente";

      const puedeEditar =
        estado.toLowerCase() !== "aprobada";

      const fila =
        document.createElement("tr");

      fila.innerHTML = `
        <td>
          ${formatearFecha(registro.fecha)}
        </td>

        <td>
          ${
            escaparHTML(
              registro.tarea ||
              registro.actividad ||
              ""
            )
          }
        </td>

        <td>
          ${registro.horaEntrada || ""}
        </td>

        <td>
          ${registro.horaSalida || ""}
        </td>

        <td>
          ${horas.toFixed(2)}
        </td>

        <td>
          <span class="estado estado-${estado.toLowerCase()}">
            ${estado}
          </span>
        </td>

        <td>
          ${
            escaparHTML(
              registro.observacionesDocente ||
              ""
            )
          }
        </td>

        <td class="acciones-tabla">

          ${
            puedeEditar
              ? `
                <button
                  type="button"
                  class="boton-pequeno"
                  onclick="editarRegistro('${registro._id}')"
                >
                  Editar
                </button>

                <button
                  type="button"
                  class="boton-pequeno boton-peligro"
                  onclick="eliminarRegistro('${registro._id}')"
                >
                  Eliminar
                </button>
              `
              : `
                <span class="texto-bloqueado">
                  Revisado
                </span>
              `
          }

        </td>
      `;

      tablaBitacoras.appendChild(fila);
    }
  );

  totalHoras.textContent =
    sumaHoras.toFixed(2);
}

/* =====================================================
   GUARDAR O ACTUALIZAR REGISTRO
===================================================== */

formularioBitacora.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    mensajeBitacora.textContent = "";

    if (
      !fecha.value ||
      !horaEntrada.value ||
      !horaSalida.value ||
      !tarea.value.trim()
    ) {
      mensajeBitacora.textContent =
        "Debe completar todos los campos obligatorios.";

      return;
    }

    const horasCalculadas =
      calcularHoras(
        horaEntrada.value,
        horaSalida.value
      );

    if (horasCalculadas <= 0) {
      mensajeBitacora.textContent =
        "La hora de salida debe ser posterior a la hora de entrada.";

      return;
    }

    const datos = {
      fecha: fecha.value,
      horaEntrada: horaEntrada.value,
      horaSalida: horaSalida.value,
      tarea: tarea.value.trim(),
      totalHoras: horasCalculadas
    };

    const id = registroId.value;

    btnGuardarActividad.disabled = true;

    btnGuardarActividad.textContent =
      id
        ? "Actualizando..."
        : "Guardando...";

    try {
      if (id) {
        await solicitarAPI(
          `${API_BITACORAS}/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(datos)
          }
        );

        mensajeBitacora.textContent =
          "Actividad actualizada correctamente.";

        mensajeBitacora.className =
          "mensaje-exito campo-completo";
      } else {
        await solicitarAPI(
          API_BITACORAS,
          {
            method: "POST",
            body: JSON.stringify(datos)
          }
        );

        mensajeBitacora.textContent =
          "Actividad registrada correctamente.";

        mensajeBitacora.className =
          "mensaje-exito campo-completo";
      }

      limpiarFormulario();
      await cargarRegistros();
    } catch (error) {
      console.error(
        "Error al guardar actividad:",
        error
      );

      mensajeBitacora.textContent =
        error.message;

      mensajeBitacora.className =
        "mensaje-error campo-completo";
    } finally {
      btnGuardarActividad.disabled = false;

      btnGuardarActividad.textContent =
        "Guardar actividad";
    }
  }
);

/* =====================================================
   EDITAR REGISTRO
===================================================== */

function editarRegistro(id) {
  const registro =
    registrosBitacora.find(
      (item) => item._id === id
    );

  if (!registro) {
    alert(
      "No se encontró el registro seleccionado."
    );
    return;
  }

  if (
    registro.estado &&
    registro.estado.toLowerCase() ===
      "aprobada"
  ) {
    alert(
      "Una actividad aprobada ya no puede editarse."
    );
    return;
  }

  registroId.value = registro._id;

  fecha.value =
    obtenerFechaParaInput(registro.fecha);

  horaEntrada.value =
    registro.horaEntrada || "";

  horaSalida.value =
    registro.horaSalida || "";

  tarea.value =
    registro.tarea ||
    registro.actividad ||
    "";

  btnGuardarActividad.textContent =
    "Actualizar actividad";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* =====================================================
   ELIMINAR REGISTRO
===================================================== */

async function eliminarRegistro(id) {
  const registro =
    registrosBitacora.find(
      (item) => item._id === id
    );

  if (!registro) {
    return;
  }

  if (
    registro.estado &&
    registro.estado.toLowerCase() ===
      "aprobada"
  ) {
    alert(
      "Una actividad aprobada ya no puede eliminarse."
    );
    return;
  }

  const confirmar = window.confirm(
    "¿Está seguro de eliminar esta actividad?"
  );

  if (!confirmar) {
    return;
  }

  try {
    await solicitarAPI(
      `${API_BITACORAS}/${id}`,
      {
        method: "DELETE"
      }
    );

    await cargarRegistros();
  } catch (error) {
    console.error(
      "Error al eliminar:",
      error
    );

    alert(error.message);
  }
}

/* =====================================================
   LIMPIAR FORMULARIO
===================================================== */

function limpiarFormulario() {
  formularioBitacora.reset();

  registroId.value = "";

  btnGuardarActividad.textContent =
    "Guardar actividad";

  establecerFechaActual();
}

btnCancelarEdicion.addEventListener(
  "click",
  limpiarFormulario
);

/* =====================================================
   CALCULAR HORAS
===================================================== */

function calcularHoras(
  entrada,
  salida
) {
  if (!entrada || !salida) {
    return 0;
  }

  const [
    horaInicio,
    minutoInicio
  ] = entrada
    .split(":")
    .map(Number);

  const [
    horaFin,
    minutoFin
  ] = salida
    .split(":")
    .map(Number);

  const minutosEntrada =
    horaInicio * 60 +
    minutoInicio;

  const minutosSalida =
    horaFin * 60 +
    minutoFin;

  const diferencia =
    minutosSalida -
    minutosEntrada;

  if (diferencia <= 0) {
    return 0;
  }

  return diferencia / 60;
}

function obtenerHorasRegistro(registro) {
  const horasGuardadas =
    Number(registro.totalHoras);

  if (
    Number.isFinite(horasGuardadas) &&
    horasGuardadas > 0
  ) {
    return horasGuardadas;
  }

  return calcularHoras(
    registro.horaEntrada,
    registro.horaSalida
  );
}

/* =====================================================
   FORMATEAR FECHAS
===================================================== */

function formatearFecha(fechaValor) {
  if (!fechaValor) {
    return "";
  }

  const fechaObjeto =
    new Date(fechaValor);

  return fechaObjeto.toLocaleDateString(
    "es-CR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );
}

function obtenerFechaParaInput(
  fechaValor
) {
  if (!fechaValor) {
    return "";
  }

  return new Date(fechaValor)
    .toISOString()
    .split("T")[0];
}

function establecerFechaActual() {
  if (!fecha.value) {
    fecha.value =
      new Date()
        .toISOString()
        .split("T")[0];
  }
}

/* =====================================================
   ESCAPAR TEXTO HTML
===================================================== */

function escaparHTML(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =====================================================
   CALCULAR SEMANA ISO
===================================================== */

function obtenerLunesSemana(
  valorSemana
) {
  const [
    anioTexto,
    semanaTexto
  ] = valorSemana.split("-W");

  const anio =
    Number(anioTexto);

  const numeroSemana =
    Number(semanaTexto);

  const cuatroEnero =
    new Date(
      anio,
      0,
      4,
      12,
      0,
      0
    );

  const diaSemana =
    cuatroEnero.getDay() || 7;

  cuatroEnero.setDate(
    cuatroEnero.getDate() -
      diaSemana +
      1
  );

  cuatroEnero.setDate(
    cuatroEnero.getDate() +
      (numeroSemana - 1) * 7
  );

  cuatroEnero.setHours(
    0,
    0,
    0,
    0
  );

  return cuatroEnero;
}

/* =====================================================
   PREPARAR IMPRESIÓN SEMANAL
===================================================== */

btnImprimirSemana.addEventListener(
  "click",
  prepararImpresionSemanal
);

function prepararImpresionSemanal() {
  try {
    const semanaSeleccionada =
      semanaImprimir.value;

    if (!semanaSeleccionada) {
      alert(
        "Debe seleccionar la semana que desea imprimir."
      );
      return;
    }

    const fechaInicio =
      obtenerLunesSemana(
        semanaSeleccionada
      );

    const fechaFin =
      new Date(fechaInicio);

    fechaFin.setDate(
      fechaFin.getDate() + 6
    );

    fechaFin.setHours(
      23,
      59,
      59,
      999
    );

    const registrosSemana =
      registrosBitacora
        .filter((registro) => {
          const fechaRegistro =
            new Date(registro.fecha);

          return (
            fechaRegistro >= fechaInicio &&
            fechaRegistro <= fechaFin
          );
        })
        .sort(
          (a, b) =>
            new Date(a.fecha) -
            new Date(b.fecha)
        );

    if (
      registrosSemana.length === 0
    ) {
      alert(
        "No existen registros para la semana seleccionada."
      );
      return;
    }

    const registrosNoAprobados = registrosSemana.filter(
      (registro) => registro.estado !== "Aprobada"
    );

    if (registrosNoAprobados.length > 0) {
      const detalle = registrosNoAprobados
        .map((registro) => `${formatearFecha(registro.fecha)}: ${registro.estado || "Pendiente"}`)
        .join("\n");

      alert(
        "La semana todavía no puede imprimirse. Todas las actividades deben estar aprobadas por el docente.\n\n" +
        detalle
      );
      return;
    }

    completarDatosImpresion(
      fechaInicio,
      fechaFin
    );

    construirTablaImpresion(
      registrosSemana
    );

    cargarEncabezadoBase64();

    document.body.classList.add(
      "modo-impresion"
    );

    window.print();

    setTimeout(() => {
      document.body.classList.remove(
        "modo-impresion"
      );
    }, 500);
  } catch (error) {
    console.error(
      "Error al preparar impresión:",
      error
    );

    alert(
      "No fue posible preparar la impresión."
    );
  }
}

/* =====================================================
   COMPLETAR DATOS DE IMPRESIÓN
===================================================== */

function completarDatosImpresion(
  fechaInicio,
  fechaFin
) {
  const nombre =
    datosEstudiante.nombreCompleto ||
    usuarioGuardado.nombreCompleto ||
    usuarioGuardado.nombre ||
    "";

  const especialidad =
    datosEstudiante.especialidadId?.nombre ||
    datosEstudiante.especialidad?.nombre ||
    datosEstudiante.especialidad ||
    "Desarrollo Web";

  const empresa =
    datosEstudiante.empresaId?.nombreEmpresa ||
    datosEstudiante.empresa?.nombreEmpresa ||
    datosEstudiante.empresa ||
    "";

  const departamento =
    datosEstudiante.empresaId?.departamento ||
    datosEstudiante.empresa?.departamento ||
    datosEstudiante.departamento ||
    "";

  const direccion =
    datosEstudiante.empresaId?.direccion ||
    datosEstudiante.empresa?.direccion ||
    datosEstudiante.direccion ||
    "";

  const periodo =
    datosEstudiante.periodo ||
    "2026";

  document.getElementById(
    "impEstudiante"
  ).textContent = nombre;

  document.getElementById(
    "impEspecialidad"
  ).textContent = especialidad;

  document.getElementById(
    "impEmpresa"
  ).textContent = empresa;

  document.getElementById(
    "impDepartamento"
  ).textContent = departamento;

  document.getElementById(
    "impDireccion"
  ).textContent = direccion;

  document.getElementById(
    "impPeriodo"
  ).textContent = periodo;

  document.getElementById(
    "impSemana"
  ).textContent =
    `${formatearFecha(fechaInicio)} al ` +
    `${formatearFecha(fechaFin)}`;
}

/* =====================================================
   CONSTRUIR TABLA DE IMPRESIÓN
===================================================== */

function construirTablaImpresion(
  registrosSemana
) {
  cuerpoTablaImpresion.innerHTML = "";

  let totalSemana = 0;

  registrosSemana.forEach(
    (registro) => {
      const horas =
        obtenerHorasRegistro(registro);

      totalSemana += horas;

      const fila =
        document.createElement("tr");

      fila.innerHTML = `
        <td>
          ${formatearFecha(registro.fecha)}
        </td>

        <td class="celda-tarea">
          ${
            escaparHTML(
              registro.tarea ||
              registro.actividad ||
              ""
            )
          }
        </td>

        <td>
          ${registro.horaEntrada || ""}
        </td>

        <td>
          ${registro.horaSalida || ""}
        </td>

        <td>
          ${horas.toFixed(2)}
        </td>

        <td class="celda-firma"></td>
      `;

      cuerpoTablaImpresion.appendChild(
        fila
      );
    }
  );

  document.getElementById(
    "totalHorasImpresion"
  ).textContent =
    totalSemana.toFixed(2);
}

/* =====================================================
   CARGAR ENCABEZADO BASE64
===================================================== */

function cargarEncabezadoBase64() {
  const imagen =
    document.getElementById(
      "imagenEncabezado"
    );

  if (
    window.logoBase64 &&
    typeof window.logoBase64 ===
      "string"
  ) {
    imagen.src =
      window.logoBase64;
  } else {
    imagen.style.display =
      "none";

    console.warn(
      "No se encontró window.logoBase64."
    );
  }
}

/* =====================================================
   CERRAR SESIÓN
===================================================== */

btnCerrarSesion.addEventListener(
  "click",
  cerrarSesion
);

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.href =
    "/login.html";
}

/* =====================================================
   INICIALIZAR
===================================================== */

async function iniciarBitacora() {
  if (!verificarSesion()) {
    return;
  }

  establecerFechaActual();

  await cargarDatosEstudiante();

  await cargarRegistros();
}

document.addEventListener(
  "DOMContentLoaded",
  iniciarBitacora
);

/* =====================================================
   FUNCIONES DISPONIBLES EN HTML
===================================================== */

window.editarRegistro =
  editarRegistro;

window.eliminarRegistro =
  eliminarRegistro;

window.limpiarFormulario =
  limpiarFormulario;

window.cerrarSesion =
  cerrarSesion;