import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
} from 'react-native';
import COLORS from '../../consts/colors';
import {useSelector} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {RegisterClose, baseURL} from '../../Apis/apiConstants';
import {
  selectGrandTotalPrice,
  selectRegisterId,
  selectRegisterOpen,
  selectToken,
  setRegisterOpen,
} from '../../redux/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {PrimaryButton} from '../components/Button';

const CloseRegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selfCash, setSelfCash] = useState('');
  const [shortFall, setShortFall] = useState('');
  const token = useSelector(selectToken);
  const registerId = useSelector(selectRegisterId);
  const isRegisterOpen = useSelector(selectRegisterOpen);
  const grandTotalPrice = useSelector(selectGrandTotalPrice);
  const [closeCashHistory, setCloseCashHistory] = useState([]);
  const [overallCash, setOverallCash] = useState();
  const [cartItemKey, setCartItemKey] = useState();

  useEffect(() => {
    getLatestOpenCash();
    loadCloseCashHistory();
    checkCartEmptyOrNot();
  }, [grandTotalPrice, overallCash]);

  const checkCartEmptyOrNot = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const cartItemKeys = allKeys.filter(key => key.startsWith('cartItems_'));
    cartItemKeys && setCartItemKey(cartItemKeys);
  };

  const loadCloseCashHistory = async () => {
    try {
      const historyJson = await AsyncStorage.getItem('closeCashHistory');
      if (historyJson) {
        const history = JSON.parse(historyJson);
        setCloseCashHistory(history);
      }
    } catch (error) {
      console.error('Error loading close cash history:', error);
    }
  };

  const clearAllCash = async () => {
    try {
      const keysToRemove = ['latestOpenCash', 'grandTotalPrice'];
      await AsyncStorage.multiRemove(keysToRemove);
      console.log('Keys removed successfully:', keysToRemove);
    } catch (error) {
      console.error('Error removing keys from AsyncStorage:', error);
    }
  };

  const getLatestOpenCash = async () => {
    try {
      const latestOpenCash = await AsyncStorage.getItem('latestOpenCash');
      if (latestOpenCash !== null) {
        const parsedLatestOpenCash = parseFloat(JSON.parse(latestOpenCash));
        setOverallCash(grandTotalPrice + parsedLatestOpenCash);

        return parsedLatestOpenCash;
      }
    } catch (error) {
      console.error(
        'Error retrieving latest open_cash from AsyncStorage:',
        error,
      );
    }
  };

  const saveCloseCashHistory = async newHistoryItem => {
    const newHistory = [...closeCashHistory, newHistoryItem];
    await AsyncStorage.setItem('closeCashHistory', JSON.stringify(newHistory));
    setCloseCashHistory(newHistory);
  };

  const calculateTotalAmount = () => {
    const selfCashAmount = parseFloat(selfCash) || 0;
    const shortFallAmount = parseFloat(shortFall) || 0;
    return selfCashAmount + shortFallAmount;
  };

  const handleCloseRegister = async () => {
    if (isRegisterOpen) {
      if (!cartItemKey?.length > 0) {
        try {
          if (token) {
            const headers = {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            };

            const totalAmount = calculateTotalAmount();

            if (totalAmount !== overallCash) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Total amount does not match open cash amount.',
                visibilityTime: 1500,
              });
              return;
            }

            const payload = {
              reg_id: registerId,
              c_handover_cash: 0,
              c_cashTo: 0,
              c_self_cash: selfCash ? parseFloat(selfCash) : 0,
              c_short_fall: shortFall ? parseFloat(shortFall) : 0,
            };

            const registerCloseUrl = baseURL + RegisterClose;
            const response = await axios.post(registerCloseUrl, payload, {
              headers,
            });

            if (response.status === 200) {
              await AsyncStorage.setItem('registerOpen', JSON.stringify(false));
              dispatch(setRegisterOpen(false));

              const newHistoryItem = {
                serialNumber: closeCashHistory.length + 1,
                amount: totalAmount,
                reg_id: registerId,
                dateTime: new Date().toLocaleString(),
              };
              saveCloseCashHistory(newHistoryItem);
              clearAllCash();
              Toast.show({
                type: 'success',
                text1: 'Close register successful.',
                visibilityTime: 1500,
              });
            }

            console.log('Close Register Response:', response.data);
          }
        } catch (error) {
          console.error('Error closing register:', error);
          Toast.show({
            type: 'error',
            text1: 'Failed to close register. Please try again.',
            visibilityTime: 1500,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1:
            'Cart KOT is pending, Please complete it before closing register.',
          visibilityTime: 1500,
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Register is not open.',
        visibilityTime: 1500,
      });
    }
  };

  const handleClearEntry = async index => {
    if (index !== null) {
      const updatedHistory = closeCashHistory.filter((_, i) => i !== index);
      await AsyncStorage.setItem(
        'closeCashHistory',
        JSON.stringify(updatedHistory),
      );
      setCloseCashHistory(updatedHistory);
    }
  };

  const handleClearAll = async () => {
    await AsyncStorage.removeItem('closeCashHistory');
    setCloseCashHistory([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon name="arrow-back-ios" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Close Register</Text>
      </View>
      <View style={{marginBottom: 10}}>
        <Text style={{color: '#000', fontWeight: 900, fontSize: 18}}>
          Total cash: {overallCash}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Text>Self Cash:</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter self cash amount"
          keyboardType="numeric"
          value={selfCash}
          onChangeText={text => setSelfCash(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Shortfall Cash:</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter shortfall cash amount"
          keyboardType="numeric"
          value={shortFall}
          onChangeText={text => setShortFall(text)}
        />
      </View>
      <PrimaryButton title="Close" onPress={handleCloseRegister} />
      {/* <View style={{marginBottom: 15}}>
        <Button title="Submit"  />
      </View> */}
      {closeCashHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text style={styles.historyTitle}>Close Cash History:</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => handleClearAll()}>
                <Text style={{color: 'blue'}}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={closeCashHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.historyItem}>
                <Text>{`Register ID: ${item.reg_id}`}</Text>
                {/* <Text>{`Sr No: ${item.serialNumber}`}</Text> */}
                <Text>{`Amount: ${item.amount}`}</Text>
                <Text>{`Date & Time: ${item.dateTime}`}</Text>
                <TouchableOpacity
                  onPress={() => handleClearEntry(item.serialNumber - 1)}>
                  <Text style={{color: 'red'}}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputField: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 5,
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CloseRegisterScreen;
