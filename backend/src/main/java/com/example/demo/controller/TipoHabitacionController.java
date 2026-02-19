package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.demo.model.TipoHabitacion;
import com.example.demo.service.TipoHabitacionService;

@RestController
@RequestMapping("/api/tipos")
@CrossOrigin("*")
public class TipoHabitacionController {

	private final TipoHabitacionService service;

	public TipoHabitacionController(TipoHabitacionService service) {
		this.service = service;
	}

	@GetMapping
	public List<TipoHabitacion> listar() {
		return service.listar();
	}

	@PostMapping
	public TipoHabitacion guardar(@RequestBody TipoHabitacion tipo) {
		return service.guardar(tipo);
	}

	@PutMapping("/{id}")
	public TipoHabitacion actualizar(@PathVariable Integer id, @RequestBody TipoHabitacion tipo) {
		return service.actualizar(id, tipo);
	}

	@DeleteMapping("/{id}")
	public void eliminar(@PathVariable Integer id) {
		service.eliminar(id);
	}
}
