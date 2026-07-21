const dns = require("dns");
const path = require("path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

/* =====================================================
   CONFIGURAR DNS PARA MONGODB ATLAS
===================================================== */

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

/* =====================================================
   CARGAR VARIABLES DEL ARCHIVO .env
===================================================== */

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
  override: true
});

/* =====================================================
   MODELOS
===================================================== */

const Administrador = require("../models/Administrador");

/* =====================================================
   CREAR O ACTUALIZAR ADMINISTRADOR
===================================================== */

async function crearDatosIniciales() {
  try {
    const {
      MONGODB_URI,
      ADMIN_NOMBRE,
      ADMIN_CORREO,
      ADMIN_PASSWORD
    } = process.env;

    if (!MONGODB_URI) {
      throw new Error(
        "La variable MONGODB_URI no está configurada."
      );
    }

    if (!ADMIN_CORREO) {
      throw new Error(
        "La variable ADMIN_CORREO no está configurada."
      );
    }

    if (!ADMIN_PASSWORD) {
      throw new Error(
        "La variable ADMIN_PASSWORD no está configurada."
      );
    }

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB conectado correctamente.");

    const correoNormalizado = ADMIN_CORREO
      .toLowerCase()
      .trim();

    const passwordCifrado = await bcrypt.hash(
      ADMIN_PASSWORD,
      12
    );

    const administradorExistente =
      await Administrador.findOne({
        correo: correoNormalizado
      });

    if (administradorExistente) {
      administradorExistente.nombreCompleto =
        ADMIN_NOMBRE || "Administrador del sistema";

      administradorExistente.password =
        passwordCifrado;

      administradorExistente.activo = true;

      await administradorExistente.save();

      console.log(
        "Administrador actualizado correctamente."
      );
    } else {
      await Administrador.create({
        nombreCompleto:
          ADMIN_NOMBRE || "Administrador del sistema",

        correo: correoNormalizado,

        password: passwordCifrado,

        activo: true
      });

      console.log(
        "Administrador creado correctamente."
      );
    }

    console.log(
      `Correo del administrador: ${correoNormalizado}`
    );
  } catch (error) {
    console.error(
      "Error al crear los datos iniciales:"
    );

    console.error(error.message);

    process.exitCode = 1;
  } finally {
    try {
      await mongoose.connection.close();

      console.log(
        "Conexión con MongoDB cerrada."
      );
    } catch (error) {
      console.error(
        "No se pudo cerrar la conexión:",
        error.message
      );
    }
  }
}

crearDatosIniciales();