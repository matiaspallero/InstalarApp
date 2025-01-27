import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, SafeAreaProvider } from 'react-native';
import Tablas, {leerTabla} from '../componentes/tablas';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';


export default function App() {
  
  useEffect(() => {
    async function fetchData() {
      const data = await leerTabla();
      console.log('Datos de la tabla:', data);
    }
    fetchData();
  }, []);
  
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName='Instalar-db.db'>
      <StatusBar style="auto" />
      <Text style={styles.titulo} >Bienvenidos a InstaLar😃</Text>
      <View style={styles.tabla1}>
        <Tablas />
      </View>
      </SQLiteProvider> 
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000',
    alignItems: 'center',
    marginTop: 70,
  },
  titulo: {
    fontFamily: 'system-ui',
    fontSize: 20,
  },
});
