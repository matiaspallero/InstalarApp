const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
// Se importan las funciones específicas para la tabla 'metro' y se les da un alias
const {
  obtenerAiresMETRO: obtenerAiresMetro,
  insertarAireMETRO: insertarAireMetro,
  actualizarAireMETRO: actualizarAireMetro,
  eliminarAireMETRO: eliminarAireMetro,
} = require('./componentes/tablaMetro'); // Usar funciones de tablaMetro.js

const {
  obtenerAiresM: obtenerAiresMonteros,
  insertarAireM: insertarAireMonteros,
  actualizarAireM: actualizarAireMonteros,
  eliminarAireM: eliminarAireMonteros
} = require('./componentes/tablaMonteros'); // Usa funciones de tablaMonteros.js

const {
  obtenerAiresC: obtenerAiresConcepcion,
  insertarAireC: insertarAireConcepcion,
  actualizarAireC: actualizarAireConcepcion,
  eliminarAireC: eliminarAireConcepcion
} = require('./componentes/tablaConcepcion'); // Usa funciones de tablaConcepcion.js


const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para obtener datos de la tabla Aires
app.get('/metro', async (req, res) => {
  try {
    const aires = await obtenerAiresMetro(); // Usar la función de tablaMetro
    res.json(aires);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/monteros', async (req, res) => {
  try {
    const aires = await obtenerAiresMonteros(); // Usar la función de tablaMonteros
    res.json(aires);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/concepcion', async (req, res) => {
  try {
    const aires = await obtenerAiresConcepcion(); // Usar la función de tablaConcepcion
    res.json(aires);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Endpoint para insertar datos en la tabla Aires
app.post('/metro', async (req, res) => {
  try {
    const { Marca, Frigorias, Ubicacion, Servicio } = req.body; // Incluir Ubicacion

    // Validaciones
    if (!Marca || !Frigorias || !Ubicacion || !Servicio) { // Considerar validar Ubicacion si es mandatorio
      return res.status(400).json({
        message: 'La marca y las frigorías son requeridas'
      });
    }

    const resultado = await insertarAireMetro(Marca, Frigorias, Ubicacion, Servicio); // Usar la función de tablaMetro
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ // Corregido para que coincida con el formato de error de PUT
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

app.post('/monteros', async (req, res) => {
  try {
    const { Marca, Frigorias, Ubicacion, Servicio } = req.body; // Incluir Ubicacion

    // Validaciones
    if (!Marca || !Frigorias || !Ubicacion || !Servicio) { // Considerar validar Ubicacion si es mandatorio
      return res.status(400).json({
        message: 'La marca y las frigorías son requeridas'
      });
    }

    const resultado = await insertarAireMonteros(Marca, Frigorias, Ubicacion, Servicio); // Usar la función de tablaMonteros
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ // Corregido para que coincida con el formato de error de PUT
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

app.post('/concepcion', async (req, res) => {
  try {
    const { Marca, Frigorias, Ubicacion, Servicio } = req.body; // Incluir Ubicacion

    // Validaciones
    if (!Marca || !Frigorias || !Ubicacion || !Servicio) { // Considerar validar Ubicacion si es mandatorio
      return res.status(400).json({
        message: 'La marca y las frigorías son requeridas'
      });
    }

    const resultado = await insertarAireConcepcion(Marca, Frigorias, Ubicacion, Servicio); // Usar la función de tablaConcepcion
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ // Corregido para que coincida con el formato de error de PUT
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

app.put('/metro/:id', async (req, res) => {
  const { id } = req.params;
  const { Marca, Frigorias, Ubicacion, Servicio } = req.body; // Incluir Ubicacion

  try {
    if (!Marca || !Frigorias || !Ubicacion || !Servicio) { // Considerar validar Ubicacion si es mandatorio
      return res.status(400).json({ error: 'Marca, Frigorías y Ubicación son requeridas' });
    }

    // Usar la función de tablaMetro, el id es idMetro
    const resultado = await actualizarAireMetro(id, Marca, Frigorias, Ubicacion, Servicio);
    res.json(resultado);
  } catch (error) {
    console.error('Error en la ruta PUT:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/monteros/:id', async (req, res) => {
  const { id } = req.params;
  const { Marca, Frigorias, Ubicacion, Servicio } = req.body; // Incluir Ubicacion

  try {
    if (!Marca || !Frigorias || !Ubicacion || !Servicio) { // Considerar validar Ubicacion si es mandatorio
      return res.status(400).json({ error: 'Marca, Frigorías, Ubicación y Servicio son requeridas' });
    }

    // Usar la función de tablaMonteros, el id es idMonteros
    const resultado = await actualizarAireMonteros(id, Marca, Frigorias, Ubicacion, Servicio);
    res.json(resultado);
  } catch (error) {
    console.error('Error en la ruta PUT:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/concepcion/:id', async (req, res) => {
  const { id } = req.params;
  const { Marca, Frigorias, Ubicacion, Servicio } = req.body; // Incluir Ubicacion

  try {
    if (!Marca || !Frigorias || !Ubicacion || !Servicio) { // Considerar validar Ubicacion si es mandatorio
      return res.status(400).json({ error: 'Marca, Frigorías y Ubicación son requeridas' });
    }

    // Usar la función de tablaConcepcion, el id es idConcepcion
    const resultado = await actualizarAireConcepcion(id, Marca, Frigorias, Ubicacion, Servicio);
    res.json(resultado);
  } catch (error) {
    console.error('Error en la ruta PUT:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/metro/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarAireMetro(id); // Usar la función de tablaMetro, el id es idMetro
    res.status(200).json({ message: 'Aire eliminado exitosamente', result });
  } catch (error) {
    console.error('Error al eliminar el aire:', error);
    res.status(500).json({ error: 'Error al eliminar el aire' });
  }
});

app.delete('/monteros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarAireMonteros(id); // Usar la función de tablaMonteros, el id es idMonteros
    res.status(200).json({ message: 'Aire eliminado exitosamente', result });
  } catch (error) {
    console.error('Error al eliminar el aire:', error);
    res.status(500).json({ error: 'Error al eliminar el aire' });
  }
});

app.delete('/concepcion/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarAireConcepcion(id); // Usar la función de tablaConcepcion, el id es idConcepcion
    res.status(200).json({ message: 'Aire eliminado exitosamente', result });
  } catch (error) {
    console.error('Error al eliminar el aire:', error);
    res.status(500).json({ error: 'Error al eliminar el aire' });
  }
});

// Proxy middleware para el frontend (servidor de desarrollo de Expo)
// Esto debe ir DESPUÉS de tus rutas de API.
// Asume que el servidor de desarrollo de Expo corre en el puerto 8081.
// Cámbialo si `npm run web` usa un puerto diferente (ej. 19306).
const EXPO_DEV_SERVER_PORT = 8081; // O el puerto que use `expo start --web`
app.use('/', createProxyMiddleware({
  target: `http://localhost:${EXPO_DEV_SERVER_PORT}`,
  changeOrigin: true,
  ws: true, // Habilitar proxy para WebSockets (importante para HMR)
  logLevel: 'info', // Opcional: 'debug' para más detalles del proxy
  onError: function(err, req, res) {
    console.error('Error del Proxy:', err);
    if (res && !res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
    }
    if (res) {
        res.end('Error del Proxy: No se pudo conectar al servidor de desarrollo de Expo en el puerto ' + EXPO_DEV_SERVER_PORT + '. ¿Está `npm run web` ejecutándose?');
    }
  }
}));

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor API y Proxy corriendo en http://localhost:${PORT}`);
  console.log(`Asegúrate de que el servidor de desarrollo de Expo (npm run web) esté corriendo en http://localhost:${EXPO_DEV_SERVER_PORT}`);
  console.log(`Accede a la aplicación web a través de http://localhost:${PORT}`);
});
