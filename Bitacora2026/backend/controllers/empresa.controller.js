const Empresa = require("../models/Empresa");

async function listarEmpresas(req, res) {
  try {
    const empresas = await Empresa.find().sort({
      nombreEmpresa: 1
    });

    res.json(empresas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar empresas.",
      error: error.message
    });
  }
}

async function crearEmpresa(req, res) {
  try {
    const empresa = await Empresa.create(req.body);

    res.status(201).json(empresa);
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo registrar la empresa.",
      error: error.message
    });
  }
}

async function actualizarEmpresa(req, res) {
  try {
    const empresa = await Empresa.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!empresa) {
      return res.status(404).json({
        mensaje: "Empresa no encontrada."
      });
    }

    res.json(empresa);
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar la empresa.",
      error: error.message
    });
  }
}

async function eliminarEmpresa(req, res) {
  try {
    const empresa = await Empresa.findByIdAndDelete(req.params.id);

    if (!empresa) {
      return res.status(404).json({
        mensaje: "Empresa no encontrada."
      });
    }

    res.json({
      mensaje: "Empresa eliminada correctamente."
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar la empresa.",
      error: error.message
    });
  }
}

module.exports = {
  listarEmpresas,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
};