const router = require("express").Router();

const {
  listarSupervisores,
  crearSupervisor,
  actualizarSupervisor,
  eliminarSupervisor
} = require("../controllers/supervisor.controller");

const {
  verificarToken,
  soloAdministrador
} = require("../middleware/auth.middleware");

router.use(verificarToken);

router.get("/", listarSupervisores);

router.post("/", soloAdministrador, crearSupervisor);

router.put("/:id", soloAdministrador, actualizarSupervisor);

router.delete("/:id", soloAdministrador, eliminarSupervisor);

module.exports = router;