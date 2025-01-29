// botones.js

// Función para agregar o actualizar un aire
export const saveAire = async (currentAire, formData, fetchData, closeModal) => {
  try {
    const url = currentAire
      ? `http://192.168.1.49:5000/aires/${currentAire.idAires}`
      : 'http://192.168.1.49:5000/aires';

    const response = await fetch(url, {
      method: currentAire ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Marca: formData.Marca,
        Frigorias: parseInt(formData.Frigorias)
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      alert('Aire guardado exitosamente');
      fetchData();
      closeModal();
    } else {
      alert('Error al guardar: ' + (responseData.message || 'Error desconocido'));
    }
  } catch (error) {
    console.error('Error al guardar el aire:', error);
    alert('Error al guardar el aire. Por favor, intente nuevamente');
  }
};

// Función para eliminar un aire
export const deleteAire = async (id, fetchData) => {
  try {
    // Envía una solicitud DELETE al backend
    const response = await fetch(`http://192.168.1.49:5000/aires/${id}`, {
      method: 'DELETE',
    });

    // Si la solicitud es exitosa, recarga los datos
    if (response.ok) {
      fetchData(); // Recargar los datos
    }
  } catch (error) {
    console.error('Error al eliminar el aire:', error);
  }
};