import * as dotenv from 'dotenv'
dotenv.config()

export const configVariables = {
    port: process.env.SERVER_PORT,
    demonPort: process.env.SERVER_DEMON_PORT,
    //urlServicioCentralizado:"https://servicioscomprobante.espoch.edu.ec/ServicioWebComprobantes/ServiciosComprobantes/ObtenerCebtralizadaCedula/",
    urlServicioCentralizado: "https://centralizada2.espoch.edu.ec/rutadinardap/buscarRegistros/",
    //urlServicioCentralizado: "https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/",
    //Sedes
    urlSedes: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/5/NA/NA",

    //Facultades
    urlFacultadesMatriz: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/1/1/MATRIZ",
    urlFacultadesMorona: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/1/1/MORONA",
    urlFacultadesNorte: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/1/1/NORTE",

    //Carreras Matriz
    urlCarrerasFade: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FADE/MATRIZ",
    urlCarrerasCiencias: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FC/MATRIZ",
    urlCarrerasCienciasPecuarias: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FCP/MATRIZ",
    urlCarrerasFie: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FIE/MATRIZ",
    urlCarrerasMecanica: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FIM/MATRIZ",
    urlCarrerasRecursosNaturales: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FRN/MATRIZ",
    urlCarrerasSaludPublica: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FSP/MATRIZ",
    urlCarrerasNivelacion: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/UNA/MATRIZ",

    //Carreras Morona
    urlCarrerasFadeMorona: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FADE/MORONA",
    urlCarrerasCienciasMorona: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FC/MORONA",
    urlCarrerasCienciasPecuariasMorona: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FCP/MORONA",
    urlCarrerasFieMorona: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FIE/MORONA",
    urlCarrerasRecursosNaturalesMorona: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FRN/MORONA",
    urlCarrerasNivelacionMorona: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/UNA/MORONA",

    //Carreras Norte
    urlCarrerasCienciasNorte: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FC/NORTE",
    urlCarrerasCienciasPecuariasNorte: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FCP/NORTE",
    urlCarrerasFieNorte: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FIE/NORTE",
    urlCarrerasRecursosNaturalesNorte: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/FRN/NORTE",
    urlCarrerasNivelacionNorte: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/unidadespublico/2/UNA/NORTE",

    //Dependencias y procesos
    urlServicioDependencia: "https://swtalentohumano.espoch.edu.ec/dthapi/ws/dependencia",
    urlServicioProceso: "https://swtalentohumano.espoch.edu.ec/dthapi/ws/proceso",
    urlServicioProcesoDependencia: "https://swtalentohumano.espoch.edu.ec/dthapi/ws/proceso/dependencia/9",

    //Cargos
    RUTA_TOKEN_TTHH: "https://apitalentohumano2.espoch.edu.ec/api_v1/auth/login",
    CARGO_DEPENCENCIA: "https://apitalentohumano2.espoch.edu.ec/api_v1/m_servidor/servidor/estado_vinculacion",

    //decanatos
    RUTA_TOKEN_DCF: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/token",
    DECANATO: "https://apiinstrumentos.espoch.edu.ec/rutaInstrumentos/datosgeneralesunidad/3/",
}

export const dbVariables = {
    dbUser: process.env.DB_USER,
    dbServer: process.env.DB_SERVER,
    dbPassword: process.env.DB_PASSWORD,
    dbDialect: process.env.DB_DIALECT,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT

}

export const dbVariables2 = {
    dbUser2: process.env.DB_USER2 || "",
    dbPassword2: process.env.DB_PASSWORD2 || "",
    dbServer2: process.env.DB_SERVER2 || "",
    dbDatabase2: process.env.DB_DATABASE2 || "",
    dbPort2: process.env.DB_PORT2 || "",
}

export const jwtVariables = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
}





