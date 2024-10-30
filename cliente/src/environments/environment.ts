const baseUrl = '';
export const environment = {
  production: false,
  baseUrl: baseUrl,
  url: 'https://localhost:4200/' + baseUrl,
  urlLogOut: 'https://localhost:4200/logout' + baseUrl,
  urlOneDriveService:
    'https://pruebas.espoch.edu.ec:8181/WebCorreoInstitucional/ServiciosCorreos/TokenOneDrive',
//  urlApi: 'https://192.168.1.111:8000/',            //Wifi de Ruben
  // urlApi: 'https://api-inventario.rubenvn.com/',   //Servidor de Ruben en la Nube
  // urlApi: 'https://pruebasw.espoch.edu.ec:3011/',
  // urlApi: 'https://26.241.69.100:8000/',             //Servidor de Homero radmin VPN
  //urlApi: 'https://26.207.103.212:8001/',             //Servidor de Daniel radmin VPN
  // urlApi: 'https://26.157.36.117:8000/',              //Servidor VyV readmi
  // urlApi: 'https://192.168.1.107:8001/',           //Wifi Ruben
  urlApi: 'https://localhost:8001/wsinventario/',               //Local de Daniel
  //urlApi: 'https://pruebasinventario.me/wsinventario/',
  //urlApi: 'https://localhost:8000/',               //Local de Homero

  CodigoSistemaOneDrive: 'ARCHPOLI',
};
