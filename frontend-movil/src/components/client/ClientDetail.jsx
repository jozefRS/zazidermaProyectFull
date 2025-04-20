import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../../styles/styles";

export default function ClientDetail() {
  const route = useRoute();
  const { client } = route.params;
  const direccion = client.direccion || {};
  const telefonos = client.telefono || [];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.clientName}>
          {client.nombre} {client.apellidoPaterno} {client.apellidoMaterno}
        </Text>
        <Text style={styles.description}>Detalles de contacto y dirección del cliente</Text>

        <View style={styles.divider} />

        <Text style={styles.info}>
          <Text style={styles.label}>Correo: </Text> {client.correo}
        </Text>

        <Text style={styles.sectionTitle}>Teléfonos registrados</Text>
        {telefonos.length > 0 ? (
          telefonos.map((tel, index) => (
            <Text key={index} style={styles.info}>
              <Text style={styles.label}>Teléfono {index + 1}: </Text> {tel}
            </Text>
          ))
        ) : (
          <Text style={styles.info}>No hay teléfonos registrados.</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Dirección</Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Calle: </Text> {direccion.calle?.trim() || 'No disponible'}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Número: </Text> {direccion.numero?.trim() || 'No disponible'}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Colonia: </Text> {direccion.colonia?.trim() || 'No disponible'}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Ciudad: </Text> {direccion.ciudad?.trim() || 'No disponible'}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Estado: </Text> {direccion.estado?.trim() || 'No disponible'}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Código Postal: </Text> {direccion.codigoPostal?.trim() || 'No disponible'}
        </Text>

        <View style={styles.divider} />

        <View
          style={[
            styles.footer,
            { backgroundColor: client.status ? COLORS.primary : "#ccc" }
          ]}
        >
          <Text style={styles.footerText}>
          {client.status ? "Cliente activo" : "Cliente inactivo"}
          </Text>
        </View>
      </View>
    </View>
  );
}


// 📌 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "flex-start",
  },
  clientName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "left",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: COLORS.black,
    marginVertical: 5,
    textAlign: "left",
    lineHeight: 22,
  },
  label: {
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: COLORS.primary,
    textAlign: "left",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.primary,
    width: "100%",
    marginVertical: 10,
  },
  footer: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 15,
  },
  footerText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});
