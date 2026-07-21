const mongoose = require("mongoose");

const bitacoraSchema = new mongoose.Schema(
  {
    estudianteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estudiante",
      required: true
    },

    fecha: {
      type: Date,
      required: true
    },

    tarea: {
      type: String,
      required: true,
      trim: true
    },

    horaEntrada: {
      type: String,
      required: true
    },

    horaSalida: {
      type: String,
      required: true
    },

    totalHoras: {
      type: Number,
      required: true,
      min: 0
    },

    firmaSupervisor: {
      type: String,
      trim: true,
      default: ""
    },

    estado: {
      type: String,
      enum: ["Pendiente", "Revisada", "Aprobada", "Rechazada"],
      default: "Pendiente"
    },

    observacionesDocente: {
      type: String,
      trim: true,
      default: ""
    },

    fechaRevision: {
      type: Date,
      default: null
    },

    revisadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Administrador",
      default: null
    }
  },
  {
    timestamps: true,
    collection: "bitacoras"
  }
);

module.exports = mongoose.model("Bitacora", bitacoraSchema);