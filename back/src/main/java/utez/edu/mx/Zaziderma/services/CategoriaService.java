package utez.edu.mx.Zaziderma.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.Zaziderma.entities.Categoria;
import utez.edu.mx.Zaziderma.entities.Subcategoria;
import utez.edu.mx.Zaziderma.repositories.CategoriaRepository;
import utez.edu.mx.Zaziderma.repositories.SubcategoriaRepository;
import utez.edu.mx.Zaziderma.utils.CustomResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private CustomResponseEntity customResponseEntity;
    @Autowired
    private SubcategoriaRepository subcategoriaRepository;

    public ResponseEntity<?> findAll() {
        List<Categoria> list = new ArrayList<Categoria>();
        String mensaje="";

        if (categoriaRepository.findAll().isEmpty()) {
            mensaje = "No se encontro el categoria";
        }else{
            mensaje="operacion exitosa";

            for (Categoria c: categoriaRepository.findAll() ){
             list.add(c);
            }
        }
    return customResponseEntity.getOkResponse(mensaje,list);
    }

    public ResponseEntity<?> save(Categoria categoria) {
        try {
            categoriaRepository.save(categoria);
            return customResponseEntity.getOkResponse("Categoria guardada exitosa",categoria);
        }catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }

    public ResponseEntity<?> addSubcategoriaToCategoria(String categoriaId, Subcategoria subcategoria) {
        try {
            // Buscar la categoría por ID
            Categoria categoria = categoriaRepository.findById(categoriaId)
                    .orElseThrow(() -> new Exception("Categoría no encontrada"));

            // Guardar la subcategoría en la base de datos, si no está guardada
            // Esto asume que la subcategoría ya tiene el nombre y otros atributos necesarios.
            Subcategoria nuevaSubcategoria = subcategoriaRepository.save(subcategoria);

            // Agregar la subcategoría a la lista de subcategorías de la categoría
            categoria.getSubcategorias().add(nuevaSubcategoria);

            // Guardar la categoría con la nueva subcategoría añadida
            categoriaRepository.save(categoria);

            return customResponseEntity.getOkResponse("Subcategoría agregada con éxito", categoria);
        } catch (Exception e) {
            // Si ocurre algún error, retornar una respuesta de error
            return customResponseEntity.get400Response();
        }
    }

    // Método para obtener las subcategorías de una categoría por su ID
    public List<Subcategoria> getSubcategoriasByCategoriaId(String categoriaId) {
        Optional<Categoria> categoriaOpt = categoriaRepository.findById(categoriaId);

        if (categoriaOpt.isPresent()) {
            Categoria categoria = categoriaOpt.get();
            return categoria.getSubcategorias();  // Retorna las subcategorías de la categoría
        } else {
            return null;  // Si no se encuentra la categoría, retorna null o lanza una excepción
        }
    }
    public ResponseEntity<?> deleteById(String id) {
        Categoria found = categoriaRepository.findById(id).orElse(null);
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                categoriaRepository.deleteById(id);
                return customResponseEntity.getOkResponse(
                        "Eliminación exitosa",
                        null
                );
            } catch (Exception e) {
                return customResponseEntity.get400Response();
            }
        }
    }

    public ResponseEntity<?> updateById(String id, Categoria categoria) {
        Optional<Categoria> foundOpt = categoriaRepository.findById(id);

        if (!foundOpt.isPresent()) {
            return customResponseEntity.get404Response();
        }

        try {
            Categoria found = foundOpt.get();

            // Actualizar solo si los campos no son nulos
            if (categoria.getNombre() != null) {
                found.setNombre(categoria.getNombre());
            }
            if (categoria.isStatus() != found.isStatus()) {
                found.setStatus(categoria.isStatus());
            }


            // Guardar cambios
            categoriaRepository.save(found);

            return customResponseEntity.getOkResponse(
                    "Actualización exitosa",
                    found
            );
        } catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }
    public ResponseEntity<?> findById(String id){
        Categoria found = categoriaRepository.findById(id).orElse(null);
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            return customResponseEntity.getOkResponse(
                    "Busqueda exitosa",
                    found
            );
        }
    }

    public ResponseEntity<?> changeStatus(String id) {
        // Buscar la categoría por su ID
        Categoria found = categoriaRepository.findById(id).orElse(null);

        // Si no se encuentra la categoría, retornar un error 404
        if (found == null) {
            return customResponseEntity.get404Response();
        }

        // Cambiar el valor del estado (si es true, se pasa a false, y si es false, se pasa a true)
        found.setStatus(!found.isStatus());

        // Guardar la categoría con el nuevo estado
        categoriaRepository.save(found);

        // Retornar respuesta de éxito con la categoría actualizada
        return customResponseEntity.getOkResponse(
                "Estado actualizado exitosamente",
                found
        );
    }

}





