import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../../utils/axiosInstance'; // Usamos axiosInstance para hacer las solicitudes
import ConfirmationModal from '../status/ConfirmationModal'; // Modal de confirmación para eliminar productos
import CatalogSearchBar from '../catalog/CatalogSearchbar';

const SalesList = ({ products, setProducts, showAlert }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]); // Lista de productos de la base de datos
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');


  const confirmDelete = (product) => {
    setSelectedToDelete(product);
  };

  const deleteProduct = () => {
    if (selectedToDelete) {
      setProducts(prev => prev.filter(p => p.id !== selectedToDelete.id));
      setSelectedToDelete(null);
    }
  };


  useEffect(() => {
    fetchProducts(); // Al montar el componente, obtenemos los productos
  }, []);

  const fetchProducts = async () => {
    try {
      const [productRes, categoryRes] = await Promise.all([
        axiosInstance.get('api/producto'),
        axiosInstance.get('api/categoria')
      ]);

      const productos = productRes.data.body?.data || [];
      const categorias = categoryRes.data.body?.data || [];

      const productosTransformados = productos
        .filter(p => p.estado)
        .map((p) => {
          const categoria = categorias.find(c => c.id === p.idCategoria);
          return {
            ...p,
            categoria: categoria ? categoria.nombre : 'Sin categoría'
          };
        });

      setAvailableProducts(productosTransformados);
      setCategories(categorias); // Por si luego se necesitan
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };


  const addProductToList = (product) => {
    setProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p.id === product.id);

      if (existingProduct) {
        return prevProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }

      return [
        ...prevProducts,
        {
          id: product.id,
          name: product.nombre,
          price: parseFloat(product.precio), // 💰 aseguramos número
          details: product.descripcion || '', // 📄 info adicional opcional
          quantity: 1,
          stock: product.stock
        }
      ];
    });

    setModalVisible(false);
  };


  const updateQuantity = (id, type) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id !== id) return product;

        if (type === 'increase') {
          if (product.quantity < product.stock) {
            return { ...product, quantity: product.quantity + 1 };
          } else {
            showAlert(`Solo hay ${product.stock} unidades disponibles en inventario.`, 'error');
            return product;
          }
        } else {
          return {
            ...product,
            quantity: Math.max(1, product.quantity - 1),
          };
        }
      })
    );
  };

  const filteredProducts = availableProducts.filter(product =>
    product.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (product.categoria?.toLowerCase().includes(search.toLowerCase()))
  );



  return (
    <View style={styles.container}>
      {/* Header con botón de agregar */}
      <View style={styles.tableHeader}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Icon name="add-circle-outline" size={30} color="#6C2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Producto</Text>
        <Text style={styles.headerText}>Precio por unidad</Text>
        <Text style={styles.headerText}>Cantidad</Text>
      </View>



      {/* Lista de productos seleccionados */}
      <View style={{ height: 250 }}>
        {products.length === 0 ? (
          <Text style={styles.emptyText}>No hay productos agregados</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <View style={styles.productRow}>
                <TouchableOpacity onPress={() => confirmDelete(item)}>
                  <Icon name="trash-outline" size={20} color="red" style={{ marginBottom: 20 }} />
                </TouchableOpacity>
                <View style={styles.productInfo}>
                  {/* <View style={styles.productImage} /> */}
                  <View style={styles.productTextContainer}>
                    <Text style={styles.productName}>{item.name}</Text> {/* Mostrar el nombre */}
                    {/* <Text style={styles.productDetails}>{item.details}</Text> */}
                  </View>
                </View>
                <Text style={styles.price}>${item.price}</Text> {/* Mostrar el precio */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')}>
                    <Icon name="remove-circle-outline" size={20} color="#6C2373" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')}>
                    <Icon name="add-circle-outline" size={20} color="#6C2373" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Modal para seleccionar productos */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Seleccionar Producto</Text>
            <CatalogSearchBar search={search} setSearch={setSearch} />
            {availableProducts.length === 0 ? (
              <Text style={styles.emptyText}>No hay productos disponibles</Text>
            ) : (
              <ScrollView style={{ maxHeight: 300 }}>
                {filteredProducts.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.modalItem}
                    onPress={() => addProductToList(product)}
                  >
                    <Text style={styles.modalText}>
                      {product.nombre} - ${product.precio}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}


            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {selectedToDelete && (
        <ConfirmationModal
          isVisible={!!selectedToDelete}
          message={`¿Deseas eliminar "${selectedToDelete.name}" de la venta?`}
          onConfirm={deleteProduct}
          onCancel={() => setSelectedToDelete(null)}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: '#6C2373',
  },
  addButton: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    color: '#6C2373',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  productInfo: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 30,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginRight: 10,
  },
  productTextContainer: {
    flex: 1,
    flexWrap: 'wrap',
    minHeight: 40,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '100%',
  },
  productDetails: {
    fontSize: 12,
    color: '#777',
  },
  price: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
  quantityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 20,
  },
  // Estilos del Modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#6C2373',
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  modalText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#6C2373',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SalesList;
