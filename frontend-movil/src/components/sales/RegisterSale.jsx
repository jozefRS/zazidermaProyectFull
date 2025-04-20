import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { GLOBAL_STYLES, COLORS } from '../../styles/styles';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import SalesList from './SalesList';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import ConfirmationModal from '../status/ConfirmationModal';
import LoadingModal from '../status/LoadingModal';
import AlertModal from '../status/AlertModal';
import { Switch } from 'react-native';
import { useContext } from 'react';
import { CatalogContext } from '../../context/CatalogContext';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as yup from 'yup';
import ClientSelectorModal from '../client/ClientSelectorModal';
import PaymentTypeSelectorModal from '../client/PaymentTypeSelectorModal';
import DeliveryTypeSelectorModal from '../client/DeliveryTypeSelectorModal';
import { SalesContext } from '../../context/SalesContext';

const validationSchema = yup.object().shape({
  client: yup.string().required('Seleccione un cliente'),
  paymentType: yup.string().required('Seleccione tipo de pago'),
  deliveryType: yup.string().required('Seleccione tipo de entrega'),
  products: yup.array().min(1, 'Agregue al menos un producto')
});

const RegisterSale = () => {
  const { addSale } = useContext(SalesContext);

  const navigation = useNavigation();
  const { updateStock } = useContext(CatalogContext);
  const { user } = useContext(AuthContext); // <-- ✅ obtenemos el id del trabajador

  const [clients, setClients] = useState([]);
  const [client, setClient] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [applyIVA, setApplyIVA] = useState(false);
  const [iva, setIva] = useState(0);

  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [submitted, setSubmitted] = useState(false);
  const [evidencia, setEvidencia] = useState(null);

  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [clientName, setClientName] = useState('');
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);




  const validateField = useCallback(async (field, value) => {
    try {
      await validationSchema.validateAt(field, { [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, [field]: error.message }));
    }
  }, []);

  // Validar campos en tiempo real después del primer intento
  useEffect(() => {
    if (submitted) validateField('client', client);
  }, [client, submitted, validateField]);

  useEffect(() => {
    if (submitted) validateField('paymentType', paymentType);
  }, [paymentType, submitted, validateField]);

  useEffect(() => {
    if (submitted) validateField('deliveryType', deliveryType);
  }, [deliveryType, submitted, validateField]);

  useEffect(() => {
    if (submitted) validateField('products', products);
  }, [products, submitted, validateField]);


  useEffect(() => {
    const subTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const calculatedIVA = applyIVA ? subTotal * 0.16 : 0;
    setIva(calculatedIVA);
    setTotal(subTotal + calculatedIVA);
  }, [products, applyIVA]);



  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axiosInstance.get('api/cliente');
        const clientList = res.data.body?.data || [];
        setClients(clientList);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      }
    };

    fetchClients();
  }, []);

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    // Subir evidencia si existe
    let imageUrl = null;
    if (deliveryType === 'Domicilio' || deliveryType === 'Paquetería') {
      imageUrl = await uploadEvidencia();
      if (!imageUrl) {
        setIsLoading(false);
        return;
      }
    }

    const productosMap = {};
    products.forEach((product) => {
      productosMap[product.id] = product.quantity;
    });

    const subTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const iva = applyIVA ? subTotal * 0.16 : 0;
    const totalFinal = subTotal + iva;

    const ventaData = {
      idCliente: client,
      productos: productosMap,
      subTotal,
      total: totalFinal,
      estado: true,
      aplicarIVA: applyIVA,
      tipoDePago: paymentType,
      tipoDeEntrega: deliveryType,
      idTrabajador: user?.idUsuario,
      urlImagenEnvio: imageUrl, // ← incluimos el nombre de la imagen
    };

    try {
      await axiosInstance.post('api/ventas/realizar', ventaData);
      updateStock(products.map((prod) => ({
        productId: prod.id,
        quantitySold: prod.quantity,
      })));

      setClient('');
      setProducts([]);
      setPaymentType('');
      setDeliveryType('');
      setEvidencia(null); // Limpiar imagen
      addSale(ventaData); // Para actualizar la lista sin recargar

      setTimeout(() => {
        setIsLoading(false);
        setAlertMessage('Venta registrada exitosamente.');
        setAlertType('success');
        setAlertVisible(true);
      }, 1000);
      // navigation.navigate('Sales'); 

    } catch (error) {
      setIsLoading(false);
      setAlertMessage('Ocurrió un error al registrar la venta.');
      setAlertType('error');
      setAlertVisible(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
    if (alertType === 'success') {
      // console.log("🧾 Sale enviada al detalle:", sale);
      navigation.navigate('Sales'); // solo si fue exitosa
    }
  };
  

  // 🛑 Modificar el onPress del botón de registro
  const handleRegisterPress = async () => {
    setSubmitted(true);
    try {
      await validationSchema.validate({
        client,
        paymentType,
        deliveryType,
        products
      }, { abortEarly: false });

      setErrors({});
      setShowConfirmation(true);
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  const showAlert = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleTakePhoto = async () => {
    // Pide permisos para la cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara para tomar evidencia.');
      return;
    }

    // Abre la cámara
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    // Si el usuario toma una foto y no cancela
    if (!result.canceled) {
      const photo = result.assets[0];
      setEvidencia(photo); // Puedes almacenar URI o base64 según tu backend
    }
  };

  const uploadEvidencia = async () => {
    if (!evidencia) return null;

    const formData = new FormData();
    formData.append('image', {
      uri: evidencia.uri,
      name: 'evidencia.jpg',
      type: 'image/jpeg',
    });

    try {
      const res = await axiosInstance.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data.imageUrl; // devuelve solo el nombre del archivo
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      showAlert('Error al subir la imagen de evidencia');
      return null;
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registrar Venta</Text>

        <Text style={styles.label}>Cliente</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={{ flex: 1, height: 50, justifyContent: 'center' }}
            onPress={() => setClientModalVisible(true)}
          >
            <Text style={[styles.pickerText, { color: paymentType ? '#000' : '#999' }]}>
              {clientName || 'Seleccione un cliente'}
            </Text>
          </TouchableOpacity>
          <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
        </View>
        {errors.client && <Text style={styles.errorText}>{errors.client}</Text>}


        <Text style={styles.label}>Tipo de Pago</Text>
        <TouchableOpacity
          onPress={() => setPaymentModalVisible(true)}
          style={styles.pickerContainer}
        >
          <Text style={[styles.pickerText, { color: paymentType ? '#000' : '#999' }]}>
            {paymentType || 'Seleccione tipo de pago'}
          </Text>

          <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
        </TouchableOpacity>
        {errors.paymentType && <Text style={styles.errorText}>{errors.paymentType}</Text>}


        <Text style={styles.label}>Tipo de Entrega</Text>
<TouchableOpacity
  onPress={() => setDeliveryModalVisible(true)}
  style={styles.pickerContainer}
>
  <Text style={[styles.pickerText, { color: deliveryType ? '#000' : '#999' }]}>
    {deliveryType || 'Seleccione el tipo de entrega'}
  </Text>
  <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
</TouchableOpacity>
{errors.deliveryType && <Text style={styles.errorText}>{errors.deliveryType}</Text>}

        {(deliveryType === 'Domicilio' || deliveryType === 'Paquetería') && (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                padding: 12,
                borderRadius: 10,
                alignItems: 'center',
                marginBottom: 15,
              }}
              onPress={handleTakePhoto}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Adjuntar evidencia</Text>
            </TouchableOpacity>

            {evidencia && (
              <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Image
                  source={{ uri: evidencia.uri }}
                  style={{ width: 150, height: 150, borderRadius: 10 }}
                />
                <Text style={{ fontSize: 12, marginTop: 5, color: '#6C2373' }}>
                  Evidencia adjuntada
                </Text>
              </View>
            )}
          </>
        )}


        {errors.deliveryType && <Text style={styles.errorText}>{errors.deliveryType}</Text>}

        <View style={styles.infoContainer}>
          <Text style={styles.label}>¿Aplicar IVA?</Text>
          <Switch
            value={applyIVA}
            onValueChange={setApplyIVA}
            thumbColor={applyIVA ? COLORS.primary : "#ccc"}
            trackColor={{ false: "#ccc", true: COLORS.lightGray }}
          />
        </View>
        <Text style={{ textAlign: 'right', marginRight: 10, color: '#555' }}>
          IVA aplicado: ${iva.toFixed(2)}
        </Text>


        <SalesList products={products} setProducts={setProducts} showAlert={showAlert} />
        {errors.products && (
          <Text style={{ marginTop: 20, fontSize: 12, color: 'red', marginLeft: 15 }}>
            {errors.products}
          </Text>
        )}


        <View style={styles.totalContainer}>
          <View style={styles.rowRight}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${(total - iva).toFixed(2)}</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.totalLabel}>IVA (16%):</Text>
            <Text style={styles.totalValue}>${iva.toFixed(2)}</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
        </View>


        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        isVisible={showConfirmation}
        message="¿Estás seguro de que deseas registrar esta venta?"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
      />

<AlertModal
  isVisible={alertVisible}
  type={alertType}
  message={alertMessage}
  onClose={handleCloseAlert}
/>


      <ClientSelectorModal
        visible={clientModalVisible}
        onClose={() => setClientModalVisible(false)}
        onSelectClient={(selected) => {
          setClient(selected.id);
          setClientName(`${selected.nombre} ${selected.apellidoPaterno} ${selected.apellidoMaterno}`);
        }}
      />

      <PaymentTypeSelectorModal
        visible={paymentModalVisible}
        onSelect={(option) => {
          setPaymentType(option);
          setPaymentModalVisible(false);
        }}
        onClose={() => setPaymentModalVisible(false)}
      />

<DeliveryTypeSelectorModal
  visible={deliveryModalVisible}
  onSelect={(option) => {
    setDeliveryType(option);
    setDeliveryModalVisible(false);
  }}
  onClose={() => setDeliveryModalVisible(false)}
/>


      <LoadingModal isLoading={isLoading} message="Registrando venta..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#6C2373',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C2373',
    marginBottom: 5,
    marginLeft: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C2373',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#F8F3F8',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  pickerIcon: {
    position: 'absolute',
    right: 15,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 15,
  },
  totalText: {
    fontSize: 16,
    color: '#6C2373',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C2373',
    marginTop: 5,
  },
  registerButton: {
    marginTop: 15,
    backgroundColor: '#6C2373',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  switch: {
    marginLeft: 10,
  },
  rowRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: '#444',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 15
  },
  pickerText: {
    flex: 1,
    height: 50,
    lineHeight: 50, // <-- centra verticalmente
    paddingLeft: 10,
    fontSize: 16,
  },


});

export default RegisterSale;