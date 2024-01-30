import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Toast from 'react-native-toast-message';

import COLORS from '../../consts/colors';
import {RegisterOpen, baseURL} from '../../Apis/apiConstants';
import {
  selectRegisterOpen,
  selectToken,
  setRegisterId,
  setRegisterOpen,
} from '../../redux/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import { PrimaryButton } from '../components/Button';
import {useNavigation} from '@react-navigation/native';

const OpenRegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isRegisterOpen = useSelector(selectRegisterOpen);

  const [openCashHistory, setOpenCashHistory] = useState([]);
  const [clearEntryIndex, setClearEntryIndex] = useState(null);

  useEffect(() => {
    const loadOpenCashHistory = async () => {
      try {
        const historyJson = await AsyncStorage.getItem('openCashHistory');
        if (historyJson) {
          const history = JSON.parse(historyJson);
          setOpenCashHistory(history);
        }
      } catch (error) {
        console.error('Error loading open cash history:', error);
      }
    };

    loadOpenCashHistory();
  }, []);

  const formik = useFormik({
    initialValues: {
      openCash: '',
    },
    validationSchema: Yup.object({
      openCash: Yup.number().required('Please enter the open cash amount.'),
    }),
    onSubmit: async values => {
      if (!isRegisterOpen) {
        try {
          if (token) {
            const headers = {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            };

            const payload = {
              open_cash: parseFloat(values.openCash),
            };

            const registerOpenUrl = baseURL + RegisterOpen;
            const response = await axios.post(registerOpenUrl, payload, {
              headers,
            });
            if (response.status === 200) {
              const newHistoryItem = {
                serialNumber: openCashHistory.length + 1,
                amount: parseFloat(values.openCash),
                reg_id: response.data?.data?.reg_id,
                dateTime: new Date().toLocaleString(),
              };

              const newHistory = [...openCashHistory, newHistoryItem];
              await AsyncStorage.setItem(
                'openCashHistory',
                JSON.stringify(newHistory),
              );
              setOpenCashHistory(newHistory);

              await AsyncStorage.setItem('registerOpen', JSON.stringify(true));
              dispatch(setRegisterOpen(true));
              const registerId = response.data?.data?.reg_id;
              await AsyncStorage.setItem('registerId', registerId);
              dispatch(setRegisterId(registerId));

              await AsyncStorage.setItem('latestOpenCash', JSON.stringify(values.openCash));

              Toast.show({
                type: 'success',
                text1: 'Open register successful',
                visibilityTime: 1500,
              });
            }
          }
        } catch (error) {
          console.error('Error opening register:', error);
          Toast.show({
            type: 'error',
            text1: 'Failed to open register. Please try again.',
            visibilityTime: 1500,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'SalesRegister is already Open.',
          visibilityTime: 1500,
        });
      }
    },
  });

  const handleClearEntry = async index => {
    if (clearEntryIndex !== null) {
      const updatedHistory = openCashHistory.filter((_, i) => i !== index);
      await AsyncStorage.setItem(
        'openCashHistory',
        JSON.stringify(updatedHistory),
      );
      setOpenCashHistory(updatedHistory);
      setClearEntryIndex(null);
    }
  };

  const handleClearAll = async () => {
    await AsyncStorage.removeItem('openCashHistory');
    setOpenCashHistory([]);
    setClearEntryIndex(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon name="arrow-back-ios" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Open Register</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text>Open Cash Amount:</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter open cash amount"
          keyboardType="numeric"
          value={formik.values.openCash}
          onChangeText={formik.handleChange('openCash')}
          onBlur={formik.handleBlur('openCash')}
        />
        {formik.touched.openCash && formik.errors.openCash ? (
          <Text style={styles.errorText}>{formik.errors.openCash}</Text>
        ) : null}
      </View>
      <PrimaryButton title="Submit" onPress={formik.handleSubmit} />
      {openCashHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text style={styles.historyTitle}>Open Cash History:</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => handleClearAll()}>
                <Text style={{color: 'blue'}}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={openCashHistory}
            keyExtractor={item => item?.serialNumber?.toString()}
            renderItem={({item, index}) => (
              <View style={styles.historyItem}>
                {/* <Text>{`Sr No: ${item.serialNumber}`}</Text> */}
                <Text>{`Register ID: ${item.reg_id}`}</Text>
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
    marginBottom: 20,
  },
  inputField: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
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

export default OpenRegisterScreen;
