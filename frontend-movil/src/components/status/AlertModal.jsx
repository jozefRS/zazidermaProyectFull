import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";

const AlertModal = ({ isVisible, type = "success", message, redirectTo, onClose }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (redirectTo) {
      navigation.navigate(redirectTo); // 📌 Redirigir a la vista especificada
    }
    onClose(); // 📌 Cerrar el modal
  };

  return (
    <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut">
      <View style={styles.modalContainer}>
        {/* 📌 Ícono según el tipo de alerta */}
        <Icon 
          name={type === "success" ? "checkmark-circle" : "close-circle"} 
          size={50} 
          color={type === "success" ? COLORS.green : COLORS.red} 
        />

        {/* 📌 Mensaje */}
        <Text style={styles.message}>{message}</Text>

        {/* 📌 Botón para cerrar y redirigir */}
        <TouchableOpacity style={styles.closeButton} onPress={handlePress}>
          <Text style={styles.closeButtonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// 📌 Estilos del modal de alerta
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 15,
    color: COLORS.black,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AlertModal;
