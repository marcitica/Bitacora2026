const API_URL = "/api";

function obtenerToken() {
  return localStorage.getItem("token");
}

function obtenerUsuario() {
  const datos = localStorage.getItem("usuario");

  return datos ? JSON.parse(datos) : null;
}

function guardarSesion(token, usuario) {
  localStorage.setItem("token", token);

  localStorage.setItem(
    "usuario",
    JSON.stringify(usuario)
  );
}

function cerrarSesion() {
  localStorage.removeItem("token");

  localStorage.removeItem("usuario");

  window.location.href = "login.html";
}

function encabezadosAutorizados() {
  return {
    "Content-Type": "application/json",

    Authorization: `Bearer ${obtenerToken()}`
  };
}

function protegerPagina(rolPermitido) {
  const usuario = obtenerUsuario();

  if (!usuario || !obtenerToken()) {
    window.location.href = "login.html";

    return;
  }

  if (
    rolPermitido &&
    usuario.rol !== rolPermitido
  ) {
    cerrarSesion();
  }
}

async function solicitud(
  ruta,
  opciones = {}
) {
  const respuesta = await fetch(
    `${API_URL}${ruta}`,
    {
      ...opciones,

      headers: {
        ...encabezadosAutorizados(),
        ...(opciones.headers || {})
      }
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
      datos.error ||
      "Ocurrió un error."
    );
  }

  return datos;
}