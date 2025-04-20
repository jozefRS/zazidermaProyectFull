import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import axiosInstance from '../../utils/axiosInstance';
import CatalogSearchBar from '../catalog/CatalogSearchbar';
import { COLORS } from '../../styles/styles';

const ClientSelectorModal = ({ visible, onClose, onSelectClient }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) fetchClients();
  }, [visible]);

  const fetchClients = async () => {
    try {
      const res = await axiosInstance.get('api/cliente');
      const lista = res.data.body?.data || [];
      setClients(lista);
      setFilteredClients(lista);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredClients(clients);
    } else {
      const term = search.toLowerCase();
      const filtrados = clients.filter((c) =>
        `${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno}`.toLowerCase().includes(term)
      );
      setFilteredClients(filtrados);
    }
  }, [search, clients]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Seleccionar Cliente</Text>

          <CatalogSearchBar search={search} setSearch={setSearch} />

          <FlatList
            data={filteredClients}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 300 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelectClient(item);
                  onClose();
                }}
              >
                <Text style={styles.itemText}>
                  {item.nombre} {item.apellidoPaterno} {item.apellidoMaterno}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron clientes</Text>}
          />

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: COLORS.black,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    color: COLORS.darkGray,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ClientSelectorModal;
