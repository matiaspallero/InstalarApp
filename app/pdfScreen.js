import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

// Deberías mover esta configuración a un archivo de constantes o configuración
const SERVER_IP = '192.168.1.38'; // Asegúrate que esta IP sea accesible desde tu dispositivo
const API_BASE_URL = `http://${SERVER_IP}:5000`;

// Funciones para obtener datos (similar a InventarioScreen.js, podrías refactorizar esto a un módulo común)
const fetchDataFromEndpoint = async (endpointPath, pantallaOrigen, idKey) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpointPath}`);
    if (!response.ok) {
      throw new Error(`Error al obtener datos de ${endpointPath}: ${response.status}`);
    }
    const data = await response.json();
    return data.map(item => ({
      id: `${endpointPath}_${item[idKey]}`,
      nombre: item.Marca,
      ubicacion: item.Ubicacion,
      frigorias: item.Frigorias,
      pantallaOrigen: pantallaOrigen,
      servicio: item.Servicio,
      originalId: item[idKey],
    }));
  } catch (error) {
    console.error(`Error en fetchAiresFrom ${pantallaOrigen}:`, error);
    return [];
  }
};

const AppPDF = () => {
  const [loading, setLoading] = useState(false);

  const generateInventarioGeneralPdf = async () => {
    setLoading(true);
    try {
      const [airesMetro, airesMonteros, airesConcepcion] = await Promise.all([
        fetchDataFromEndpoint('metro', 'Metro', 'idMetro'),
        fetchDataFromEndpoint('monteros', 'Monteros', 'idMonteros'),
        fetchDataFromEndpoint('concepcion', 'Concepción', 'idConcepcion'),
      ]);

      const allAires = [...airesMetro, ...airesMonteros, ...airesConcepcion];

      if (allAires.length === 0) {
        alert('No hay datos de inventario para generar el PDF.');
        setLoading(false);
        return;
      }

      // Crear contenido HTML para el PDF
      let htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Helvetica, Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .footer { text-align: center; margin-top: 30px; font-size: 0.8em; color: #777; }
            </style>
          </head>
          <body>
            <h1>Inventario General de Aires Acondicionados</h1>
            <table>
              <thead>
                <tr>
                  <th>Marca/Nombre</th>
                  <th>Frigorías</th>
                  <th>Ubicación</th>
                  <th>Servicio</th>
                  <th>Origen</th>
                </tr>
              </thead>
              <tbody>
      `;

      allAires.forEach(aire => {
        htmlContent += `
          <tr>
            <td>${aire.nombre || 'N/A'}</td>
            <td>${aire.frigorias || 'N/A'}</td>
            <td>${aire.ubicacion || 'N/A'}</td>
            <td>${aire.servicio || 'N/A'}</td>
            <td>${aire.pantallaOrigen || 'N/A'}</td>
          </tr>
        `;
      });

      htmlContent += `
              </tbody>
            </table>
            <div class="footer">Reporte generado el ${new Date().toLocaleDateString()}</div>
          </body>
        </html>
      `;

      if (Platform.OS === 'web') {
        // En la web, printAsync abre el diálogo de impresión del navegador,
        // que generalmente permite "Guardar como PDF".
        await Print.printAsync({
          html: htmlContent,
        });
      } else {
        // En plataformas nativas (iOS, Android)
        const { uri } = await Print.printToFileAsync({
          html: htmlContent,
        });
        console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      }
    } catch (error) {
      console.error("Error al generar PDF de inventario:", error);
      alert('Error al generar el PDF. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async (pdfType) => {
    console.log(`Generar PDF: ${pdfType}`);
    if (loading) return; // Evitar múltiples ejecuciones

    if (pdfType === 'Inventario General') {
      await generateInventarioGeneralPdf();
    } else if (pdfType === 'Ficha Técnica Equipo') {
      // Para "Ficha Técnica Equipo", necesitarías primero una forma de seleccionar un equipo específico.
      // Podrías navegar a otra pantalla para seleccionar el equipo o mostrar un modal.
      // Una vez seleccionado, obtienes sus datos y generas un HTML similar pero más detallado.
      alert(`Generación de "${pdfType}" requiere seleccionar un equipo primero (no implementado).`);
    } else if (pdfType === 'PPP') {
      // Define qué datos y formato necesita el PDF "PPP"
      alert(`Función para generar "${pdfType}" aún no implementada.`);
    } else {
      alert(`Tipo de PDF "${pdfType}" no reconocido.`);
    }
  };

  return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Panel de Generación de PDFs</Text>

                <TouchableOpacity style={styles.button} onPress={() => handleGeneratePdf('Inventario General')} disabled={loading} activeOpacity={0.5}>
                    <Text style={styles.buttonText}>Generar PDF de Inventario General</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => handleGeneratePdf('Ficha Técnica Equipo')} disabled={loading} activeOpacity={0.5}>
                    <Text style={styles.buttonText}>Generar PDF de Ficha Técnica</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => handleGeneratePdf('OTRO')} disabled={loading} activeOpacity={0.5}>
                    <Text style={styles.buttonText}>OTRO</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => handleGeneratePdf('OTRO 2')} disabled={loading} activeOpacity={0.5}>
                    <Text style={styles.buttonText}>OTRO 2</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => handleGeneratePdf('OTRO 3')} disabled={loading} activeOpacity={0.5}>
                    <Text style={styles.buttonText}>OTRO 3</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => handleGeneratePdf('OTRO 4')} disabled={loading} activeOpacity={0.5}>
                    <Text style={styles.buttonText}>OTRO 4</Text>
                </TouchableOpacity>

                {/* Puedes añadir más botones para otros tipos de PDF aquí */}

            </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center', // Centrar los botones si el contenido es menor que la pantalla
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    width: '80%', // O un ancho fijo si prefieres
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
  },
});

export default AppPDF;
