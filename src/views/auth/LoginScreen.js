import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Footer from '../components/Footer';
import {navigationRef} from '../../../App';
import COLORS from '../../consts/colors';
import Toast from 'react-native-toast-message';
import {Login, baseURL} from '../../Apis/apiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {
  setGrandTotalPrice,
  setRegisterId,
  setRegisterOpen,
  setToken,
  setUserData,
} from '../../redux/authSlice';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),
});
const LoginScreen = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   checkTokenAndNavigate();
  // }, []);

  // const checkTokenAndNavigate = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     const userData = await AsyncStorage.getItem('userData');
  //     const registerOpen = await AsyncStorage.getItem('registerOpen');
  //     const registerId = await AsyncStorage.getItem('registerId');
  //     const isRegisterOpen = JSON.parse(registerOpen);
  //     const grandTotalPrice = await AsyncStorage.getItem('grandTotalPrice');
  //     const ParsedGrandTotalPrice = parseFloat(grandTotalPrice);
  //     if (token) {
  //       dispatch(setToken(token));
  //       navigationRef.current?.navigate('Home');
  //     }
  //     if (userData) {
  //       dispatch(setUserData(userData));
  //     }
  //     if (registerOpen) {
  //       dispatch(setRegisterOpen(isRegisterOpen));
  //     }
  //     if (registerId) {
  //       dispatch(setRegisterId(registerId));
  //     }
  //     if (grandTotalPrice) {
  //       console.log('grandTotalPrice', ParsedGrandTotalPrice);
  //       dispatch(setGrandTotalPrice(ParsedGrandTotalPrice));
  //     }
  //   } catch (error) {
  //     console.error('Error checking token:', error);
  //   }
  // };

  const handleSignIn = async values => {
    try {
      setLoading(true);

      const loginUrl = baseURL + Login;

      const response = await axios.post(loginUrl, {
        email: values.email,
        password: values.password,
      });

      if (response && response.status === 200) {
        const token = response.data.data.token;
        const userData = JSON.stringify(response.data.data.user);

        console.log(userData);

        showToast('Successfully signed in!');
        await AsyncStorage.setItem('token', token);
        dispatch(setToken(token));
        await AsyncStorage.setItem('userData', userData);
        dispatch(setUserData(userData));

        console.log('Successful sign-in:', values, 'Token: ' + token);
        setErrorMessage('');

        navigationRef.current?.navigate('Home');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = message => {
    Toast.show({
      type: 'success',
      text1: message,
      visibilityTime: 1200,
    });
  };

  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, backgroundColor: COLORS.white}}>
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Image
                alt="AppLogo"
                resizeMode="contain"
                style={styles.headerImg}
                source={require('../../assets/HotelZ.png')}
              />
              <Text style={styles.title}>
                Sign in to <Text style={{color: COLORS.primary}}>HotelZ</Text>
              </Text>
            </View>

            <View style={styles.form}>
              <Formik
                initialValues={{email: '', password: ''}}
                validationSchema={validationSchema}
                onSubmit={values => handleSignIn(values)}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <>
                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        placeholder="Enter your email"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={values.email}
                      />
                      {touched.email && errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}
                    </View>

                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          autoCorrect={false}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          placeholder="Enter your password"
                          placeholderTextColor="#6b7280"
                          style={styles.inputControl}
                          secureTextEntry={!showPassword}
                          value={values.password}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeIcon}>
                          {showPassword ? (
                            <Icon name="eye-off" size={20} color="#6b7280" />
                          ) : (
                            <Icon name="eye" size={20} color="#6b7280" />
                          )}
                        </TouchableOpacity>
                      </View>
                      {touched.password && errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                      )}
                    </View>

                    {errorMessage ? (
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}

                    <View style={styles.formAction}>
                      <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}>
                        <View style={styles.btn}>
                          {loading ? (
                            <ActivityIndicator size={26} color={COLORS.white} />
                          ) : (
                            <>
                              <Icon
                                name="log-in"
                                size={20}
                                color={COLORS.white}
                                style={{marginRight: 8}}
                              />
                              <Text style={styles.btnText}>Sign in</Text>
                            </>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <Footer />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    marginVertical: 30,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 6,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
    marginBottom: 50,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    width: '100%',
    backgroundColor: '#e8ecf4',
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: COLORS.white,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#e8ecf4',
    borderRadius: 12,
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
});
export default LoginScreen;
