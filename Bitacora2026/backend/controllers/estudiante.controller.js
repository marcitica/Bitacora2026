const bcrypt = require("bcryptjs");
const Estudiante = require("../models/Estudiante");

async function listarEstudiantes(req, res) {
  try {
    const estudiantes = await Estudiante.find()
      .populate("especialidadId", "nombre")
      .populate("empresaId", "nombreEmpresa departamento direccion")
      .populate("supervisorId", "nombreCompleto correo telefono")
      .select("-password")
      .sort({
        nombreCompleto: 1
      });

    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar estudiantes.",
      error: error.message
    });
  }
}

async function obtenerMiPerfil(req, res) {
  try {
    const estudiante = await Estudiante.findById(req.usuario.id)
      .populate("especialidadId", "nombre")
      .populate("empresaId")
      .populate("supervisorId")
      .select("-password");

    if (!estudiante) {
      return res.status(404).json({
        mensaje: "Estudiante no encontrado."
      });
    }

    res.json(estudiante);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar el perfil.",
      error: error.message
    });
  }
}

async function crearEstudiante(req, res) {
  try {
    const {
      cedula,
      nombreCompleto,
      correo,
      password,
      especialidadId,
      empresaId,
      supervisorId,
      lugarResidencia,
      periodo,
      fechaInicio,
      fechaFin,
      horario
    } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos seis caracteres."
      });
    }

    const passwordCifrada = await bcrypt.hash(password, 10);

    const estudiante = await Estudiante.create({
      cedula,
      nombreCompleto,
      correo,
      password: passwordCifrada,
      especialidadId,
      empresaId,
      supervisorId,
      lugarResidencia,
      periodo,
      fechaInicio,
      fechaFin,
      horario
    });

    const resultado = estudiante.toObject();
    delete resultado.password;

    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo registrar el estudiante.",
      error: error.message
    });
  }
}

async function actualizarEstudiante(req, res) {
  try {
    const datos = {
      ...req.body
    };

    if (datos.password) {
      datos.password = await bcrypt.hash(datos.password, 10);
    } else {
      delete datos.password;
    }

    const estudiante = await Estudiante.findByIdAndUpdate(
      req.params.id,
      datos,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!estudiante) {
      return res.status(404).json({
        mensaje: "Estudiante no encontrado."
      });
    }

    res.json(estudiante);
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el estudiante.",
      error: error.message
    });
  }
}

async function eliminarEstudiante(req, res) {
  try {
    const estudiante = await Estudiante.findByIdAndDelete(req.params.id);

    if (!estudiante) {
      return res.status(404).json({
        mensaje: "Estudiante no encontrado."
      });
    }

    res.json({
      mensaje: "Estudiante eliminado correctamente."
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el estudiante.",
      error: error.message
    });
  }
}

module.exports = {
  listarEstudiantes,
  obtenerMiPerfil,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante
};