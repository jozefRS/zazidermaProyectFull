import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
   // ✅ SIN /api para permitir rutas como /auth/login
  baseURL: 'http://3.87.61.205:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

//para casos muy específicos, como el de la imagen
export const API_BASE_URL = 'http://3.87.61.205:8080';

// Agrega el token automáticamente si está disponible
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    console.log('🧪 Token actual:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
