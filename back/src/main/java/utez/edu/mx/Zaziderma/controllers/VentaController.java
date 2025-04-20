package utez.edu.mx.Zaziderma.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.Zaziderma.auth.JwtTokenProvider;
import utez.edu.mx.Zaziderma.entities.Cliente;
import utez.edu.mx.Zaziderma.entities.Venta;
import utez.edu.mx.Zaziderma.repositories.VentaRepository;
import utez.edu.mx.Zaziderma.services.ClienteService;
import utez.edu.mx.Zaziderma.services.VentaService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")  // Permite acceso a ambos roles
@RequestMapping("/api/ventas")
@CrossOrigin("*")
public class VentaController {

    @Autowired
    private VentaService ventaService;
    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ClienteService clienteService;
    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return new ResponseEntity<>(ventaService.findAll(), HttpStatus.OK);
    }

    @PostMapping("/realizar")
    public Venta realizarVenta(@RequestBody Venta venta) {
        return ventaService.realizarVenta(venta);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return ventaService.findById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id) {
        return ventaService.deleteById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateById(@PathVariable String id, @RequestBody Venta venta) {
        return ventaService.updateById(id, venta);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    @PatchMapping("/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable String id) {
        try {
            Venta venta = ventaService.changeStatus(id);
            return ResponseEntity.ok().body("Estado actualizado exitosamente: " + venta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping("/trabajador")
    public ResponseEntity<?> obtenerVentasPorTrabajador(HttpServletRequest request) {
        String idTrabajador = (String) request.getAttribute("idTrabajador");

        if (idTrabajador == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("El ID del trabajador no está presente en el token");
        }

        List<Venta> ventas = ventaService.obtenerVentasPorTrabajador(idTrabajador);
        if (ventas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No hay ventas registradas.");
        }
        return ResponseEntity.ok(ventas);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")  // Permite acceso a ambos roles
    @PutMapping("/{id}/enviar")
    public ResponseEntity<?> actualizarEvidenciaEnvio(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Venta> optionalVenta = ventaRepository.findById(id);
        if (optionalVenta.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Venta no encontrada");
        }

        Venta venta = optionalVenta.get();
        String evidencia = body.get("evidencia"); // viene como { evidencia: "/ruta/imagen.jpg" }

        venta.setUrlImagenEnvio(evidencia);
        venta.setEnviado(true);
        ventaRepository.save(venta);

        return ResponseEntity.ok("Evidencia de envío actualizada");
    }
}




