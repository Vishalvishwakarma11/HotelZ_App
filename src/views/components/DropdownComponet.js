import React, {useState, useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios'; // Import axios
import COLORS from '../../consts/colors';
import {useDispatch, useSelector} from 'react-redux';
import {selectToken} from '../../redux/authSlice';
import {TableList, baseURL} from '../../Apis/apiConstants';

const {width} = Dimensions.get('screen');
const dropdownWidth = width / 2 - 30;

const DropdownComponent = ({selectedTable, onSelectTable}) => {
  const token = useSelector(selectToken);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      if (token) {
        try {
          const tableDate = baseURL + TableList;
          const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };
          const response = await axios.post(tableDate, null, {headers});
          const data = response.data;
          if (data.status && data.data) {
            setTableData(
              data.data.map(table => ({
                label: table.name,
                value: table.id,
              })),
            );
          } else {
            console.error('Failed to fetch table data from the API');
          }
        } catch (error) {
          console.error('Error fetching table data:', error);
        }
      }
    };

    fetchTableData();
  }, [token]);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: COLORS.primary}]}>
          Select Table
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: COLORS.primary}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={tableData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select Table' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          onSelectTable(item.label, item.value);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  dropdown: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: dropdownWidth,
    paddingVertical: 23,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 5,
    zIndex: 999,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
