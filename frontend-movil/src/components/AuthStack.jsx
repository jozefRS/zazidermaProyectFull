import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../modules/auth/LoginScreen';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

export default AuthStack;
