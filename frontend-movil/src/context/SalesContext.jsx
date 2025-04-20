// context/SalesContext.js
import React, { createContext, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    try {
      const res = await axiosInstance.get('api/ventas');
      const ventas = res.data.body?.data || [];
      setSales(ventas);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  const addSale = (nuevaVenta) => {
    setSales(prev => [nuevaVenta, ...prev]);
  };

  return (
    <SalesContext.Provider value={{ sales, fetchSales, addSale }}>
      {children}
    </SalesContext.Provider>
  );
};
