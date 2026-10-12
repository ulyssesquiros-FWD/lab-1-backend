const http = require('http');
const https = require('https');

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;
    const reqOptions = { ...options };
    let bodyData = null;

    if (options.body) {
      bodyData = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      reqOptions.headers = {
        ...options.headers,
        'Content-Length': Buffer.byteLength(bodyData)
      };
    }

    const req = client.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });
    req.on('error', reject);
    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

async function runValidations() {
  console.log('=== INICIANDO VALIDACIÓN TÉCNICA DE ENDPOINTS ===\n');

  try {
    // 1. GET /productos
    console.log('1. Probando: GET http://localhost:3000/productos');
    const res1 = await request('http://localhost:3000/productos');
    console.log(`   Status: ${res1.statusCode} | Total productos: ${res1.data.length}`);
    if (res1.statusCode !== 200 || !Array.isArray(res1.data)) throw new Error('Fallo en petición 1');

    // 2. GET /productos/2
    console.log('2. Probando: GET http://localhost:3000/productos/2');
    const res2 = await request('http://localhost:3000/productos/2');
    console.log(`   Status: ${res2.statusCode} | Producto: ${res2.data.nombre} ($${res2.data.precio})`);
    if (res2.statusCode !== 200 || res2.data.id !== 2 || res2.data.nombre !== 'Mouse inalámbrico') {
      throw new Error('Fallo en petición 2');
    }

    // 3. POST /productos
    console.log('3. Probando: POST http://localhost:3000/productos');
    const nuevoProducto = { nombre: "Auriculares", precio: 32000, stock: 20 };
    const res3 = await request('http://localhost:3000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: nuevoProducto
    });
    console.log(`   Status: ${res3.statusCode} | ID generado: ${res3.data.id} | Nombre: ${res3.data.nombre}`);
    if ((res3.statusCode !== 201 && res3.statusCode !== 200) || res3.data.nombre !== 'Auriculares') {
      throw new Error('Fallo en petición 3');
    }

    // 4. PUT /productos/1
    console.log('4. Probando: PUT http://localhost:3000/productos/1');
    const productoActualizado = { id: 1, nombre: "Teclado mecánico actualizado", precio: 27000, stock: 10 };
    const res4 = await request('http://localhost:3000/productos/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: productoActualizado
    });
    console.log(`   Status: ${res4.statusCode} | Nombre actualizado: ${res4.data.nombre} | Precio: ${res4.data.precio}`);
    if (res4.statusCode !== 200 || res4.data.nombre !== 'Teclado mecánico actualizado') {
      throw new Error('Fallo en petición 4');
    }

    // 5. DELETE /productos/3
    console.log('5. Probando: DELETE http://localhost:3000/productos/3');
    const res5 = await request('http://localhost:3000/productos/3', { method: 'DELETE' });
    console.log(`   Status: ${res5.statusCode}`);
    if (res5.statusCode !== 200 && res5.statusCode !== 204) throw new Error('Fallo en petición 5 (DELETE)');

    // 5b. Comprobación posterior
    console.log('5b. Comprobación posterior: GET http://localhost:3000/productos/3');
    const res5b = await request('http://localhost:3000/productos/3');
    console.log(`   Status comprobación posterior (esperado 404): ${res5b.statusCode}`);
    if (res5b.statusCode !== 404) throw new Error('El producto 3 aún existe tras DELETE');

    // 6. GET /productos?_sort=precio
    console.log('6. Probando: GET http://localhost:3000/productos?_sort=precio');
    const res6 = await request('http://localhost:3000/productos?_sort=precio');
    console.log(`   Status: ${res6.statusCode} | Precios recibidos:`, res6.data.map(p => p.precio));
    for (let i = 0; i < res6.data.length - 1; i++) {
      if (res6.data[i].precio > res6.data[i + 1].precio) {
        throw new Error(`Los productos no están ordenados ascendentemente: ${res6.data[i].precio} > ${res6.data[i + 1].precio}`);
      }
    }
    console.log('   Ordenamiento ascendente verificado con éxito.');

    // 7. GET https://jsonplaceholder.typicode.com/posts
    console.log('7. Probando API Pública: GET https://jsonplaceholder.typicode.com/posts');
    const res7 = await request('https://jsonplaceholder.typicode.com/posts');
    console.log(`   Status: ${res7.statusCode} | Total publicaciones: ${res7.data.length}`);
    if (res7.statusCode !== 200 || !Array.isArray(res7.data)) throw new Error('Fallo en petición 7');

    // 8. GET https://jsonplaceholder.typicode.com/posts/1
    console.log('8. Probando API Pública: GET https://jsonplaceholder.typicode.com/posts/1');
    const res8 = await request('https://jsonplaceholder.typicode.com/posts/1');
    console.log(`   Status: ${res8.statusCode} | Post ID: ${res8.data.id} | Titulo: ${res8.data.title.substring(0, 30)}...`);
    if (res8.statusCode !== 200 || res8.data.id !== 1) throw new Error('Fallo en petición 8');

    // 9. GET https://jsonplaceholder.typicode.com/posts?userId=1
    console.log('9. Probando API Pública: GET https://jsonplaceholder.typicode.com/posts?userId=1');
    const res9 = await request('https://jsonplaceholder.typicode.com/posts?userId=1');
    console.log(`   Status: ${res9.statusCode} | Total publicaciones userId=1: ${res9.data.length}`);
    if (res9.statusCode !== 200 || !Array.isArray(res9.data) || res9.data.length === 0) throw new Error('Fallo en petición 9');
    const todosUser1 = res9.data.every(p => p.userId === 1);
    if (!todosUser1) throw new Error('Hay publicaciones que no pertenecen a userId 1');
    console.log('   Filtro por userId=1 verificado con éxito.');

    console.log('\n=== TODAS LAS 9 PETICIONES Y COMPROBACIONES FUERON EXITOSAS ===');
  } catch (err) {
    console.error('\n❌ ERROR DURANTE LA VALIDACIÓN:', err.message);
    process.exit(1);
  }
}

runValidations();
