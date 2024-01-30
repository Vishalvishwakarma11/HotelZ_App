import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import COLORS from '../../consts/colors';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {InvoiceList, baseURL} from '../../Apis/apiConstants';
import {selectToken} from '../../redux/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {PrimaryButton} from '../components/Button';

const InvoiceListScreen = () => {
  const navigation = useNavigation();
  const [invoices, setInvoices] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [noDataMessage, setNoDataMessage] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const token = useSelector(selectToken);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      if (token) {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const payload = {
          from_date: fromDate.toISOString().split('T')[0],
          to_date: toDate.toISOString().split('T')[0],
        };
        const invoiceListUrl = baseURL + InvoiceList;
        const response = await axios.post(invoiceListUrl, payload, {headers});
        const {data} = response.data;
        // console.log('invoiceListUrl', data);
        setInvoices(data);
        setNoDataMessage(
          data.length === 0
            ? 'No invoices found. Change date and try again.'
            : '',
        );
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setNoDataMessage('Failed to fetch invoices. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch invoices. Please try again.',
        visibilityTime: 1500,
      });
    }
  }, [token, fromDate, toDate]);

  const renderInvoiceItem = ({item}) => (
    <TouchableOpacity
      style={styles.invoiceItem}
      onPress={() => {
        navigation.navigate('InvoiceDetail', {invoice: item});
      }}>
      <Text style={styles.invoiceText}>{`Invoice ID: ${item.sales_id}`}</Text>
      <Text
        style={styles.invoiceText}>{`Amount: $${item.invoice_amount}`}</Text>
      <Text style={styles.invoiceText}>{`Created At: ${item.created_at}`}</Text>
    </TouchableOpacity>
  );

  const handleFilterPress = () => {
    setNoDataMessage('');
    fetchInvoices();
  };

  const showFromDatePickerModal = () => {
    setShowFromDatePicker(true);
  };

  const showToDatePickerModal = () => {
    setShowToDatePicker(true);
  };

  const handleFromDateChange = (event, date) => {
    setShowFromDatePicker(false);
    if (date !== undefined) {
      setFromDate(date);
    }
  };

  const handleToDateChange = (event, date) => {
    setShowToDatePicker(false);
    if (date !== undefined) {
      setToDate(date);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon name="arrow-back-ios" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Close Register</Text>
      </View>
      <View style={styles.filterContainer}>
        <View style={styles.dateFieldContainer}>
          <Text>From Date:</Text>
          <TouchableOpacity onPress={showFromDatePickerModal}>
            <Text style={styles.dateText}>
              {fromDate.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={handleFromDateChange}
            />
          )}
        </View>
        <View style={styles.dateFieldContainer}>
          <Text>To Date:</Text>
          <TouchableOpacity onPress={showToDatePickerModal}>
            <Text style={styles.dateText}>
              {toDate.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={handleToDateChange}
            />
          )}
        </View>
      </View>
      <View style={{marginBottom: 10}}>
        <PrimaryButton title="Filter" onPress={handleFilterPress} />
      </View>
      {noDataMessage ? (
        <Text style={[styles.noDataMessage, {textAlign: 'center'}]}>
          {noDataMessage}
        </Text>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={item => item.sales_id.toString()}
          renderItem={renderInvoiceItem}
          showsVerticalScrollIndicator={false}
        />
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateFieldContainer: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'space-between',
  },
  dateText: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
    color: COLORS.primary,
  },
  invoiceItem: {
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  invoiceText: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 5,
  },
  noDataMessage: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
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

export default InvoiceListScreen;
