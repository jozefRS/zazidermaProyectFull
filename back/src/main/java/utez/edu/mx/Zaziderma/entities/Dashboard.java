package utez.edu.mx.Zaziderma.entities;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class Dashboard {

    private int totalOrdenes;
    private int totalPendientes;
    private BigDecimal totalVendidoMes;
    private List<Producto> productosPorAgotarse;
    private Map<String, BigDecimal> ventasPorTrabajador; // Mapa de ventas por trabajador
    private List<TopProducto> topProductosVendidos; // Listado de productos más vendidos con nombre y cantidad

    // Constructor actualizado
    public Dashboard(int totalOrdenes, int totalPendientes, BigDecimal totalVendidoMes, List<Producto> productosPorAgotarse,
                     Map<String, BigDecimal> ventasPorTrabajador, List<TopProducto> topProductosVendidos) {
        this.totalOrdenes = totalOrdenes;
        this.totalPendientes = totalPendientes;
        this.totalVendidoMes = totalVendidoMes;
        this.productosPorAgotarse = productosPorAgotarse;
        this.ventasPorTrabajador = ventasPorTrabajador;
        this.topProductosVendidos = topProductosVendidos;
    }

    // Getters y setters
    public int getTotalOrdenes() {
        return totalOrdenes;
    }

    public void setTotalOrdenes(int totalOrdenes) {
        this.totalOrdenes = totalOrdenes;
    }

    public int getTotalPendientes() {
        return totalPendientes;
    }

    public void setTotalPendientes(int totalPendientes) {
        this.totalPendientes = totalPendientes;
    }

    public BigDecimal getTotalVendidoMes() {
        return totalVendidoMes;
    }

    public void setTotalVendidoMes(BigDecimal totalVendidoMes) {
        this.totalVendidoMes = totalVendidoMes;
    }

    public List<Producto> getProductosPorAgotarse() {
        return productosPorAgotarse;
    }

    public void setProductosPorAgotarse(List<Producto> productosPorAgotarse) {
        this.productosPorAgotarse = productosPorAgotarse;
    }

    public Map<String, BigDecimal> getVentasPorTrabajador() {
        return ventasPorTrabajador;
    }

    public void setVentasPorTrabajador(Map<String, BigDecimal> ventasPorTrabajador) {
        this.ventasPorTrabajador = ventasPorTrabajador;
    }

    public List<TopProducto> getTopProductosVendidos() {
        return topProductosVendidos;
    }

    public void setTopProductosVendidos(List<TopProducto> topProductosVendidos) {
        this.topProductosVendidos = topProductosVendidos;
    }
}
