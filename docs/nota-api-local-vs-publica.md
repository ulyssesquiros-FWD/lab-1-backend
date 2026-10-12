# Nota Comparativa: Consumo de API Local vs. API Pública

Durante el desarrollo de esta práctica de laboratorio se contrastó el consumo de una **API REST local** (implementada con Node.js y `json-server` sobre un archivo `db.json`) frente a una **API REST pública externa** ([JSONPlaceholder](https://jsonplaceholder.typicode.com)). 

La **API local** se ejecuta de manera autónoma en el entorno propio del desarrollador (`http://localhost:3000`), lo que confiere un control total sobre la estructura de los datos, los identificadores, la persistencia inmediata en el archivo local y la disponibilidad del servicio sin requerir acceso a internet. Asimismo, permite ejecutar operaciones completas de lectura y escritura (`GET`, `POST`, `PUT`, `DELETE`), alterando directamente el estado de `db.json`. 

En contraposición, la **API pública** reside en una infraestructura remota sujeta a la disponibilidad del proveedor y depende estrictamente de una conexión activa a internet y de la latencia de red. Aunque ofrece datos listos para consumo, en este ejercicio se operó bajo un esquema de solo lectura (`GET` con consultas y filtrado por parámetros), donde el cliente no tiene gobernanza sobre los registros ni permisos para mutar de forma persistente la base de datos subyacente del servidor remoto.
