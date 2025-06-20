import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { saveAire, deleteAire } from "../componentes/botones"; // Importar las funciones desde botones.js
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import QRCode from 'react-native-qrcode-svg'; // Importar QRCode

// IMPORTANTE: Reemplaza 'TU_IP_LOCAL_AQUI' con la dirección IP de la computadora donde corre el servidor.
const SERVER_IP = '192.168.1.38'; // Ejemplo: '192.168.1.105'
const API_BASE_URL = `http://${SERVER_IP}:5000`;

const AppConcepcion = () => {
  const [airesConcepcion, setAiresConcepcion] = useState([]); // Estado para los datos de la tabla concepcion
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [currentAire, setCurrentAire] = useState(null); // Estado para almacenar el aire que se está editando
  const [formData, setFormData] = useState({ Marca: "", Frigorias: "", Ubicacion: "", Servicio: "" }); // Formulario
  const ENDPOINT_PATH = "concepcion"; // Endpoint específico para esta pantalla
  const [infoModalVisible, setInfoModalVisible] = useState(false); // Estado para el modal de información
  const [selectedAireDetails, setSelectedAireDetails] = useState(null); // Estado para los detalles del aire seleccionado
  const [qrCodeValue, setQrCodeValue] = useState(''); // Estado para el valor del código QR
  const [displayQrInModal, setDisplayQrInModal] = useState(false); // Estado para mostrar QR en el modal

  // Función para obtener los datos del backend
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${ENDPOINT_PATH}`); // Usar el endpoint correcto
      const data = await response.json();
      setAiresConcepcion(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para abrir el modal de agregar/editar
  const openModal = (concepcion = null) => {
    if (concepcion) {
      console.log(`Editando aire para ${ENDPOINT_PATH}:`, concepcion);
      setCurrentAire(concepcion);
      setFormData({
        Marca: concepcion.Marca || "",
        Frigorias: concepcion.Frigorias ? concepcion.Frigorias.toString() : "",
        Ubicacion: concepcion.Ubicacion || "",
        Servicio: concepcion.Servicio || "",
        // id: concepcion.idConcepcion // El ID se manejará en handleSave al construir el objeto
      });
    } else {
      setCurrentAire(null);
      setFormData({ Marca: "", Frigorias: "", Ubicacion: "", Servicio: "" });
    }
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
    setCurrentAire(null);
    setFormData({ Marca: "", Frigorias: "", Ubicacion: "", Servicio: "" });
  };

    // Función para abrir el modal de información
  const openInfoModal = (concepcion) => {
    setSelectedAireDetails(concepcion);
    setQrCodeValue(''); // Limpiar valor QR anterior
    setDisplayQrInModal(false); // No mostrar QR inicialmente
    setInfoModalVisible(true);
  };

  // Función para cerrar el modal de información
  const closeInfoModal = () => {
    setInfoModalVisible(false);
    setSelectedAireDetails(null);
    setQrCodeValue('');
    setDisplayQrInModal(false);
  };

    // Función para generar y mostrar el código QR
  const handleGenerateQr = () => {
    if (selectedAireDetails) {
      const qrData = JSON.stringify({
        id: selectedAireDetails.idMetro,
        marca: selectedAireDetails.Marca,
        frigorias: selectedAireDetails.Frigorias,
        ubicacion: selectedAireDetails.Ubicacion,
        servicio: selectedAireDetails.Servicio,
        screen: ENDPOINT_PATH, // Identificador de la pantalla/tabla de origen
      });
      setQrCodeValue(qrData);
      setDisplayQrInModal(true);
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (name, value) => {
    console.log(`Cambiando ${name} a:`, value); // Para debugging
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Preparamos el objeto currentAire para saveAire, asegurando que tenga el ID correcto si es una edición.
    // Asumimos que la API para /concepcion devuelve 'idConcepcion' como identificador.
    const aireParaGuardar = currentAire ? { ...formData, id: currentAire.idConcepcion } : null;
    saveAire(ENDPOINT_PATH, aireParaGuardar, formData, fetchData, closeModal);
  };

  const handleDelete = (id) => {
    deleteAire(ENDPOINT_PATH, id, fetchData);
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
          <Button title="Agregar Aire" onPress={() => openModal()} activeOpacity={0.5}/>
        </View>
        <FlatList
          data={airesConcepcion}
          // Asumimos que la API para /concepcion devuelve objetos con idConcepcion
          keyExtractor={(item) => item.idConcepcion.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.marca}>Marca: {item.Marca}</Text>
              <Text style={styles.frigorias}>Frigorías: {item.Frigorias}</Text>
              <Text style={styles.ubicacion}>Ubicación: {item.Ubicacion}</Text>
              <Text style={styles.servicio}>Servicio: {item.Servicio}</Text>
              <View style={styles.actions}>
                <Button title="Info" onPress={() => openInfoModal(item)} activeOpacity={0.5}>Info</Button>
                <Button title="Editar" onPress={() => openModal(item)} activeOpacity={0.5}/>
                <Button
                  title="Eliminar"
                  onPress={() => handleDelete(item.idConcepcion)} // Usar idConcepcion y la nueva función
                  activeOpacity={0.5}
                />
              </View>
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
        />

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {currentAire ? "Editar Aire" : "Agregar Aire"}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Marca"
                value={formData.Marca}
                onChangeText={(text) => handleInputChange("Marca", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Frigorías"
                value={formData.Frigorias}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  handleInputChange("Frigorias", numericValue);
                }}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Ubicación"
                value={formData.Ubicacion}
                onChangeText={(text) => handleInputChange("Ubicacion", text)}
              />
              <TextInput
                style={styles.input}
                 placeholder="Servicio"
                value={formData.Servicio}
                onChangeText={(text) => handleInputChange("Servicio", text)}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={closeModal} />
                <Button title="Guardar" onPress={handleSave} />
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal para mostrar detalles del Aire */}
        {selectedAireDetails && (
          <Modal visible={infoModalVisible} animationType="fade" transparent={true} onRequestClose={closeInfoModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
              {!displayQrInModal ? (
                <>
                <Text style={styles.modalTitle}>Detalles del Aire</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Marca:</Text> {selectedAireDetails.Marca}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Frigorías:</Text> {selectedAireDetails.Frigorias}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Ubicación:</Text> {selectedAireDetails.Ubicacion}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Servicio:</Text> {selectedAireDetails.Servicio}</Text>
                <View style={styles.modalButtons}>
                  <Button title="Generar QR" onPress={handleGenerateQr} />
                  <Button title="Cerrar" onPress={closeInfoModal} />
                </View>
                </>
                ) : (
                <>
                  <Text style={styles.modalTitle}>Código QR</Text>
                    {qrCodeValue ? (
                      <View style={styles.qrCodeContainer}>
                        <QRCode
                          value={qrCodeValue}
                          size={Dimensions.get("window").width * 0.25} // Ajustar tamaño del QR
                          backgroundColor="white"
                          color="black"
                        />
                      </View>
                    ) : <Text>Generando QR...</Text>}
                    <View style={styles.modalButtons}>
                      <Button title="Volver a Detalles" onPress={() => setDisplayQrInModal(false)} />
                      <Button title="Cerrar" onPress={closeInfoModal} />
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        )}

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Estilos de la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },
  marca: {
    fontSize: 18,
    fontWeight: "bold",
    placeholder: "Marca",
  },
  frigorias: {
    fontSize: 16,
    color: "#555",
    placeholder: "Frigorías",
  },
  ubicacion: {
    fontSize: 16,
    color: "#555",
    placeholder: "Ubicación",
  },
  servicio: {
    fontSize: 16,
    color: "#555",
    placeholder: "Servicio",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: Dimensions.get("window").width * 0.8,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  flatListContent: {
    flexGrow: 1,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default AppConcepcion;