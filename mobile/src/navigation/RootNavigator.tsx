import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import PasajeroHomeScreen from '../screens/pasajero/PasajeroHomeScreen';
import ChoferHomeScreen from '../screens/chofer/ChoferHomeScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const {isAuthenticated, user} = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Navegación según rol
  const renderScreensByRole = () => {
    if (user?.rol === 'CHOFER') {
      return (
        <Stack.Navigator
          screenOptions={{
            headerTitle: 'DES - Chofer',
            headerStyle: {backgroundColor: '#6366f1'},
            headerTintColor: '#fff',
          }}>
          <Stack.Screen name="ChoferHome" component={ChoferHomeScreen} />
        </Stack.Navigator>
      );
    } else if (user?.rol === 'ADMIN') {
      return (
        <Stack.Navigator
          screenOptions={{
            headerTitle: 'DES - Admin',
            headerStyle: {backgroundColor: '#6366f1'},
            headerTintColor: '#fff',
          }}>
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        </Stack.Navigator>
      );
    } else {
      return (
        <Stack.Navigator
          screenOptions={{
            headerTitle: 'DES - Pasajero',
            headerStyle: {backgroundColor: '#6366f1'},
            headerTintColor: '#fff',
          }}>
          <Stack.Screen name="PasajeroHome" component={PasajeroHomeScreen} />
        </Stack.Navigator>
      );
    }
  };

  return <NavigationContainer>{renderScreensByRole()}</NavigationContainer>;
};

export default RootNavigator;
