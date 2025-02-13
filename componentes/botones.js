// botones.js

// Función para agregar o actualizar un aire
export const saveAire = async (currentAire, formData, fetchData, closeModal) => {
  try {
    // Validar datos antes de enviar
    if (!formData.Marca || !formData.Frigorias) {
      alert('Por favor complete todos los campos');
      return;
    }

    const url = currentAire
      ? `http://192.168.1.49:5000/aires/${currentAire.idAires}`
      : 'http://192.168.1.49:5000/aires';

    const method = currentAire ? 'PUT' : 'POST';
    console.log(`Enviando petición ${method} a:`, url);
    console.log('Datos a enviar:', {
      Marca: formData.Marca,
      Frigorias: parseInt(formData.Frigorias)
    });

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Marca: formData.Marca,
        Frigorias: parseInt(formData.Frigorias)
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
export const deleteAire = async (id, fetchData) => {
  try {
    // Envía una solicitud DELETE al backend
    const response = await fetch(`http://192.168.1.49:5000/aires/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el aire');
    }

    alert('Aire eliminado exitosamente');
    await fetchData();
  } catch (error) {
    console.error('Error al eliminar el aire:', error);
    alert('Error al eliminar el aire');
  }
};