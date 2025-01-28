import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, Dimensions } from 'react-native';

const App = () => {
  const [aires, setAires] = useState([]); // Estado para almacenar los datos de la tabla
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  // Función para obtener los datos del backend
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.1.49:5000/aires');
      const data = await response.json();
      setAires(data); // Guardar los datos en el estado
      setLoading(false); // Desactivar el indicador de carga
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setLoading(false); // Desactivar el indicador de carga en caso de error
    }
  };

  // Ejecutar fetchData cuando el componente se monta
  useEffect(() => {
    fetchData();
  }, []);

  // Mostrar un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  // Renderizar la lista de datos
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tabla de Aires Acondicionados</Text>
      <FlatList
        data={aires}
        keyExtractor={(item) => item.idAires.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.marca}>Marca: {item.Marca}</Text>
            <Text style={styles.frigorias}>Frigorías: {item.Frigorias}</Text>
            <Button style={styles.enviar}>Enviar</Button>
          </View>
        )}
      />
      <View>

      </View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  FlatList: {
    flex: 1,
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.7,
    flexDirection: 'row',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  marca: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  frigorias: {
    fontSize: 16,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enviar: {
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
    
  },
});

export default App;