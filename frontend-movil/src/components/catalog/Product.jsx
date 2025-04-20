import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/styles';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../../utils/axiosInstance';


const Product = ({ product }) => {
  const navigation = useNavigation();

  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const imageUrl = product.image
    ? `${API_BASE_URL}/images${product.image}`
    : 'https://via.placeholder.com/150';


  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product })}>

      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{truncateText(product.description, 50)}</Text>
        <View style={styles.row}>
          <Text style={styles.productPrice}>{product.price}</Text>
          <View style={[styles.badge, product.available ? styles.available : styles.unavailable]}>
            <Text style={styles.badgeText}>{product.available ? 'En stock' : 'Agotado'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  infoContainer: {
    padding: 10,
    width: '100%',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  productDescription: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'left',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  available: {
    backgroundColor: COLORS.secondary,
  },
  unavailable: {
    backgroundColor: COLORS.lightGray,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Product;
