import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {useGetViajesDisponiblesQuery} from '../../api/apiSlice';

const PasajeroHomeScreen = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const {data: viajes, isLoading} = useGetViajesDisponiblesQuery({
    origen: 'Perico',
    destino: 'San Salvador de Jujuy',
  });

  const renderViaje = ({item}: any) => (
    <View style={styles.viajeCard}>
      <Text style={styles.viajeTitle}>
        {item.origen} → {item.destino}
      </Text>
      <Text style={styles.viajeInfo}>
        📅 {item.fechaSalida} - 🕐 {item.horaSalida}
      </Text>
      <Text style={styles.viajeInfo}>
        👨‍✈️ {item.chofer?.usuario?.nombre} {item.chofer?.usuario?.apellido}
      </Text>
      <Text style={styles.viajeInfo}>
        💺 {item.asientosDisponibles} asientos disponibles
      </Text>
      <Text style={styles.viajePrecio}>
        ${item.tarifaPorAsiento} por asiento
      </Text>
      <TouchableOpacity style={styles.reservarButton}>
        <Text style={styles.reservarButtonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        ¡Hola, {user?.nombre}!
      </Text>
      <Text style={styles.subtitle}>Viajes disponibles</Text>

      {isLoading ? (
        <Text style={styles.loading}>Cargando viajes...</Text>
      ) : (
        <FlatList
          data={viajes}
          renderItem={renderViaje}
          keyExtractor={(item) => item.idViaje.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No hay viajes disponibles
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  viajeCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  viajeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  viajeInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  viajePrecio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginTop: 5,
    marginBottom: 10,
  },
  reservarButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  reservarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PasajeroHomeScreen;
