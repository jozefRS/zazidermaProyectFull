package utez.edu.mx.Zaziderma.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subcategorias")
public class Subcategoria {

    @Id
    private String id;

    private String nombre;
    private boolean status;


    public Subcategoria() {
    }

    public Subcategoria(String id, String nombre, boolean status) {
        this.id = id;
        this.nombre = nombre;
        this.status = status;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
