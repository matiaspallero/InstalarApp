const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { obtenerAires, insertarAire, actualizarAire, eliminarAire } = require('./componentes/tablas');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para obtener datos de la tabla Aires
app.get('/aires', async (req, res) => {
  try {
    const aires = await obtenerAires();
    res.json(aires);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Endpoint para insertar datos en la tabla Aires
app.post('/aires', async (req, res) => {
  try {
    const { Marca, Frigorias } = req.body;
    
    // Validaciones
    if (!Marca || !Frigorias) {
      return res.status(400).json({
        message: 'La marca y las frigorías son requeridas'
      });
    }

    const resultado = await insertarAire(Marca, Frigorias);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

app.put('/aires/:id', async (req, res) => {
  const { id } = req.params;
  const { Marca, Frigorias } = req.body;

  try {
    if (!Marca || !Frigorias) {
      return res.status(400).json({ error: 'Marca y Frigorías son requeridas' });
    }

    // Usar 'actualizarAire' directamente ya que está desestructurado
    const resultado = await actualizarAire(id, Marca, Frigorias);
    res.json(resultado);
  } catch (error) {
    console.error('Error en la ruta PUT:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/aires/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarAire(id);
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
