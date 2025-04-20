package utez.edu.mx.Zaziderma.controllers;


import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.Zaziderma.entities.Categoria;
import utez.edu.mx.Zaziderma.entities.Subcategoria;
import utez.edu.mx.Zaziderma.services.CategoriaService;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede acceder a este controlador

@RequestMapping("/api/categoria")
public class CategoriaController {


    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return new ResponseEntity<>(categoriaService.findAll(), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Categoria categoria) {
        return new ResponseEntity<>(categoriaService.save(categoria), HttpStatus.CREATED);
    }

    @PutMapping("/{categoriaId}/subcategoria")
    public ResponseEntity<?> addSubcategoriaToCategoria(@PathVariable String categoriaId, @RequestBody Subcategoria subcategoria) {
        return categoriaService.addSubcategoriaToCategoria(categoriaId, subcategoria);
    }
    // Endpoint para obtener subcategorías de una categoría específica
    @GetMapping("/{categoriaId}/subcategorias")
    public List<Subcategoria> getSubcategoriasByCategoriaId(@PathVariable String categoriaId) {
        return categoriaService.getSubcategoriasByCategoriaId(categoriaId);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategoria(@PathVariable String id, @RequestBody Categoria categoria) {
        return categoriaService.updateById(id, categoria);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id) {
        return categoriaService.deleteById(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return categoriaService.findById(id);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable String id) {
        return categoriaService.changeStatus(id);
    }

}





