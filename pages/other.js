import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './inicio'; // Corregido: Ruta a la pantalla de inicio
import AiresManagementScreen from './App'; // Añadido: Importar la pantalla de gestión de aires

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
       <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
       <Stack.Screen name="App" component={AiresManagementScreen} options={{ title: 'Gestión de Aires' }} />
     </Stack.Navigator>
   </NavigationContainer>
  );
}