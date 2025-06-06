import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.header}>
                  <Image style={styles.imagen} source={require('../assets/LOGO INSTALAR.jpg')} />
                  <Text style={styles.headerText}>Bienvenidos😀</Text>
              </View>
              <View style={styles.container2}>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('App')}>
                      <Image source={require('../assets/edificio2.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>METRO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                      <Image source={require('../assets/edificio2.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>MONTEROS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                      <Image source={require('../assets/edificio2.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>CONCEPCION</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                      <Image source={require('../assets/inventario.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>INVENTARIO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                      <Image source={require('../assets/otros.png')} style={styles.imgbutton} />
                      <Text style={styles.buttonText}>OTROS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
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
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 50,
  },
  imagen: {
    display: 'flex',
    justifyContent: 'center',
    width: 250,
    height: 100,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
  container2: {
    justifyContent: 'center',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    width: '100%',
    maxWidth: 500,
    gridAutoRows: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 10,
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderColor: 'blue',
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#6495ED',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
  },
  imgbutton: {
    display: 'flex',
    justifyContent: 'center',
  },
scrollContainer: {
    flexGrow: 1,
},
});

export default HomeScreen;