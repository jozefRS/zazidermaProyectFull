import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../../utils/axiosInstance";
import { GLOBAL_STYLES, COLORS } from "../../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";
import StatusBar from "../../components/status/StatusBar";
import AlertModal from '../../components/status/AlertModal';
import ConfirmationModal from '../../components/status/ConfirmationModal';

const ClientWithDeactivate = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('api/cliente');
      const clientes = response.data.body?.data || [];
      setClients(clientes);
    } catch (error) {
      setAlertMessage('Error al cargar clientes');
      setAlertType('error');
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDeactivateClient = async () => {
    try {
      setConfirmVisible(false);
      await axiosInstance.patch(`api/cliente/${selectedClientId}`);
      setAlertMessage('Cliente desactivado correctamente');
      setAlertType('success');
      setAlertVisible(true);
      fetchClients();
    } catch (error) {
      setAlertMessage('No se pudo desactivar el cliente');
      setAlertType('error');
      setAlertVisible(true);
    }
  };

  const showConfirmationModal = (id) => {
    setSelectedClientId(id);
    setConfirmVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar isLoading={isLoading} />

      <Text style={styles.title}>Gestión de Clientes</Text>
      <View style={GLOBAL_STYLES.line} />

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("RegisterClient")}>
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Nombre</Text>
        <Text style={styles.headerText}>Email</Text>
        <Text style={styles.headerText}>Contacto</Text>
        <Text style={styles.headerText}>Acciones</Text>
      </View>

      {!isLoading && (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.nombre} {item.apellidoPaterno}</Text>
              <Text style={styles.cell}>{item.correo}</Text>
              <Text style={styles.cell}>{item.telefono[0]}</Text>
              <View style={styles.actions}>
                {/* <TouchableOpacity onPress={() => navigation.navigate("EditClient", { client: item })}>
                  <Icon name="pencil-outline" size={20} color={COLORS.black} />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => navigation.navigate("ClientDetail", { client: item })}>
                  <Icon name="eye-outline" size={20} color={COLORS.black} />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => showConfirmationModal(item.id)}>
                  <Icon name="trash-outline" size={20} color={COLORS.darkGray} />
                </TouchableOpacity> */}
              </View>
            </View>
          )}
        />
      )}

      <ConfirmationModal
        isVisible={confirmVisible}
        message="¿Deseas desactivar este cliente?"
        onConfirm={handleDeactivateClient}
        onCancel={() => setConfirmVisible(false)}
      />

      <AlertModal
        isVisible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: COLORS.primary,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: COLORS.black,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
});

export default ClientWithDeactivate;
