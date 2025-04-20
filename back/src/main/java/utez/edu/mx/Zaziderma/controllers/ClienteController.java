package utez.edu.mx.Zaziderma.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.Zaziderma.entities.Cliente;
import utez.edu.mx.Zaziderma.services.ClienteService;

@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")  // Permite acceso a ambos roles

@RequestMapping("/api/cliente")
public class ClienteController {


    @Autowired
    private ClienteService clienteService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return new ResponseEntity<>(clienteService.findAll(), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Cliente cliente) {
        return new ResponseEntity<>(clienteService.save(cliente), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return clienteService.findById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id) {
        return clienteService.deleteById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateById(@PathVariable String id, @RequestBody Cliente cliente) {
        return clienteService.updateById(id, cliente);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable String id) {
        return clienteService.changeStatus(id);
    }



}
