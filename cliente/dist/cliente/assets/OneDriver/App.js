var baseEndpoint = "https://graph.microsoft.com";
var filesResource = "https://" + tenant + "-my.sharepoint.com";
var endpoints = {
  filesResource: filesResource,
};

window.config = {
  tenant: tenant,
  clientId: clientId,
  postLogoutRedirectUri: window.location.origin,
  endpoints: endpoints,
  cacheLocation: "localStorage",
};

function getDatos() {
  let datosCliente = {
    tenant: tenant,
    clientId: clientId,
  };
  return datosCliente;
}

var authContext = new AuthenticationContext(config);
var fileToUpload;

var tokenCliente = "";
function getTokenGenerado(initToken) {
  tokenCliente = initToken;

  var isCallback = authContext.isCallback(window.location.hash);
  authContext.handleWindowCallback();

  if (isCallback && !authContext.getLoginError()) {
    window.location = authContext._getItem(
      authContext.CONSTANTS.STORAGE.LOGIN_REQUEST
    );
  }

  var user = authContext.getCachedUser();
  if (user) {
    console.log("Usuario logueado");
  } else {
    console.log("Usuario no logueado");
  }
}

function cargarData(ruta, archivo) {
  return new Promise((resolve, reject) => {
    authContext.acquireToken(baseEndpoint, function (error, token) {
      if (error || !token) {
        console.log("ADAL error: " + error);
        resolve(false);
      }
      fetch(baseEndpoint + `/v1.0/me/drive/root:/${ruta}/${archivo}`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      })
        .then((resp) => resp.json())
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("Err", err);
          reject(err);
        });

      // $.ajax({
      //   type: "GET",
      //   url: baseEndpoint + `/v1.0/me/drive/root:/${ruta}/${archivo}`,
      //   headers: { Authorization: "Bearer " + token },
      // })
      //   .done(function (response) {
      //     console.log(response);
      //     resolve(response);
      //   })
      //   .fail(function () {
      //     resolve(false);
      //   });
    });
  });
}

async function onUpload(archivo, ruta, nombreArchivo) {
  fileToUpload = archivo;
  let uploadUrl;
  try {
    var i = fileToUpload.name.lastIndexOf(".");
  } catch (error) {
    console.log("Seleccione primero el archivo a subir.");
    return;
  }
  let fileType = fileToUpload.name.substring(i + 1);
  let fileName = nombreArchivo;
  let resp = await getUploadSession(fileType, fileName, ruta);
  return resp;
}

function getUploadSession(fileType, name, ruta) {
  return new Promise((resolve, reject) => {
    let body = {
      item: {
        "@microsoft.graph.conflictBehavior": "replace",
      },
    };
    authContext.acquireToken(baseEndpoint, function (error, token) {
      if (error || !token) {
        console.log("ADAL error: " + error);
        return;
      }
      fetch(
        baseEndpoint +
          `/v1.0/me/drive/root:/${ruta}/${name}.${fileType}:/createUploadSession`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(body),
        }
      )
        .then((resp) => resp.json())
        .then(async (response) => {
          let uploadUrl = response.uploadUrl;
          sessionStorage.setItem("urlDrive", response);

          let resp = await uploadChunks(fileToUpload, uploadUrl);
          resolve(resp);
        })
        .catch((error) => {
          console.log(
            "No se pudo obtener la sesión de carga: " + response.responseText
          );
          reject();
        });
    });
  });
}

async function uploadChunks(file, uploadUrl) {
  var reader = new FileReader();
  var position = 0;
  var chunkLength = 320 * 1024;
  var continueRead = true;
  while (continueRead) {
    var chunk;
    try {
      continueRead = true;
      try {
        let stopByte = position + chunkLength;
        chunk = await readFragmentAsync(file, position, stopByte);
        if (chunk.byteLength > 0) {
          continueRead = true;
        } else {
          break;
        }
      } catch (e) {
        console.log("Bytes recibidos de readFragmentAsync: " + e);
        break;
      }
      try {
        let res = await uploadChunk(chunk, uploadUrl, position, file.size);
        if (res.status !== 202 && res.status !== 201 && res.status !== 200)
          throw "La operación no devolvió la respuesta esperada";
        if (res.status === 201 || res.status === 200) {
          continueRead = false;
        } else {
          position = Number(res.json.nextExpectedRanges[0].split("-")[0]);
        }
      } catch (e) {
        console.log("Ocurrió un error al llamar a uploadChunk:" + e);
      }
    } catch (e) {
      continueRead = false;
    }
  }
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}

function readFragmentAsync(file, startByte, stopByte) {
  var frag = "";
  const reader = new FileReader();
  var blob = file.slice(startByte, stopByte);
  reader.readAsArrayBuffer(blob);
  return new Promise((resolve, reject) => {
    reader.onloadend = (event) => {
      if (reader.readyState === reader.DONE) {
        frag = reader.result;
        resolve(frag);
      }
    };
  });
}

function uploadChunk(chunk, uploadURL, position, totalLength) {
  var max = position + chunk.byteLength - 1;
  return new Promise((resolve, reject) => {
    try {
      let crHeader = "bytes " + position + "-" + max + "/" + totalLength;
      fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Range": crHeader,
          "Content-Type": "application/octet-stream",
        },
        contentType: "application/octet-stream",
        body: chunk,
        processData: false,
      })
        .then(async (response) => {
          console.log("\n\n=> ", response);
          results = {};
          results.status = response.status;
          results.json = await response.json();
          console.log(results.json);
          resolve(results);
        })
        .catch((err) => {
          console.log("No se pudo cargar el fragmento: " + err.responseText);
          console.log("Content-Range header is : " + crHeader);
        });
    } catch (e) {
      console.log("exception uploadChunk:  " + e);
      reject(e);
    }
  });
}
