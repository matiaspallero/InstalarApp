import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, Dimensions, Modal, TextInput, ScrollView } from 'react-native';
import { saveAire, deleteAire } from '../componentes/botones'; // Importar las funciones desde botones.js
import { SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  const [aires, setAires] = useState([]); // Estado para almacenar los datos de la tabla
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [currentAire, setCurrentAire] = useState(null); // Estado para almacenar el aire que se está editando
  const [formData, setFormData] = useState({ Marca: '', Frigorias: '' }); // Estado para manejar los datos del formulario

  // Función para obtener los datos del backend
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.1.49:5000/aires');
      const data = await response.json();
      setAires(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para abrir el modal de agregar/editar
  const openModal = (aire = null) => {
    if (aire) {
      console.log('Editando aire:', aire); // Para debugging
      setCurrentAire(aire);
      setFormData({
        Marca: aire.Marca || '',
        Frigorias: aire.Frigorias ? aire.Frigorias.toString() : ''
      });
    } else {
      setCurrentAire(null);
      setFormData({ Marca: '', Frigorias: '' });
    }
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
    setCurrentAire(null);
    setFormData({ Marca: '', Frigorias: '' });
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (name, value) => {
    console.log(`Cambiando ${name} a:`, value); // Para debugging
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = () => {
    saveAire(currentAire, formData, fetchData, closeModal);
  };
  

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
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.title}>Tabla de Aires Acondicionados</Text>
        <View style={styles.buttonContainer}>
          <Button title="Agregar Aire" onPress={() => openModal()} />
        </View>
        <FlatList
          data={aires}
          keyExtractor={(item) => item.idAires.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.marca}>Marca: {item.Marca}</Text>
              <Text style={styles.frigorias}>Frigorías: {item.Frigorias}</Text>
              <View style={styles.actions}>
                <Button title="Editar" onPress={() => openModal(item)} />
                <Button title="Eliminar" onPress={() => deleteAire(item.idAires, fetchData)} />
              </View>
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
        />

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {currentAire ? 'Editar Aire' : 'Agregar Aire'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Marca"
                value={formData.Marca}
                onChangeText={(text) => handleInputChange('Marca', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Frigorías"
                value={formData.Frigorias}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, '');
                  handleInputChange('Frigorias', numericValue);
                }}
                keyboardType="numeric"
              />
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={closeModal} />
                <Button title="Guardar" onPress={handleSave} />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Estilos de la aplicación
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
  buttonContainer: {
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default App;