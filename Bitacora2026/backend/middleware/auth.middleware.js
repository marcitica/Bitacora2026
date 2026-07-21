const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "No se proporcionó un token de acceso."
      });
    }

    const token = authorization.split(" ")[1];

    const datos = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = datos;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o vencido."
    });
  }
}

function soloAdministrador(req, res, next) {
  if (req.usuario.rol !== "administrador") {
    return res.status(403).json({
      mensaje: "Acceso exclusivo para el docente administrador."
    });
  }

  next();
}

function soloEstudiante(req, res, next) {
  if (req.usuario.rol !== "estudiante") {
    return res.status(403).json({
      mensaje: "Acceso exclusivo para estudiantes."
    });
  }

  next();
}

module.exports = {
  verificarToken,
  soloAdministrador,
  soloEstudiante
};