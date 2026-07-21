const router = require("express").Router();

const {
  crearRegistro,
  listarMisRegistros,
  actualizarMiRegistro,
  listarTodasLasBitacoras,
  revisarRegistro,
  eliminarMiRegistro
} = require("../controllers/bitacora.controller");

const {
  verificarToken,
  soloAdministrador,
  soloEstudiante
} = require("../middleware/auth.middleware");

router.get(
  "/mis-registros",
  verificarToken,
  soloEstudiante,
  listarMisRegistros
);

router.post(
  "/",
  verificarToken,
  soloEstudiante,
  crearRegistro
);

router.put(
  "/:id",
  verificarToken,
  soloEstudiante,
  actualizarMiRegistro
);

router.delete(
  "/:id",
  verificarToken,
  soloEstudiante,
  eliminarMiRegistro
);

router.get(
  "/",
  verificarToken,
  soloAdministrador,
  listarTodasLasBitacoras
);

router.patch(
  "/:id/revisar",
  verificarToken,
  soloAdministrador,
  revisarRegistro
);

module.exports = router;