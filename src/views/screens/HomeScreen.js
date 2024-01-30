import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import COLORS from '../../consts/colors';
import {useCartContext} from '../../context/CartContext';
import Toast from 'react-native-toast-message';
import AnimatedSearchBox from '@ocean28799/react-native-animated-searchbox';
import DropdownComponent from '../components/DropdownComponet';
import AddToCartModal from '../../modal/AddToCartModal';
import Card from '../components/Card';
import ListCategories from '../components/ ListCategories';
import {selectRegisterOpen, selectToken} from '../../redux/authSlice';
import {useSelector} from 'react-redux';
import {CatList, ProdList, baseURL} from '../../Apis/apiConstants';
import axios from 'axios';
import {useDispatch} from 'react-redux';

const {width} = Dimensions.get('screen');
const searchWidth = width / 2;

const HomeScreen = () => {
  const isRegisterOpen = useSelector(selectRegisterOpen);
  const {cartItems, addToCart, selectedTable, updateSelectedTable} =
    useCartContext();
  const refSearchBox = useRef();
  const openSearchBox = () => refSearchBox.current.open();
  const closeSearchBox = () => refSearchBox.current.close();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isTableSelected, setIsTableSelected] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, selectedCategoryIndex, categoryList, products]);

  const token = useSelector(selectToken);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (products?.length == 0) {
      fetchData();
      fetchCategories();
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const productListUrl = baseURL + ProdList;
        const response = await axios.post(productListUrl, null, {headers});
        const innerData = response.data.data;
        if (innerData) {
          setProducts(Array.from(innerData));
          setFilteredFoods(innerData);
        } else {
          console.error('Failed to fetch data from the API');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [token]);
  const fetchCategories = useCallback(async () => {
    try {
      if (token) {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };
        const catListUrl = baseURL + CatList;
        const response = await axios.post(catListUrl, null, {headers});
        const {data} = response.data;
        setCategoryList(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [token]);

  const handleSearch = text => {
    setSearchQuery(text);

    const filteredBySearch = products.filter(product =>
      product.prod_name.toLowerCase().includes(text.toLowerCase()),
    );

    const filteredByCategory =
      selectedCategoryIndex === 0
        ? filteredBySearch
        : filteredBySearch.filter(product =>
            product.cat_id.includes(categoryList[selectedCategoryIndex].cat_id),
          );

    setFilteredFoods(filteredByCategory);
  };

  const handleAddToCart = (food, quantity) => {
    if (isRegisterOpen) {
      if (!selectedTable?.tableName) {
        errorToast(
          'Select a Table',
          'Please select a table before adding to cart.',
        );
        return;
      }

      const isItemInCart = cartItems.some(
        item =>
          item.prod_id === food.prod_id &&
          item.table === selectedTable?.tableValue,
      );

      if (isItemInCart) {
        errorToast(
          'Already in Cart',
          `${food.prod_name} is already in your cart for this table.`,
        );
      } else {
        // Include the selected table in the cart item
        const cartItem = {
          ...food,
          table: selectedTable?.tableValue,
          quantity: quantity,
        };
        addToCart(cartItem);
        showToast(
          'Added to Cart',
          `${food.prod_name} has been added to your cart for this table.`,
        );
      }
    } else {
      errorToast(
        'Register is not open.',
        'Please open a Register before adding to cart.',
      );
    }
  };

  const openModal = food => {
    if (isRegisterOpen) {
      if (selectedTable?.tableName) {
        setSelectedFood(food);
        setModalVisible(true);
      } else {
        errorToast(
          'Select a Table',
          'Please select a table before adding to cart.',
        );
      }
    } else {
      errorToast(
        'Register is not open.',
        'Please open a Register before adding to cart.',
      );
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsTableSelected(false);
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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={styles.header}>
        <DropdownComponent
          selectedTable={selectedTable?.tableName}
          onSelectTable={(tableName, tableValue) => {
            updateSelectedTable({tableName, tableValue});
            showToast(`${tableName} selected.`);
          }}
        />
        {/* Search bar section */}
        <View
          style={{
            width: searchWidth,
            paddingHorizontal: 10,
            paddingVertical: 0,
            marginTop: 15,
          }}>
          <AnimatedSearchBox
            ref={ref => (refSearchBox.current = ref)}
            placeholder={'Search for food'}
            placeholderTextColor="#848484"
            backgroundColor={COLORS.light}
            searchIconColor="#000"
            focusAfterOpened
            searchIconSize={22}
            borderRadius={8}
            onChangeText={handleSearch}
            onBlur={() => closeSearchBox()}
            value={searchQuery}
            paddingVertical={0}
          />
        </View>
      </View>
      {/* List of food categories */}
      <View>
        <ListCategories
          selectedCategoryIndex={selectedCategoryIndex}
          setSelectedCategoryIndex={setSelectedCategoryIndex}
          categoryList={categoryList}
        />
      </View>
      {/* FlatList to display food cards */}
      <FlatList
        contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={filteredFoods}
        keyExtractor={item =>
          item.prod_id ? item.prod_id.toString() : item.prod_id.toString()
        }
        ListEmptyComponent={() => (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Image
              source={require('../../assets/emptyCart.jpeg')}
              style={{width: 200, height: 200}}
            />
            <Text style={{marginTop: 20, fontSize: 16}}>
              No food found. Try a different search.
            </Text>
          </View>
        )}
        renderItem={({item}) => (
          <Card
            products={products}
            openModal={openModal}
            handleAddToCart={handleAddToCart}
            food={item}
            onPress={selectedFood => {
              setSelectedFood(selectedFood);
              setModalVisible(true);
            }}
          />
        )}
      />
      {/* AddToCartModal component */}
      <AddToCartModal
        isVisible={modalVisible}
        closeModal={() => {
          closeModal();
          setIsTableSelected(false);
        }}
        foodItem={selectedFood}
        addToCart={handleAddToCart}
        selectedTable={selectedTable?.tableName}
        isTableSelected={isTableSelected}
        handleAddToCart={handleAddToCart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  addToCartBtn: {
    height: 32,
    width: 32,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
