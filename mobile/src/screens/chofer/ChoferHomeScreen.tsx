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
import {useGetChoferesQuery} from '../../api/apiSlice';

const ChoferHomeScreen = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const {data: choferes, isLoading} = useGetChoferesQuery({});

  const renderChofer = ({item}: any) => (
    <View style={styles.choferCard}>
      <Text style={styles.choferNombre}>
        👨‍✈️ {item.usuario?.nombre} {item.usuario?.apellido}
      </Text>
      <Text style={styles.choferInfo}>
        Estado: {item.estadoChofer}
      </Text>
      <Text style={styles.choferInfo}>
        Licencia: {item.licenciaConducir}
      </Text>
      <Text style={styles.choferInfo}>
        Autos: {item.autos?.length || 0}
      </Text>
      {item.latitud && item.longitud && (
        <Text style={styles.choferInfo}>
          📍 {item.latitud.toFixed(4)}, {item.longitud.toFixed(4)}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        ¡Hola, Chofer {user?.nombre}!
      </Text>
      <Text style={styles.subtitle}>Panel de chofer</Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Tu estado actual</Text>
        <Text style={styles.statusValue}>DISPONIBLE</Text>
        <TouchableOpacity style={styles.statusButton}>
          <Text style={styles.statusButtonText}>Cambiar Estado</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Choferes en servicio</Text>

      {isLoading ? (
        <Text style={styles.loading}>Cargando choferes...</Text>
      ) : (
        <FlatList
          data={choferes}
          renderItem={renderChofer}
          keyExtractor={(item) => item.idChofer.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay choferes registrados</Text>
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
  statusCard: {
    backgroundColor: '#6366f1',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  statusValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusButtonText: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
  choferCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  choferNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  choferInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default ChoferHomeScreen;
