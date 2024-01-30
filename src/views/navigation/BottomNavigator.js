import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import {View, Text} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import {useCartContext} from '../../context/CartContext';
import LogoutScreen from '../auth/LogoutScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  const {cartItems} = useCartContext();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const totalItems = cartItems.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0,
    );
    cartItems && setCartItemCount(totalItems);
  }, [cartItems]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          {
            display: 'flex',
          },
          null,
        ],
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="home-filled" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="LogoutTab"
        component={LogoutScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="manage-accounts" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({color}) => (
            <View style={{position: 'relative'}}>
              <View style={{zIndex: 1}}>
                <Icon name="shopping-cart" color={color} size={28} />
              </View>
              {cartItemCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: 7.7,
                    backgroundColor: COLORS.primary,
                    borderRadius: 100,
                    width: 13,
                    height: 13,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: COLORS.white, fontWeight: 'bold'}}>
                    {/* {cartItemCount} */}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
