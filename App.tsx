import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Target, Users, Binoculars } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold,
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';
import { Lora_400Regular, Lora_500Medium, Lora_600SemiBold, Lora_700Bold } from '@expo-google-fonts/lora';

import { Colors } from './src/theme/colors';
import { 
  ListsScreen, ListDetailsScreen, AddItemScreen, ItemDetailsScreen, 
  FoodFactsScreen, AssistantScreen, ProfileScreen, SettingsScreen 
} from './src/screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ListsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="ListsHome" component={ListsScreen} />
      <Stack.Screen name="ListDetails" component={ListDetailsScreen} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold,
    Lora_400Regular, Lora_500Medium, Lora_600SemiBold, Lora_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.tabBarActive,
          tabBarInactiveTintColor: Colors.tabBarInactive,
          sceneStyle: { backgroundColor: Colors.background },
          tabBarStyle: {
            backgroundColor: Colors.tabBarBackground,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 70,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter_600SemiBold', // Matches the small bold label
            fontSize: 10,
            marginTop: 4,
          }
        }}
      >
        <Tab.Screen 
          name="ListsTab" 
          component={ListsStack} 
          options={{
            tabBarIcon: ({ color, size, focused }) => <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} />,
            tabBarLabel: 'Home' 
          }} 
        />
        <Tab.Screen 
          name="FoodFactsTab" 
          component={FoodFactsScreen} 
          options={{
            tabBarIcon: ({ color, size, focused }) => <Target color={color} size={24} strokeWidth={focused ? 2.5 : 2} />,
            tabBarLabel: 'Review'
          }} 
        />
        <Tab.Screen 
          name="AssistantTab" 
          component={AssistantScreen} 
          options={{
            tabBarIcon: ({ color, size, focused }) => <Users color={color} size={24} strokeWidth={focused ? 2.5 : 2} />,
            tabBarLabel: 'Live'
          }} 
        />
        <Tab.Screen 
          name="ProfileTab" 
          component={ProfileStack} 
          options={{
            tabBarIcon: ({ color, size, focused }) => <Binoculars color={color} size={24} strokeWidth={focused ? 2.5 : 2} />,
            tabBarLabel: 'Explore'
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
