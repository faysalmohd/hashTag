import { StatusBar } from 'expo-status-bar';
import { View, useColorScheme } from 'react-native';
import { Icon } from '@rneui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './profile';
import Upload from './upload';
import Settings from './setting';
import Home from './home';
import { useEffect, useState } from 'react';
import { getApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite';

export default function BottomNavigation(props) {
    const { route } = props;
    const { username } = route.params;
    const { verified } = route.params;
    const { firstname } = route.params;
    const { lastname } = route.params;
    const { password } = route.params;
    const [id, setId] = useState(route.params.id)
    const [bgColor, stetBgColor] = useState(false)

    const optional = async () => {
        const app = getApp();
        const db = getFirestore(app);
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
        const filter = items.filter((user) => user.username === username)
        setId(filter[0].id)
    }

    if (id == undefined || id == '' || id == null) {
        optional()
    }

    let colorScheme = useColorScheme();

    useEffect(() => {


        if (colorScheme === 'dark') {
            stetBgColor(true)
        } else {
            stetBgColor(false)
        }
    }, [colorScheme])

    const Tab = createBottomTabNavigator();

    return (
        <View style={{ height: '100%' }}>
            <StatusBar style="auto" />
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: { height: 50, backgroundColor: !bgColor ? 'white' : '#111111' },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused
                                ? 'home'
                                : 'home-outline';
                        }
                        else if (route.name === 'Settings') {
                            iconName = focused ? 'cog' : 'cog-outline';
                        }
                        else if (route.name === 'Upload') {
                            iconName = focused ? 'add-circle' : 'add-circle-outline';
                        }
                        else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        }
                        return <Icon type='ionicon' name={iconName} size={25} color={color} />;
                    },
                    tabBarActiveTintColor: '#08FF08',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Settings" children={() => { return <Settings props={{ username, id, password }} /> }} />
                <Tab.Screen name="Upload" children={() => { return <Upload props={{ username, id }} /> }} />
                <Tab.Screen name="Profile" children={() => { return <Profile props={{ username, firstname, lastname, verified }} /> }} />
            </Tab.Navigator>

        </View>
    );
}
