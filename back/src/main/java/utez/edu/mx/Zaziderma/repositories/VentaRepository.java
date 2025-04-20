package utez.edu.mx.Zaziderma.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import utez.edu.mx.Zaziderma.entities.Venta;

import java.time.LocalDateTime;
import java.util.List;

public interface VentaRepository extends MongoRepository<Venta, String> {
    List<Venta> findByIdTrabajador(String idTrabajador);


    // Buscar ventas por mes y año
    List<Venta> findByFechaDeVentaBetween(LocalDateTime startDate, LocalDateTime endDate);

}
