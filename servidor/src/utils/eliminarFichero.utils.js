import fs from "fs";

export function eliminarFichero(nombreArchivo) {
    try {
      fs.unlinkSync(nombreArchivo); // Intentar eliminar el archivo de forma sincrónica
      //console.log("Archivo eliminado correctamente");
      return true; // Devolver true si se elimina correctamente
    } catch (error) {
        console.log("No se pudo eliminar el archivo");
      return false; // Devolver false si no se puede eliminar o si el archivo no existe
    }
  }

export default {
    eliminarFichero,
};
  

