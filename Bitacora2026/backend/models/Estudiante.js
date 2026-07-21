const mongoose = require("mongoose");

const estudianteSchema = new mongoose.Schema(
  {
    cedula: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    nombreCompleto: {
      type: String,
      required: true,
      trim: true
    },

    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    especialidadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Especialidad",
      required: true
    },

    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: true
    },

    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: true
    },

    lugarResidencia: {
      type: String,
      trim: true,
      default: ""
    },

    periodo: {
      type: String,
      default: "2026"
    },

    fechaInicio: {
      type: Date,
      required: true
    },

    fechaFin: {
      type: Date,
      required: true
    },

    horario: {
      type: String,
      trim: true,
      default: ""
    },

    rol: {
      type: String,
      default: "estudiante",
      immutable: true
    },

    estado: {
      type: String,
      enum: ["Activo", "Finalizado", "Suspendido"],
      default: "Activo"
    }
  },
  {
    timestamps: true,
    collection: "estudiante"
  }
);

module.exports = mongoose.model("Estudiante", estudianteSchema);