package utez.edu.mx.Zaziderma.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.Zaziderma.entities.Subcategoria;
import utez.edu.mx.Zaziderma.repositories.SubcategoriaRepository;
import utez.edu.mx.Zaziderma.utils.CustomResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SubcategoriaService {
    
     @Autowired
    private SubcategoriaRepository subcategoriaRepository;
    @Autowired
    private CustomResponseEntity customResponseEntity;

    public ResponseEntity<?> findAll() {
        List<Subcategoria> list = new ArrayList<Subcategoria>();
        String mensaje="";

        if (subcategoriaRepository.findAll().isEmpty()) {
            mensaje = "No se encontro el subcategoria";
        }else{
            mensaje="operacion exitosa";

            for (Subcategoria s: subcategoriaRepository.findAll() ){
             list.add(s);
            }
        }
    return customResponseEntity.getOkResponse(mensaje,list);
    }

    public ResponseEntity<?> save(Subcategoria subcategoria) {
        try {
            subcategoriaRepository.save(subcategoria);
            return customResponseEntity.getOkResponse("Subcategoria guardada exitosa",subcategoria);
        }catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }
    // Método para obtener una subcategoría por ID (ID es String en MongoDB)
    public ResponseEntity<?> findById(String id) {
        Optional<Subcategoria> subcategoria = subcategoriaRepository.findById(id);

        if (subcategoria.isPresent()) {
            return customResponseEntity.getOkResponse("Subcategoría encontrada", subcategoria.get());
        } else {
            return customResponseEntity.get404Response();
        }
    }
    public ResponseEntity<?> deleteById(String id) {
        Optional<Subcategoria> found = subcategoriaRepository.findById(id);
        if (found.isEmpty()) {
            return customResponseEntity.get404Response();
        } else {
            try {
                subcategoriaRepository.deleteById(id);
                return customResponseEntity.getOkResponse("Eliminación exitosa", null);
            } catch (Exception e) {
                return customResponseEntity.get400Response();
            }
        }
    }

    public ResponseEntity<?> updateById(String id, Subcategoria subcategoria) {
        Optional<Subcategoria> foundOpt = subcategoriaRepository.findById(id);
        if (foundOpt.isEmpty()) {
            return customResponseEntity.get404Response();
        } else {
            try {
                Subcategoria found = foundOpt.get();
                if (subcategoria.getNombre() != null) {
                    found.setNombre(subcategoria.getNombre());
                }
                found.setStatus(subcategoria.isStatus());
                subcategoriaRepository.save(found);
                return customResponseEntity.getOkResponse("Actualización exitosa", found);
            } catch (Exception e) {
                return customResponseEntity.get400Response();
            }
        }
    }

    public Subcategoria changeStatus(String id) throws Exception {
        Optional<Subcategoria> subcategoriaOpt = subcategoriaRepository.findById(id);

        if (subcategoriaOpt.isPresent()) {
            Subcategoria subcategoria = subcategoriaOpt.get();

            // Cambiar el estado (si está en true lo pasa a false y viceversa)
            subcategoria.setStatus(!subcategoria.isStatus());

            // Guardar la actualización de la subcategoría
            return subcategoriaRepository.save(subcategoria);
        } else {
            throw new Exception("Subcategoría no encontrada con ID: " + id);
        }
    }



}





