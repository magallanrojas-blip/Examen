package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.demo.model.Habitacion;
import com.example.demo.service.HabitacionService;

@RestController
@RequestMapping("/api/habitaciones")
@CrossOrigin("*")
public class HabitacionController {

	private final HabitacionService service;

	public HabitacionController(HabitacionService service) {
		this.service = service;
	}

	@GetMapping
	public List<Habitacion> listar() {
		return service.listar();
	}

	@PostMapping
	public Habitacion guardar(@RequestBody Habitacion habitacion) {
		return service.guardar(habitacion);
	}

	@PutMapping("/{id}")
	public Habitacion actualizar(@PathVariable Integer id, @RequestBody Habitacion habitacion) {
		return service.actualizar(id, habitacion);
	}

	@DeleteMapping("/{id}")
	public void eliminar(@PathVariable Integer id) {
		service.eliminar(id);
	}
}
