package com.example.demo.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.model.Huesped;
import com.example.demo.repository.HuespedRepository;

@Service
public class HuespedService {

	private final HuespedRepository repo;

	public HuespedService(HuespedRepository repo) {
		this.repo = repo;
	}

	public List<Huesped> listar() {
		return repo.findAll();
	}

	public Huesped guardar(Huesped h) {
		if (repo.existsByDni(h.getDni())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "DNI ya registrado");
		}
		if (repo.existsByTelefono(h.getTelefono())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Teléfono ya registrado");
		}
		return repo.save(h);
	}

	public Huesped actualizar(Integer id, Huesped h) {
		Huesped existente = repo.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Huésped no encontrado"));

		if (repo.existsByDniAndIdHuespedNot(h.getDni(), id)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "DNI ya registrado");
		}
		if (repo.existsByTelefonoAndIdHuespedNot(h.getTelefono(), id)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Teléfono ya registrado");
		}

		existente.setNombre(h.getNombre());
		existente.setDni(h.getDni());
		existente.setTelefono(h.getTelefono());
		existente.setEmail(h.getEmail());
		return repo.save(existente);
	}

	public void eliminar(Integer id) {
		repo.deleteById(id);
	}
}
