const Supervisor = require("../models/Supervisor");

async function listarSupervisores(req, res) {
  try {
    const filtro = {};

    if (req.query.empresaId) {
      filtro.empresaId = req.query.empresaId;
    }

    const supervisores = await Supervisor.find(filtro)
      .populate("empresaId", "nombreEmpresa")
      .sort({
        nombreCompleto: 1
      });

    res.json(supervisores);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar supervisores.",
      error: error.message
    });
  }
}

async function crearSupervisor(req, res) {
  try {
    const supervisor = await Supervisor.create(req.body);

    res.status(201).json(supervisor);
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo registrar el supervisor.",
      error: error.message
    });
  }
}

async function actualizarSupervisor(req, res) {
  try {
    const supervisor = await Supervisor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!supervisor) {
      return res.status(404).json({
        mensaje: "Supervisor no encontrado."
      });
    }

    res.json(supervisor);
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el supervisor.",
      error: error.message
    });
  }
}

async function eliminarSupervisor(req, res) {
  try {
    const supervisor = await Supervisor.findByIdAndDelete(req.params.id);

    if (!supervisor) {
      return res.status(404).json({
        mensaje: "Supervisor no encontrado."
      });
    }

    res.json({
      mensaje: "Supervisor eliminado correctamente."
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el supervisor.",
      error: error.message
    });
  }
}

module.exports = {
  listarSupervisores,
  crearSupervisor,
  actualizarSupervisor,
  eliminarSupervisor
};