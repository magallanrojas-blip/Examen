package com.example.demo.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.model.Habitacion;
import com.example.demo.repository.HabitacionRepository;

@Service
public class HabitacionService {

	private final HabitacionRepository repo;

	public HabitacionService(HabitacionRepository repo) {
		this.repo = repo;
	}

	public List<Habitacion> listar() {
		return repo.findAll();
	}

	public Habitacion guardar(Habitacion h) {
		if (repo.existsByNumero(h.getNumero())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Número de habitación ya registrado");
		}
		return repo.save(h);
	}

	public Habitacion actualizar(Integer id, Habitacion h) {
		Habitacion existente = repo.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habitación no encontrada"));

		if (repo.existsByNumeroAndIdHabitacionNot(h.getNumero(), id)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Número de habitación ya registrado");
		}

		existente.setNumero(h.getNumero());
		existente.setEstado(h.getEstado());
		existente.setTipoHabitacion(h.getTipoHabitacion());
		return repo.save(existente);
	}

	public void eliminar(Integer id) {
		repo.deleteById(id);
	}
}
