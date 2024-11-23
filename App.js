import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login';
import Signup from './signup';
import BottomNavigation from './BottomNavigation';
import ImageScreen from './imageScreen';

const Stack = createNativeStackNavigator();

export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator
            screenOptions={
                {
                    headerShown: false
                }
            }            
            >
                <Stack.Screen
                    name="Login"
                    component={Login}
                />
                <Stack.Screen
                    name="Signup"
                    component={Signup}
                />
                <Stack.Screen
                    name="BottomNavigation"
                    component={BottomNavigation}
                />
                <Stack.Screen
                    name="ImageScreen"
                    component={ImageScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}