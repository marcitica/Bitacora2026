const mongoose = require("mongoose");

const supervisorSchema = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      required: true,
      trim: true
    },

    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: true
    },

    departamento: {
      type: String,
      trim: true,
      default: ""
    },

    correo: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },

    telefono: {
      type: String,
      trim: true,
      default: ""
    },

    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: "supervisor"
  }
);

module.exports = mongoose.model("Supervisor", supervisorSchema);