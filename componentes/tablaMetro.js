// tablas.js
//console.log("tablasMetro.js cargado correctamente");


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
const obtenerAiresMETRO = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM metro', (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results); // Devuelve los resultados de la consulta
    });
  });
};

// Función para insertar un nuevo registro en la tabla Aires
const insertarAireMETRO = (Marca, Frigorias, Ubicacion, Servicio) => {
  return new Promise((resolve, reject) => {
    if (!Marca || !Frigorias) { // Considera validar Ubicacion si es mandatorio
      reject(new Error('Marca y Frigorías son requeridas.'));
      return;
    }

    connection.query(
      'INSERT INTO metro (Marca, Frigorias, Ubicacion, Servicio) VALUES (?, ?, ?, ?)',
      [Marca, parseInt(Frigorias), Ubicacion, Servicio],
      (err, results) => {
        if (err) {
          console.error('Error en la inserción:', err);
          reject(err);
          return;
        }
        resolve({
          id: results.insertId,
          Marca,
          Frigorias: parseInt(Frigorias),
          Ubicacion,
          Servicio,
        });
      }
    );
  });
};

// Función para actualizar un registro en la tabla Aires
const actualizarAireMETRO = (idMetro, Marca, Frigorias, Ubicacion, Servicio) => {
  return new Promise((resolve, reject) => {
    // Considera validar los campos aquí también
    connection.query(
      'UPDATE metro SET Marca = ?, Frigorias = ?, Ubicacion = ?, Servicio = ? WHERE idMetro = ?',
      [Marca, Frigorias, Ubicacion, Servicio, idMetro],
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
const eliminarAireMETRO = (idMetro) => {
  return new Promise((resolve, reject) => {
    console.log("ID del aire (metro) a eliminar:", idMetro); // Depuración

    connection.query(
      'DELETE FROM metro WHERE idMetro = ?',
      [idMetro],
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
module.exports = { obtenerAiresMETRO, insertarAireMETRO, actualizarAireMETRO, eliminarAireMETRO };
