import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Notebook, Glasses } from '@solar-icons/react-native/BoldDuotone';
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
  ListsScreen, PlanScreen, ListDetailsScreen, AddItemScreen, ItemDetailsScreen, 
  ProfileScreen, SettingsScreen 
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
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            elevation: 0,
            shadowOpacity: 0,
            height: 85,
          },
          tabBarItemStyle: {
            paddingTop: 4,
            justifyContent: 'flex-start',
          },
          tabBarIconStyle: {
            marginTop: 0,
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter_600SemiBold', // Matches the small bold label
            fontSize: 10,
            marginTop: 0,
          }
        }}
      >
        <Tab.Screen 
          name="ListsTab" 
          component={ListsStack} 
          options={{
            tabBarIcon: ({ color }) => <Home color={color} size={24} />,
            tabBarLabel: 'Home' 
          }} 
        />
        <Tab.Screen 
          name="PlanTab" 
          component={PlanScreen} 
          options={{
            tabBarIcon: ({ color }) => <Notebook color={color} size={24} />,
            tabBarLabel: 'Plan' 
          }} 
        />
        <Tab.Screen 
          name="ProfileTab" 
          component={ProfileStack} 
          options={{
            tabBarIcon: ({ color }) => <Glasses color={color} size={24} />,
            tabBarLabel: 'Explore'
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
