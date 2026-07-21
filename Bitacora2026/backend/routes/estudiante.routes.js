const router = require("express").Router();

const {
  listarEstudiantes,
  obtenerMiPerfil,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante
} = require("../controllers/estudiante.controller");

const {
  verificarToken,
  soloAdministrador,
  soloEstudiante
} = require("../middleware/auth.middleware");

router.get(
  "/mi-perfil",
  verificarToken,
  soloEstudiante,
  obtenerMiPerfil
);

router.get(
  "/",
  verificarToken,
  soloAdministrador,
  listarEstudiantes
);

router.post(
  "/",
  verificarToken,
  soloAdministrador,
  crearEstudiante
);

router.put(
  "/:id",
  verificarToken,
  soloAdministrador,
  actualizarEstudiante
);

router.delete(
  "/:id",
  verificarToken,
  soloAdministrador,
  eliminarEstudiante
);

module.exports = router;