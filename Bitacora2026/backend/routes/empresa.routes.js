const router = require("express").Router();

const {
  listarEmpresas,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
} = require("../controllers/empresa.controller");

const {
  verificarToken,
  soloAdministrador
} = require("../middleware/auth.middleware");

router.use(verificarToken);

router.get("/", listarEmpresas);

router.post("/", soloAdministrador, crearEmpresa);

router.put("/:id", soloAdministrador, actualizarEmpresa);

router.delete("/:id", soloAdministrador, eliminarEmpresa);

module.exports = router;