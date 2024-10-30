const baseUrl = '';
export const environment = {
  production: false,
  baseUrl: baseUrl,
  url: 'https://localhost:4200/' + baseUrl,
  urlLogOut: 'https://localhost:4200/logout' + baseUrl,
  // urlOneDriveService: 'https://pruebas.espoch.edu.ec:8181/WebCorreoInstitucional/ServiciosCorreos/TokenOneDrive',
  urlOneDriveService:
    'https://pruebas.espoch.edu.ec:8181/WebCorreoInstitucional/ServiciosCorreos/TokenOneDrive/',
  CodigoSistemaOneDrive: 'ORDPAGO',
  urlApi: 'https://localhost:8001/wsinventario/',
 // urlApi: 'https://localhost:8000/',               //Local de Homero
 // CodigoSistemaOneDrive: 'ARCHPOLI',

  //urlApi: 'https://apiinventarios.espoch.edu.ec/',  //Servicios web Produccion
  //urlApi: 'https://apiinventarios.espoch.edu.ec/',  //Servicios web Produccion
  // CodigoSistemaOneDrive: 'ARCHPOLI',

};
