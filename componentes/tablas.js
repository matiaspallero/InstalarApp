

const mysql = require('mysql2');

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1', // Dirección del servidor MySQL
  user: 'root',      // Usuario de la base de datos
  password: 'matyotto29', // Contraseña de la base de datos
  database: 'InstaLaR' // Nombre de la base de datos
});

// Conectar a MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Función para obtener todos los registros de la tabla Aires
const obtenerAires = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Aires', (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
};

// Función para insertar un nuevo registro en la tabla Aires
const insertarAire = (Marca, Frigorias) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO Aires (Marca, Frigorias) VALUES (?, ?)',
      [Marca, Frigorias],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: results.insertId, Marca, Frigorias });
      }
    );
  });
};

module.exports = { obtenerAires, insertarAire };