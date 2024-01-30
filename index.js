/**
 * @format
 */
import { Provider } from 'react-redux';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import store from './src/redux/store';
const Root = () => (
    <Provider store={store}>
      <App />
    </Provider>
  );
AppRegistry.registerComponent(appName, () => Root);
