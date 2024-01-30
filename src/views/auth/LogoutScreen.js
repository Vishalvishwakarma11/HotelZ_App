import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Footer from '../components/Footer';
import FormModal from '../../modal/FormModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import Toast from 'react-native-toast-message';
import {selectRegisterOpen, selectUserData} from '../../redux/authSlice';
import {useSelector} from 'react-redux';

const LogoutScreen = () => {
  const navigation = useNavigation();
  const userData = useSelector(selectUserData);
  const isRegisterOpen = useSelector(selectRegisterOpen);
  const [userName, setUserName] = useState();
  const [userInfo, setUserInfo] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (userData) {
      setUserName(JSON.parse(userData).name);
      setUserInfo(JSON.parse(userData).email);
    }
  }, [userData]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = (newUserName, newUserInfo) => {
    setUserName(newUserName);
    setUserInfo(newUserInfo);
    closeModal();
  };

  const handleLogout = async () => {
    if (isRegisterOpen == null) {
      try {
        await AsyncStorage.multiRemove([
          'token',
          'userData',
          'registerOpen',
          'registerId',
          'grandTotalPrice',
        ]);
        console.log('Successful sign-out:');
        showToast('Successfully signed out!');
        navigation.replace('Login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    } else {
      errorToast('Register is open, Please close before logging out');
    }
  };
  const InvoiceListNavigate = async () => {
    try {
      navigation.navigate('InvoiceList');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const openRegister = async () => {
    try {
      navigation.navigate('OpenRegisterScreen');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const closeRegister = async () => {
    try {
      navigation.navigate('CloseRegisterScreen');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const showConfirmation = () => {
    Alert.alert(
      'Logout?',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: handleLogout,
        },
      ],
      {cancelable: false},
    );
  };

  const showToast = message => {
    Toast.show({
      type: 'success',
      text1: message,
      visibilityTime: 1000,
    });
  };

  const errorToast = message => {
    Toast.show({
      type: 'error',
      text1: message,
      visibilityTime: 1000,
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigation.goBack}>
            <Icon name="arrow-back-ios" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profile</Text>
        </View>

        <View style={styles.userContainer}>
          <Icon name="person" size={40} color="#1d1d1d" />
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userInfo}>{userInfo}</Text>
          </View>
          {/* <View style={styles.editButtonContainer}>
            <TouchableOpacity onPress={openModal}>
              <Icon name="edit" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View> */}
        </View>

        <FormModal
          isVisible={isModalVisible}
          onClose={closeModal}
          onSave={handleSave}
          userName={userName}
          userInfo={userInfo}
        />

        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity onPress={openRegister}>
            <View style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Open Register</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity onPress={closeRegister}>
            <View style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Close Register</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity onPress={InvoiceListNavigate}>
            <View style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Invoice List</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.logoutButtonContainer, {margin: 10}]}>
        <TouchableOpacity onPress={showConfirmation}>
          <View style={styles.logoutButton}>
            <Icon name="exit-to-app" size={28} color={COLORS.white} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfoContainer: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  userInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#48494a',
  },
  editButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  logoutButtonContainer: {
    marginTop: 15,
    justifyContent: 'flex-end',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
    textAlign: 'center',
  },
});

export default LogoutScreen;
