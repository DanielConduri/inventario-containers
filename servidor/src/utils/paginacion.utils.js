import { Op } from "sequelize";
// funcion general para hacer paginacion de los diferentes models de la BD
async function paginarDatos(page, size, modelo, columna, parametro) {
  const skip = (page - 1) * size;


  let where = {}; // Define una condición de filtro vacía por defecto
  // Si columna y parametro tienen valores distintos de cero, crea la condición del filtro
  if(parametro=='ACTIVO'|| parametro=='INACTIVO'){
    where = { [columna]: parametro };
  }else if (columna && parametro) {
    where = { [columna]: { [Op.like]: `%${parametro}%` } };
  }
  const [datos, total] = await Promise.all([
    modelo.findAll({
      //order: [['int_bien_id', 'ASC']], 
      limit: size,
      offset: skip,
      where, // Incluye la condición del filtro en el objeto de opciones
    }),
    modelo.count({ where }), // También debes incluir la condición en el conteo
  ]);
  return { datos, total };
}

async function paginarDatosBienes(page, size, modelo, columna, parametro) {
  const skip = (page - 1) * size;

  let where = {}; // Define una condición de filtro vacía por defecto
  // Si columna y parametro tienen valores distintos de cero, crea la condición del filtro
  if(parametro==''|| parametro==''){  //if(parametro=='ACTIVO'|| parametro=='INACTIVO')
    //where = { [columna]: parametro };
  where = { int_bien_estado_historial: 1}
  }else if (columna && parametro) {
    where = { [columna]: { [Op.like]: `%${parametro}%`}, int_bien_estado_historial: 1};
  }

  const [datos, total] = await Promise.all([
    modelo.findAll({
      order: [['int_bien_id', 'ASC']], 
      limit: size,
      offset: skip,
      where, // Incluye la condición del filtro en el objeto de opciones
    }),
    modelo.count({ where }), // También debes incluir la condición en el conteo
  ]);
  return { datos, total } 
  
}

async function paginarDatosBienesPorCustodio(page, size, modelo, columna, parametro, custodio_id) {
  const skip = (page - 1) * size;
  let where = {}; // Define una condición de filtro vacía por defecto
  // Si columna y parametro tienen valores distintos de cero, crea la condición del filtro
  if(parametro==''|| parametro==''){  //if(parametro=='ACTIVO'|| parametro=='INACTIVO')
    //where = { [columna]: parametro };
    where = { int_custodio_id: custodio_id,
              int_bien_estado_historial: 1
    }   //Todos los bienes del custodio
  }else if (columna && parametro) {
    where = { 
      [columna]: { [Op.like]: `%${parametro}%`}, 
      int_bien_estado_historial: 1,   //Bienes activos
      int_custodio_id: custodio_id    //Del custodio que está logueado
    };
  }
  const [datos, total] = await Promise.all([
    modelo.findAll({
      order: [['int_bien_id', 'ASC']], 
      limit: size,
      offset: skip,
      where, // Incluye la condición del filtro en el objeto de opciones
    }),
    modelo.count({ where }), // También debes incluir la condición en el conteo
  ]);
  return { datos, total } 
}

  

export { paginarDatos, paginarDatosBienes, paginarDatosBienesPorCustodio};
