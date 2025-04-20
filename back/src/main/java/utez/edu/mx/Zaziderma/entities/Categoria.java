package utez.edu.mx.Zaziderma.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "categorias")
public class Categoria {

    @Id
    private String id;
    private String nombre;
    private boolean status;
    @DBRef
    private List<Subcategoria> subcategorias = new ArrayList<>(); // Inicialización de la lista

    public Categoria() {}

    public Categoria(String id, String nombre, List<Subcategoria> subcategorias, boolean status) {
        this.id = id;
        this.nombre = nombre;
        this.subcategorias = subcategorias != null ? subcategorias : new ArrayList<>(); // Asegurar que nunca sea null
        this.status = status;
    }

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

    public List<Subcategoria> getSubcategorias() {
        return subcategorias;
    }

    public void setSubcategorias(List<Subcategoria> subcategorias) {
        this.subcategorias = subcategorias;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
