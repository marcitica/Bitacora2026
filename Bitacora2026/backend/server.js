const dns = require("dns");
const path = require("path");

/*
  Usar servidores DNS públicos para resolver
  los registros SRV de MongoDB Atlas.
*/
dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  override: true
});

const express = require("express");
const cors = require("cors");

const conectarBaseDatos = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/empresas", require("./routes/empresa.routes"));
app.use("/api/especialidades", require("./routes/especialidad.routes"));
app.use("/api/supervisores", require("./routes/supervisor.routes"));
app.use("/api/estudiantes", require("./routes/estudiante.routes"));
app.use("/api/bitacoras", require("./routes/bitacora.routes"));

const frontendPath = path.resolve(__dirname, "../frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.get("/api", (req, res) => {
  res.status(200).json({
    mensaje:
      "API del Sistema de Bitácoras de Pasantía 2026 funcionando correctamente."
  });
});

app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada."
  });
});

app.use((error, req, res, next) => {
  console.error("Error interno del servidor:", error);

  res.status(error.status || 500).json({
    mensaje:
      error.message ||
      "Ocurrió un error interno en el servidor."
  });
});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await conectarBaseDatos();

    app.listen(PORT, () => {
      console.log("==========================================");
      console.log("Sistema de Bitácoras de Pasantía 2026");
      console.log(`Servidor funcionando en: http://localhost:${PORT}`);
      console.log(`API disponible en: http://localhost:${PORT}/api`);
      console.log("==========================================");
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:");
    console.error(error.message);
    process.exit(1);
  }
}

iniciarServidor();