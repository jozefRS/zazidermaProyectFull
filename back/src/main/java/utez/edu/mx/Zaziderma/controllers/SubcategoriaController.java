package utez.edu.mx.Zaziderma.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.Zaziderma.entities.Subcategoria;
import utez.edu.mx.Zaziderma.services.SubcategoriaService;

@RestController
@PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede acceder a este controlador

@RequestMapping("/api/subcategoria")
public class SubcategoriaController {


    @Autowired
    private SubcategoriaService subcategoriaService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return new ResponseEntity<>(subcategoriaService.findAll(), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Subcategoria subcategoria) {
        return new ResponseEntity<>(subcategoriaService.save(subcategoria), HttpStatus.CREATED);
    }
    // Método para obtener una subcategoría por ID (ID es String)
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubcategoriaById(@PathVariable String id) {
        return subcategoriaService.findById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id) {
        return subcategoriaService.deleteById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateById(@PathVariable String id, @RequestBody Subcategoria subcategoria) {
        return subcategoriaService.updateById(id, subcategoria);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable String id) {
        try {
            Subcategoria subcategoria = subcategoriaService.changeStatus(id);
            return ResponseEntity.ok().body("Estado actualizado exitosamente: " + subcategoria);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}