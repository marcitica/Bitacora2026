const router = require("express").Router();

const {
  listarEspecialidades,
  crearEspecialidad
} = require("../controllers/especialidad.controller");

const {
  verificarToken,
  soloAdministrador
} = require("../middleware/auth.middleware");

router.use(verificarToken);

router.get("/", listarEspecialidades);

router.post("/", soloAdministrador, crearEspecialidad);

module.exports = router;