import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/styles';

// Vistas de catálogo
import CatalogScreen from '../modules/screens/Catalog';
import ProductDetailScreen from '../components/catalog/ProductDetail';
import { createStackNavigator } from '@react-navigation/stack';

// Vistas de ventas
import SalesTableScreen from '../modules/screens/Sales';
import RegisterSale from './sales/RegisterSale';
import SalesDetailScreen from './sales/SalesDetailScreen';


// Vistas de cliente
import Client from '../modules/screens/Clients';
import ClientDetail from './client/ClientDetail';
import RegisterClient from './client/RegisterClient';
import EditClient from './client/EditClient';
import UserProfile from '../modules/auth/UserProfile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CatalogStack = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.white }, headerTintColor: COLORS.black, headerTitleStyle: { fontSize: 18, fontWeight: 'bold' } }}>
    <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catálogo' }} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Detalles del Producto' }} />
  </Stack.Navigator>
);

const SalesStack = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.white }, headerTintColor: COLORS.black, headerTitleStyle: { fontSize: 18, fontWeight: 'bold' } }}>
    <Stack.Screen name="Sales" component={SalesTableScreen} options={{ title: 'Gestión de Ventas' }} />
    <Stack.Screen name="SalesDetail" component={SalesDetailScreen} options={{ title: 'Detalles de la Venta' }} />
    <Stack.Screen name="RegisterSale" component={RegisterSale} options={{ title: 'Registrar Venta' }} />
  </Stack.Navigator>
);

const ClientsStack = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.white }, headerTintColor: COLORS.black, headerTitleStyle: { fontSize: 18, fontWeight: 'bold' } }}>
    <Stack.Screen name="Clients" component={Client} options={{ title: 'Gestión de Clientes' }} />
    <Stack.Screen name="ClientDetail" component={ClientDetail} options={{ title: 'Detalles del Cliente' }} />
    <Stack.Screen name="RegisterClient" component={RegisterClient} options={{ title: 'Registrar Cliente' }} />
    <Stack.Screen name="EditClient" component={EditClient} options={{ title: 'Editar Cliente' }} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Catalog') iconName = 'list-outline';
        else if (route.name === 'Sales') iconName = 'cash-outline';
        else if (route.name === 'Clients') iconName = 'people-outline';
        else if (route.name === 'Perfil') iconName = 'person-outline';
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.darkGray,
      tabBarStyle: { backgroundColor: COLORS.white, paddingBottom: 5, height: 60 },
    })}
  >
    <Tab.Screen name="Catalog" component={CatalogStack} options={{ headerShown: false, title: 'Catálogo' }} />
    <Tab.Screen name="Sales" component={SalesStack} options={{ headerShown: false, title: 'Ventas' }} />
    <Tab.Screen name="Clients" component={ClientsStack} options={{ headerShown: false, title: 'Clientes' }} />
    <Tab.Screen name="Perfil" component={UserProfile} options={{ title: 'Perfil', headerShown: false }} />
  </Tab.Navigator>
);

export default MainTabs;
