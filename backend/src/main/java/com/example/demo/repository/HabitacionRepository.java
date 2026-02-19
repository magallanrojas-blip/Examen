package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Habitacion;

public interface HabitacionRepository extends JpaRepository<Habitacion, Integer> {
    boolean existsByNumero(String numero);
    boolean existsByNumeroAndIdHabitacionNot(String numero, Integer idHabitacion);
}
