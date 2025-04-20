package utez.edu.mx.Zaziderma.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.Zaziderma.entities.Cliente;
import utez.edu.mx.Zaziderma.repositories.ClienteRepository;
import utez.edu.mx.Zaziderma.utils.CustomResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private CustomResponseEntity customResponseEntity;

    public ResponseEntity<?> findAll() {
        List<Cliente> list = new ArrayList<>();
        String mensaje="";

        if (clienteRepository.findAll().isEmpty()) {
            mensaje="aun no hay registros";
        }else {
            mensaje="operacion exitosa";
            for (Cliente c : clienteRepository.findAll()) {
                list.add(c);
            }


        }
        return customResponseEntity.getOkResponse(mensaje,list);
    }

    public ResponseEntity<?> save(Cliente cliente) {
        try {
            clienteRepository.save(cliente);
            return customResponseEntity.getOkResponse("cliente registrado",cliente);
        }catch (Exception e) {
            return  customResponseEntity.get400Response();

        }
    }
    public ResponseEntity<?> deleteById(String id) {
        Optional<Cliente> foundOpt = clienteRepository.findById(id);
        if (!foundOpt.isPresent()) {
            return customResponseEntity.get404Response();
        }
        try {
            clienteRepository.deleteById(id);
            return customResponseEntity.getOkResponse(
                    "Eliminación exitosa",
                    null
            );
        } catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }


    public ResponseEntity<?> updateById(String id, Cliente cliente) {
        Optional<Cliente> foundOpt = clienteRepository.findById(id);
        if (!foundOpt.isPresent()) {
            return customResponseEntity.get404Response();
        }
        try {
            Cliente found = foundOpt.get();

            // Actualizar solo si los campos no son nulos
            if (cliente.getNombre() != null) {
                found.setNombre(cliente.getNombre());
            }
            if (cliente.getApellidoPaterno() != null) {
                found.setApellidoPaterno(cliente.getApellidoPaterno());
            }
            if (cliente.getApellidoMaterno() != null) {
                found.setApellidoMaterno(cliente.getApellidoMaterno());
            }
            if (cliente.getCorreo() != null) {
                found.setCorreo(cliente.getCorreo());
            }
            if (cliente.getTelefono() != null) {
                found.setTelefono(cliente.getTelefono());
            }
            if (cliente.getDireccion() != null) {
                found.setDireccion(cliente.getDireccion());
            }
            if (cliente.isStatus() != found.isStatus()) {
                found.setStatus(cliente.isStatus());
            }

            // Guardar cambios
            clienteRepository.save(found);
            return customResponseEntity.getOkResponse(
                    "Actualización exitosa",
                    found
            );
        } catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }


    public ResponseEntity<Cliente> findById(String id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent()) {
            return ResponseEntity.ok(cliente.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    public ResponseEntity<?> changeStatus(String id) {
        // Buscar el cliente por ID
        Cliente found = clienteRepository.findById(id).orElse(null);
        if (found == null) {
            return customResponseEntity.get404Response();
        }

        // Cambiar el estado (si está en true lo pasa a false y viceversa)
        found.setStatus(!found.isStatus());

        // Guardar la actualización del cliente
        clienteRepository.save(found);

        // Responder con el cliente actualizado
        return customResponseEntity.getOkResponse(
                "Estado actualizado exitosamente",
                found
        );
    }

}
