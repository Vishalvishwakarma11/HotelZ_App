import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Marquee} from '@animatereactnative/marquee';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';

const {width} = Dimensions.get('screen');
const cardWidth = width / 2 - 30;
const Card = ({handleAddToCart, openModal, food: foodItem, onPress}) => {
  return (
    <View>
      <TouchableOpacity
        key={foodItem.prod_id}
        activeOpacity={0.8}
        onPress={() => openModal(foodItem)}>
        <View style={foodCardStyles.card}>
          <View style={{marginHorizontal: 10}}>
            {foodItem?.prod_name?.length > 12 ? (
              <Marquee spacing={20} speed={0.4}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  {foodItem.prod_name}
                </Text>
              </Marquee>
            ) : (
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {foodItem.prod_name}
              </Text>
            )}
          </View>
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              ${foodItem.prod_price}
            </Text>
            <TouchableOpacity
              style={foodCardStyles.addToCartBtn}
              onPress={() => handleAddToCart(foodItem)}>
              <Icon name="add" size={30} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const foodCardStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  categoriesListContainer: {
    paddingTop: 20,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  categoryBtn: {
    height: 45,
    minWidth: 120,
    marginRight: 7,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    minHeight: 'auto',
    paddingVertical: 10,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 8,
    marginTop: 10,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.white,
  },
  addToCartBtn: {
    height: 32,
    width: 32,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
