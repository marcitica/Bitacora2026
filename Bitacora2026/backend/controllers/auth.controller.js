const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Administrador = require("../models/Administrador");
const Estudiante = require("../models/Estudiante");

function crearToken(usuario, rol) {
  return jwt.sign(
    {
      id: usuario._id,
      nombreCompleto: usuario.nombreCompleto,
      correo: usuario.correo,
      rol,
      especialidadId: usuario.especialidadId || null
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h"
    }
  );
}

async function iniciarSesion(req, res) {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Debe ingresar el correo y la contraseña."
      });
    }

    const correoNormalizado = correo.toLowerCase().trim();

    const administrador = await Administrador.findOne({
      correo: correoNormalizado,
      activo: true
    });

    if (administrador) {
      const passwordValido = await bcrypt.compare(
        password,
        administrador.password
      );

      if (!passwordValido) {
        return res.status(401).json({
          mensaje: "Correo o contraseña incorrectos."
        });
      }

      return res.json({
        token: crearToken(administrador, "administrador"),

        usuario: {
          id: administrador._id,
          nombreCompleto: administrador.nombreCompleto,
          correo: administrador.correo,
          rol: "administrador",
          especialidadId: administrador.especialidadId || null
        }
      });
    }

    const estudiante = await Estudiante.findOne({
      correo: correoNormalizado,
      estado: "Activo"
    });

    if (!estudiante) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos."
      });
    }

    const passwordValido = await bcrypt.compare(
      password,
      estudiante.password
    );

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos."
      });
    }

    return res.json({
      token: crearToken(estudiante, "estudiante"),

      usuario: {
        id: estudiante._id,
        nombreCompleto: estudiante.nombreCompleto,
        correo: estudiante.correo,
        rol: "estudiante"
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión.",
      error: error.message
    });
  }
}

module.exports = {
  iniciarSesion
};