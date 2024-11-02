// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Components/Page/HomeScreen';
import FavoriteScreen from './Components/Page/FavoriteScreen';
import CaptainsScreen from './Components/Page/CaptainsScreen';
import DetailScreen from './Components/Page/DeayerDetail';
import TeacherScreen from './Components/Page/TeacherScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tạo HomeStack để quản lý Home và Detail
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        {/* Sử dụng HomeStack cho tab Home */}
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Favorite" component={FavoriteScreen} />
        <Tab.Screen name="Captains" component={CaptainsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}



// const styles = StyleSheet.creat({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
