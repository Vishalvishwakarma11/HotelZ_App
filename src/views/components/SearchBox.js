import React, {useRef} from 'react';
import {AnimatedSearchBox} from '@ocean28799/react-native-animated-searchbox';
import styles from './styles';
import COLORS from '../../consts/colors';
import {Dimensions, View} from 'react-native';

const {width} = Dimensions.get('screen');
const cardWidth = width / 2 - 30;
const searchWidth = width / 2;

const SearchBox = ({
  refSearchBox,
  handleSearch,
  searchQuery,
  closeSearchBox,
}) => {
  return (
    <View
      style={{
        width: searchWidth,
        paddingHorizontal: 10,
        paddingVertical: 0,
        marginTop: 15,
      }}>
      <AnimatedSearchBox
        ref={refSearchBox}
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
  );
};

export default SearchBox;
