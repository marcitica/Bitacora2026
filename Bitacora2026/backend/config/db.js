const mongoose = require("mongoose");

async function conectarBaseDatos() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "La variable MONGODB_URI no está configurada en el archivo .env."
    );
  }

  try {
    await mongoose.connect(uri);

    console.log(
      "MongoDB conectado correctamente."
    );
  } catch (error) {
    console.error(
      "Error al conectar con MongoDB:"
    );

    console.error(error.message);

    throw error;
  }
}

module.exports = conectarBaseDatos;