package utez.edu.mx.Zaziderma.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.Zaziderma.entities.Dashboard;
import utez.edu.mx.Zaziderma.entities.Producto;
import utez.edu.mx.Zaziderma.entities.TopProducto;
import utez.edu.mx.Zaziderma.entities.Venta;

import java.math.BigDecimal;
import java.util.*;
@Service
public class DashboardService {

    @Autowired
    private VentaService ventaService;

    @Autowired
    private ProductoService productoService;

    // Método para obtener los datos del Dashboard
    public Dashboard obtenerDashboardData(int mes, int año) {
        // Obtener las ventas del mes
        List<Venta> ventas = ventaService.obtenerVentasPorMes(mes, año);
        BigDecimal totalVendidoMes = ventaService.obtenerTotalVendidoPorMes(mes, año);

        // Obtener productos con stock bajo
        List<Producto> productosPorAgotarse = productoService.obtenerProductosConStockBajo();

        // Obtener estadísticas generales
        int totalOrdenes = ventas.size();
        int totalPendientes = (int) ventas.stream().filter(venta -> !venta.isEstado()).count();

        // Obtener ventas por trabajador
        Map<String, BigDecimal> ventasPorTrabajador = ventaService.obtenerVentasPorTrabajador(mes, año);

        // Obtener top 5 productos más vendidos con el nombre y la cantidad
        List<Map.Entry<String, Integer>> topProductosVendidos = ventaService.obtenerTopProductosVendidos(mes, año);

        // Crear la lista de TopProducto
        List<TopProducto> productosTop5 = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : topProductosVendidos) {
            String productoId = entry.getKey();  // El ID del producto
            Integer cantidadVendida = entry.getValue();  // La cantidad vendida de ese producto

            // Llamar al método findById para obtener el producto por ID
            Producto producto = productoService.findById(productoId).getBody();  // Obtener el producto
            if (producto != null) {
                TopProducto topProducto = new TopProducto(producto.getNombre(), cantidadVendida);
                productosTop5.add(topProducto); // Agregar el producto a la lista
            }
        }

        // Crear y devolver el objeto Dashboard con la información recopilada
        return new Dashboard(totalOrdenes, totalPendientes, totalVendidoMes, productosPorAgotarse, ventasPorTrabajador, productosTop5);
    }
}
