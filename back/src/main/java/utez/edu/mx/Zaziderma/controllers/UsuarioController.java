package utez.edu.mx.Zaziderma.controllers;


import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.Zaziderma.entities.Usuario;
import utez.edu.mx.Zaziderma.services.EmailService;
import utez.edu.mx.Zaziderma.services.UsuarioService;

import java.util.List;
import java.util.Optional;

@RestController
@PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede acceder a este controlador

@RequestMapping("/api/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Usuario> getAll() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Usuario> getById(@PathVariable String id) {
        return usuarioService.findById(id);
    }

    @PostMapping()
    public Usuario create(@RequestBody Usuario usuario) {
        return usuarioService.save(usuario);
    }

    @PutMapping("/{id}")
    public Usuario update(@PathVariable String id, @RequestBody Usuario usuario) {
        return usuarioService.update(usuario, id);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable String id) {
        return usuarioService.delete(id);
    }

    @PostMapping("/registrar-trabajador")
    public ResponseEntity<?> registrarTrabajador(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarTrabajador(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Error al enviar el correo.");
        }
    }


}
