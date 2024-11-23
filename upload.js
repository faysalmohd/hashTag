import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View, useColorScheme } from 'react-native';
import { Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Gallery from './gallery';
import CameraScreen from './camera';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore/lite';

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



export default function Upload(props, { navigation }) {
  const Tab = createMaterialTopTabNavigator();
  const [profileImg, setProfileImg] = useState([]);
  const [username, setUsername] = useState([]);
  const [bgColor, stetBgColor] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const dataCollection = collection(db, 'UserProfileImage');
      const dataSnapshot = await getDocs(dataCollection);
      const itemss = dataSnapshot.docs.map(doc => {
        return {
          username: doc.data().username,
          image: doc.data().image
        };
      });
      const filters = itemss.filter((Post) => Post.username === props.props.username)
      setProfileImg(filters);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setUsername(props.props.username)
  }, [])

  let colorScheme = useColorScheme();

  useEffect(() => {


    if (colorScheme === 'dark') {
      stetBgColor(true)
    } else {
      stetBgColor(false)
    }
  }, [colorScheme])
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style='auto' />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            width: '70%',
            backgroundColor: !bgColor ? '#dbdbdb' : '#4a4a4a',
            marginHorizontal: '15%',
            borderRadius: 20,
            position: 'absolute',
            marginTop: 60,
            paddingBottom: 5
          },
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === 'Gallery') {
              iconName = focused
                ? 'images'
                : 'images-outline';
            }
            else if (route.name === 'CameraScreen') {
              iconName = focused ? 'camera' : 'camera-outline';
            }
            return <Icon type='ionicon' name={iconName} size={24} color={color} />;
          },
          tabBarIndicatorStyle: {
            height: 40,
            width: 137,
            borderRadius: 20,
            backgroundColor: !bgColor ? 'white' : 'black',
            marginVertical: 3,
            marginHorizontal: 3
          },
          tabBarActiveTintColor: '#08FF08',
          tabBarInactiveTintColor: 'gray',
          tabBarContentContainerStyle: {
            height: 41,
            paddingBottom: 20,
          },
        })}
      >
        <Tab.Screen
          name="Gallery"
          children={() => {return profileImg ? <Gallery props={profileImg.length != 0 ? {image: profileImg[0].image, username: username} : {username: props.props.username}} /> : <ActivityIndicator color='#08FF08' size={50} style={{flex: 1}} />}}
        />
        <Tab.Screen
          name="CameraScreen"
          children={() => {return profileImg ? <CameraScreen props={profileImg.length != 0 ? {image: profileImg[0].image, username: username} : {username: props.props.username}} /> : <ActivityIndicator color='#08FF08' size={50} style={{flex: 1}} />}}
        />
      </Tab.Navigator>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 70
  },
});
