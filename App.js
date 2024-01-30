import 'react-native-gesture-handler';
import React, {useCallback, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import COLORS from './src/consts/colors';
import {CartProvider} from './src/context/CartContext';
import Toast from 'react-native-toast-message';
import {
  selectIsLoggedIn,
  setGrandTotalPrice,
  setRegisterId,
  setRegisterOpen,
  setToken,
  setUserData,
} from './src/redux/authSlice';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import StackNavigation from './src/views/navigation/StackNavigation';
export const navigationRef = React.createRef();
const App = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    checkTokenAndNavigate();
  }, []);
  const checkTokenAndNavigate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userData');
      const registerOpen = await AsyncStorage.getItem('registerOpen');
      const registerId = await AsyncStorage.getItem('registerId');
      const isRegisterOpen = JSON.parse(registerOpen);
      const grandTotalPrice = await AsyncStorage.getItem('grandTotalPrice');
      const ParsedGrandTotalPrice = parseFloat(grandTotalPrice);
      if (token) {
        dispatch(setToken(token));
        navigationRef.current?.navigate('Home');
      }
      if (userData) {
        dispatch(setUserData(userData));
      }
      if (registerOpen) {
        dispatch(setRegisterOpen(isRegisterOpen));
      }
      if (registerId) {
        dispatch(setRegisterId(registerId));
      }
      if (grandTotalPrice) {
        console.log('grandTotalPrice', ParsedGrandTotalPrice);
        dispatch(setGrandTotalPrice(ParsedGrandTotalPrice));
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };
  console.log('isLoggedIn', isLoggedIn);
  return (
    <CartProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
        <StackNavigation />
      </NavigationContainer>
      <Toast topOffset={0} />
    </CartProvider>
  );
};

export default App;
