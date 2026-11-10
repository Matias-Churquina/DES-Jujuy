import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useLoginMutation} from '../../api/apiSlice';
import {useDispatch} from 'react-redux';
import {setCredentials} from '../../store/slices/authSlice';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('admin@des.com');
  const [password, setPassword] = useState('demo123');
  const [login, {isLoading}] = useLoginMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const response = await login({email, password}).unwrap();

      dispatch(
        setCredentials({
          user: response.usuario,
          token: response.token,
        }),
      );

      // Navegar según el rol
      const rol = response.usuario.rol;
      if (rol === 'CHOFER') {
        navigation.navigate('ChoferHome' as never);
      } else if (rol === 'PASAJERO') {
        navigation.navigate('PasajeroHome' as never);
      } else {
        navigation.navigate('AdminHome' as never);
      }
    } catch (error: any) {
      Alert.alert('Error', error.data?.msg || 'Error al iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DES</Text>
      <Text style={styles.subtitle}>Destino Express Service</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>Usuarios demo:</Text>
          <Text style={styles.demoText}>admin@des.com / demo123</Text>
          <Text style={styles.demoText}>carlos.chofer@des.com / demo123</Text>
          <Text style={styles.demoText}>ana.pasajero@des.com / demo123</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default LoginScreen;
