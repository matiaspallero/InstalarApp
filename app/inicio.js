import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.header}>
                  <Image style={styles.imagen} source={require('../assets/LOGO INSTALAR.jpg')} />
                  <Text style={styles.headerText}>Bienvenidos😀</Text>
              </View>
              <View style={styles.container2}>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('App')} activeOpacity={0.5}>
                      <Image source={require('../assets/edificio2.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>METRO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AppMonteros')} activeOpacity={0.5}>
                      <Image source={require('../assets/edificio2.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>MONTEROS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AppConcepcion')} activeOpacity={0.5}>
                      <Image source={require('../assets/edificio2.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>CONCEPCION</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AppInventario')} activeOpacity={0.5}>
                      <Image source={require('../assets/inventario.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>INVENTARIO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ScannerScreen')} activeOpacity={0.5}>
                      <Image source={require('../assets/qr-scan.png')} style={styles.imgbutton} /> {/* Necesitarás un ícono para escanear QR */}
                      <Text style={styles.buttonText}>ESCANEAR QR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('')} activeOpacity={0.5}>
                      <Image source={require('../assets/pdf.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>PDF'S</Text>
                  </TouchableOpacity>
              </View>
            </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, // Un poco más de padding
    backgroundColor: '#f8f9fa', // Fondo ligeramente gris
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30, // Reducir un poco el margen inferior
    marginTop: 20, // Añadir margen superior
  },
  imagen: {
    display: 'flex',
    justifyContent: 'center',
    width: 250,
    height: 100,
  },
  headerText: {
    fontSize: 28, // Tamaño un poco mayor
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#2c3e50', // Color más profesional
    marginTop: 15, // Espacio después de la imagen
  },
  container2: {
    flexDirection: 'row', // Organizar hijos en fila
    flexWrap: 'wrap',     // Permitir que los elementos pasen a la siguiente línea
    justifyContent: 'center',
    width: '100%',
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20,
  },
  button: {
    flexDirection: 'column', // Cambiar a columna para móvil (icono arriba, texto abajo)
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 5,
    borderColor: '#3498db',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10, // Bordes más redondeados
    backgroundColor: '#fff',
    width: width > 500 ? '40%' : '45%', // 3 columnas en pantallas anchas, 2 en móviles
    minHeight: 120, // Altura mínima para consistencia
    shadowColor: '#000', // Sombra para profundidad
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android
},
  buttonText: {
    marginTop: 10, // Espacio entre icono y texto
    fontSize: 16,
    fontWeight: '600', // Semibold en lugar de bold
    color: '#2c3e50',
},
  imgbutton: {
    width: 40, // Tamaño fijo para iconos
    height: 40,
    resizeMode: 'contain',
},
  scrollContainer: {
    flexGrow: 1,
},
});

export default HomeScreen;