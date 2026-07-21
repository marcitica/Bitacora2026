const mongoose = require("mongoose");

const empresaSchema = new mongoose.Schema(
  {
    nombreEmpresa: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    departamento: {
      type: String,
      trim: true,
      default: ""
    },

    direccion: {
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

    estado: {
      type: String,
      enum: ["Activa", "Inactiva"],
      default: "Activa"
    }
  },
  {
    timestamps: true,
    collection: "empresa"
  }
);

module.exports = mongoose.model("Empresa", empresaSchema);