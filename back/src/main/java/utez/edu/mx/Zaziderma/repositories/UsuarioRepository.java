package utez.edu.mx.Zaziderma.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import utez.edu.mx.Zaziderma.entities.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    // Buscar usuario por correo electrónico
    public Optional<Usuario> findByEmail(String email);


}
