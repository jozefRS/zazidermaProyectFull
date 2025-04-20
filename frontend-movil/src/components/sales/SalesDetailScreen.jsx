import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS, GLOBAL_STYLES } from '../../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { FAB } from 'react-native-paper'; // Para el botón flotante
import { API_BASE_URL } from '../../utils/axiosInstance';


const SalesDetailScreen = () => {

  const route = useRoute();
  const { sale } = route.params;
  console.log("📦 Detalles de venta recibidos:", sale);
  const [tooltip, setTooltip] = useState({ visible: false, message: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const formattedDate = new Date(sale.fechaDeVenta).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getPaymentColor = (type) => {
    switch (type) {
      case 'Tarjeta': return COLORS.primary;
      case 'Efectivo': return COLORS.green;
      case 'Transferencia': return COLORS.blue;
      case 'Crédito': return COLORS.orange;
      default: return COLORS.darkGray;
    }
  };

  const getDeliveryColor = (type) => {
    switch (type) {
      case 'Domicilio': return COLORS.blue;
      case 'Físico': return COLORS.gray;
      case 'Envío':
      case 'Recoger en tienda': return COLORS.violet;
      default: return COLORS.darkGray;
    }
  };

  const showTooltip = (message) => {
    setTooltip({ visible: true, message });
    setTimeout(() => setTooltip({ visible: false, message: '' }), 2500);
  };
  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      // 1. Crear HTML para el PDF
      const imageUrl = sale.urlImagenEnvio
        ? `${API_BASE_URL}/images/${sale.urlImagenEnvio}`
        : null;

      const html = `
  <html>
    <head>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: ${COLORS.primary}; text-align: center; }
        .header { margin-bottom: 20px; }
        .section { margin-bottom: 15px; }
        .badge { 
          padding: 5px 10px; 
          border-radius: 15px; 
          color: white; 
          display: inline-block;
          background-color: ${getPaymentColor(sale.tipoDePago)};
        }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .evidence-container {
          text-align: center;
          margin-top: 30px;
        }
        .evidence-image {
          width: 250px;
          height: auto;
          border-radius: 10px;
          border: 1px solid #ccc;
        }
      </style>
    </head>
    <body>
      <h1>Detalles de Venta</h1>
      
      <div class="header">
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Cliente:</strong> ${sale.clientName}</p>
      </div>

      <div class="section">
        <p><strong>Tipo de pago:</strong> 
          <span class="badge">${sale.tipoDePago}</span>
        </p>
        <p><strong>Tipo de entrega:</strong> 
          <span class="badge" style="background-color: ${getDeliveryColor(sale.tipoDeEntrega)};">
            ${sale.tipoDeEntrega}
          </span>
        </p>
      </div>

      <div class="section">
        <h3>Productos (${sale.products.length})</h3>
        <table>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
          ${sale.products.map(product => `
            <tr>
              <td>${product.name}</td>
              <td>$${product.price}</td>
              <td>${product.quantity}</td>
              <td>$${product.total}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <div class="section">
        <h3>Total: $${parseFloat(sale.total).toFixed(2)}</h3>
        <p>IVA aplicado: ${sale.aplicarIVA ? 'Sí (16%)' : 'No'}</p>
        <p>Estado: ${sale.estado ? 'Activa' : 'Inactiva'}</p>
      </div>

      ${imageUrl ? `
        <div class="evidence-container">
          <h3>Evidencia de Envío</h3>
          <img src="${imageUrl}" alt="Evidencia" class="evidence-image" />
        </div>
      ` : ''}
    </body>
  </html>
`;


      // 2. Generar archivo PDF
      const { uri } = await Print.printToFileAsync({ html });

      // 3. Compartir el PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir detalles de venta',
        });
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (

    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>Detalles de la Venta</Text>
        <View style={GLOBAL_STYLES.line} />

        <View style={styles.cardDate}>
          <Icon name="calendar-outline" size={20} color={COLORS.primary} style={styles.icon} />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="person-outline" size={18} color={COLORS.primary} style={styles.icon} />
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{sale.clientName}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="card-outline" size={18} color={COLORS.primary} style={styles.icon} />
          <Text style={styles.label}>Tipo de Pago:</Text>
          <View style={[GLOBAL_STYLES.badge, { backgroundColor: getPaymentColor(sale.tipoDePago) }]}>
            <Text style={styles.badgeText}>{sale.tipoDePago}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="cube-outline" size={18} color={COLORS.primary} style={styles.icon} />
          <Text style={styles.label}>Tipo de Entrega:</Text>
          <View style={[GLOBAL_STYLES.badge, { backgroundColor: getDeliveryColor(sale.tipoDeEntrega) }]}>
            <Text style={styles.badgeText}>{sale.tipoDeEntrega}</Text>
          </View>
          <TouchableOpacity onPress={() => showTooltip('Forma en que el cliente recibe su pedido.')}>
            <Icon name="information-circle-outline" size={18} color={COLORS.primary} style={GLOBAL_STYLES.tooltipIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="pricetag-outline" size={18} color={COLORS.primary} style={styles.icon} />
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.value}>${parseFloat(sale.total).toFixed(2)}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="cash-outline" size={18} color={COLORS.primary} style={styles.icon} />
          <Text style={styles.label}>¿Aplica IVA?</Text>
          <Text style={styles.value}>{sale.aplicarIVA ? 'Sí' : 'No'}</Text>
          <TouchableOpacity onPress={() => showTooltip('Si está activo, se calculará 16% de IVA.')}>
            <Icon name="information-circle-outline" size={18} color={COLORS.primary} style={GLOBAL_STYLES.tooltipIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="alert-circle-outline" size={18} color={COLORS.primary} style={styles.icon} />
          <Text style={styles.label}>Estado:</Text>
          <View style={[GLOBAL_STYLES.badge, { backgroundColor: sale.estado ? COLORS.green : COLORS.red }]}>
            <Text style={styles.badgeText}>{sale.estado ? 'Activa' : 'Inactiva'}</Text>
          </View>
          <TouchableOpacity onPress={() => showTooltip('La venta puede estar activa o inactiva según su proceso.')}>
            <Icon name="information-circle-outline" size={18} color={COLORS.primary} style={GLOBAL_STYLES.tooltipIcon} />
          </TouchableOpacity>
        </View>

        {tooltip.visible && (
          <View style={tooltipBox.tooltipContainer}>
            <Text style={GLOBAL_STYLES.tooltipText}>{tooltip.message}</Text>
          </View>
        )}

        <View style={GLOBAL_STYLES.line} />
        <Text style={styles.subTitle}>Productos en esta venta</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Producto</Text>
          <Text style={styles.headerText}>Precio Unidad</Text>
          <Text style={styles.headerText}>Cantidad</Text>
          <Text style={styles.headerText}>Total</Text>
        </View>
        {sale.products.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.price}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.total}</Text>
          </View>
        ))}

        {sale.urlImagenEnvio && (
          <View style={{ marginVertical: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: COLORS.primary }}>
              Evidencia de envío
            </Text>
            <Image
              source={{ uri: `${API_BASE_URL}/images/${sale.urlImagenEnvio}` }}
              style={{ width: 250, height: 250, borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>
        )}

      </ScrollView>
      <FAB
        style={styles.fab}
        icon="file-pdf-box"
        label="Exportar a PDF"
        onPress={generatePDF}
        loading={isGenerating}
        color={COLORS.white}
        visible={!tooltip.visible}
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: COLORS.primary,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.black,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: COLORS.primary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    color: COLORS.secondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.darkGray,
  },
  cardDate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '600',
  },
  icon: {
    marginRight: 6,
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
});

const tooltipBox = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
});

export default SalesDetailScreen;