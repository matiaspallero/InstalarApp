import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './inicio'; // Corregido: Ruta a la pantalla de inicio
import AppMetro from './App'; // Añadido: Importar la pantalla de gestión de aires
import AppMonteros from './MonterosScreen';
import AppConcepcion from './ConcepcionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
       <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
       <Stack.Screen name="App" component={AppMetro} options={{ title: 'Gestión de Metro' }} />
       <Stack.Screen name="AppMonteros" component={AppMonteros} options={{ title: 'Gestión de Monteros' }} />
       <Stack.Screen name="AppConcepcion" component={AppConcepcion} options={{ title: 'Gestión de Concepcion' }} />
     </Stack.Navigator>
   </NavigationContainer>
  );
}