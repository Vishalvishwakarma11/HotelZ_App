import React, {useState, useCallback} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import axios from 'axios';
import COLORS from '../consts/colors';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  selectGrandTotalPrice,
  selectToken,
  setGrandTotalPrice,
} from '../redux/authSlice';
import {CreateInvoice, PreformaInvoice, baseURL} from '../Apis/apiConstants';
import {useCartContext} from '../context/CartContext';
import {useDispatch} from 'react-redux';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutModal = ({onClose, items, totalPrice, isVisible}) => {
  const {selectedTable, updateSelectedTable} = useCartContext();
  const grandTotalPrice = useSelector(selectGrandTotalPrice);
  const [invoiceType, setInvoiceType] = useState(null);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  const deleteCartItemsForTable = async table => {
    try {
      const storageKey = `cartItems_${table}`;
      await AsyncStorage.removeItem(storageKey);
      console.log('vishal');
    } catch (error) {
      console.error(
        `Error deleting cart items for table ${selectedTable?.tableName}:`,
        error,
      );
    }
  };

  const reloadApp = () => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        console.log('Reloading the app...');
        AppState.removeEventListener('change', handleAppStateChange);
      }
    };
    AppState.addEventListener('change', handleAppStateChange);
  };
  const clearCart = () => {
    if (selectedTable?.tableValue) {
      const storageKey = `cartItems_${selectedTable?.tableValue}`;
      console.log(
        `Clearing cart items for table ${selectedTable} with storage key: ${storageKey}`,
      );
      deleteCartItemsForTable(selectedTable?.tableValue);
      console.log(
        `Successfully deleted cart items for table ${selectedTable?.tableName}`,
      );
      updateSelectedTable(null);
      reloadApp();
    } else {
      console.warn('No selected table to clear.');
    }
  };

  const fetchInvoice = useCallback(
    async type => {
      try {
        if (token) {
          const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };

          const payload = {
            table_id: items[0]?.table,
            prod_details: items.map(item => ({
              id: item?.prod_id,
              qty: item?.quantity || 1,
              price: item?.prod_price,
            })),
            totalPrice: totalPrice,
            cash_amt: totalPrice,
            inv_type: type === 'taxable' ? 1 : 0,
            vat: 0,
            sub_total: totalPrice,
            grand_total: totalPrice,
          };

          console.log(payload);
          let apiUrl = baseURL + CreateInvoice;

          const response = await axios.post(apiUrl, payload, {headers});
          if (response.status === 200) {
            // Retrieve the previous total price from AsyncStorage
            const previousTotalPrice = await AsyncStorage.getItem(
              'grandTotalPrice',
            );
            console.log('Previous total price: ' + previousTotalPrice);
            const newTotalPrice =
              previousTotalPrice == null
                ? 0 + parseFloat(totalPrice)
                : parseFloat(previousTotalPrice) + parseFloat(totalPrice);

            // Store the updated total price back in AsyncStorage
            await AsyncStorage.setItem(
              'grandTotalPrice',
              newTotalPrice.toString(),
            );
            dispatch(setGrandTotalPrice(newTotalPrice));
            clearCart();
            console.log(
              'Updated grandTotalPrice',
              grandTotalPrice,
              newTotalPrice,
            );

            showToast(`${type} Invoice created successfully!!`);
          }
          console.log(`Invoice (${type}) created:`, response.data);
        }
      } catch (error) {
        console.error(`Error creating ${type} invoice:`, error);
      }
    },
    [items, totalPrice, token],
  );

  const showToast = msg1 => {
    Toast.show({
      type: 'success',
      text1: msg1,
      visibilityTime: 1300,
    });
  };

  const handleInvoiceTypeSelection = type => {
    setInvoiceType(type);
    onClose();
    fetchInvoice(type);
  };

  const showInvoiceTypeDialog = () => {
    Alert.alert(
      'Select Invoice Type',
      'Choose the type of invoice you want:',
      [
        {
          text: 'Taxable',
          onPress: () => handleInvoiceTypeSelection('taxable'),
        },
        {
          text: 'Non-Taxable',
          onPress: () => handleInvoiceTypeSelection('nonTaxable'),
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Checkout Summary</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, {flex: 3}]}>Item Name</Text>
            <Text style={styles.headerText}>Qty.</Text>
            <Text style={styles.headerText}>Rate</Text>
            <Text style={styles.headerText}>Amt.</Text>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.checkoutItem}>
                <Text style={[styles.itemText, {flex: 3}]}>
                  {item.prod_name}
                </Text>
                <Text style={styles.itemText}>{item.quantity || 1}</Text>
                <Text style={styles.itemText}>{item.prod_price}</Text>
                <Text style={styles.itemText}>
                  {(item.prod_price * (item.quantity || 1)).toFixed(2)}
                </Text>
              </View>
            )}
          />
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                console.log('Closing modal');
                onClose();
              }}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.printButton}
              onPress={showInvoiceTypeDialog}>
              <Text style={styles.printButtonText}>Get Invoice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.primary,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  checkoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  totalPriceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  printButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  printButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default CheckoutModal;
