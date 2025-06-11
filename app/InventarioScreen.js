import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Platform } from 'react-native'; // Importar Platform
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// IMPORTANTE: Reemplaza 'TU_IP_LOCAL_AQUI' con la dirección IP de la computadora donde corre el servidor.
const SERVER_IP = '192.168.1.38'; // Ejemplo: '192.168.1.105'
const API_BASE_URL = `http://${SERVER_IP}:5000`;

const fetchDataFromEndpoint = async (endpointPath, pantallaOrigen, idKey) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpointPath}`);
    if (!response.ok) {
      throw new Error(`Error al obtener datos de ${endpointPath}: ${response.status}`);
    }
    const data = await response.json();
    // Adaptar los datos al formato esperado por InventoryScreen
    return data.map(item => ({
      id: `${endpointPath}_${item[idKey]}`, // Crear un ID único para el FlatList
      nombre: item.Marca, // Usar Marca como nombre
      ubicacion: item.Ubicacion,
      frigorias: item.Frigorias, // Mantener frigorias por si se necesita
      pantallaOrigen: pantallaOrigen,
      servicio: item.Servicio,
      originalId: item[idKey], // Guardar el ID original por si se necesita
    }));
  } catch (error) {
    console.error(`Error en fetchAiresFrom ${pantallaOrigen}:`, error);
    return []; // Retornar un array vacío en caso de error para no romper Promise.all
  }
};

// Obtener datos del endpoint /metro
const fetchAiresFromMetro = async () => {
  return fetchDataFromEndpoint('metro', 'Metro', 'idMetro');
};

// Obtener datos del endpoint /monteros
const fetchAiresFromMonteros = async () => {
  return fetchDataFromEndpoint('monteros', 'Monteros', 'idMonteros');
};

// Obtener datos del endpoint /concepcion
const fetchAiresFromConcepcion = async () => {
  return fetchDataFromEndpoint('concepcion', 'Concepción', 'idConcepcion');
};


const InventarioScreen = () => {
  const [allAires, setAllAires] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define la función para cargar los aires, envuelta en useCallback para estabilidad
  const loadAllAires = useCallback(async () => {
    try {
        setLoading(true);
        // Carga los datos de todas las pantallas en paralelo
        const [airesScreen1, airesScreen2, airesScreen3] = await Promise.all([
          fetchAiresFromMetro(),
          fetchAiresFromMonteros(),
          fetchAiresFromConcepcion(),
        ]);

        // Combina los resultados
        setAllAires([...(airesScreen1 || []), ...(airesScreen2 || []), ...(airesScreen3 || [])]);
      } catch (error) {
        console.error("Error al cargar los aires:", error);
        // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
      } finally {
        setLoading(false);
      }
  }, []); // Las dependencias de useCallback están vacías porque las funciones fetch son estables

  // Usa useFocusEffect para recargar los datos cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      loadAllAires();
    }, [loadAllAires]) // Dependencia en la función loadAllAires memoizada
  );

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.nombre}</Text>
      <Text>Frigorías: {item.frigorias}</Text>
      <Text>Ubicación: {item.ubicacion}</Text>
      <Text>Servicio: {item.servicio}</Text>
      <Text style={styles.itemOrigen}>Origen: {item.pantallaOrigen}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* El indicador de carga principal se maneja antes de este bloque de retorno,
            por lo que FlatList solo se renderiza cuando loading es false. */}
        <View style={styles.contentView}>
          <FlatList
            data={allAires}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.flatList} // Asegura que la FlatList ocupe el espacio de contentView
            ListHeaderComponent={<Text style={styles.header}>Inventario Total de Aires Acondicionados</Text>}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay aires acondicionados para mostrar.</Text>}
            contentContainerStyle={styles.flatListContent} // Para el layout interno de la lista (ej. ListEmptyComponent)
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Fondo similar a otras pantallas
  },
  contentView: { // Nuevo contenedor para el padding interno
    flex: 1,
    padding: 20,
    ...(Platform.OS === 'web' && { overflowY: 'auto' }), // Clave para el scroll en web en este contenedor
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#ffffff', // Fondo blanco para efecto tarjeta
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemOrigen: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#555'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  flatListContent: {
    flexGrow: 1,
  },
  flatList: { // Estilo para la FlatList
    flex: 1, // Para que la FlatList se expanda dentro de contentView
  }
});

export default InventarioScreen;
