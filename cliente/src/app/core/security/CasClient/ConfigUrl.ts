import { environment } from 'src/environments/environment';

export let CONFIG = {
  Settings: {
    CASLOGIN: 'https://seguridad.espoch.edu.ec/cas/login?',
    CASLOGOUT: 'https://seguridad.espoch.edu.ec/cas/logout?',
    CASVALIDATE: 'https://seguridad.espoch.edu.ec/cas/p3/serviceValidate?',
    REDIRECT_URI: environment.url,
    LOGOUT_REDIRECT: environment.urlLogOut,

  // REDIRECT_URI: 'https://pruebacomprobante.espoch.edu.ec:8080/cash',
  //   LOGOUT_REDIRECT: 'https://pruebacomprobante.espoch.edu.ec:8080/logout',
    LOGOUT_CORREO: 'https://login.microsoftonline.com/common/oauth2/logout?',
    VALIDATEJAVA:
      'https://precas.espoch.edu.ec/ServicioWebComprobantes/ServiciosComprobantes/ValidateCas/',
  },
};
