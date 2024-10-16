export class tokenUsuario {


    constructor() {
        this.perIdCas = {};
    }

    guardarId(clave, valor) {
        this.perIdCas[clave] = valor;
        console.log("Token guardado: ", this.perIdCas)
    }

    obtenerId() {
        console.log("Token obtenido en obtenerId: ", this.perIdCas)
        return this.perIdCas;
    }

    
}


export const tokenUser = new tokenUsuario();


export default new tokenUsuario();