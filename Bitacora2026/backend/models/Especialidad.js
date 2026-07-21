const mongoose = require("mongoose");

const especialidadSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: "especialidades"
  }
);

module.exports = mongoose.model("Especialidad", especialidadSchema);