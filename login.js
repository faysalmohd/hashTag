import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableHighlight, Image, useColorScheme, ActivityIndicator } from 'react-native';
import { Icon, Divider } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore/lite';
import SvgLogo from './svg/logo';
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: "AIzaSyAyuglecfsmXSPXwYrKDo851mWCKoBw_js",
  authDomain: "hashtaginfo-5e124.firebaseapp.com",
  projectId: "hashtaginfo-5e124",
  storageBucket: "hashtaginfo-5e124.appspot.com",
  messagingSenderId: "210582425078",
  appId: "1:210582425078:web:fd7cca1767cea8f58c8bd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export default function Login({ navigation }) {
  /* const [items, setItems] = useState([]) */
  const [dataLoading, setDataLoading] = useState(true)
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(true);
  const [usernameText, setUsernameText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [loginErr, setLoginErr] = useState(false);
  const [UsernameFocused, setUsernameFocused] = useState(false);
  const [PasswordFocused, setPasswordFocused] = useState(false);
  const [bgColor, stetBgColor] = useState(false)

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    storeData();
  }, [userData]);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@userInfo', JSON.stringify(userData));
    } catch (e) {
    }
  }



  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@userInfo')
      if (value !== null) {
        let JsonData = JSON.parse(value);
        setUserData(JsonData)
        setTimeout(() => {setDataLoading(false)}, 50)
        navigation.navigate('BottomNavigation', { username: JsonData.username, password: JsonData.password, firstname: JsonData.firstname, lastname: JsonData.lastname, verified: JsonData.verified, id: JsonData.id })
      } else {
        setDataLoading(false)
      }
    } catch (e) {
      
    }
  }


  /*     useEffect(() => {
        const fetchData = async () => {
          const dataCollection = collection(db, 'Users');
          const dataSnapshot = await getDocs(dataCollection);
          const items = dataSnapshot.docs.map(doc => {
            return {
              id: doc.id,
              verified: doc.data().verified,
              username: doc.data().username,
              password: doc.data().password,
              firstname: doc.data().firstname,
              lastname: doc.data().lastname
            };
          });
          setItems(items);
        }
        fetchData();
      }, []); */


  let colorScheme = useColorScheme();
  useEffect(() => {


    if (colorScheme === 'dark') {
      stetBgColor(true)
    } else {
      stetBgColor(false)
    }
  }, [colorScheme])

  const login = async (uname, pword) => {
    setLoading(true)
    const dataCollection = collection(db, 'Users');
    const dataSnapshot = await getDocs(dataCollection);
    const items = dataSnapshot.docs.map(doc => {
      return {
        id: doc.id,
        verified: doc.data().verified,
        username: doc.data().username,
        password: doc.data().password,
        firstname: doc.data().firstname,
        lastname: doc.data().lastname
      };
    });
    setTimeout(() => {
      if (uname.trim() == "" || pword.trim() == "") {
        setLoginErr(true)
        setLoading(false)
      } else {
        setLoading(true)
        setLoginErr(false)
        const filtered = items.filter((user) => user.username === uname.trim())
        if (filtered.length === 0) {
          setLoginErr(true)
          setLoading(false)
        }
        else {
          if (filtered[0].username === uname.trim() && filtered[0].password === pword.trim()) {
            setTimeout(() => { home_screen(filtered[0]) }, 100)
          }
          else {
            setLoading(false)
            setLoginErr(true)
          }
        }
      }
    }, 1000)
  }

  const home_screen = (userList) => {
    setUserData(userList)
    navigation.navigate('BottomNavigation', { username: userList.username, password: userList.password, firstname: userList.firstname, lastname: userList.lastname, verified: userList.verified, id: userList.id })
    setUsernameText('');
    setPasswordText('');
    setPassword(true)
    setLoading(false);
    setLoginErr(false)
  }

  const signup_screen = () => {
    setUsernameText('');
    setLoginErr(false)
    setPasswordText('');
    setLoading(false)
    navigation.navigate('Signup')
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      {
        dataLoading ?
          <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 70, paddingBottom: 100, backgroundColor: bgColor ? 'black' : 'white' }}>
            <ActivityIndicator color='#08FF08' size={50} />
          </View>
          :
          <ScrollView style={[styles.container, { backgroundColor: bgColor ? 'black' : 'white' }]}>
            <View style={{ display: 'flex', alignItems: 'center', paddingTop: 70, paddingBottom: 100 }}>
              {/* <SvgComponent /> */}
              <SvgLogo />
            </View>

            {/* <View style={styles.icons}>
          <View style={{ transform: 'rotate(-20deg)', padding: 0, margin: 0, height: 20 }}>
            <View style={{ transform: 'translate(-70px, -50px)' }}>
              <Icon
                name='add-a-photo'
                size={18}
                color='#d9d9d9' />
            </View>
          </View>
          <View style={{ padding: 0, margin: 0, height: 20 }}>
            <View style={{ transform: 'translate(130px, 0px)' }}>
              <Icon
                name='photo'
                size={18}
                color='#d9d9d9' />
            </View>
          </View>
          <View style={{ transform: 'rotate(300deg)', padding: 0, margin: 0, height: 20 }}>
            <View style={{ transform: 'translate(30px, 20px)' }}>
              <Icon
                name='music-note'
                size={18}
                color='#d9d9d9' />
            </View>
          </View>
          <View style={{ padding: 0, margin: 0, height: 20 }}>
            <View style={{ transform: 'translate(-150px, 80px)' }}>
              <Icon
                name='language'
                size={18}
                color='#d9d9d9' />
            </View>
          </View>
          <View style={{ transform: 'rotate(-20deg)', padding: 0, margin: 0, height: 20 }}>
            <View style={{ transform: 'translate(100px, 150px)' }}>
              <Icon
                name='favorite'
                size={18}
                color='#d9d9d9' />
            </View>
          </View>
          <View style={{ transform: 'rotate(-40deg)', padding: 0, margin: 0, height: 20 }}>
            <View style={{ transform: 'translate(-70px, -130px)' }}>
              <Icon
                name='question-answer'
                size={18}
                color='#d9d9d9' />
            </View>
          </View>
          <View style={{ transform: 'rotate(-20deg)', padding: 0, margin: 0, height: 20 }}>
            <View style={{ transform: 'translate(170px, 20px)' }}>
              <Icon
                name='thumb-up'
                size={18}
                color='#d9d9d9' />
            </View>
          </View>
          <View style={{ transform: 'rotate(20deg)', padding: 0, margin: 0, height: 20 }}>
            <View style={{ transform: 'translate(0px, 50px)' }}>
              <Icon
                name='person'
                size={18}
                color='#d9d9d9' />
            </View>
          </View>
          <View style={{ padding: 0, margin: 0, height: 20 }}>
            <View style={{ transform: 'translate(60px, -10px)' }}>
              <Icon
                name='verified'
                size={18}
                color='#d9d9d9' />
            </View>
          </View>
        </View> */}
            <View>
              <TextInput keyboardType='visible-password' autoCapitalize='none' value={usernameText} onFocus={() => { setUsernameFocused(true) }} onBlur={() => { setUsernameFocused(false) }} onChangeText={(usernameText) => { setUsernameText(usernameText) }} style={[styles.username, { borderColor: UsernameFocused ? '#08ff08' : '#f3f3f3' }]} placeholder='Username' ></TextInput>
              <View onFocus={() => { setPasswordFocused(true) }} onBlur={() => { setPasswordFocused(false) }} style={[styles.viewPassword, { borderColor: PasswordFocused ? '#08ff08' : '#f3f3f3' }]}>
                <TextInput autoCapitalize='none' value={passwordText} onChangeText={(passwordText) => { setPasswordText(passwordText); setLoginErr(false) }} style={styles.password} placeholder='Password' secureTextEntry={password} ></TextInput>
                <View style={{ borderRadius: 14 }}>
                  <Icon
                    onPress={() => { setPassword(!password) }}
                    style={{ padding: 5 }}
                    name={password ? "visibility-off" : "visibility"}
                    color={PasswordFocused ? '#00bf00' : '#a3a3a3'}
                    underlayColor='#f3f3f3' />
                </View>
              </View>

            </View>
            <View style={styles.viewForgotPassword}>
              <Text style={{ color: 'red', fontSize: 14, paddingLeft: 15, paddingTop: 5 }}>{loginErr ? '*Invalid username or password.' : ''}</Text>
              <Text style={styles.forgotpassword} onPress={() => { console.log("forgot password") }}>Forgot Password?</Text>
            </View>
            <TouchableHighlight style={styles.btn} onPress={() => { login(usernameText, passwordText) }} underlayColor='#8eff8a'>
              <Text style={styles.btnText}>
                {loading ? <ActivityIndicator size={20} color='white' /> : 'LogIn'}
              </Text>
            </TouchableHighlight>
            <View style={styles.signup}>
              <Text style={{ color: '#00bf00', fontWeight: '300' }}>Dont have an account?  </Text>
              <Text style={{ color: '#008c00', fontWeight: '900' }} onPress={() => { signup_screen() }}>Create account</Text>
            </View>
          </ScrollView>
      }


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 70,
  },
  /*   icons: {
      height: 'fitContent',
      marginBottom: 70
    }, */
  username: {
    backgroundColor: '#f3f3f3',
    padding: 10,
    paddingLeft: 14,
    fontSize: 15,
    borderRadius: 14,
    marginBottom: 20,
    marginHorizontal: 10,
    borderWidth: 1,

  },
  viewPassword: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#f3f3f3',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    marginHorizontal: 10,
    paddingRight: 10,
    borderRadius: 14,
  },
  password: {
    padding: 10,
    paddingLeft: 14,
    fontSize: 15,
    width: '90%'
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 14,
    marginTop: 40,
    backgroundColor: '#08ff08',
    marginHorizontal: 30
  },
  btnText: {
    display: 'flex',
    color: 'white',
    fontWeight: '900',
    fontSize: 17,
  },
  viewForgotPassword: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5
  },
  forgotpassword: {
    color: '#00bf00',
    marginLeft: 20,
    paddingRight: 13,
    paddingTop: 10,
    fontWeight: '500'
  },
  signup: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 5,
    paddingVertical: 10,
    paddingBottom: 200
  },
});
