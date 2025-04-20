package utez.edu.mx.Zaziderma.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import utez.edu.mx.Zaziderma.entities.Usuario;
import utez.edu.mx.Zaziderma.repositories.UsuarioRepository;

import java.util.ArrayList;

@Service
public class UserDetailsServicesImplements implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Encuentra el usuario en la base de datos por correo electrónico
        Usuario usuarioEntity = this.usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("email no encontrado"));

        // Regresa un objeto User con el correo, la contraseña y los roles (en este caso, vacíos)
        return new User(usuarioEntity.getEmail() , usuarioEntity.getContrasena(), new ArrayList<>());
    }
}
