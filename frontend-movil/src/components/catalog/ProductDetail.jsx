import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS, GLOBAL_STYLES } from '../../styles/styles';
import { API_BASE_URL } from '../../utils/axiosInstance';

const ProductDetail = () => {
  const route = useRoute();
  const { product } = route.params;
  const imageUrl = product.image
  ? `${API_BASE_URL}/images${product.image}`
  : 'https://placehold.co/200.png';


  return (
    <View style={styles.container}>
      <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description || 'Sin descripción'}</Text>

          <View style={GLOBAL_STYLES.line} />

          <Text style={styles.productInfo}><Text style={styles.label}>Contenido:</Text> {product.content || 'No especificado'}</Text>
          <Text style={styles.productInfo}><Text style={styles.label}>Categoría:</Text> {product.category || 'No especificada'}</Text>
          <Text style={styles.productInfo}><Text style={styles.label}>Sub-Categoria:</Text> {product.subcategory || 'No especificado'}</Text>

          <View style={GLOBAL_STYLES.line} />

          <View style={styles.row}>
            <Text style={styles.productPrice}>{product.price}</Text>
            <View style={[styles.badge, product.available ? styles.available : styles.unavailable]}>
              <Text style={styles.badgeText}>
                {product.available ? `${product.stock} unidades disponibles` : 'Agotado'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    width: '90%',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 15,
  },
  infoContainer: {
    width: '100%',
    paddingTop: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  productDescription: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'justify',
    marginBottom: 5,
  },
  productInfo: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginLeft: 10,
  },
  available: {
    backgroundColor: COLORS.secondary,
  },
  unavailable: {
    backgroundColor: COLORS.lightGray,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProductDetail;