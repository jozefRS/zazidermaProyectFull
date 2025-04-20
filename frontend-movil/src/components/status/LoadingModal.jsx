import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "../../styles/styles";

const LoadingModal = ({ isLoading, message = "Procesando..." }) => {
  return (
    <Modal isVisible={isLoading} animationIn="fadeIn" animationOut="fadeOut">
      <View style={styles.modalContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});

export default LoadingModal;
