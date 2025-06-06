import { registerRootComponent } from 'expo';

import App from '../InstalarApp/app/other'; // Cambiado para usar el navegador principal de pages/other.js

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
