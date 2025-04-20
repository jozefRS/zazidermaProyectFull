package utez.edu.mx.Zaziderma.services;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import utez.edu.mx.Zaziderma.entities.Usuario;
import utez.edu.mx.Zaziderma.repositories.UsuarioRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;
    @Autowired
    private JavaMailSender mailSender;




    public Usuario registrarTrabajador(Usuario usuario) throws MessagingException {
        usuario.setRol("TRABAJADOR"); // Asigna el rol TRABAJADOR

        // Generar una contraseña aleatoria
        String contrasenaGenerada = generarContrasena();
        usuario.setContrasena(passwordEncoder.encode(contrasenaGenerada)); // Guardar encriptada

        usuario.setActivo(true); // Activar la cuenta por defecto

        // Guardar en la base de datos
        Usuario guardado = usuarioRepository.save(usuario);

        // Enviar correo con credenciales
        emailService.enviarCorreoBienvenida(usuario.getEmail(), contrasenaGenerada);

        return guardado;
    }

    private String generarContrasena() {
        return "Trabajador" + UUID.randomUUID().toString().substring(0, 6); // Generar clave aleatoria
    }


    public List<Usuario> findAll() {
        try {
            List<Usuario> usuarios = usuarioRepository.findAll();
            if (usuarios.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.OK,"No usuarios here yet");
            }
            return usuarios;
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Error fetching usuarios");
        }
    }

    public Optional<Usuario> findById(String id) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(id);
            if (usuario.isPresent()) {
                return usuario;
            }
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Usuario not found");
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error fetching usuario.");
        }
    }

    public Usuario save(Usuario usuario) {
        try {
            usuario.setActivo(true);
            return usuarioRepository.save(usuario);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error saving usuario.");
        }
    }

    public Usuario update(Usuario usuario, String id) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        try {
            if (!usuarioOptional.isPresent()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario not found with id: " + id);
            }
            Usuario idAd = usuarioOptional.get();
            usuario.setId(idAd.getId());
            return usuarioRepository.save(usuario);
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error updating usuario.");
        }
    }
    public Usuario findByCorreo(String correo) {
        return usuarioRepository.findByEmail(correo).orElse(null);
    }

    public boolean delete(String id) {
        try {
            if (!usuarioRepository.existsById(id)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario not found with id: " + id);
            }
            usuarioRepository.deleteById(id);
            return true;
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error deleting usuario.");
        }
    }

    public ResponseEntity<String> recoverPassword(String email) throws Exception {
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            if (user.getRol().equals("ADMIN")) {
                // Genera un token de recuperación único
                String token = UUID.randomUUID().toString();

                // Almacenar temporalmente el token asociado al usuario (esto depende de tu implementación, podría ser en una base de datos o un servicio de caché)
                // Aquí puedes crear una tabla/entidad para almacenar los tokens de recuperación con su expiración

                // Envía el enlace de recuperación al correo del usuario
                String recoveryLink = "http://localhost:8080/auth/restablecer-contraseña?token=" + token;

                sendRecoveryEmail(email, recoveryLink);  // Enviar el enlace de recuperación

                return ResponseEntity.ok("Correo de recuperación enviado");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo los administradores pueden recuperar la contraseña");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Correo no encontrado");
        }
    }

    private void sendRecoveryEmail(String to, String recoveryLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("your-email@example.com");
        message.setTo(to);
        message.setSubject("Recuperación de Contraseña");
        message.setText("Haz clic en el siguiente enlace para recuperar tu contraseña: " + recoveryLink);

        mailSender.send(message);
    }

}
