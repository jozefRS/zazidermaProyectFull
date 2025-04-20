package utez.edu.mx.Zaziderma.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import utez.edu.mx.Zaziderma.entities.Categoria;

public interface CategoriaRepository extends MongoRepository<Categoria, String> {
}
