const formularioLogin =
  document.getElementById("formLogin");

const mensajeLogin =
  document.getElementById("mensajeLogin");

const botonLogin =
  document.getElementById("btnLogin");

formularioLogin.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    mensajeLogin.textContent = "";

    const correo = document
      .getElementById("correo")
      .value
      .trim()
      .toLowerCase();

    const password = document
      .getElementById("password")
      .value;

    if (!correo || !password) {
      mensajeLogin.textContent =
        "Debe ingresar el correo y la contraseña.";

      return;
    }

    botonLogin.disabled = true;
    botonLogin.textContent = "Ingresando...";

    try {
      const respuesta = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            correo,
            password
          })
        }
      );

      const textoRespuesta =
        await respuesta.text();

      let datos = {};

      if (textoRespuesta) {
        try {
          datos = JSON.parse(textoRespuesta);
        } catch (error) {
          throw new Error(
            `Respuesta inválida del servidor: ${textoRespuesta}`
          );
        }
      }

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
          datos.message ||
          "No fue posible iniciar sesión."
        );
      }

      if (!datos.token || !datos.usuario) {
        throw new Error(
          "La respuesta del servidor está incompleta."
        );
      }

      localStorage.setItem(
        "token",
        datos.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(datos.usuario)
      );

      if (datos.usuario.rol === "estudiante") {
        window.location.href =
          "/bitacora.html";

        return;
      }

      if (
        datos.usuario.rol ===
        "administrador"
      ) {
        window.location.href =
          "/administrador.html";

        return;
      }

      throw new Error(
        "El rol del usuario no es válido."
      );
    } catch (error) {
      console.error(
        "Error de inicio de sesión:",
        error
      );

      mensajeLogin.textContent =
        error.message;
    } finally {
      botonLogin.disabled = false;
      botonLogin.textContent =
        "Iniciar sesión";
    }
  }
);