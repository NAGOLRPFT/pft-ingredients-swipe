import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Swipe from './screens/swipe';

import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();



export default function App() {

  const [fontsLoaded] = useFonts({
    'Cabin': require('./assets/fonts/Cabin.ttf'), // Adjust the path to your font file
    'Montserrat': require('./assets/fonts/Montserrat.ttf'), // Adjust the path to your font file
  });

  // const navigation = useNavigation();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          <Stack.Screen name="Swipe" component={Swipe} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

