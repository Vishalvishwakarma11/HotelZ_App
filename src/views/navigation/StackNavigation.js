import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../auth/LoginScreen';
import BottomNavigator from './BottomNavigator';
import LogoutScreen from '../auth/LogoutScreen';
import {selectIsLoggedIn} from '../../redux/authSlice';
import InvoiceListScreen from '../screens/InvoiceListScreen';
import InvoiceDetailScreen from '../screens/InvoiceDetailScreen';
import CloseRegisterScreen from '../screens/CloseRegisterScreen';
import OpenRegisterScreen from '../screens/OpenRegisterScreen';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();
const StackNavigation = ({}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Home" component={BottomNavigator} />
          <Stack.Screen name="InvoiceList" component={InvoiceListScreen} />
          <Stack.Screen
            name="OpenRegisterScreen"
            component={OpenRegisterScreen}
          />
          <Stack.Screen
            name="CloseRegisterScreen"
            component={CloseRegisterScreen}
          />
          <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
          {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        </>
      )}
    </Stack.Navigator>
  );
};
export default StackNavigation;
