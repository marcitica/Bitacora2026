const Especialidad = require("../models/Especialidad");

async function listarEspecialidades(req, res) {
  try {
    const especialidades = await Especialidad.find({
      activo: true
    }).sort({
      nombre: 1
    });

    res.json(especialidades);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar especialidades.",
      error: error.message
    });
  }
}

async function crearEspecialidad(req, res) {
  try {
    const especialidad = await Especialidad.create(req.body);

    res.status(201).json(especialidad);
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo registrar la especialidad.",
      error: error.message
    });
  }
}

module.exports = {
  listarEspecialidades,
  crearEspecialidad
};