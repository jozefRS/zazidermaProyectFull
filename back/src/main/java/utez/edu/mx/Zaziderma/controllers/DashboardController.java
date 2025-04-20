package utez.edu.mx.Zaziderma.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.Zaziderma.entities.Dashboard;
import utez.edu.mx.Zaziderma.services.DashboardService;

@PreAuthorize("hasAnyRole('ADMIN')")  // Permite acceso a ambos roles

@RestController
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboard")
    public Dashboard obtenerDashboard(@RequestParam("mes") int mes, @RequestParam("año") int año) {
        // Llamar al DashboardService para obtener los datos
        return dashboardService.obtenerDashboardData(mes, año);
    }
}
