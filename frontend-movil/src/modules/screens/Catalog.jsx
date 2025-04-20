import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { GLOBAL_STYLES } from '../../styles/styles';
import Product from '../../components/catalog/Product';
import CatalogSearchBar from '../../components/catalog/CatalogSearchbar';
import StatusBar from "../../components/status/StatusBar";
import { CatalogContext } from '../../context/CatalogContext'; // <-- Import

const CatalogScreen = () => {
  // 1. Traes products y la función fetchAllData
  const { products, fetchAllData } = useContext(CatalogContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 2. Cuando monte, llamas fetchAllData
  useEffect(() => {
    const loadCatalog = async () => {
      setIsLoading(true);
      await fetchAllData(); // Carga global
      setIsLoading(false);
    };
    loadCatalog();
  }, []);

  // 3. Filtrar localmente para search
  useEffect(() => {
    filterProducts();
  }, [search, products]);

  const filterProducts = () => {
    if (!search.trim()) {
      setFilteredProducts(products);
      return;
    }
    const term = search.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <View style={GLOBAL_STYLES.container}>
      <StatusBar isLoading={isLoading} />
      <CatalogSearchBar search={search} setSearch={setSearch} />

      {!isLoading && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Product product={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
      {/* Eliminé tus modales, pero puedes reinsertarlos si quieres */}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
  },
});

export default CatalogScreen;
