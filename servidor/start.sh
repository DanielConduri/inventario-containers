#!/bin/bash
# Ejecutar los tests
# npm test
# if [ $? -eq 0 ]; then
#     echo "Tests pasaron, iniciando el servidor..."
#     npm start
# else
#     echo "Los tests fallaron, deteniendo el contenedor."
#     exit 1
# fi

if docker ps -a --format '{{.Names}}' | grep -q "api-inventario"; then
    echo "Eliminando contenedor 'api-inventario'..."
    docker rm -f api-inventario
else
    echo "El contenedor 'container-productos' no existe."
fi
          
if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "img-node"; then
    echo "Eliminando imagen 'img-node'..."
    docker rmi -f img-node
else
    echo "La imagen 'img-node' no existe."
fi