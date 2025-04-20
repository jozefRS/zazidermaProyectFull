package utez.edu.mx.Zaziderma.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.Zaziderma.entities.Producto;
import utez.edu.mx.Zaziderma.services.ProductoService;

@RestController
@PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede acceder a este controlador
@RequestMapping("/api/producto")
public class ProductoController {


    @Autowired
    private ProductoService productoService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")  // Permite acceso a ambos roles
    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return new ResponseEntity<>(productoService.findAll(), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Producto producto) {
        return new ResponseEntity<>(productoService.save(producto), HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id) {
        return productoService.deleteById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateById(@PathVariable String id, @RequestBody Producto producto) {
        return productoService.updateById(id, producto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return productoService.findById(id);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable String id) {
        try {
            Producto producto = productoService.changeStatus(id);
            return ResponseEntity.ok().body("Estado actualizado exitosamente: " + producto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("/incrementar-stock/{id}")
    public ResponseEntity<?> incrementarStock(@PathVariable String id, @RequestParam int cantidad) {
        return productoService.incrementarStock(id, cantidad);
    }


}
