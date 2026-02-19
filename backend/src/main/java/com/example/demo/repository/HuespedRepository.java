package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Huesped;

public interface HuespedRepository extends JpaRepository<Huesped, Integer> {
    boolean existsByDni(String dni);
    boolean existsByTelefono(String telefono);
    boolean existsByDniAndIdHuespedNot(String dni, Integer idHuesped);
    boolean existsByTelefonoAndIdHuespedNot(String telefono, Integer idHuesped);
}
