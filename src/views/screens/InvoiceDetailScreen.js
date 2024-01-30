import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import COLORS from '../../consts/colors';

const InvoiceDetailScreen = ({route}) => {
  const {invoice} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.invoiceItem}>
        <Text style={styles.headerText}>Invoice Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Invoice ID:</Text>
          <Text style={styles.valueText}>{invoice.sales_id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Table Id:</Text>
          <Text style={styles.valueText}>{invoice.table_id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Voucher Number:</Text>
          <Text style={styles.valueText}>{invoice.voucher_number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Amount:</Text>
          <Text style={styles.valueText}>{`$${invoice.invoice_amount}`}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Created At:</Text>
          <Text style={styles.valueText}>{invoice.created_at}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  invoiceItem: {
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.lightGray,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 16,
  },
});

export default InvoiceDetailScreen;
