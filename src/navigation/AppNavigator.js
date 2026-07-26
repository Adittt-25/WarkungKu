import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddProductScreen from '../screens/AddProductScreen';
import CartScreen from '../screens/CartScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoadingSpinner from '../components/LoadingSpinner';

import { CartProvider } from './CartContext';
import { getSession } from '../services/storage';
import COLORS from '../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack that wraps the Katalog tab so we can push detail/add-product screens
function KatalogStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CatalogList" component={CatalogScreen} options={{ title: 'Katalog' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Detail Produk' }} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Tambah Produk' }} />
    </Stack.Navigator>
  );
}

function RiwayatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HistoryList" component={HistoryScreen} options={{ title: 'Riwayat' }} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ title: 'Detail Transaksi' }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <CartProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
        }}
      >
        <Tab.Screen
          name="Katalog"
          component={KatalogStack}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🛍️</Text> }}
        />
        <Tab.Screen
          name="Keranjang"
          component={CartScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🛒</Text> }}
        />
        <Tab.Screen
          name="Riwayat"
          component={RiwayatStack}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🧾</Text> }}
        />
        <Tab.Screen
          name="Profil"
          component={ProfileScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👤</Text> }}
        />
      </Tab.Navigator>
    </CartProvider>
  );
}

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null); // null = checking session
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      setInitialRoute(session ? 'MainTabs' : 'Login');
      setChecking(false);
    }
    checkSession();
  }, []);

  if (checking) return <LoadingSpinner label="Menyiapkan WarungKu..." />;

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
