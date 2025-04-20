import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../styles/styles';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ConfirmationModal from '../../components/status/ConfirmationModal';
import LoadingModal from '../../components/status/LoadingModal';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setConfirmVisible(false);
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={user?.photoURL ? { uri: user.photoURL } : { uri: 'https://avatar.iran.liara.run/public/boy' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.name || 'Vendedor'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setConfirmVisible(true)}
        activeOpacity={0.8}
      >
        <Icon name="exit-to-app" size={24} color={COLORS.white} />
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <ConfirmationModal
        isVisible={confirmVisible}
        message="¿Estás seguro de que quieres cerrar sesión?"
        onConfirm={handleLogout}
        onCancel={() => setConfirmVisible(false)}
      />

      <LoadingModal isLoading={isLoading} message="Cerrando sesión..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default UserProfile;
