import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableHighlight, Image, useColorScheme, ActivityIndicator } from 'react-native';
import { Icon } from '@rneui/themed';
import { useEffect, useState } from 'react';
import SvgComponent from './svg/hashTag';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore/lite';
import SvgLogo from './svg/logo';

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
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([])
    const [duplicate, setDuplicate] = useState(false)
    const [firstnameText, setFirstnameText] = useState('');
    const [lastnameText, setLastnameText] = useState('');
    const [emailText, setEmailText] = useState('');
    const [usernameText, setUsernameText] = useState('');
    const [passwords, setPassword] = useState(true);
    const [passwordText, setPasswordText] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(true);
    const [confirmPasswordText, setConfirmPasswordText] = useState('');
    const [signupErr, setSignupErr] = useState(false);
    const [match, setMatch] = useState(false);
    const [correctLength, setCorrectLength] = useState(false);
    const [FirstFocused, setFirstFocused] = useState(false);
    const [LastFocused, setLastFocused] = useState(false);
    const [EmailFocused, setEmailFocused] = useState(false);
    const [UsernameFocused, setUsernameFocused] = useState(false);
    const [PasswordFocused, setPasswordFocused] = useState(false);
    const [ConfirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    const [bgColor, stetBgColor] = useState(false)

    // -----------------------------------------------------------------------------------------------------------

    useEffect(() => {
        const fetchData = async () => {
            const dataCollection = collection(db, 'Users');
            const dataSnapshot = await getDocs(dataCollection);
            const items = dataSnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    date: doc.data().date,
                    firstname: doc.data().firstname,
                    lastname: doc.data().lastname,
                    email: doc.data().email,
                    username: doc.data().username,
                    password: doc.data().password
                };
            });
            setItems(items);
        }
        fetchData();
    }, []);

    let colorScheme = useColorScheme();
    useEffect(() => {


        if (colorScheme === 'dark') {
            stetBgColor(true)
        } else {
            stetBgColor(false)
        }
    }, [colorScheme])

    const signup = async (fname, lname, email, uname, pword, cpword) => {
        setDuplicate(false)
        setLoading(true);
        setMatch(false);
        setSignupErr(false);
        setCorrectLength(false);
        if (fname.trim() == "" || lname.trim() == "" || email.trim() == "" || uname.trim() == "" || pword.trim() == "" || cpword.trim() == "") {
            setSignupErr(true)
            setDuplicate(false)
            setLoading(false);
        } else {
            if (fname.trim() != "" && lname.trim() != "" && email.trim() != "" && uname.trim() != "" && pword.trim() !== "" && cpword.trim() != "") {
                setSignupErr(false)
                if ((pword.trim() === cpword.trim()) && (pword.trim() != '' && cpword.trim() != '')) {
                    setMatch(false)
                    if (pword.length < 7) {
                        setCorrectLength(true);
                        setLoading(false);
                    } else {
                        let i = 0;
                        let j = 0;
                        while (i < items.length) {
                            if (items[i].username == uname.trim()) {
                                j += 1;
                                setDuplicate(true);
                                setMatch(false);
                                setSignupErr(false);
                                setCorrectLength(false);
                                setUsernameText('')
                                setLoading(false);
                                break
                            }
                            i++

                        }

                        if (j == 0) {
                            let newUser = { firstname: fname, lastname: lname, email: email, username: uname.toLowerCase(), password: pword, verified: 0 };
                            await addDoc(collection(db, 'Users'), newUser);
                            { home_screen(uname, pword, fname, lname) }
                        }
                    }

                }
                else {
                    if ((pword.trim() !== cpword.trim())) {
                        setMatch(true)
                        setLoading(false);
                    } else {
                        if (pword.trim() != '' || cpword.trim() != '') {
                            setSignupErr(true)
                            setLoading(false);
                        }
                    }
                }
            }
        }
    }


    const home_screen = (uname, pword, fname, lname) => {
        navigation.navigate('BottomNavigation', { username: uname, password: pword, verified: 0, firstname: fname, lastname: lname })
    }

    const login_screen = () => {
        setMatch(false)
        setLoading(false)
        setPassword(false)
        setConfirmPassword(false)
        setConfirmPasswordText('')
        setPasswordText('')
        setUsernameText('')
        setFirstnameText('')
        setLastnameText('')
        setEmailText('')
        setDuplicate(false)
        setCorrectLength(false)
        setSignupErr(false)
        navigation.navigate('Login')
    }
    return (
        <View style={{ flex: 1, paddingTop: 35, backgroundColor: bgColor ? 'black' : 'white' }}>
            <StatusBar style="auto" />
            <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: bgColor ? 'black' : 'white' }]}>
                <View style={{ display: 'flex', alignItems: 'center', paddingTop: 35, paddingBottom: 100 }}>
                    {/* <SvgComponent /> */}
                    <SvgLogo />
                </View>

                {/* <View style={styles.icons}>
                    <View style={{ transform: 'rotate(-20deg)', padding: 0, margin: 0, height: 20 }}>
                        <View style={{ transform: 'translate(-70px, -50px)' }}>
                            <Icon
                                name='add-a-photo'
                                size={20}
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
                                size={25}
                                color='#d9d9d9' />
                        </View>
                    </View>
                    <View style={{ transform: 'rotate(-20deg)', padding: 0, margin: 0, height: 20 }}>
                        <View style={{ transform: 'translate(100px, 150px)' }}>
                            <Icon
                                name='favorite'
                                size={22}
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
                                size={24}
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
                    <TextInput value={firstnameText} onFocus={() => { setFirstFocused(true) }} onBlur={() => { setFirstFocused(false) }} onChangeText={(firstnameText) => { setFirstnameText(firstnameText) }} style={[styles.textField, { borderColor: FirstFocused ? '#08ff08' : '#f3f3f3' }]} placeholder='First Name' ></TextInput>
                    <TextInput value={lastnameText} onFocus={() => { setLastFocused(true) }} onBlur={() => { setLastFocused(false) }} onChangeText={(lastnameText) => { setLastnameText(lastnameText) }} style={[styles.textField, { borderColor: LastFocused ? '#08ff08' : '#f3f3f3' }]} placeholder='Last Name' ></TextInput>
                    <TextInput autoCapitalize='none' keyboardType='email-address' value={emailText} onFocus={() => { setEmailFocused(true) }} onBlur={() => { setEmailFocused(false) }} onChangeText={(emailText) => { setEmailText(emailText) }} style={[styles.textField, { borderColor: EmailFocused ? '#08ff08' : '#f3f3f3' }]} placeholder='Email' ></TextInput>
                    <TextInput autoCapitalize='none' keyboardType='visible-password' value={usernameText} onFocus={() => { setUsernameFocused(true) }} onBlur={() => { setUsernameFocused(false) }} onChangeText={(usernameText) => { setUsernameText(usernameText) }} style={[styles.textField, { borderColor: UsernameFocused ? '#08ff08' : '#f3f3f3' }]} placeholder='Username' ></TextInput>
                    <View style={[styles.viewPassword, { borderColor: PasswordFocused ? '#08ff08' : '#f3f3f3' }]} onFocus={() => { setPasswordFocused(true) }} onBlur={() => { setPasswordFocused(false) }}>
                        <TextInput autoCapitalize='none' value={passwordText} onChangeText={(passwordText) => { setPasswordText(passwordText); setSignupErr(false) }} style={styles.password} placeholder='Password' secureTextEntry={passwords} ></TextInput>
                        <View style={{ borderRadius: 14 }}>
                            <Icon
                                onPress={() => { setPassword(!passwords) }}
                                style={{ padding: 5 }}
                                name={passwords ? "visibility-off" : "visibility"}
                                color={PasswordFocused ? '#00bf00' : '#a3a3a3'}
                                underlayColor='#f3f3f3' />
                        </View>
                    </View>
                    <View style={[styles.viewConfirmPassword, { borderColor: ConfirmPasswordFocused ? '#08ff08' : '#f3f3f3' }]} onFocus={() => { setConfirmPasswordFocused(true) }} onBlur={() => { setConfirmPasswordFocused(false) }}>
                        <TextInput autoCapitalize='none' value={confirmPasswordText} onChangeText={(confirmPasswordText) => { setConfirmPasswordText(confirmPasswordText); setSignupErr(false) }} style={styles.password} placeholder='Confirm Password' secureTextEntry={confirmPassword} ></TextInput>
                        <View style={{ borderRadius: 14 }}>
                            <Icon
                                onPress={() => { setConfirmPassword(!confirmPassword) }}
                                style={{ padding: 5 }}
                                name={confirmPassword ? "visibility-off" : "visibility"}
                                color={ConfirmPasswordFocused ? '#00bf00' : '#a3a3a3'}
                                underlayColor='#f3f3f3' />
                        </View>
                    </View>
                </View>
                <View style={styles.viewNotMatch}>
                    <Text style={[{ color: 'red', fontSize: 14, paddingLeft: 15, paddingTop: 5 }]}>{match ? '*password do not match' : ''}</Text>
                    <Text style={[{ color: 'red', fontSize: 14, paddingLeft: 15, paddingTop: 5, transform: [{ translateX: -45 }] }]}>{signupErr ? '*Please fill all the information fields' : ''}</Text>
                    <Text style={[{ color: 'red', fontSize: 14, paddingLeft: 15, paddingTop: 5, transform: [{ translateX: -65 }] }]}>{correctLength ? '*Length of password must be 8 or above' : ''}</Text>
                    <Text style={[{ color: 'red', fontSize: 14, paddingLeft: 15, paddingTop: 5, transform: [{ translateX: -260 }] }]}>{duplicate ? '*username taken' : ''}</Text>
                </View>
                <TouchableHighlight style={styles.btn} onPress={() => { signup(firstnameText, lastnameText, emailText, usernameText, passwordText, confirmPasswordText) }} underlayColor='#8eff8a'>
                    <Text style={styles.btnText}>
                        {loading ? <ActivityIndicator style={{ color: 'white' }} /> : 'SignUp'}
                    </Text>
                </TouchableHighlight>
                <View style={styles.login}>
                    <Text style={{ color: '#00bf00', fontWeight: '300' }}>Already have an account?  </Text>
                    <Text style={{ color: '#008c00', fontWeight: '900' }} onPress={() => { login_screen() }}>LogIn</Text>
                </View>
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: 'fitContent',
        padding: 5,
        height: 'maxContent',
        paddingTop: 70
    },
    /* icons: {
        height: 'fitContent',
        marginBottom: 70
    }, */
    textField: {
        backgroundColor: '#f3f3f3',
        padding: 10,
        paddingLeft: 14,
        fontSize: 15,
        borderRadius: 14,
        marginBottom: 20,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#f3f3f3',
    },
    viewPassword: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        marginHorizontal: 10,
        marginBottom: 20,
        paddingRight: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#f3f3f3',
    },
    viewConfirmPassword: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        marginHorizontal: 10,
        paddingRight: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#f3f3f3',
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
    viewNotMatch: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },
    login: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 5,
        paddingBottom: 15,
        paddingTop: 100,
        marginBottom: 70
    },
});
