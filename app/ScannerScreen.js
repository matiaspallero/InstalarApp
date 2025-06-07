import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Modal, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      const parsedData = JSON.parse(data);
      console.log('QR Data Parsed:', parsedData);
      // Validar que parsedData tiene los campos esperados
      if (parsedData && parsedData.id && parsedData.marca) {
        setScannedData(parsedData);
        setModalVisible(true);
      } else {
        alert('Código QR no válido o formato incorrecto.');
        setScanned(false); // Permitir volver a escanear
      }
    } catch (e) {
      console.error('Error parsing QR data:', e);
      alert('Error al leer el código QR. Asegúrate de que sea un QR generado por la app.');
      setScanned(false); // Permitir volver a escanear
    }
  };

  const closeInfoModal = () => {
    setModalVisible(false);
    setScanned(false); // Permite escanear de nuevo después de cerrar el modal
    setScannedData(null);
  };

  if (hasPermission === null) {
    return <Text style={styles.centerText}>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.centerText}>Sin acceso a la cámara. Habilita el permiso en la configuración.</Text>;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && !modalVisible && ( // Botón para escanear de nuevo si el modal no está visible pero ya se escaneó
          <View style={styles.rescanButtonContainer}>
            <Button title={'Escanear de Nuevo'} onPress={() => setScanned(false)} />
          </View>
        )}

        {scannedData && (
          <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={closeInfoModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Ficha del Aire Acondicionado</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>ID:</Text> {scannedData.id}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Marca:</Text> {scannedData.marca}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Frigorías:</Text> {scannedData.frigorias}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Ubicación:</Text> {scannedData.ubicacion}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Servicio:</Text> {scannedData.servicio}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Origen (Pantalla):</Text> {scannedData.screen}</Text>
                <View style={styles.modalButton}>
                  <Button title="Cerrar" onPress={closeInfoModal} />
                </View>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Fondo negro para que la cámara se vea bien
  },
  centerText: {
    textAlign: 'center',
    fontSize: 18,
    padding: 20,
    color: 'white',
  },
  rescanButtonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fondo semitransparente
  },
  modalContent: {
    width: Dimensions.get("window").width * 0.85,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: 'stretch', // Para que el botón ocupe el ancho
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  modalButton: {
    marginTop: 15,
  }
});

export default ScannerScreen;
