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
    const url = `http://192.168.1.49:5000/aires/${id}`;
    console.log("URL de eliminación:", url); // Depuración

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