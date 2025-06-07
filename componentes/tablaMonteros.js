// tablas.js
//console.log("tablasMonteros.js cargado correctamente");


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
});

// Función para obtener todos los registros de la tabla Aires
const obtenerAiresM = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM monteros', (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results); // Devuelve los resultados de la consulta
    });
  });
};

// Función para insertar un nuevo registro en la tabla Aires
const insertarAireM = (Marca, Frigorias, Ubicacion, Servicio) => {
  return new Promise((resolve, reject) => {
    if (!Marca || !Frigorias || !Ubicacion || !Servicio) { // Considera validar Ubicacion si es mandatorio
      reject(new Error('Marca, Frigorías y ubicación son requeridas.'));
      return;
    }

    connection.query(
      'INSERT INTO monteros (Marca, Frigorias, Ubicacion, Servicio) VALUES (?, ?, ?, ?)',
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
          Servicio
        });
      }
    );
  });
};

// Función para actualizar un registro en la tabla Aires
const actualizarAireM = (idMonteros, Marca, Frigorias, Ubicacion, Servicio) => {
  return new Promise((resolve, reject) => {
    // Considera validar los campos aquí también
    connection.query(
      'UPDATE monteros SET Marca = ?, Frigorias = ?, Ubicacion = ?, Servicio = ? WHERE idMonteros = ?',
      [Marca, Frigorias, Ubicacion, Servicio, idMonteros],
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
const eliminarAireM = (idMonteros) => {
  return new Promise((resolve, reject) => {
    console.log("ID del aire (monteros) a eliminar:", idMonteros); // Depuración

    connection.query(
      'DELETE FROM monteros WHERE idMonteros = ?',
      [idMonteros],
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
module.exports = { obtenerAiresM, insertarAireM, actualizarAireM, eliminarAireM };
