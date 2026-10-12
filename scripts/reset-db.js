const fs = require('fs');
const path = require('path');

const initialData = {
  "productos": [
    {
      "id": 1,
      "nombre": "Teclado mecánico",
      "precio": 25000,
      "stock": 12
    },
    {
      "id": 2,
      "nombre": "Mouse inalámbrico",
      "precio": 14000,
      "stock": 30
    },
    {
      "id": 3,
      "nombre": "Monitor 24 pulgadas",
      "precio": 98000,
      "stock": 5
    }
  ],
  "usuarios": [
    {
      "id": 1,
      "nombre": "Ana",
      "rol": "admin"
    },
    {
      "id": 2,
      "nombre": "Luis",
      "rol": "cliente"
    }
  ]
};

const dbPath = path.join(__dirname, '..', 'db.json');

try {
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
  console.log('✅ Base de datos db.json restaurada con exito al estado inicial.');
} catch (error) {
  console.error('❌ Error al restaurar db.json:', error.message);
  process.exit(1);
}
