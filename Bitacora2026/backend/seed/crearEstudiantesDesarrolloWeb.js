const dns = require("dns");
const path = require("path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

/* =====================================================
   CONFIGURAR DNS PARA MONGODB ATLAS
===================================================== */

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

/* =====================================================
   CARGAR VARIABLES DEL ARCHIVO .env
===================================================== */

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
  override: true
});

/* =====================================================
   IMPORTAR MODELOS
===================================================== */

const Estudiante = require("../models/Estudiante");
const Empresa = require("../models/Empresa");
const Especialidad = require("../models/Especialidad");
const Supervisor = require("../models/Supervisor");

/* =====================================================
   CONFIGURACIÓN GENERAL
===================================================== */

const ESPECIALIDAD = "Desarrollo Web";

const FECHA_INICIO = new Date("2026-07-20T12:00:00");
const FECHA_FIN = new Date("2026-08-07T12:00:00");

const PERIODO = "2026";

const HORARIO =
  "Miércoles de 12:00 m.d. en adelante; jueves y viernes jornada completa";

/* =====================================================
   DATOS DE LOS ESTUDIANTES
===================================================== */

const estudiantes = [
  {
    cedula: "504850559",
    nombreCompleto: "Sofía Bermúdez Padilla",
    correo: "sofiabernudez6@gmail.com",
    empresa: "Municipalidad de Cañas",
    supervisor: "Karina Herrera López",
    departamento: "Administración",
    telefonoEmpresa: "89304854",
    lugarResidencia: "Cañas Centro"
  },
  {
    cedula: "504830242",
    nombreCompleto: "Joselyn Harianny Bermúdez Villareal",
    correo: "joselynhari2209@gmail.com",
    empresa: "Ingenio Taboga",
    supervisor: "Jéssica Umaña B",
    departamento: "Desarrollo Organizacional",
    telefonoEmpresa: "26740435",
    lugarResidencia: ""
  },
  {
    cedula: "504860233",
    nombreCompleto: "Shantall Alondra Bojorge Espinoza",
    correo: "shantallespinoza61@gmail.com",
    empresa: "CENCINAI",
    supervisor: "Rosalba López Loaíciga",
    departamento: "Dirección Nacional del CEN-CINAI",
    telefonoEmpresa: "",
    lugarResidencia: "La Libertad"
  },
  {
    cedula: "504850491",
    nombreCompleto: "Yosef David Castro Cabezas",
    correo: "josedavidcastrocabezas82@gmail.com",
    empresa: "SISTECSA",
    supervisor: "Carlos González Segura",
    departamento: "TI",
    telefonoEmpresa: "89380844",
    lugarResidencia: "Barrio San Martín"
  },
  {
    cedula: "504830951",
    nombreCompleto: "María Celeste Esquivel Rojas",
    correo: "mcelesteesquivel2009@gmail.com",
    empresa: "Municipalidad de Cañas",
    supervisor: "Alexander Elizondo Duarte",
    departamento: "Administración",
    telefonoEmpresa: "26904010",
    lugarResidencia: "Pedregal"
  },
  {
    cedula: "504800726",
    nombreCompleto: "Joan Alonso Flores Villalobos",
    correo: "joanf2912@gmail.com",
    empresa: "Liceo de Bebedero",
    supervisor: "Sonia Solórzano Espinoza",
    departamento: "Dirección",
    telefonoEmpresa: "88275127",
    lugarResidencia: "Bebedero"
  },
  {
    cedula: "504840501",
    nombreCompleto: "Alisson Ariadna Fonseca Cordero",
    correo: "fonsecacorderoalisson@gmail.com",
    empresa: "SISTECSA",
    supervisor: "Carlos González Segura",
    departamento: "TI",
    telefonoEmpresa: "89380844",
    lugarResidencia: "Barrio San Martín"
  },
  {
    cedula: "504830387",
    nombreCompleto: "Isabella Guevara Turcios",
    correo: "i90085793@gmail.com",
    empresa: "Hogar de Ancianos",
    supervisor: "Olaman Sibaja Miranda",
    departamento: "Administración",
    telefonoEmpresa: "86339165",
    lugarResidencia: ""
  },
  {
    cedula: "504820549",
    nombreCompleto: "Whinny Yahith Marchena Ulate",
    correo: "whitnnymarchenaulate@gmail.com",
    empresa: "Hogar de Ancianos",
    supervisor: "Olaman Sibaja Miranda",
    departamento: "Administración",
    telefonoEmpresa: "86339165",
    lugarResidencia: "Javilla"
  },
  {
    cedula: "504850737",
    nombreCompleto: "Ana Judith Suárez Angulo",
    correo: "judithangulobermudez20@gmail.com",
    empresa: "Escuela Lajas",
    supervisor: "Yendry Chavarría Gómez",
    departamento: "Dirección",
    telefonoEmpresa: "",
    lugarResidencia: "Los Cocos"
  },
  {
    cedula: "504850347",
    nombreCompleto: "Matías Josué Zambrana Martínez",
    correo: "matizambranam@gmail.com",
    empresa: "Rincón Corobicí",
    supervisor: "Dany Huber",
    departamento: "Rafting y Servicio al Cliente",
    telefonoEmpresa: "87096262",
    lugarResidencia: "Las Cañas"
  },
  {
    cedula: "504840507",
    nombreCompleto: "José Pablo Mata",
    correo: "josepablomat@gmail.com",
    empresa: "Municipalidad de Cañas",
    supervisor: "Alexander Elizondo Duarte",
    departamento: "Administración",
    telefonoEmpresa: "26904010",
    lugarResidencia: "Barrio San Martín"
  }
];

