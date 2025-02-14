// tablas.js
console.log("tablas.js cargado correctamente");


const mysql = require('mysql2');

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1', // Dirección del servidor MySQL
  user: 'root', // Usuario de la base de datos
  password: 'matyotto29', // Contraseña de la base de datos
  database: 'InstaLaR', // Nombre de la base de datos
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
      resolve(results); // Devuelve los resultados de la consulta
    });
  });
};

// Función para insertar un nuevo registro en la tabla Aires
const insertarAire = (Marca, Frigorias) => {
  return new Promise((resolve, reject) => {
    if (!Marca || !Frigorias) {
      reject(new Error('Marca y Frigorías son requeridas'));
      return;
    }

    connection.query(
      'INSERT INTO Aires (Marca, Frigorias) VALUES (?, ?)',
      [Marca, parseInt(Frigorias)],
      (err, results) => {
        if (err) {
          console.error('Error en la inserción:', err);
          reject(err);
          return;
        }
        resolve({
          id: results.insertId,
          Marca,
          Frigorias: parseInt(Frigorias)
        });
      }
    );
  });
};

// Función para actualizar un registro en la tabla Aires
const actualizarAire = (idAires, Marca, Frigorias) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'UPDATE Aires SET Marca = ?, Frigorias = ? WHERE idAires = ?',
      [Marca, Frigorias, idAires],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results); // Devuelve los resultados de la actualización
      }
    );
  });
};

// Función para eliminar un registro de la tabla Aires
const eliminarAire = (idAires) => {
  return new Promise((resolve, reject) => {
    console.log("ID del aire a eliminar:", idAires); // Depuración

    connection.query(
      'DELETE FROM Aires WHERE idAires = ?',
      [idAires],
      (err, results) => {
        if (err) {
          console.error("Error en la consulta SQL:", err); // Depuración
          reject(err);
          return;
        }
        console.log("Resultados de la eliminación:", results); // Depuración
        resolve(results);
      }
    );
  });
};

// Exportar las funciones para usarlas en otros archivos
module.exports = { obtenerAires, insertarAire, actualizarAire, eliminarAire };
