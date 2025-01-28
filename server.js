const express = require('express');
const cors = require('cors');
const { obtenerAires, insertarAire } = require('./componentes/tablas'); // Importar funciones de tablas.js

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
    res.status(500).send('Error en el servidor');
  }
});

// Endpoint para insertar datos en la tabla Aires
app.post('/aires', async (req, res) => {
  const { Marca, Frigorias } = req.body;
  try {
    const nuevoAire = await insertarAire(Marca, Frigorias);
    res.status(201).json(nuevoAire);
  } catch (error) {
    console.error('Error al insertar datos:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});