/* =====================================================
   CREAR O ACTUALIZAR ESPECIALIDAD
===================================================== */

async function obtenerEspecialidad() {
  const especialidad = await Especialidad.findOneAndUpdate(
    {
      nombre: ESPECIALIDAD
    },
    {
      $set: {
        nombre: ESPECIALIDAD,
        activo: true
      }
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );

  return especialidad;
}

/* =====================================================
   CREAR O ACTUALIZAR EMPRESA
===================================================== */

async function obtenerEmpresa(datos) {
  const empresa = await Empresa.findOneAndUpdate(
    {
      nombreEmpresa: datos.empresa
    },
    {
      $set: {
        nombreEmpresa: datos.empresa,
        departamento: datos.departamento,
        telefono: datos.telefonoEmpresa,
        direccion: "Cañas, Guanacaste",
        estado: "Activa"
      }
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );

  return empresa;
}

/* =====================================================
   CREAR O ACTUALIZAR SUPERVISOR
===================================================== */

async function obtenerSupervisor(datos, empresaId) {
  const supervisor = await Supervisor.findOneAndUpdate(
    {
      nombreCompleto: datos.supervisor,
      empresaId
    },
    {
      $set: {
        nombreCompleto: datos.supervisor,
        empresaId,
        departamento: datos.departamento,
        telefono: datos.telefonoEmpresa,
        activo: true
      }
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );

  return supervisor;
}

/* =====================================================
   CREAR O ACTUALIZAR ESTUDIANTE
===================================================== */

async function guardarEstudiante(
  datos,
  especialidadId,
  empresaId,
  supervisorId
) {
  const correoNormalizado = datos.correo
    .toLowerCase()
    .trim();

  /*
   * La contraseña inicial será la cédula.
   */
  const passwordCifrado = await bcrypt.hash(
    datos.cedula,
    12
  );

  const estudianteExistente = await Estudiante.findOne({
    $or: [
      {
        cedula: datos.cedula
      },
      {
        correo: correoNormalizado
      }
    ]
  });

  const informacion = {
    cedula: datos.cedula,
    nombreCompleto: datos.nombreCompleto,
    correo: correoNormalizado,
    password: passwordCifrado,
    especialidadId,
    empresaId,
    supervisorId,
    lugarResidencia: datos.lugarResidencia,
    periodo: PERIODO,
    fechaInicio: FECHA_INICIO,
    fechaFin: FECHA_FIN,
    horario: HORARIO,
    estado: "Activo"
  };

  if (estudianteExistente) {
    Object.assign(
      estudianteExistente,
      informacion
    );

    await estudianteExistente.save();

    return "actualizado";
  }

  await Estudiante.create(informacion);

  return "creado";
}

/* =====================================================
   PROCESO PRINCIPAL
===================================================== */

async function crearEstudiantesDesarrolloWeb() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "La variable MONGODB_URI no está configurada en el archivo .env."
      );
    }

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("");
    console.log(
      "MongoDB conectado correctamente."
    );

    const especialidad =
      await obtenerEspecialidad();

    console.log(
      `Especialidad lista: ${especialidad.nombre}`
    );

    let creados = 0;
    let actualizados = 0;
    let errores = 0;

    for (const datos of estudiantes) {
      try {
        const empresa =
          await obtenerEmpresa(datos);

        const supervisor =
          await obtenerSupervisor(
            datos,
            empresa._id
          );

        const resultado =
          await guardarEstudiante(
            datos,
            especialidad._id,
            empresa._id,
            supervisor._id
          );

        if (resultado === "creado") {
          creados++;

          console.log(
            `Creado: ${datos.nombreCompleto}`
          );
        } else {
          actualizados++;

          console.log(
            `Actualizado: ${datos.nombreCompleto}`
          );
        }
      } catch (errorEstudiante) {
        errores++;

        console.error("");
        console.error(
          `Error con ${datos.nombreCompleto}:`
        );

        console.error(
          errorEstudiante.message
        );
      }
    }

    console.log("");
    console.log(
      "=========================================="
    );
    console.log(
      "RESULTADO DEL SEED"
    );
    console.log(
      "=========================================="
    );
    console.log(
      `Estudiantes creados: ${creados}`
    );
    console.log(
      `Estudiantes actualizados: ${actualizados}`
    );
    console.log(
      `Registros con error: ${errores}`
    );
    console.log(
      `Especialidad: ${ESPECIALIDAD}`
    );
    console.log(
      `Periodo: ${PERIODO}`
    );
    console.log(
      "Contraseña inicial: cédula del estudiante"
    );
    console.log(
      "=========================================="
    );
  } catch (error) {
    console.error("");
    console.error(
      "Error general al crear los estudiantes:"
    );

    console.error(error.message);

    if (error.errors) {
      for (const detalle of Object.values(
        error.errors
      )) {
        console.error(
          `- ${detalle.path}: ${detalle.message}`
        );
      }
    }

    process.exitCode = 1;
  } finally {
    try {
      if (
        mongoose.connection.readyState !== 0
      ) {
        await mongoose.connection.close();
      }

      console.log("");
      console.log(
        "Conexión con MongoDB cerrada."
      );
    } catch (errorCierre) {
      console.error(
        "Error al cerrar MongoDB:",
        errorCierre.message
      );
    }
  }
}

/* =====================================================
   EJECUTAR SEED
===================================================== */

crearEstudiantesDesarrolloWeb();