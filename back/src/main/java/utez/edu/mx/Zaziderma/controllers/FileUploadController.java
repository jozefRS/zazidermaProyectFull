package utez.edu.mx.Zaziderma.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${upload.path}")
    private String uploadDir; // ahora será uploads/images

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("image") MultipartFile image) {
        try {
            // Generar nombre único
            String fileName = UUID.randomUUID().toString() + "-" + image.getOriginalFilename();

            // ✅ CORREGIDO: usar Paths.get con dos argumentos
            Path path = Paths.get(uploadDir, fileName);

            // Asegurar que los directorios existen
            Files.createDirectories(path.getParent());

            // Guardar el archivo
            image.transferTo(path);

            // Solo devolver el nombre del archivo
            HashMap<String, String> response = new HashMap<>();
            response.put("imageUrl", fileName); // ← ahora guarda bien en la DB

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar la imagen");
        }
    }
}
