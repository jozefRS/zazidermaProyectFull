import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../styles/styles';

const CatalogSearchBar = ({ search, setSearch }) => {
  return (
    <View style={styles.searchContainer}>
      <Icon name="search-outline" size={20} color={COLORS.darkGray} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre"
        placeholderTextColor={COLORS.darkGray}
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    color: COLORS.black,
  },
});

export default CatalogSearchBar;
