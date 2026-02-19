package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.List;

import com.example.demo.model.TipoHabitacion;
import com.example.demo.repository.TipoHabitacionRepository;

@Service
public class TipoHabitacionService {

	private final TipoHabitacionRepository repo;

	public TipoHabitacionService(TipoHabitacionRepository repo) {
		this.repo = repo;
	}

	public List<TipoHabitacion> listar() {
		return repo.findAll();
	}

	public TipoHabitacion guardar(TipoHabitacion tipo) {
		return repo.save(tipo);
	}

	public TipoHabitacion actualizar(Integer id, TipoHabitacion tipo) {
		TipoHabitacion existente = repo.findById(id).orElseThrow();

		existente.setNombre(tipo.getNombre());
		existente.setDescripcion(tipo.getDescripcion());
		existente.setPrecioNoche(tipo.getPrecioNoche());

		return repo.save(existente);
	}

	public void eliminar(Integer id) {
		repo.deleteById(id);
	}
}
