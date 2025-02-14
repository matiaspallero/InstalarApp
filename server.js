const express = require('express');
const cors = require('cors');
const { obtenerAires, insertarAire, eliminarAire } = require('./componentes/tablas');


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
    console.log('Actualizando aire:', { id, Marca, Frigorias });
    
    if (!Marca || !Frigorias) {
      return res.status(400).json({ error: 'Marca y Frigorías son requeridas' });
    }

    const resultado = await tablas.actualizarAire(id, Marca, Frigorias);
    console.log('Resultado de la actualización:', resultado);
    
    res.json(resultado);
  } catch (error) {
    console.error('Error en la ruta PUT:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/aires/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarAire(id); // Usar la función importada
    res.status(200).json({ message: 'Aire eliminado exitosamente', result });
  } catch (error) {
    console.error('Error al eliminar el aire:', error);
    res.status(500).json({ error: 'Error al eliminar el aire' });
  }
});

const tablas = require('./componentes/tablas'); // Asegúrate de que la ruta es correcta


// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});