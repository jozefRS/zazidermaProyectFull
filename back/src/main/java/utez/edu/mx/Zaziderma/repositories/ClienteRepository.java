package utez.edu.mx.Zaziderma.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import utez.edu.mx.Zaziderma.entities.Cliente;

import java.util.List;

public interface ClienteRepository extends MongoRepository<Cliente, String> {



}
