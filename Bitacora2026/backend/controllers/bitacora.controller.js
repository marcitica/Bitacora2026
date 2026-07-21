const Bitacora = require("../models/Bitacora");
const Estudiante = require("../models/Estudiante");

function calcularTotalHoras(horaEntrada, horaSalida) {
  if (!horaEntrada || !horaSalida) {
    throw new Error("Debe indicar la hora de entrada y la hora de salida.");
  }

  const [horaInicio, minutoInicio] = horaEntrada.split(":").map(Number);
  const [horaFin, minutoFin] = horaSalida.split(":").map(Number);
  const inicioEnMinutos = horaInicio * 60 + minutoInicio;
  const finEnMinutos = horaFin * 60 + minutoFin;
  const diferencia = finEnMinutos - inicioEnMinutos;

  if (diferencia <= 0) {
    throw new Error("La hora de salida debe ser posterior a la hora de entrada.");
  }

  return Number((diferencia / 60).toFixed(2));
}

async function crearRegistro(req, res) {
  try {
    const { fecha, tarea, horaEntrada, horaSalida, firmaSupervisor } = req.body;
    const totalHoras = calcularTotalHoras(horaEntrada, horaSalida);

    const registro = await Bitacora.create({
      estudianteId: req.usuario.id,
      fecha,
      tarea,
      horaEntrada,
      horaSalida,
      totalHoras,
      firmaSupervisor,
      estado: "Pendiente"
    });

    res.status(201).json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo guardar la bitácora.", error: error.message });
  }
}

async function listarMisRegistros(req, res) {
  try {
    const registros = await Bitacora.find({ estudianteId: req.usuario.id })
      .populate("revisadoPor", "nombreCompleto")
      .sort({ fecha: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar la bitácora.", error: error.message });
  }
}

async function actualizarMiRegistro(req, res) {
  try {
    const registro = await Bitacora.findOne({ _id: req.params.id, estudianteId: req.usuario.id });

    if (!registro) {
      return res.status(404).json({ mensaje: "Registro no encontrado." });
    }

    if (registro.estado === "Aprobada") {
      return res.status(403).json({ mensaje: "Una actividad aprobada ya no puede modificarse." });
    }

    const { fecha, tarea, horaEntrada, horaSalida, firmaSupervisor } = req.body;
    registro.fecha = fecha;
    registro.tarea = tarea;
    registro.horaEntrada = horaEntrada;
    registro.horaSalida = horaSalida;
    registro.totalHoras = calcularTotalHoras(horaEntrada, horaSalida);
    registro.firmaSupervisor = firmaSupervisor;

    // Al corregir, vuelve a la bandeja del docente.
    registro.estado = "Pendiente";
    registro.fechaRevision = null;
    registro.revisadoPor = null;

    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo actualizar el registro.", error: error.message });
  }
}

async function listarTodasLasBitacoras(req, res) {
  try {
    const filtro = {};
    if (req.query.estado) filtro.estado = req.query.estado;
    if (req.query.estudianteId) filtro.estudianteId = req.query.estudianteId;

    // Un docente asociado a una especialidad solo revisa estudiantes de esa especialidad.
    if (req.usuario.especialidadId) {
      const estudiantes = await Estudiante.find({
        especialidadId: req.usuario.especialidadId
      }).select("_id");
      filtro.estudianteId = { $in: estudiantes.map((item) => item._id) };
    }

    const registros = await Bitacora.find(filtro)
      .populate({
        path: "estudianteId",
        select: "cedula nombreCompleto",
        populate: [
          { path: "especialidadId", select: "nombre" },
          { path: "empresaId", select: "nombreEmpresa departamento direccion" },
          { path: "supervisorId", select: "nombreCompleto" }
        ]
      })
      .populate("revisadoPor", "nombreCompleto")
      .sort({ fecha: -1, createdAt: -1 });

    res.json(registros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar las bitácoras.", error: error.message });
  }
}

async function revisarRegistro(req, res) {
  try {
    const { estado, observacionesDocente } = req.body;
    const estadosPermitidos = ["Pendiente", "Aprobada", "Rechazada"];

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ mensaje: "Estado de revisión no permitido." });
    }

    if (["Pendiente", "Rechazada"].includes(estado) && !String(observacionesDocente || "").trim()) {
      return res.status(400).json({
        mensaje: "Debe escribir una observación para indicar la corrección requerida."
      });
    }

    const registro = await Bitacora.findById(req.params.id).populate({
      path: "estudianteId",
      select: "especialidadId"
    });

    if (!registro) {
      return res.status(404).json({ mensaje: "Registro no encontrado." });
    }

    if (
      req.usuario.especialidadId &&
      String(registro.estudianteId?.especialidadId) !== String(req.usuario.especialidadId)
    ) {
      return res.status(403).json({ mensaje: "No puede revisar bitácoras de otra especialidad." });
    }

    registro.estado = estado;
    registro.observacionesDocente = String(observacionesDocente || "").trim();
    registro.fechaRevision = new Date();
    registro.revisadoPor = req.usuario.id;
    await registro.save();

    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo revisar la bitácora.", error: error.message });
  }
}

async function eliminarMiRegistro(req, res) {
  try {
    const registro = await Bitacora.findOne({ _id: req.params.id, estudianteId: req.usuario.id });
    if (!registro) return res.status(404).json({ mensaje: "Registro no encontrado." });

    if (registro.estado === "Aprobada") {
      return res.status(403).json({ mensaje: "Una actividad aprobada no puede eliminarse." });
    }

    await registro.deleteOne();
    res.json({ mensaje: "Registro eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "No se pudo eliminar el registro.", error: error.message });
  }
}

module.exports = {
  crearRegistro,
  listarMisRegistros,
  actualizarMiRegistro,
  listarTodasLasBitacoras,
  revisarRegistro,
  eliminarMiRegistro
};
