package utez.edu.mx.Zaziderma.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import utez.edu.mx.Zaziderma.entities.TokenRecuperacion;
import utez.edu.mx.Zaziderma.entities.Usuario;
import utez.edu.mx.Zaziderma.repositories.TokenRecuperacionRepository;
import utez.edu.mx.Zaziderma.repositories.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class TokenRecuperacionService {

    @Autowired
    private TokenRecuperacionRepository tokenRecuperacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<String> createRecoveryToken(String email) {
        // Verificar si el usuario existe
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);

        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        Usuario user = userOpt.get();

        // Generar token único para la recuperación
        String token = UUID.randomUUID().toString();

        // Crear la fecha de expiración del token (1 hora de validez)
        LocalDateTime expirationDate = LocalDateTime.now().plusHours(1);

        // Crear y guardar el token en la base de datos
        TokenRecuperacion tokenRecuperacion = new TokenRecuperacion();
        tokenRecuperacion.setEmail(user.getEmail());
        tokenRecuperacion.setToken(token);
        tokenRecuperacion.setExpirationDate(expirationDate);

        // Guardar el token en la base de datos
        tokenRecuperacionRepository.save(tokenRecuperacion);

        // Enviar el correo con el enlace para restablecer la contraseña
        String recoveryLink = "http://localhost:5173/restablecer-contrasena?token=" + token;

        sendRecoveryEmail(user.getEmail(), recoveryLink);

        return ResponseEntity.ok("Correo de recuperación enviado");
    }




    // Enviar el correo de recuperación
    private void sendRecoveryEmail(String to, String recoveryLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("your-email@example.com");
        message.setTo(to);
        message.setSubject("Recuperación de Contraseña");
        message.setText("Haz clic en el siguiente enlace para recuperar tu contraseña: " + recoveryLink);

        mailSender.send(message);
    }

    public String resetPassword(String token, String newPassword) {
        // Verificar si el token existe
        TokenRecuperacion tokenRecuperacion = tokenRecuperacionRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token no válido")); // Lanzamos una excepción si el token no se encuentra
        System.out.println("Token recibido: " + token);

        // Verificar si el token ha expirado
        if (tokenRecuperacion.getExpirationDate().isBefore(LocalDateTime.now())) {
            return "El token ha expirado";
        }

        // Buscar el usuario con el correo asociado al token
        String email = tokenRecuperacion.getEmail();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        if (!usuarioOptional.isPresent()) {
            return "Usuario no encontrado";
        }

        Usuario usuario = usuarioOptional.get();

        // Cambiar la contraseña
        usuario.setContrasena(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);

        // Eliminar el token de recuperación después de usarlo
        tokenRecuperacionRepository.delete(tokenRecuperacion);

        return "Contraseña restablecida con éxito";
    }


}
