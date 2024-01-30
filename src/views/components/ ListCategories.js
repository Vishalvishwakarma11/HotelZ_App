import React from 'react';
import {ScrollView, TouchableOpacity, View, Text, Image} from 'react-native';
import COLORS from '../../consts/colors';
import styles from './styles';

const ListCategories = React.memo(
  ({selectedCategoryIndex, setSelectedCategoryIndex, categoryList}) => {
    const scrollViewRef = React.useRef(null);
    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesListContainer}>
        {categoryList.map((category, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedCategoryIndex(index);
            }}>
            <View
              style={{
                backgroundColor:
                  selectedCategoryIndex === index
                    ? COLORS.primary
                    : COLORS.secondary,
                ...styles.categoryBtn,
              }}>
              <View style={styles.categoryBtnImgCon}>
                {/* <Image
                  source={category.image}
                  style={{height: 35, width: 35, resizeMode: 'cover'}}
                /> */}
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginLeft: 10,
                  color:
                    selectedCategoryIndex == index
                      ? COLORS.white
                      : COLORS.primary,
                }}>
                {category.cat_name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  },
);

export default ListCategories;
