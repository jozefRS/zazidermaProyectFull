import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "../../styles/styles";

const ConfirmationModal = ({ isVisible, message, onConfirm, onCancel }) => {
  return (
    <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut">
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Confirmación</Text>
        <Text style={styles.message}>{message}</Text>

        {/* 📌 Botones de acción */}
        <View style={styles.buttonContainer}>
          {/* 📌 Botón Cancelar (con borde más visible) */}
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          {/* 📌 Botón Confirmar */}
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// 📌 Estilos mejorados para que el botón Cancelar se vea bien
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.black,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ConfirmationModal;
