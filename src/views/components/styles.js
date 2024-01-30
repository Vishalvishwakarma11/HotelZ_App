// styles.js
import {Dimensions, StyleSheet} from 'react-native';
import COLORS from '../../consts/colors';

const {width} = Dimensions.get('screen');
const cardWidth = width / 2 - 30;
const searchWidth = width / 2;

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

export default styles;
