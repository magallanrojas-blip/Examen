package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.demo.model.Huesped;
import com.example.demo.service.HuespedService;

@RestController
@RequestMapping("/api/huespedes")
@CrossOrigin("*")
public class HuespedController {

	private final HuespedService service;

	public HuespedController(HuespedService service) {
		this.service = service;
	}

	@GetMapping
	public List<Huesped> listar() {
		return service.listar();
	}

	@PostMapping
	public Huesped guardar(@RequestBody Huesped huesped) {
		return service.guardar(huesped);
	}

	@PutMapping("/{id}")
	public Huesped actualizar(@PathVariable Integer id, @RequestBody Huesped huesped) {
		return service.actualizar(id, huesped);
	}

	@DeleteMapping("/{id}")
	public void eliminar(@PathVariable Integer id) {
		service.eliminar(id);
	}
}
