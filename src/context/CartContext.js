import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCartContext = () => {
  return useContext(CartContext);
};

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  // Load cartItems from AsyncStorage when the component mounts
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        if (selectedTable?.tableValue) {
          const storageKey = `cartItems_${selectedTable?.tableValue}`;
          const storedCartItems = await AsyncStorage.getItem(storageKey);

          if (storedCartItems) {
            const parsedCartItems = JSON.parse(storedCartItems);
            setCartItems(parsedCartItems);
          }
        } else {
          const allKeys = await AsyncStorage.getAllKeys();
          const cartItemKeys = allKeys.filter(key =>
            key.startsWith('cartItems_'),
          );

          if (cartItemKeys.length > 0) {
            console.log(
              'Cart items exist without selecting a table:',
              cartItemKeys,
            );
          } else {
            console.log('No cart items stored without selecting a table.');
          }
        }
      } catch (error) {
        console.error('Error loading cart items from AsyncStorage:', error);
      }
    };

    loadCartItems();
  }, [selectedTable]);

  useEffect(() => {
    const saveCartItems = async () => {
      try {
        const serializedCartItems = JSON.stringify(cartItems);
        if (selectedTable?.tableValue) {
          const storageKey = `cartItems_${selectedTable?.tableValue}`;
          await AsyncStorage.setItem(storageKey, serializedCartItems);
        }
      } catch (error) {
        console.error('Error saving cart items to AsyncStorage:', error);
      }
    };

    saveCartItems();
  }, [cartItems, selectedTable]);

  const updateCartItems = updatedItems => {
    setCartItems(updatedItems);
  };

  const addToCart = item => {
    const updatedCartItems = [...cartItems, item];
    setCartItems(updatedCartItems);
  };

  const updateSelectedTable = table => {
    setSelectedTable(table);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        updateCartItems,
        addToCart,
        selectedTable,
        updateSelectedTable,
      }}>
      {children}
    </CartContext.Provider>
  );
};
