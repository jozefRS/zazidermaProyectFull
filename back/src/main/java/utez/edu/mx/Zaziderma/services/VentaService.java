package utez.edu.mx.Zaziderma.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.Zaziderma.entities.Producto;
import utez.edu.mx.Zaziderma.entities.Venta;
import utez.edu.mx.Zaziderma.repositories.ProductoRepository;
import utez.edu.mx.Zaziderma.repositories.VentaRepository;
import utez.edu.mx.Zaziderma.utils.CustomResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VentaService {
    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private VentaRepository ventaRepository;

    public Venta realizarVenta(Venta venta) {
        // Obtener los productos desde la base de datos usando los IDs de los productos de la venta
        List<Producto> productos = productoRepository.findAllById(venta.getProductos().keySet()); // Obtener productos por sus IDs

        // Calcular el subtotal
        BigDecimal subTotal = productos.stream()
                .map(producto -> producto.getPrecio().multiply(new BigDecimal(venta.getProductos().get(producto.getId())))) // Multiplicar el precio por la cantidad
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Si el valor de aplicarIVA es true, calcula el IVA
        BigDecimal total;
        if (venta.isAplicarIVA()) {
            BigDecimal iva = subTotal.multiply(new BigDecimal("0.16")); // 16% de IVA
            total = subTotal.add(iva);
        } else {
            total = subTotal;
        }

        // Actualizar stock de los productos vendidos
        for (Producto producto : productos) {
            int cantidadComprada = venta.getProductos().get(producto.getId()); // Obtener la cantidad comprada del producto
            if (producto.getStock() >= cantidadComprada) {
                producto.setStock(producto.getStock() - cantidadComprada);
                productoRepository.save(producto); // Actualiza el stock
            } else {
                throw new RuntimeException("El producto " + producto.getNombre() + " no tiene suficiente stock.");
            }
        }



        // Guardar los datos de la venta
        venta.setSubTotal(subTotal);
        venta.setTotal(total);
        venta.setFechaDeVenta(LocalDateTime.now()); // Fecha de la venta con hora actual
        venta.setEstado(false); // La venta está activa

        // Guardar la venta en la base de datos
        return ventaRepository.save(venta);
    }

    public ResponseEntity<?> findAll() {
        List<Venta> list = ventaRepository.findAll();
        String mensaje = "";
        if (ventaRepository.findAll().isEmpty()) {

            mensaje = "No se encontraron productos";
        } else {
            for (Venta v : ventaRepository.findAll()) {
                list.add(v);


            }


        }
        return customResponseEntity.getOkResponse(mensaje, list);

    }

    public ResponseEntity<?> findById(String id) {
        Venta found = ventaRepository.findById(id).orElse(null);
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            return customResponseEntity.getOkResponse("Venta encontrada", found);
        }
    }

    public ResponseEntity<?> deleteById(String id) {
        Venta found = ventaRepository.findById(id).orElse(null);
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                ventaRepository.deleteById(id);
                return customResponseEntity.getOkResponse("Eliminación exitosa", null);
            } catch (Exception e) {
                return customResponseEntity.get400Response();
            }
        }
    }

    public ResponseEntity<?> updateById(String id, Venta venta) {
        Optional<Venta> found = ventaRepository.findById(id);

        if (!found.isPresent()) {
            return customResponseEntity.get404Response();
        }
        try {
            ventaRepository.save(venta);
            return customResponseEntity.getOkResponse("Actualización exitosa", venta);
        } catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }

    public Venta changeStatus(String id) throws Exception {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);

        if (ventaOpt.isPresent()) {
            Venta venta = ventaOpt.get();

            // Cambiar el estado (si está en true lo pasa a false y viceversa)
            venta.setEstado(!venta.isEstado());

            // Guardar la actualización de la venta
            return ventaRepository.save(venta);
        } else {
            throw new Exception("Venta no encontrada con ID: " + id);
        }
    }
    // Obtener ventas por mes (usando el mes y año como parámetros)
    public List<Venta> obtenerVentasPorMes(int mes, int año) {
        // Primer día del mes
        LocalDateTime startDate = LocalDateTime.of(año, mes, 1, 0, 0, 0, 0);

        // Último día del mes
        LocalDateTime endDate = startDate.withDayOfMonth(startDate.toLocalDate().lengthOfMonth())
                .withHour(23).withMinute(59).withSecond(59);

        // Realizamos la consulta en el repositorio para obtener ventas en ese rango de fechas
        return ventaRepository.findByFechaDeVentaBetween(startDate, endDate);
    }

    // Obtener ventas por trabajador (usando su id)
    public List<Venta> obtenerVentasPorTrabajador(String idTrabajador) {
        return ventaRepository.findByIdTrabajador(idTrabajador);
    }

    // Calcular el total de ventas en un mes específico
    public BigDecimal obtenerTotalVendidoPorMes(int mes, int año) {
        List<Venta> ventas = obtenerVentasPorMes(mes, año);
        return ventas.stream()
                .map(venta -> venta.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Obtener total de ventas por trabajador en un mes y año
    public Map<String, BigDecimal> obtenerVentasPorTrabajador(int mes, int año) {
        List<Venta> ventas = obtenerVentasPorMes(mes, año);

        // Agrupar ventas por idTrabajador y calcular el total vendido por trabajador
        return ventas.stream()
                .collect(Collectors.groupingBy(
                        Venta::getIdTrabajador,
                        Collectors.reducing(BigDecimal.ZERO, Venta::getTotal, BigDecimal::add)
                ));
    }

    // Obtener Top 5 productos más vendidos
    public List<Map.Entry<String, Integer>> obtenerTopProductosVendidos(int mes, int año) {
        List<Venta> ventas = obtenerVentasPorMes(mes, año);

        // Contar las cantidades vendidas por producto (idProducto -> cantidad vendida)
        Map<String, Integer> productosVendidos = ventas.stream()
                .flatMap(venta -> venta.getProductos().entrySet().stream())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        Integer::sum
                ));

        // Ordenar por la cantidad vendida y obtener el top 5
        return productosVendidos.entrySet().stream()
                .sorted((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue())) // Ordenar por cantidad vendida
                .limit(5) // Top 5 productos
                .collect(Collectors.toList());
    }


}
