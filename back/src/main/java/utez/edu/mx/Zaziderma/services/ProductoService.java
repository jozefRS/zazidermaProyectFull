package utez.edu.mx.Zaziderma.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.Zaziderma.entities.Producto;
import utez.edu.mx.Zaziderma.repositories.ProductoRepository;
import utez.edu.mx.Zaziderma.utils.CustomResponseEntity;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;


    public ResponseEntity<?> findAll() {
        List<Producto> list = productoRepository.findAll();
        String mensaje = "Productos encontrados"; // Mensaje por defecto si hay productos

        if (list.isEmpty()) {
            mensaje = "No se encontraron productos"; // Si la lista está vacía, cambiamos el mensaje
        }

        return customResponseEntity.getOkResponse(mensaje, list);
    }


    public ResponseEntity<?> save(Producto producto){
        try {
            // Verificar si el producto ya existe (puedes verificar por nombre, SKU, etc.)
            Optional<Producto> existingProducto = productoRepository.findByNombre(producto.getNombre());
            if (existingProducto.isPresent()) {
                return customResponseEntity.get400Response();
            }

            producto.setEstado(true);
            productoRepository.save(producto);
            return customResponseEntity.getOkResponse("Producto registrado correctamente", producto);
        } catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }
    public ResponseEntity<?> deleteById(String id) {
        Producto found = productoRepository.findById(id).orElse(null);
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                productoRepository.deleteById(id);
                return customResponseEntity.getOkResponse(
                        "Eliminación exitosa",
                        null
                );
            } catch (Exception e) {
                return customResponseEntity.get400Response();
            }
        }
    }

    public ResponseEntity<?> updateById(String id, Producto producto) {
        Optional<Producto> foundOpt = productoRepository.findById(id);

        if (!foundOpt.isPresent()) {
            return customResponseEntity.get404Response();
        }

        try {
            Producto found = foundOpt.get();

            // Actualizar solo si los campos no son nulos
            if (producto.getNombre() != null) {
                found.setNombre(producto.getNombre());
            }
            if (producto.getDescripcion() != null) {
                found.setDescripcion(producto.getDescripcion());
            }
            if (producto.getPrecio() != null) {
                found.setPrecio(producto.getPrecio());
            }
            if (producto.getStock() != 0) {
                found.setStock(producto.getStock());
            }
            if (producto.getImagen() != null) {
                found.setImagen(producto.getImagen());
            }
            if (producto.getCantidad() != null) {
                found.setCantidad(producto.getCantidad());
            }
            if (producto.getUnidadMedida() != null) {
                found.setUnidadMedida(producto.getUnidadMedida());
            }
            if (producto.getIdCategoria() != null) {
                found.setIdCategoria(producto.getIdCategoria());
            }
            if (producto.getIdSubcategoria() != null) {
                found.setIdSubcategoria(producto.getIdSubcategoria());
            }
            if (producto.isEstado() != found.isEstado()) {
                found.setEstado(producto.isEstado());
            }

            // Guardar cambios
            productoRepository.save(found);
            return customResponseEntity.getOkResponse(
                    "Actualización exitosa",
                    found
            );
        } catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }

    public Producto changeStatus(String id) throws Exception {
        Optional<Producto> productoOpt = productoRepository.findById(id);

        if (productoOpt.isPresent()) {
            Producto producto = productoOpt.get();

            // Cambiar el estado (si está en true lo pasa a false y viceversa)
            producto.setEstado(!producto.isEstado());

            // Guardar la actualización del producto
            return productoRepository.save(producto);
        } else {
            throw new Exception("Producto no encontrado con ID: " + id);
        }
    }
    // Obtener productos con stock menor o igual a 5
    public List<Producto> obtenerProductosConStockBajo() {
        return productoRepository.findByStockLessThanEqual(5);
    }

    public ResponseEntity<Producto> findById(String id) {
        Optional<Producto> productoOpt = productoRepository.findById(id);
        if (productoOpt.isPresent()) {
            return ResponseEntity.ok(productoOpt.get());  // Producto encontrado
        } else {
            return ResponseEntity.notFound().build();  // Producto no encontrado
        }
    }
    public ResponseEntity<?> incrementarStock(String id, int cantidad) {
        // Verificar si el producto existe
        Optional<Producto> productoOpt = productoRepository.findById(id);

        if (!productoOpt.isPresent()) {
            return customResponseEntity.get404Response(); // Si el producto no se encuentra
        }

        try {
            Producto producto = productoOpt.get();

            // Obtener el stock actual
            int stockActual = producto.getStock();

            // Sumar la cantidad que se quiere agregar al stock actual
            producto.setStock(stockActual + cantidad);

            // Guardar el producto actualizado
            productoRepository.save(producto);

            return customResponseEntity.getOkResponse("Stock actualizado correctamente", producto);
        } catch (Exception e) {
            return customResponseEntity.get400Response(); // En caso de error
        }
    }



}
