import React, { useEffect } from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../consts/colors';

const AddToCartModal = ({
  foodItem,
  isVisible,
  closeModal,
  selectedTable,
  handleAddToCart,
}) => {
  const [quantity, setQuantity] = React.useState(1);

  useEffect(() => {
    setQuantity(1)
  }, [closeModal])
  

  const handleQuantityChange = value => {
    const newQuantity = quantity >= 1 && Math.max(1, quantity + value);
    setQuantity(newQuantity);
  };
  
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              console.log('Closing modal');
              closeModal();
            }}>
            <Icon name="close" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          {/* Display the selected table */}
          <Text style={styles.modalTitle}>
            {selectedTable ? selectedTable : 'No Table Selected'}
          </Text>
          <View style={styles.foodDetails}>
            <Text style={styles.foodName}>
              {foodItem && foodItem.prod_name}
            </Text>
            <Text style={styles.foodPrice}>
              ${foodItem && foodItem.prod_price}
            </Text>
          </View>
          <View style={styles.actionBox}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleQuantityChange(-1)}>
              <Icon name="remove" size={25} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleQuantityChange(1)}>
              <Icon name="add" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => {
                console.log('Adding to cart with quantity:', quantity);
                closeModal();
                handleAddToCart(foodItem, quantity);
              }}>
              <Text style={styles.addToCartButtonText}>Add to cart</Text>
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
  foodDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  foodPrice: {
    fontSize: 16,
    color: COLORS.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addToCartButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  addToCartButtonText: {
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
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  selectedTableText: {
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.primary,
  },
});

export default AddToCartModal;
