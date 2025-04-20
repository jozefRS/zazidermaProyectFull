package utez.edu.mx.Zaziderma.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import utez.edu.mx.Zaziderma.entities.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends MongoRepository<Producto, String> {
    Optional<Producto> findByNombre(String nombre);

    List<Producto> findByStockLessThanEqual(int stock);


}
