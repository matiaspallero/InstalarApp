// botones.js

// IMPORTANTE: Reemplaza 'TU_IP_LOCAL_AQUI' con la dirección IP de la computadora donde corre el servidor.
const SERVER_IP = '192.168.1.38'; // Ejemplo: '192.168.1.105'
const API_BASE_URL = `http://${SERVER_IP}:5000`;

// Función para agregar o actualizar un aire
export const saveAire = async (endpointPath, currentAire, formData, fetchData, closeModal) => {
  try {
    // Validar datos antes de enviar
    // La validación de Ubicacion puede ser opcional dependiendo de la lógica de negocio
    if (!formData.Marca || !formData.Frigorias || !formData.Ubicacion ) {
      alert('Por favor complete todos los campos requeridos (Marca, Frigorías y Ubicación).');
      return;
    }

    // Asumimos que el ID se pasa en currentAire.id (ej. currentAire.idMetro, currentAire.idMonteros)
    const url = currentAire
      ? `${API_BASE_URL}/${endpointPath}/${currentAire.id}`
      : `${API_BASE_URL}/${endpointPath}`;

    const method = currentAire ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Marca: formData.Marca,
        Frigorias: parseInt(formData.Frigorias),
        Ubicacion: formData.Ubicacion // Incluir Ubicacion
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error del servidor: ${errorText}`);
    }

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    alert(currentAire ? 'Aire actualizado exitosamente' : 'Aire agregado exitosamente');
    await fetchData();
    closeModal();
  } catch (error) {
    console.error('Error en saveAire:', error);
    alert(`Error: ${error.message}`);
  }
};

// Función para eliminar un aire
export const deleteAire = async (endpointPath, id, fetchData) => {
  try {
    const url = `${API_BASE_URL}/${endpointPath}/${id}`;
    console.log(`URL de eliminación para ${endpointPath}:`, url); // Depuración

    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del servidor:", errorText); // Depuración
      throw new Error('Error al eliminar el aire');
    }

    alert('Aire eliminado exitosamente');
    await fetchData(); // Actualiza la lista después de eliminar
  } catch (error) {
    console.error('Error al eliminar el aire:', error);
    alert('Error al eliminar el aire');
  }
};
