package utez.edu.mx.Zaziderma.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import utez.edu.mx.Zaziderma.entities.TokenRecuperacion;

import java.util.Optional;

public interface TokenRecuperacionRepository extends MongoRepository<TokenRecuperacion, String> {

    Optional<TokenRecuperacion> findByEmail(String email);
    Optional<TokenRecuperacion> findByToken(String token);
    void deleteByToken(String token); // 👈 Este es el método para eliminar por token

}
