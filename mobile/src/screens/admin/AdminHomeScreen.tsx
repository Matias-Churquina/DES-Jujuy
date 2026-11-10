import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

const AdminHomeScreen = () => {
  const {user} = useSelector((state: RootState) => state.auth);

  const stats = [
    {label: 'Choferes activos', value: '5', color: '#6366f1'},
    {label: 'Viajes hoy', value: '12', color: '#10b981'},
    {label: 'Reservas pendientes', value: '8', color: '#f59e0b'},
    {label: 'Paquetes en tránsito', value: '3', color: '#ef4444'},
  ];

  const actions = [
    {title: 'Gestionar Choferes', icon: '👨‍✈️', screen: 'ManageChoferes'},
    {title: 'Ver Viajes', icon: '🚗', screen: 'ManageViajes'},
    {title: 'Reportes', icon: '📊', screen: 'Reports'},
    {title: 'Configuración', icon: '⚙️', screen: 'Settings'},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        ¡Hola, Admin {user?.nombre}!
      </Text>
      <Text style={styles.subtitle}>Panel de administración</Text>

      <Text style={styles.sectionTitle}>Estadísticas</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[styles.statCard, {backgroundColor: stat.color}]}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Acciones</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionCard}
            onPress={() => console.log('Navigate to:', action.screen)}>
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});

export default AdminHomeScreen;
