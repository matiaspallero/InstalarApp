const express = require('express');
const cors = require('cors');
const { obtenerAires, insertarAire } = require('./componentes/tablas');

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

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});