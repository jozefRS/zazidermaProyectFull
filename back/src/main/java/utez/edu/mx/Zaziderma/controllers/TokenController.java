package utez.edu.mx.Zaziderma.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.Zaziderma.auth.JwtTokenProvider;
import utez.edu.mx.Zaziderma.entities.Usuario;
import utez.edu.mx.Zaziderma.repositories.UsuarioRepository;
import utez.edu.mx.Zaziderma.services.EmailService;
import utez.edu.mx.Zaziderma.services.TokenRecuperacionService;
import utez.edu.mx.Zaziderma.services.UsuarioService;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class TokenController {
    @Autowired
    private UsuarioService userService;

    @Autowired
    private TokenRecuperacionService tokenRecuperacionService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String contrasena = request.get("contrasena");

        // Intentar autenticar al usuario
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, contrasena));

            // Buscar usuario en la base de datos
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Generar token JWT con el ID del usuario
            String token = jwtTokenProvider.generateToken(email, usuario.getRol(), usuario.getId());

            // Devolver respuesta con token, rol e ID del usuario
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "rol", usuario.getRol(),
                    "idUsuario", usuario.getId() // Aquí se devuelve el ID del usuario
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error en el servidor: " + e.getMessage());
        }
    }

    @PostMapping("/recuperar-contrasena")
    public ResponseEntity<String> recoverPassword(@RequestParam String email) {
        // Llamar al servicio TokenRecuperacionService para generar y almacenar el token
        try {
            return tokenRecuperacionService.createRecoveryToken(email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar el token de recuperación: " + e.getMessage());
        }
    }




    @PostMapping("/restablecer-contrasena")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        // Llamar al servicio para restablecer la contraseña
        String result = tokenRecuperacionService.resetPassword(token, newPassword);
        return ResponseEntity.ok(result);
    }


}
