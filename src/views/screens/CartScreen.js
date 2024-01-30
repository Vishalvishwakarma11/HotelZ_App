import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import {PrimaryButton} from '../components/Button';
import {useCartContext} from '../../context/CartContext';
import CheckoutModal from '../../modal/CheckOutModal';
import {useNavigation} from '@react-navigation/native';

import DropdownComponent from '../components/DropdownComponet';
import Toast from 'react-native-toast-message';

const CartScreen = () => {
  const navigation = useNavigation();
  const {cartItems, updateCartItems, selectedTable, updateSelectedTable} =
    useCartContext();
  const [items, setItems] = useState([]);

  const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [isEmptyCart, setIsEmptyCart] = useState(false);

  useEffect(() => {
    if (cartItems) {
      setItems(cartItems);
      setIsEmptyCart(cartItems.length === 0);
    }
  }, [cartItems]);

  useEffect(() => {
    setItems([]);
  }, [selectedTable]);

  useEffect(() => {
    if (cartItems) {
      setItems(cartItems.filter(item => item.table === selectedTable?.tableValue));
    }
  }, [cartItems, selectedTable]);
  console.log('selectedTable', selectedTable);
  const updateQuantity = (itemIndex, value) => {
    const updatedItems = [...items];
    const currentItem = updatedItems[itemIndex];

    if (currentItem) {
      // Find the index of the item in the original cartItems array
      const originalIndex = cartItems.findIndex(item => item === currentItem);

      const currentQuantity = currentItem.quantity || 1;
      const newQuantity = currentQuantity + value;

      if (newQuantity > 0) {
        updatedItems[itemIndex] = {...currentItem, quantity: newQuantity};
        setItems(updatedItems);

        const updatedCartItems = cartItems.map((item, i) =>
          i === originalIndex ? {...item, quantity: newQuantity} : item,
        );
        updateCartItems(updatedCartItems);
      } else {
        Alert.alert(
          'Remove Item',
          'Are you sure you want to remove this item from the cart?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Remove',
              onPress: () => {
                updatedItems.splice(itemIndex, 1);
                setItems(updatedItems);
                const updatedCartItems = cartItems.filter(
                  (item, i) => i !== originalIndex,
                );
                updateCartItems(updatedCartItems);
              },
              style: 'destructive',
            },
          ],
          {cancelable: true},
        );
      }
    } else {
      console.error('Invalid item:', currentItem);
    }
  };

  const showToast = (msg1, msg2) => {
    Toast.show({
      type: 'success',
      text1: msg1,
      text2: msg2,
      visibilityTime: 1300,
    });
  };

  const errorToast = (msg1, msg2) => {
    Toast.show({
      type: 'error',
      text1: msg1,
      text2: msg2,
      visibilityTime: 1300,
    });
  };

  const CartCard = ({item, index}) => {
    return (
      <View style={styles.cartCard}>
        <View
          style={{
            height: 100,
            marginLeft: 10,
            paddingVertical: 20,
            flex: 1,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            {item.prod_name}
          </Text>
          <Text style={{fontSize: 13, color: COLORS.grey}}>
            {item.ingredients}
          </Text>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>
            ${item.prod_price}
          </Text>
        </View>
        <View style={{marginRight: 20, alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            {item.quantity || 1}
          </Text>
          <View style={styles.actionBox}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => updateQuantity(index, -1)}>
              <Icon name="remove" size={25} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => updateQuantity(index, 1)}>
              <Icon name="add" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.prod_price * (item.quantity || 1),
    0,
  );

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
            onPress={navigation.goBack}>
            <Icon name="arrow-back-ios" size={28} />
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Cart</Text>
          </TouchableOpacity>
          {/* <DropdownComponent
            // selectedTable={selectedTable}
            onSelectTable={(tableName, tableValue) => {
              updateSelectedTable(tableValue);
              showToast(`${tableName} selected.`);
            }}
          /> */}
        </View>
        {items.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/emptyCart.jpeg')}
              style={{width: 200, height: 200}}
            />
            <Text
              style={{
                marginTop: 20,
                fontSize: 16,
                paddingHorizontal: 20,
                textAlign: 'center',
              }}>
              Oops! Your cart is hungry. Add some delicious items to feed it and
              view your selections.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('HomeTab')}>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.primary,
                  marginTop: 20,
                }}>
                Go to Home
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text
              style={{
                marginLeft: 20,
                marginTop: 15,
                marginBottom: 10,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {selectedTable?.tableName}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 80}}
              data={items}
              renderItem={({item, index}) => (
                <CartCard item={item} index={index} />
              )}
              ListFooterComponentStyle={{
                paddingHorizontal: 20,
                marginTop: 20,
              }}
              ListFooterComponent={() => (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 15,
                    }}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      Total Price
                    </Text>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      ${totalPrice.toFixed(2)}
                    </Text>
                  </View>
                  <CheckoutModal
                    onClose={() => setCheckoutModalVisible(false)}
                    items={items}
                    totalPrice={totalPrice}
                    isVisible={isCheckoutModalVisible}
                  />
                </View>
              )}
            />
          </View>
        )}
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          marginHorizontal: 30,
          marginBottom: 20,
        }}>
        {items.length > 0 && (
          <View>
            <PrimaryButton
              title="CHECKOUT"
              onPress={() => setCheckoutModalVisible(true)}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  cartCard: {
    height: 100,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBox: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartScreen;
