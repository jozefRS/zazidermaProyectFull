import React, { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,} from "react-native";
import axiosInstance from "../../utils/axiosInstance";
import ConfirmationModal from "../status/ConfirmationModal";
import LoadingModal from "../status/LoadingModal";
import AlertModal from "../status/AlertModal";
import * as Yup from "yup";

const clientSchema = Yup.object().shape({
  nombre: Yup.string().required("Campo requerido"),
  apellidoPaterno: Yup.string().required("Campo requerido"),
  apellidoMaterno: Yup.string().required("Campo requerido"),
  correo: Yup.string().email("Correo inválido").required("Campo requerido"),
  telefonos: Yup.array()
    .of(
      Yup.string()
        .required("No puede estar vacío")
        .matches(/^\d+$/, "Debe contener solo números")
        .min(7, "Debe tener al menos 7 dígitos")
    )
    .test(
      "no-vacios",
      "Debe registrar al menos un teléfono válido",
      (telefonos) => telefonos.some((tel) => tel.trim() !== "")
    )
    .test("sin-repetidos", "No se permiten teléfonos duplicados", (telefonos) => {
      const sinVacios = telefonos.filter((tel) => tel.trim() !== "");
      const unicos = new Set(sinVacios);
      return sinVacios.length === unicos.size;
    }),
  direccion: Yup.object().shape({
    calle: Yup.string().required("Campo requerido"),
    numero: Yup.string().required("Campo requerido").matches(/^\d+$/, "Debe contener solo números"),
    colonia: Yup.string().required("Campo requerido"),
    ciudad: Yup.string().required("Campo requerido"),
    estado: Yup.string().required("Campo requerido"),
    codigoPostal: Yup.string().required("Campo requerido").matches(/^\d{5}$/, "Debe tener exactamente 5 dígitos"),
  }),
});

