const express = require("express");

const {
  iniciarSesion
} = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/login",
  iniciarSesion
);

module.exports = router;