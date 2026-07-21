const mongoose = require("mongoose");

const administradorSchema =
  new mongoose.Schema(
    {
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
        default: null
      },

      activo: {
        type: Boolean,
        default: true
      }
    },
    {
      timestamps: true,
      collection: "administrador"
    }
  );

module.exports = mongoose.model(
  "Administrador",
  administradorSchema
);