const RegisterClient = () => {
  const [client, setClient] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefonos: [""],
    direccion: {
      calle: "",
      numero: "",
      colonia: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleChange = (name, value) => {
    const nuevoCliente = { ...client, [name]: value };
    setClient(nuevoCliente);
    validarCamposEnTiempoReal(nuevoCliente);
  };
  
  const handleDireccionChange = (name, value) => {
    const nuevaDireccion = { ...client.direccion, [name]: value };
    const nuevoCliente = { ...client, direccion: nuevaDireccion };
    setClient(nuevoCliente);
    validarCamposEnTiempoReal(nuevoCliente);
  };
  
  const handleTelefonoChange = (index, value) => {
    const nuevosTelefonos = [...client.telefonos];
    nuevosTelefonos[index] = value;
    const nuevoCliente = { ...client, telefonos: nuevosTelefonos };
    setClient(nuevoCliente);
    validarCamposEnTiempoReal(nuevoCliente);
  };
  

  const agregarTelefono = () => {
    setClient({ ...client, telefonos: [...client.telefonos, ""] });
  };

  const handleConfirm = async () => {
    try {
      await clientSchema.validate(client, { abortEarly: false });
      setErrors({});
      setModalVisible(false);
      setIsLoading(true);

      const clienteData = {
        nombre: client.nombre,
        apellidoPaterno: client.apellidoPaterno,
        apellidoMaterno: client.apellidoMaterno,
        correo: client.correo,
        telefono: client.telefonos.filter((t) => t !== ""),
        direccion: client.direccion,
        status: true,
      };

      await axiosInstance.post("api/cliente", clienteData);
      setTimeout(() => {
        setIsLoading(false);
        setAlertMessage("Cliente registrado correctamente");
        setAlertType("success");
        setAlertVisible(true);
      }, 2000);
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          if (e.path) validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        setIsLoading(false);
        setAlertMessage("No se pudo registrar el cliente");
        setAlertType("error");
        setAlertVisible(true);
      }
    }
  };
  const validarCamposEnTiempoReal = async (nuevoCliente) => {
    try {
      await clientSchema.validate(nuevoCliente, { abortEarly: false });
      setErrors({});
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          if (e.path) validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Cliente</Text>

        <TextInput
          placeholder="Nombre"
          value={client.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
          style={styles.input}
        />
        {errors.nombre && <Text style={styles.error}>{errors.nombre}</Text>}

        <TextInput
          placeholder="Apellido Paterno"
          value={client.apellidoPaterno}
          onChangeText={(text) => handleChange("apellidoPaterno", text)}
          style={styles.input}
        />
        {errors.apellidoPaterno && <Text style={styles.error}>{errors.apellidoPaterno}</Text>}

        <TextInput
          placeholder="Apellido Materno"
          value={client.apellidoMaterno}
          onChangeText={(text) => handleChange("apellidoMaterno", text)}
          style={styles.input}
        />
        {errors.apellidoMaterno && <Text style={styles.error}>{errors.apellidoMaterno}</Text>}

        <TextInput
          placeholder="Correo"
          value={client.correo}
          onChangeText={(text) => handleChange("correo", text)}
          style={styles.input}
          keyboardType="email-address"
        />
        {errors.correo && <Text style={styles.error}>{errors.correo}</Text>}

        <Text style={styles.label}>Teléfonos</Text>
        {client.telefonos.map((telefono, index) => (
          <View key={index}>
            <TextInput
              placeholder={`Teléfono ${index + 1}`}
              value={telefono}
              onChangeText={(text) => handleTelefonoChange(index, text)}
              style={styles.input}
              keyboardType="phone-pad"
              autoComplete="tel" // Sugerido para claridad
              importantForAutofill="no" // ❌ evita que Android los vincule entre sí
            />
          </View>
        ))}

        {errors.telefonos && <Text style={styles.error}>{errors.telefonos}</Text>}

        <TouchableOpacity onPress={agregarTelefono}>
          <Text style={styles.addPhone}>+ Agregar otro teléfono</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          placeholder="Calle"
          value={client.direccion.calle}
          onChangeText={(text) => handleDireccionChange("calle", text)}
          style={styles.input}
        />
        {errors["direccion.calle"] && <Text style={styles.error}>{errors["direccion.calle"]}</Text>}

        <TextInput
          placeholder="Número"
          value={client.direccion.numero}
          onChangeText={(text) => handleDireccionChange("numero", text)}
          style={styles.input}
        />
        {errors["direccion.numero"] && <Text style={styles.error}>{errors["direccion.numero"]}</Text>}

        <TextInput
          placeholder="Colonia"
          value={client.direccion.colonia}
          onChangeText={(text) => handleDireccionChange("colonia", text)}
          style={styles.input}
        />
        {errors["direccion.colonia"] && <Text style={styles.error}>{errors["direccion.colonia"]}</Text>}

        <TextInput
          placeholder="Ciudad"
          value={client.direccion.ciudad}
          onChangeText={(text) => handleDireccionChange("ciudad", text)}
          style={styles.input}
        />
        {errors["direccion.ciudad"] && <Text style={styles.error}>{errors["direccion.ciudad"]}</Text>}

        <TextInput
          placeholder="Estado"
          value={client.direccion.estado}
          onChangeText={(text) => handleDireccionChange("estado", text)}
          style={styles.input}
        />
        {errors["direccion.estado"] && <Text style={styles.error}>{errors["direccion.estado"]}</Text>}

        <TextInput
          placeholder="Código Postal"
          value={client.direccion.codigoPostal}
          onChangeText={(text) => handleDireccionChange("codigoPostal", text)}
          style={styles.input}
          keyboardType="default"
        />
        {errors["direccion.codigoPostal"] && <Text style={styles.error}>{errors["direccion.codigoPostal"]}</Text>}

        <TouchableOpacity
  style={styles.registerButton}
  onPress={async () => {
    try {
      await clientSchema.validate(client, { abortEarly: false });
      setErrors({});
      setModalVisible(true); // ✅ Solo si pasa validación
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          if (e.path) validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  }}
>
  <Text style={styles.registerButtonText}>Registrar</Text>
</TouchableOpacity>

      </View>

      <ConfirmationModal
        isVisible={isModalVisible}
        message="¿Está seguro de que desea registrar este cliente?"
        onConfirm={handleConfirm}
        onCancel={() => setModalVisible(false)}
      />
      <AlertModal
        isVisible={alertVisible}
        type={alertType}
        message={alertMessage}
        redirectTo="Clients"
        onClose={() => setAlertVisible(false)}
      />
      <LoadingModal isLoading={isLoading} />
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
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#6C2373",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6C2373",
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: "#6C2373",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#F8F3F8",
  },
  addPhone: {
    color: "#6C2373",
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 10,
  },
  registerButton: {
    marginTop: 15,
    backgroundColor: "#6C2373",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default RegisterClient;
